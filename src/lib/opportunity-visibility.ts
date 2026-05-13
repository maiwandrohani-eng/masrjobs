import type { Opportunity, SessionUser } from "@/lib/types";

/** Shown on public browse / home / filters. */
export function isPublishedCatalogOpportunity(o: Opportunity): boolean {
  if (!o.visibility) return true;
  return o.visibility === "published";
}

/**
 * Who may open the detail route (preview for org/admin, public for published).
 * `suppressedCatalogIds` hides sample-backed listings closed via admin/org.
 */
export function canUserViewOpportunityDetail(
  session: SessionUser | null,
  o: Opportunity,
  opts?: { suppressedCatalogIds?: readonly string[] },
): boolean {
  const suppressed = new Set(opts?.suppressedCatalogIds ?? []);
  if (suppressed.has(o.id)) {
    if (session?.role === "admin") return true;
    if (
      session?.role === "organization" &&
      session.organizationId === o.organizationId
    )
      return true;
    return false;
  }
  if (isPublishedCatalogOpportunity(o)) return true;
  if (session?.role === "admin") return true;
  if (
    session?.role === "organization" &&
    session.organizationId === o.organizationId
  )
    return true;
  return false;
}

export function isApplicationOpenForOpportunity(o: Opportunity): boolean {
  if (o.visibility === "closed" || o.visibility === "rejected") return false;
  if (!o.visibility) return true;
  return o.visibility === "published";
}
