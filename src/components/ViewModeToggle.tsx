"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/cn";
import type { BrowseViewMode } from "@/hooks/usePersistedViewMode";

type Props = {
  value: BrowseViewMode;
  onChange: (mode: BrowseViewMode) => void;
  /** Describes what the layout applies to (announced to assistive tech). */
  groupAriaLabel?: string;
  className?: string;
};

const btnBase =
  "inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-muted/50 sm:min-h-0 sm:flex-none sm:px-3.5";

export function ViewModeToggle({
  value,
  onChange,
  groupAriaLabel = "Choose result layout",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "inline-flex w-full max-w-full shrink-0 rounded-xl border border-brand-border bg-brand-muted/50 p-1 sm:w-auto sm:max-w-none",
        className,
      )}
      role="group"
      aria-label={groupAriaLabel}
    >
      <button
        type="button"
        onClick={() => onChange("card")}
        aria-pressed={value === "card"}
        aria-label="Show results as cards"
        className={cn(
          btnBase,
          value === "card"
            ? "bg-white text-brand-navy shadow-sm ring-2 ring-brand-gold/40 ring-offset-1 ring-offset-brand-muted/40"
            : "text-foreground/70 hover:bg-white/60 hover:text-brand-navy",
        )}
      >
        <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
        Cards
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={value === "list"}
        aria-label="Show results as a list"
        className={cn(
          btnBase,
          value === "list"
            ? "bg-white text-brand-navy shadow-sm ring-2 ring-brand-gold/40 ring-offset-1 ring-offset-brand-muted/40"
            : "text-foreground/70 hover:bg-white/60 hover:text-brand-navy",
        )}
      >
        <List className="h-4 w-4 shrink-0" aria-hidden />
        List
      </button>
    </div>
  );
}
