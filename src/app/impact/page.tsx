import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Transparency & impact",
  description:
    "Principles behind listings quality, fairness, and how MasrJobs.org serves Egypt’s social impact ecosystem.",
};

export default function ImpactPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="MasrJobs.org"
          title="Transparency & principles"
          description="We want MasrJobs.org to be a calm, trustworthy place to find serious roles — for candidates and for mission-driven employers."
        />
        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-bold text-brand-navy">What we optimize for</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Clarity</strong> — candidates should understand role, location, and how
                to apply without hunting through attachments.
              </li>
              <li>
                <strong>Fair process</strong> — published listings should reflect what the
                organization intends to recruit for, with deadlines that respect applicants’
                time.
              </li>
              <li>
                <strong>Verified employers</strong> — organization accounts go through review
                so the directory is not a free-for-all.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">Growing with the sector</h2>
            <p className="mt-3">
              Metrics and partner stories will expand as the platform matures. For now, the
              best signal is the quality of listings and the organizations choosing to post
              here. If you have ideas for accountability or reporting you would like to see
              published, reach us via{" "}
              <Link href="/contact" className="font-semibold text-brand-gold underline">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
