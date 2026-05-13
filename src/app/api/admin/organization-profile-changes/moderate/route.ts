import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { writeAdminAudit } from "@/lib/admin-audit";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { Prisma } from "@/generated/prisma/client";

const bodySchema = z.object({
  changeId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
});

async function allocateUniqueSlug(
  tx: Prisma.TransactionClient,
  name: string,
  excludeOrgId: string,
): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let n = 0;
  for (;;) {
    const clash = await tx.organization.findFirst({
      where: { slug, NOT: { id: excludeOrgId } },
      select: { id: true },
    });
    if (!clash) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-org-profile-moderate:${ip}`, 40);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const { changeId, action } = parsed.data;
  const actorId = session.user.id;

  const change = await prisma.organizationProfileChange.findUnique({
    where: { id: changeId },
    include: { organization: { select: { id: true, name: true } } },
  });

  if (!change || change.status !== "PENDING") {
    return NextResponse.json(
      { ok: false, error: "Change request not found or already processed." },
      { status: 404 },
    );
  }

  try {
    if (action === "reject") {
      await prisma.organizationProfileChange.update({
        where: { id: changeId },
        data: { status: "REJECTED" },
      });
      await writeAdminAudit(prisma, {
        action: "ORG_PROFILE_CHANGE_REJECTED",
        actorUserId: actorId,
        targetType: "OrganizationProfileChange",
        targetId: changeId,
        meta: { organizationId: change.organizationId },
      });
      return NextResponse.json({ ok: true });
    }

    const orgId = change.organizationId;

    await prisma.$transaction(async (tx) => {
      const org = await tx.organization.findUniqueOrThrow({
        where: { id: orgId },
        select: { name: true, slug: true },
      });
      const slug =
        org.name !== change.proposedName
          ? await allocateUniqueSlug(tx, change.proposedName, orgId)
          : org.slug;

      await tx.organization.update({
        where: { id: orgId },
        data: {
          name: change.proposedName,
          slug,
          email: change.proposedEmail,
          phone: change.proposedPhone,
          website: change.proposedWebsite,
          location: change.proposedLocation,
          description: change.proposedDescription,
        },
      });

      await tx.organizationProfileChange.update({
        where: { id: changeId },
        data: { status: "APPROVED" },
      });
    });

    await writeAdminAudit(prisma, {
      action: "ORG_PROFILE_CHANGE_APPROVED",
      actorUserId: actorId,
      targetType: "OrganizationProfileChange",
      targetId: changeId,
      meta: { organizationId: change.organizationId, name: change.proposedName },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/organization-profile-changes/moderate", e);
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }
}
