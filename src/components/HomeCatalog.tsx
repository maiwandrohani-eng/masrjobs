"use client";

import Link from "next/link";
import { HomeCtaRow, HomeFeatured } from "@/components/HomeFeatured";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { useMasrJobs } from "@/context/MasrJobsProvider";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";

export function HomeCatalog() {
  const { opportunities, hydrated } = useMasrJobs();
  const { mode: homeViewMode, setMode: setHomeViewMode } = usePersistedViewMode(
    "masrjobs:v1:viewHomeOpportunities",
  );

  if (!hydrated) {
    return (
      <>
        <section className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm text-foreground/60">Loading opportunities…</p>
        </section>
      </>
    );
  }
  const featured = opportunities.filter((o) => o.featured).slice(0, 3);
  const latest = [...opportunities]
    .sort((a, b) => b.deadline.localeCompare(a.deadline))
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              Featured opportunities
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              Hand-picked and newly approved listings across Egypt’s social impact
              sector.
            </p>
          </div>
          <ViewModeToggle
            value={homeViewMode}
            onChange={setHomeViewMode}
            groupAriaLabel="Featured and latest opportunity layout"
            className="self-stretch sm:self-auto"
          />
        </div>
        <div className="mt-8">
          <HomeFeatured
            items={featured}
            viewMode={homeViewMode}
            emptyMessage="No featured opportunities right now. Browse all roles to discover what is open."
          />
        </div>
        <HomeCtaRow />
      </section>

      <section className="border-t border-brand-border bg-brand-muted/50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">
                Latest opportunities
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Recently updated deadlines and new postings.
              </p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ViewModeToggle
                value={homeViewMode}
                onChange={setHomeViewMode}
                groupAriaLabel="Featured and latest opportunity layout"
                className="self-stretch sm:self-auto"
              />
              <Link
                href="/opportunities"
                className="text-center text-sm font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2 sm:text-left"
              >
                See full list
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <HomeFeatured
              items={latest}
              viewMode={homeViewMode}
              emptyMessage="No opportunities to show in this section yet."
            />
          </div>
        </div>
      </section>
    </>
  );
}
