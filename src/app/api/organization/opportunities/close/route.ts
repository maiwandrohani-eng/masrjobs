import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.object({
  opportunityId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }
  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ ok: false, error: "No organization" }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const opp = await prisma.opportunity.findFirst({
    where: {
      id: parsed.data.opportunityId,
      organizationId: orgId,
    },
    select: { id: true },
  });
  if (!opp) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  await prisma.opportunity.update({
    where: { id: opp.id },
    data: { status: "CLOSED", closedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
