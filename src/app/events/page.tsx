import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { loadCommunityEvents } from "@/lib/community-events";
import { getPrisma } from "@/lib/prisma";

export const metadata = {
  title: "Events & key dates",
  description:
    "Workshops, webinars, and milestone dates for Egypt’s development and social impact community.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const prisma = getPrisma();
  const events = prisma ? await loadCommunityEvents(prisma) : [];
  const hasUnconfirmed = events.some((e) => !e.confirmed);

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="Community"
          title="Events & key dates"
          description="Editorial calendar of sessions and seasonal hiring rhythms."
        />
        {hasUnconfirmed ? (
          <p
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            Some events below are not yet confirmed. Check back or contact the organizer before
            registering.
          </p>
        ) : null}
        <ul className="space-y-4">
          {events.map((e) => (
            <li
              key={e.id}
              className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  {e.eventDate}
                </p>
                {!e.confirmed ? (
                  <span className="rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    UNCONFIRMED
                  </span>
                ) : null}
              </div>
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
