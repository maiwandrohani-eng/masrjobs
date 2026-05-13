import Link from "next/link";
import { Suspense } from "react";
import { HomeCatalog } from "@/components/HomeCatalog";
import { LogoMark } from "@/components/LogoMark";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="border-b border-brand-border bg-gradient-to-b from-white to-brand-muted/80">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              Egypt’s Development & Social Impact Jobs Platform
            </p>
            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-brand-navy md:text-5xl md:leading-tight">
              Trusted jobs, consultancies, and grants for Egypt’s NGO ecosystem
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
              MasrJobs.org connects mission-driven talent with verified employers across
              humanitarian, development, and social enterprise work — clear listings,
              fair processes, bilingual-ready structure.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/opportunities"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-navy px-6 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Browse opportunities
              </Link>
              <Link
                href="/organizations"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-brand-border bg-white px-6 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-muted"
              >
                Organization directory
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-xs font-medium text-brand-navy/80">
              {[
                "Jobs",
                "Consultancies",
                "Trainings",
                "Volunteering",
                "Tenders",
                "Grants",
              ].map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-brand-border bg-white px-3 py-1.5 shadow-sm"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-3xl border border-brand-border bg-white p-8 shadow-md">
            <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-brand-gold via-brand-gold-soft to-brand-navy opacity-95" />
            <div className="flex flex-col items-center text-center">
              <LogoMark />
              <p className="mt-6 text-sm font-semibold text-brand-navy">
                Search & filter
              </p>
              <p className="mt-2 text-sm text-foreground/65">
                Category, location, employer, deadline, remote/hybrid, paid or unpaid —
                built for busy recruiters and applicants.
              </p>
              <Link
                href="/opportunities"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-gold py-3 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft"
              >
                Start searching
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <HomeCatalog />
      </Suspense>
    </div>
  );
}
