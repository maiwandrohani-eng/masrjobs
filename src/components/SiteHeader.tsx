"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/cn";
import { useMasrJobs } from "@/context/MasrJobsProvider";

const nav = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/organizations", label: "Organizations" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, hydrated } = useMasrJobs();

  const dashboardHref =
    session?.role === "organization"
      ? "/dashboard/organization"
      : session?.role === "admin"
        ? "/dashboard/admin"
        : session?.role === "individual"
          ? "/dashboard/user"
          : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gold/25 bg-white/95 shadow-[0_1px_0_0_rgba(27,54,93,0.06)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoMark />
          <span className="sr-only">MasrJobs.org home</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-navy/85 transition-colors hover:bg-brand-gold-muted hover:text-brand-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {hydrated && session ? (
            <Link
              href={dashboardHref}
              className="rounded-lg border border-brand-navy/15 bg-white px-3 py-2 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-gold/50 hover:bg-brand-gold-muted"
            >
              Dashboard
            </Link>
          ) : null}
          {hydrated && !session ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-navy/80 hover:bg-brand-gold-muted hover:text-brand-navy"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy-deep"
              >
                Create account
              </Link>
            </>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-brand-border p-2 text-brand-navy md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-brand-border bg-white md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-brand-navy hover:bg-brand-gold-muted"
            >
              {item.label}
            </Link>
          ))}
          {hydrated && session ? (
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-brand-gold hover:bg-brand-gold-muted"
            >
              Dashboard
            </Link>
          ) : null}
          {hydrated && !session ? (
            <div className="mt-2 flex flex-col gap-2 border-t border-brand-border pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-brand-border py-2.5 text-center text-sm font-medium text-brand-navy"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-brand-navy py-2.5 text-center text-sm font-semibold text-white"
              >
                Create account
              </Link>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
