import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

const postSchema = z.object({
  opportunityId: z.string().min(1),
  save: z.boolean(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ opportunityIds: [] }, { status: 401 });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ opportunityIds: [] });
  }
  const rows = await prisma.savedOpportunity.findMany({
    where: { userId: session.user.id },
    select: { opportunityId: true },
  });
  return NextResponse.json({
    opportunityIds: rows.map((r) => r.opportunityId),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { opportunityId, save } = parsed.data;

  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true },
  });
  if (!opp) {
    return NextResponse.json({ ok: false, error: "Opportunity not found" }, { status: 404 });
  }

  if (save) {
    await prisma.savedOpportunity.upsert({
      where: {
        opportunityId_userId: {
          opportunityId,
          userId: session.user.id,
        },
      },
      create: { opportunityId, userId: session.user.id },
      update: {},
    });
  } else {
    await prisma.savedOpportunity.deleteMany({
      where: { opportunityId, userId: session.user.id },
    });
  }

  return NextResponse.json({ ok: true });
}
