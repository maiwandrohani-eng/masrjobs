import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { writeAdminAudit } from "@/lib/admin-audit";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-opp-approve:${ip}`, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const { id: opportunityId } = await ctx.params;
  if (!opportunityId?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing opportunity id." }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  const row = await prisma.opportunity.findUnique({
    where: { id: opportunityId.trim() },
    select: {
      id: true,
      title: true,
      status: true,
      organizationId: true,
      organization: { select: { name: true, email: true } },
    },
  });

  if (!row) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
  }
  if (row.status !== "PENDING_APPROVAL") {
    return NextResponse.json(
      { ok: false, error: "Listing is not pending approval." },
      { status: 409 },
    );
  }

  const now = new Date();

  await prisma.opportunity.update({
    where: { id: row.id },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
      closedAt: null,
    },
  });

  try {
    const orgUsers = await prisma.user.findMany({
      where: {
        organizationId: row.organizationId,
        role: "ORG_USER",
        isActive: true,
      },
      select: { id: true },
    });
    if (orgUsers.length > 0) {
      await prisma.notification.createMany({
        data: orgUsers.map((u) => ({
          userId: u.id,
          organizationId: row.organizationId,
          opportunityId: row.id,
          title: "Listing published",
          message: `“${row.title}” is now live on the public opportunities page.`,
          href: "/dashboard/organization",
        })),
      });
    }
  } catch (e) {
    console.error("[admin/approve] notifications skipped", row.id, e);
  }

  try {
    await writeAdminAudit(prisma, {
      action: "OPPORTUNITY_APPROVED",
      actorUserId: session.user.id,
      targetType: "Opportunity",
      targetId: row.id,
      meta: {
        title: row.title,
        organizationId: row.organizationId,
        organizationName: row.organization?.name ?? null,
        status: "PUBLISHED",
      },
    });
  } catch (e) {
    console.error("[admin/approve] audit log skipped", row.id, e);
  }

  return NextResponse.json({
    ok: true,
    opportunityId: row.id,
    title: row.title,
    organizationName: row.organization?.name ?? "Organization",
    contactEmail: row.organization?.email ?? null,
    status: "PUBLISHED",
  });
}
