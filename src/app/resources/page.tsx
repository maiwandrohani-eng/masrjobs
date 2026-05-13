import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { ResourcesArticles } from "@/components/ResourcesArticles";

const articles = [
  {
    title: "How to read a TOR like a hiring manager",
    excerpt:
      "Terms of reference hide clues about evaluation criteria, reporting lines, and what “success” really means.",
    category: "Hiring",
  },
  {
    title: "CVs for NGOs vs. private sector",
    excerpt:
      "Lead with mission alignment, programme scale, and measurable impact — then layer technical skills.",
    category: "Careers",
  },
  {
    title: "Safeguarding basics every applicant should know",
    excerpt:
      "Understand PSEA, referral pathways, and why recruiters ask behavioural questions in screenings.",
    category: "Safeguarding",
  },
  {
    title: "Remote and hybrid roles in Egypt’s development space",
    excerpt:
      "How to demonstrate async collaboration, data security, and field connectivity when working hybrid.",
    category: "Work formats",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Resources"
          title="Career guidance & NGO sector tips"
          description="Practical articles for candidates and employers in Egypt’s social impact ecosystem. This MVP surfaces editorial-style content; connect a CMS when you scale."
        />
        <ResourcesArticles articles={articles} />
        <div className="mt-10 rounded-2xl border border-brand-border bg-brand-muted/50 p-6">
          <h2 className="text-base font-bold text-brand-navy">Newsletter</h2>
          <p className="mt-2 text-sm text-foreground/75">
            Subscribe to weekly digests of new grants, consultancies, and impact roles.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
            <button
              type="button"
              className="rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              Join list (demo)
            </button>
          </div>
        </div>
        <p className="mt-6 text-sm text-foreground/65">
          Ready to search live roles?{" "}
          <Link href="/opportunities" className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2">
            Browse opportunities
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
