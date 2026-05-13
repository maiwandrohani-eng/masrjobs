import type {
  Organization as PrismaOrganization,
  PrismaClient,
} from "@/generated/prisma/client";
import {
  mapOpportunityRecord,
  mapOrganizationRecord,
  type OpportunityRow,
} from "@/lib/db/map-prisma-catalog";
import type { Opportunity, Organization } from "@/lib/types";

const opportunityInclude = {
  organization: true,
  category: true,
  featured: true,
} as const;

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function loadDirectoryOrganizations(
  prisma: PrismaClient,
): Promise<Organization[]> {
  return safe(async () => {
    const rows = await prisma.organization.findMany({
      where: {
        verificationStatus: { not: "REJECTED" },
        isActive: true,
      },
      orderBy: { name: "asc" },
    });
    return rows.map(mapOrganizationRecord);
  }, []);
}

/** Public organization profile: match by primary key or public slug. */
export async function loadPublicOrganizationByRef(
  prisma: PrismaClient,
  ref: string,
): Promise<PrismaOrganization | null> {
  const normalized = ref.trim();
  if (!normalized) return null;
  return safe(
    () =>
      prisma.organization.findFirst({
        where: {
          OR: [{ id: normalized }, { slug: normalized }],
          verificationStatus: { not: "REJECTED" },
          isActive: true,
        },
      }),
    null,
  );
}

export async function loadPublishedOpportunityRows(
  prisma: PrismaClient,
): Promise<OpportunityRow[]> {
  return safe(
    () =>
      prisma.opportunity.findMany({
        where: {
          status: "PUBLISHED",
          organization: {
            isActive: true,
            verificationStatus: { not: "REJECTED" },
          },
        },
        include: opportunityInclude,
        orderBy: { publishedAt: "desc" },
      }),
    [],
  );
}

/** Published listings for a single employer (organization profile page). */
export async function loadPublishedOpportunitiesForOrganization(
  prisma: PrismaClient,
  organizationId: string,
): Promise<OpportunityRow[]> {
  return safe(
    () =>
      prisma.opportunity.findMany({
        where: {
          organizationId,
          status: "PUBLISHED",
        },
        include: opportunityInclude,
        orderBy: { publishedAt: "desc" },
      }),
    [],
  );
}

export async function loadPublishedCatalog(prisma: PrismaClient): Promise<{
  opportunities: Opportunity[];
  organizations: Organization[];
}> {
  try {
    const organizations = await loadDirectoryOrganizations(prisma);
    const rows = await loadPublishedOpportunityRows(prisma);
    const sorted = [...rows].sort((a, b) => {
      const ra = a.featured?.rank ?? -1;
      const rb = b.featured?.rank ?? -1;
      if (ra !== rb) return rb - ra;
      const ta = a.publishedAt?.getTime() ?? a.createdAt.getTime();
      const tb = b.publishedAt?.getTime() ?? b.createdAt.getTime();
      return tb - ta;
    });
    const opportunities: Opportunity[] = [];
    for (const row of sorted) {
      try {
        opportunities.push(mapOpportunityRecord(row));
      } catch (e) {
        console.error("[catalog] mapOpportunityRecord failed", row?.id, e);
      }
    }
    return { opportunities, organizations };
  } catch (e) {
    console.error("[catalog] loadPublishedCatalog", e);
    return { opportunities: [], organizations: [] };
  }
}

export async function loadOpportunityByRef(
  prisma: PrismaClient,
  ref: string,
): Promise<OpportunityRow | null> {
  return safe(
    () =>
      prisma.opportunity.findFirst({
        where: { OR: [{ id: ref }, { slug: ref }] },
        include: opportunityInclude,
      }),
    null,
  );
}

export async function loadSitemapOpportunityRefs(
  prisma: PrismaClient,
): Promise<{ id: string; slug: string | null }[]> {
  return safe(
    () =>
      prisma.opportunity.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, slug: true },
      }),
    [],
  );
}
