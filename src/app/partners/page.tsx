import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Partners",
  description:
    "Organizations and collaborators supporting MasrJobs.org and Egypt’s social impact talent ecosystem.",
};

export default function PartnersPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="MasrJobs.org"
          title="Partners & collaboration"
          description="MasrJobs.org grows through trusted employers, networks, and funders who care about transparent hiring in Egypt’s NGO and development space."
        />
        <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <p>
            We are building space for mission-aligned partners: NGOs posting roles,
            universities linking graduates, donors who care about workforce development, and
            media amplifying impact careers.
          </p>
          <p>
            If you represent an institution that wants to explore co-branded content,
            events, or data ethics guardrails for listings, start a conversation through{" "}
            <Link href="/contact" className="font-semibold text-brand-gold underline">
              Contact
            </Link>
            .
          </p>
          <div className="rounded-2xl border border-dashed border-brand-border bg-brand-muted/40 p-6 text-center text-foreground/70">
            Partner logos and joint announcements can live here as relationships formalize.
          </div>
        </div>
      </PageShell>
    </div>
  );
}
