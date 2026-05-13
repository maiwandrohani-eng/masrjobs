import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { writeAdminAudit } from "@/lib/admin-audit";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  opportunityId: z.string().min(1),
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
  const rl = rateLimit(`admin-opp-delete:${ip}`, 40);
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

  const { opportunityId } = parsed.data;
  const actorId = session.user.id;

  const row = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, title: true, organizationId: true },
  });
  if (!row) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.externalApplyIntent.deleteMany({
        where: { listingId: opportunityId },
      });
      await tx.opportunity.delete({ where: { id: opportunityId } });
    });
    await writeAdminAudit(prisma, {
      action: "OPPORTUNITY_DELETED",
      actorUserId: actorId,
      targetType: "Opportunity",
      targetId: opportunityId,
      meta: { title: row.title, organizationId: row.organizationId },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/opportunities/delete", e);
    return NextResponse.json({ ok: false, error: "Delete failed." }, { status: 500 });
  }
}
