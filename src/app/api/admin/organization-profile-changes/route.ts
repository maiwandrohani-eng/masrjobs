import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

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

  const items = await prisma.organizationProfileChange.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      organization: {
        select: { id: true, name: true, slug: true, verificationStatus: true },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    items: items.map((row) => ({
      id: row.id,
      organizationId: row.organizationId,
      currentName: row.organization.name,
      currentSlug: row.organization.slug,
      verificationStatus: row.organization.verificationStatus,
      proposedName: row.proposedName,
      proposedEmail: row.proposedEmail,
      proposedPhone: row.proposedPhone,
      proposedWebsite: row.proposedWebsite,
      proposedLocation: row.proposedLocation,
      proposedDescription: row.proposedDescription,
      submittedAt: row.createdAt.toISOString(),
    })),
  });
}
