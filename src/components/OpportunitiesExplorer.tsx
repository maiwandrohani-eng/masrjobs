"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Opportunity, OpportunityCategory } from "@/lib/types";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityListRow } from "@/components/OpportunityListRow";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { cn } from "@/lib/cn";

const CATEGORIES: OpportunityCategory[] = [
  "Jobs",
  "Consultancies",
  "Trainings",
  "Volunteer Roles",
  "Tenders",
  "Grants",
];

type Props = {
  opportunities: Opportunity[];
  /** Legacy `?org=` filter by exact public organization name (still supported). */
  initialOrganization?: string;
  /** Preferred `?orgId=` filter by organization primary key (stable across renames). */
  initialOrganizationId?: string;
  /** From URL `?category=` — must match an OpportunityCategory label or ignored. */
  initialCategory?: string | null;
};

function categoryFromParam(raw: string | null | undefined): OpportunityCategory | "All" {
  if (!raw?.trim()) return "All";
  const decoded = decodeURIComponent(raw.trim());
  return CATEGORIES.includes(decoded as OpportunityCategory)
    ? (decoded as OpportunityCategory)
    : "All";
}

export function OpportunitiesExplorer({
  opportunities,
  initialOrganization = "",
  initialOrganizationId = "",
  initialCategory = null,
}: Props) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "All">(() =>
    categoryFromParam(initialCategory),
  );
  const [location, setLocation] = useState("");
  const [orgIdFilter, setOrgIdFilter] = useState(() => initialOrganizationId.trim());
  const [orgNameFilter, setOrgNameFilter] = useState(() =>
    initialOrganizationId.trim() ? "" : initialOrganization.trim(),
  );
  const [type, setType] = useState("");
  const [work, setWork] = useState<string>("All");
  const [paid, setPaid] = useState<string>("All");
  const [deadlineBefore, setDeadlineBefore] = useState("");
  const { mode: viewMode, setMode: setViewMode } = usePersistedViewMode(
    "masrjobs:v1:viewOpportunitiesBrowse",
  );

  useEffect(() => {
    setCategory(categoryFromParam(initialCategory));
  }, [initialCategory]);

  useEffect(() => {
    const id = initialOrganizationId.trim();
    setOrgIdFilter(id);
    setOrgNameFilter(id ? "" : initialOrganization.trim());
  }, [initialOrganizationId, initialOrganization]);

  const orgOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const o of opportunities) {
      if (!m.has(o.organizationId)) m.set(o.organizationId, o.organizationName);
    }
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [opportunities]);

  const types = useMemo(() => {
    const s = new Set(opportunities.map((o) => o.type));
    return [...s].sort();
  }, [opportunities]);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (category !== "All" && o.category !== category) return false;
      if (location && !o.location.toLowerCase().includes(location.toLowerCase()))
        return false;
      if (orgIdFilter && o.organizationId !== orgIdFilter) return false;
      if (!orgIdFilter && orgNameFilter && o.organizationName !== orgNameFilter) return false;
      if (type && o.type !== type) return false;
      if (work !== "All" && o.workArrangement !== work) return false;
      if (paid === "Paid" && o.compensation !== "Paid") return false;
      if (paid === "Unpaid" && o.compensation !== "Unpaid") return false;
      if (deadlineBefore && o.deadline > deadlineBefore) return false;
      if (q) {
        const hay = `${o.title} ${o.organizationName} ${o.shortDescription} ${o.category}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [
    opportunities,
    q,
    category,
    location,
    orgIdFilter,
    orgNameFilter,
    type,
    work,
    paid,
    deadlineBefore,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit space-y-4 rounded-2xl border border-brand-border bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div>
          <label className="text-xs font-semibold text-brand-navy">Keyword</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles, orgs…"
              className="w-full rounded-lg border border-brand-border bg-brand-muted py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Category</label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as OpportunityCategory | "All")
            }
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Organization</label>
          <select
            value={orgIdFilter}
            onChange={(e) => {
              const v = e.target.value;
              setOrgIdFilter(v);
              setOrgNameFilter("");
            }}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="">All organizations</option>
            {orgOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Location contains</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Cairo"
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Work arrangement</label>
          <select
            value={work}
            onChange={(e) => setWork(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="All">Any</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Compensation</label>
          <select
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="All">Any</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">Deadline on or before</label>
          <input
            type="date"
            value={deadlineBefore}
            onChange={(e) => setDeadlineBefore(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setQ("");
            setCategory("All");
            setLocation("");
            setOrgIdFilter("");
            setOrgNameFilter("");
            setType("");
            setWork("All");
            setPaid("All");
            setDeadlineBefore("");
          }}
          className="w-full rounded-lg border border-brand-border py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-muted"
        >
          Clear filters
        </button>
      </aside>

      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/70">
            Showing{" "}
            <span className="font-semibold text-brand-navy">{filtered.length}</span>{" "}
            opportunities
          </p>
          <ViewModeToggle
            value={viewMode}
            onChange={setViewMode}
            groupAriaLabel="Opportunity browse layout"
            className="self-stretch sm:self-auto"
          />
        </div>
        <div
          className={cn(
            viewMode === "card" && "grid gap-5 sm:grid-cols-2",
            viewMode === "card" && filtered.length === 0 && "sm:grid-cols-1",
            viewMode === "list" && "flex flex-col gap-3",
          )}
        >
          {filtered.map((o) =>
            viewMode === "card" ? (
              <OpportunityCard key={o.id} opportunity={o} />
            ) : (
              <OpportunityListRow key={o.id} opportunity={o} />
            ),
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center text-sm text-foreground/70 shadow-sm">
            No opportunities match these filters. Try clearing filters or broadening your search.
          </p>
        ) : null}
      </div>
    </div>
  );
}
