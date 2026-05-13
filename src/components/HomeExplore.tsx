import Link from "next/link";

const cards = [
  {
    href: "/how-it-works",
    title: "How MasrJobs works",
    text: "Who can post, how review works, and what verified employers mean.",
  },
  {
    href: "/sectors",
    title: "Browse by theme",
    text: "Jump to jobs, consultancies, trainings, and more by category or focus area.",
  },
  {
    href: "/resources/internal-application-checklist-masrjobs",
    title: "Application checklist",
    text: "Prepare a strong internal application before you hit submit.",
  },
  {
    href: "/events",
    title: "Events & deadlines",
    text: "Workshops, webinars, and milestone dates worth adding to your calendar.",
  },
  {
    href: "/spotlights",
    title: "Employer spotlights",
    text: "Short reads on how teams hire and what they look for in candidates.",
  },
  {
    href: "/impact",
    title: "Transparency",
    text: "How we think about quality listings and a fair experience for everyone.",
  },
] as const;

export function HomeExplore() {
  return (
    <section className="border-t border-brand-border bg-white py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-brand-navy">Explore the platform</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Guides and hubs beyond the job board — built to help applicants and employers
          get more from MasrJobs.org.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="flex h-full flex-col rounded-2xl border border-brand-border bg-brand-muted/30 p-5 shadow-sm transition-shadow hover:border-brand-gold/40 hover:shadow-md"
              >
                <span className="text-base font-bold text-brand-navy">{c.title}</span>
                <span className="mt-2 text-sm text-foreground/75">{c.text}</span>
                <span className="mt-4 text-sm font-semibold text-brand-gold">Read more →</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            href="/posting-guidelines"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            Posting guidelines (employers)
          </Link>
          <Link
            href="/partners"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            Partners
          </Link>
        </div>
      </div>
    </section>
  );
}
