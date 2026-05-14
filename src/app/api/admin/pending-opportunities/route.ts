import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { mapOpportunityRecord } from "@/lib/db/map-prisma-catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: true, items: [] });
  }

  const rows = await prisma.opportunity.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: {
      organization: true,
      category: true,
      featured: true,
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const items = rows.map((row) => {
    const mapped = mapOpportunityRecord(row);
    return {
      id: `popp-${row.id}`,
      opportunityId: row.id,
      title: row.title,
      organizationName: row.organization.name,
      category: mapped.category,
      submittedAt: row.createdAt.toISOString().slice(0, 10),
    };
  });

  return NextResponse.json({ ok: true, items });
}