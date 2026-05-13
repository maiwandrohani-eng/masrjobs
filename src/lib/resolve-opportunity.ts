import type { Opportunity } from "@/lib/types";

/** Resolve an opportunity from org-submitted extras first, then catalog (Neon or demo). */
export function resolveOpportunity(
  id: string,
  extras: Opportunity[],
  catalog: Opportunity[],
): Opportunity | undefined {
  const bySlugOrId = (o: Opportunity) => o.id === id || o.slug === id;
  return extras.find(bySlugOrId) ?? catalog.find(bySlugOrId);
}
