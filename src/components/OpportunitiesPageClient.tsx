"use client";

import { useSearchParams } from "next/navigation";
import { OpportunitiesExplorer } from "@/components/OpportunitiesExplorer";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useMasrJobs } from "@/context/MasrJobsProvider";

export function OpportunitiesPageClient() {
  const searchParams = useSearchParams();
  const orgFilter = searchParams.get("org")
    ? decodeURIComponent(searchParams.get("org")!)
    : "";
  const categoryFilter = searchParams.get("category");
  const { opportunities, hydrated } = useMasrJobs();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Opportunities"
          title="Browse roles, consultancies, trainings, and more"
          description="Filter by category, location, organization, work arrangement, and deadline. Listings posted by organizations appear here after admin approval."
        />
        {!hydrated ? (
          <p className="text-sm text-foreground/60">Loading opportunities…</p>
        ) : (
          <OpportunitiesExplorer
            opportunities={opportunities}
            initialOrganization={orgFilter}
            initialCategory={categoryFilter}
          />
        )}
      </PageShell>
    </div>
  );
}
