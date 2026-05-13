import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Events & key dates",
  description:
    "Workshops, webinars, and milestone dates for Egypt’s development and social impact community.",
};

type EventRow = { date: string; title: string; detail: string; href?: string };

const EVENTS: EventRow[] = [
  {
    date: "2026-05-28",
    title: "CV clinic — social impact roles (online)",
    detail: "Open session on structuring CVs for NGO and consultancy applications.",
    href: "/resources",
  },
  {
    date: "2026-06-12",
    title: "Safeguarding refresher — hiring managers",
    detail: "Discussion on fair screening and referral pathways when shortlisting.",
    href: "/resources/safeguarding-basics-every-applicant-should-know",
  },
  {
    date: "2026-06-30",
    title: "Q2 reporting window — many donor roles",
    detail: "Reminder: several MEAL and programme reporting roles track to quarter-end cycles.",
    href: "/opportunities",
  },
  {
    date: "2026-09-15",
    title: "Regional skills week (hybrid, Cairo)",
    detail: "Community-led trainings on facilitation, MEAL basics, and remote collaboration.",
    href: "/opportunities?category=Trainings",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="Community"
          title="Events & key dates"
          description="Editorial calendar of sessions and seasonal hiring rhythms. Dates are illustrative — confirm with organizers and live listings."
        />
        <ul className="space-y-4">
          {EVENTS.map((e) => (
            <li
              key={e.date + e.title}
              className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {e.date}
              </p>
              <p className="mt-1 text-base font-bold text-brand-navy">{e.title}</p>
              <p className="mt-2 text-sm text-foreground/75">{e.detail}</p>
              {e.href ? (
                <Link
                  href={e.href}
                  className="mt-3 inline-block text-sm font-semibold text-brand-gold underline"
                >
                  Related link →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-foreground/65">
          Want something listed?{" "}
          <Link href="/contact" className="font-semibold text-brand-gold underline">
            Contact the team
          </Link>{" "}
          with date, audience, and registration details.
        </p>
      </PageShell>
    </div>
  );
}
