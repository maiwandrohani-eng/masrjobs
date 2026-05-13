import { SAMPLE_OPPORTUNITIES } from "@/lib/sample-data";
import type { Opportunity } from "@/lib/types";

export function resolveOpportunity(
  id: string,
  extra: Opportunity[],
): Opportunity | undefined {
  return (
    extra.find((o) => o.id === id) ??
    SAMPLE_OPPORTUNITIES.find((o) => o.id === id)
  );
}
