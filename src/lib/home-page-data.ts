import { getPrisma } from "@/lib/prisma";

export type VerifiedOrgStripItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
};

export async function getPublishedOpportunityCount(): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) return 0;
  try {
    return await prisma.opportunity.count({
      where: {
        status: "PUBLISHED",
        organization: { verificationStatus: { not: "REJECTED" } },
      },
    });
  } catch {
    return 0;
  }
}

export async function getVerifiedOrganizationsForStrip(): Promise<VerifiedOrgStripItem[]> {
  const prisma = getPrisma();
  if (!prisma) return [];
  try {
    const rows = await prisma.organization.findMany({
      where: {
        verificationStatus: "VERIFIED",
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, logoUrl: true },
    });
    return rows;
  } catch {
    return [];
  }
}
