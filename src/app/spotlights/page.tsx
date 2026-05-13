import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Employer spotlights",
  description:
    "How mission-driven employers in Egypt think about hiring, teams, and what they look for in candidates.",
};

const SPOTLIGHTS = [
  {
    org: "Humanitarian & health programmes",
    title: "Clarity beats volume",
    body: "Teams that respond fastest often run shortlisting against the TOR line-by-line. They look for evidence of delivery in similar contexts — not generic corporate language.",
    link: "/organizations",
  },
  {
    org: "National NGOs",
    title: "Arabic–English balance",
    body: "Many roles require fluent Arabic for communities and strong English for reporting. Candidates who state CEFR or workplace level honestly save everyone time in interview.",
    link: "/opportunities",
  },
  {
    org: "Consultancies & evaluations",
    title: "Methodology and ethics",
    body: "Evaluators want to see how you handle data protection, consent, and inclusion in sampling. A two-paragraph methodology sketch in your expression of interest can carry more weight than a long biography.",
    link: "/opportunities?category=Consultancies",
  },
] as const;

export default function SpotlightsPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Employers"
          title="Employer spotlights"
          description="Short reads on hiring norms in Egypt’s social impact sector — editorial guidance, not quotes from individual employers."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {SPOTLIGHTS.map((s) => (
            <article
              key={s.title}
              className="flex flex-col rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {s.org}
              </p>
              <h2 className="mt-2 text-lg font-bold text-brand-navy">{s.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{s.body}</p>
              <Link
                href={s.link}
                className="mt-4 text-sm font-semibold text-brand-gold underline"
              >
                Explore listings →
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-foreground/70">
          If your organization would like a structured spotlight interview for this page in
          the future, mention it when you{" "}
          <Link href="/contact" className="font-semibold text-brand-gold underline">
            contact us
          </Link>
          .
        </p>
      </PageShell>
    </div>
  );
}
