import Link from "next/link";
import type { OpportunityCategory } from "@/lib/types";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Browse by theme",
  description:
    "Jump to opportunities by category — jobs, consultancies, trainings, volunteer roles, tenders, and grants on MasrJobs.org.",
};

const THEMES: {
  title: string;
  blurb: string;
  category: OpportunityCategory;
}[] = [
  {
    title: "Jobs & fixed-term roles",
    blurb: "National and programme staff, fellows, and internships.",
    category: "Jobs",
  },
  {
    title: "Consultancies & TA",
    blurb: "Evaluations, research, and short-term expert support.",
    category: "Consultancies",
  },
  {
    title: "Trainings & courses",
    blurb: "Workshops, certifications, and cohort-based learning.",
    category: "Trainings",
  },
  {
    title: "Volunteer roles",
    blurb: "Unpaid placements and structured volunteering.",
    category: "Volunteer Roles",
  },
  {
    title: "Tenders & procurement",
    blurb: "RFQs, RFPs, and service contracts.",
    category: "Tenders",
  },
  {
    title: "Grants & calls",
    blurb: "Funding windows and partnership opportunities.",
    category: "Grants",
  },
];

export default function SectorsPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Discover"
          title="Browse by theme"
          description="Each card opens the public opportunities list with the matching category filter. You can still refine by keyword, location, and organization."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const href = `/opportunities?category=${encodeURIComponent(t.category)}`;
            return (
              <Link
                key={t.category}
                href={href}
                className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-shadow hover:border-brand-gold/40 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-brand-navy">{t.title}</h2>
                <p className="mt-2 text-sm text-foreground/75">{t.blurb}</p>
                <p className="mt-4 text-sm font-semibold text-brand-gold">View listings →</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-10 text-sm text-foreground/70">
          Prefer the full grid?{" "}
          <Link href="/opportunities" className="font-semibold text-brand-gold underline">
            Open all opportunities
          </Link>{" "}
          or read{" "}
          <Link href="/how-it-works" className="font-semibold text-brand-gold underline">
            how the platform works
          </Link>
          .
        </p>
      </PageShell>
    </div>
  );
}
