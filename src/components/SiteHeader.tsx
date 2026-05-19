"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/LanguageContext";
import { useMasrJobs } from "@/context/MasrJobsProvider";

const NAV_KEYS = [
  { href: "/opportunities", key: "navOpportunities" },
  { href: "/organizations", key: "navOrganizations" },
  { href: "/resources", key: "navResources" },
  { href: "/how-it-works", key: "navHowItWorks" },
  { href: "/about", key: "navAbout" },
  { href: "/contact", key: "navContact" },
] as const;

function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  return (
    <div
      className={`flex rounded-lg border border-brand-border bg-white p-0.5 text-xs font-semibold ${className ?? ""}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-md px-2.5 py-1.5 transition ${
          locale === "en"
            ? "bg-brand-navy text-white"
            : "text-brand-navy/70 hover:bg-brand-muted"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={`rounded-md px-2.5 py-1.5 transition ${
          locale === "ar"
            ? "bg-brand-navy text-white"
            : "text-brand-navy/70 hover:bg-brand-muted"
        }`}
      >
        AR
      </button>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, hydrated } = useMasrJobs();
  const { t } = useLanguage();

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
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 lg:gap-4 lg:py-3.5">
        <Link href="/" className="flex shrink-0 items-center">
          <LogoMark />
          <span className="sr-only">MasrJobs.org home</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-0.5 lg:flex lg:gap-1">
          {NAV_KEYS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-brand-navy/85 transition-colors hover:bg-brand-gold-muted hover:text-brand-navy lg:px-3"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 flex-nowrap items-center gap-2 lg:flex">
          <LanguageToggle />
          {hydrated && session ? (
            <Link
              href={dashboardHref}
              className="shrink-0 whitespace-nowrap rounded-lg border border-brand-navy/15 bg-white px-3 py-2 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-gold/50 hover:bg-brand-gold-muted"
            >
              {t("navDashboard")}
            </Link>
          ) : null}
          {hydrated && !session ? (
            <>
              <Link
                href="/login"
                className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-brand-navy/80 hover:bg-brand-gold-muted hover:text-brand-navy"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/register"
                className="shrink-0 whitespace-nowrap rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy-deep"
              >
                {t("navRegister")}
              </Link>
            </>
          ) : null}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex shrink-0 rounded-lg border border-brand-border p-2 text-brand-navy lg:hidden"
          aria-expanded={open}
          aria-label={open ? t("navCloseMenu") : t("navOpenMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-brand-border bg-white lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          <div className="px-3 py-2">
            <LanguageToggle className="w-fit" />
          </div>
          {NAV_KEYS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-brand-navy hover:bg-brand-gold-muted"
            >
              {t(item.key)}
            </Link>
          ))}
          {hydrated && session ? (
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-brand-gold hover:bg-brand-gold-muted"
            >
              {t("navDashboard")}
            </Link>
          ) : null}
          {hydrated && !session ? (
            <div className="mt-2 flex flex-col gap-2 border-t border-brand-border pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-brand-border py-2.5 text-center text-sm font-medium text-brand-navy"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-brand-navy py-2.5 text-center text-sm font-semibold text-white"
              >
                {t("navRegister")}
              </Link>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
