import type { ApplicationStatus, ListingStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const LISTING: Record<ListingStatus, string> = {
  Draft: "bg-slate-100 text-slate-800 ring-slate-200",
  "Pending approval": "bg-amber-50 text-amber-900 ring-amber-200",
  Published: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  Rejected: "bg-red-50 text-red-900 ring-red-200",
  Closed: "bg-slate-100 text-slate-700 ring-slate-200",
};

const APPLICATION: Record<ApplicationStatus, string> = {
  Submitted: "bg-sky-50 text-sky-900 ring-sky-200",
  "Under review": "bg-indigo-50 text-indigo-900 ring-indigo-200",
  Shortlisted: "bg-violet-50 text-violet-900 ring-violet-200",
  Rejected: "bg-red-50 text-red-900 ring-red-200",
  Accepted: "bg-emerald-50 text-emerald-900 ring-emerald-200",
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        LISTING[status] ?? "bg-brand-muted text-brand-navy ring-brand-border",
      )}
    >
      {status}
    </span>
  );
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        APPLICATION[status] ??
          "bg-brand-gold/15 text-brand-navy ring-brand-gold/30",
      )}
    >
      {status}
    </span>
  );
}
