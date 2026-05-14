import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normEmail(e: string) {
  return e.trim().toLowerCase();
}

/** Applicant's recorded off-platform apply clicks (Neon). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "INDIVIDUAL" || !session.user.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  const applicantEmail = normEmail(session.user.email);

  const rows = await prisma.externalApplyIntent.findMany({
    where: { applicantEmail },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const listingIds = [...new Set(rows.map((r) => r.listingId))];
  const opps =
    listingIds.length === 0
      ? []
      : await prisma.opportunity.findMany({
          where: { id: { in: listingIds } },
          select: {
            id: true,
            title: true,
            organization: { select: { name: true } },
          },
        });
  const oppMap = new Map(opps.map((o) => [o.id, o]));

  const intents = rows.map((row) => {
    const o = oppMap.get(row.listingId);
    return {
      id: row.id,
      opportunityId: row.listingId,
      opportunityTitle: o?.title ?? "Listing",
      organizationName: o?.organization.name ?? "Organization",
      applicantEmail: session.user.email.trim(),
      channel: row.channel === "EMAIL" ? ("email" as const) : ("external_link" as const),
      recordedAt: row.createdAt.toISOString().slice(0, 10),
    };
  });

  return NextResponse.json(
    { ok: true, intents },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    },
  );
}
