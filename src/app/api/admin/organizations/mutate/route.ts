import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { writeAdminAudit } from "@/lib/admin-audit";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  organizationId: z.string().min(1),
  action: z.enum(["deactivate", "reactivate", "delete"]),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-org-mutate:${ip}`, 40);
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

  const { organizationId, action } = parsed.data;
  const actorId = session.user.id;

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, slug: true, isActive: true },
  });
  if (!org) {
    return NextResponse.json({ ok: false, error: "Organization not found." }, { status: 404 });
  }

  try {
    if (action === "deactivate") {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { isActive: false },
      });
      await writeAdminAudit(prisma, {
        action: "ORGANIZATION_DEACTIVATED",
        actorUserId: actorId,
        targetType: "Organization",
        targetId: organizationId,
        meta: { name: org.name, slug: org.slug },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "reactivate") {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { isActive: true },
      });
      await writeAdminAudit(prisma, {
        action: "ORGANIZATION_REACTIVATED",
        actorUserId: actorId,
        targetType: "Organization",
        targetId: organizationId,
        meta: { name: org.name, slug: org.slug },
      });
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction(async (tx) => {
      const oppRows = await tx.opportunity.findMany({
        where: { organizationId },
        select: { id: true },
      });
      const oppIds = oppRows.map((r) => r.id);
      if (oppIds.length > 0) {
        await tx.externalApplyIntent.deleteMany({
          where: { listingId: { in: oppIds } },
        });
      }
      await tx.opportunity.deleteMany({ where: { organizationId } });

      const memberIds = (
        await tx.user.findMany({
          where: { organizationId },
          select: { id: true },
        })
      ).map((u) => u.id);
      for (const uid of memberIds) {
        await tx.adminActionLog.updateMany({
          where: { actorUserId: uid },
          data: { actorUserId: null },
        });
      }
      await tx.user.deleteMany({ where: { organizationId } });
      await tx.organization.delete({ where: { id: organizationId } });
    });

    await writeAdminAudit(prisma, {
      action: "ORGANIZATION_DELETED",
      actorUserId: actorId,
      targetType: "Organization",
      targetId: organizationId,
      meta: { name: org.name, slug: org.slug },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/organizations/mutate", e);
    return NextResponse.json({ ok: false, error: "Operation failed." }, { status: 500 });
  }
}
