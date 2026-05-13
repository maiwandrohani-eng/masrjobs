import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Posting guidelines for employers",
  description:
    "How to prepare listings that are clear for candidates and faster for administrators to review on MasrJobs.org.",
};

export default function PostingGuidelinesPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="Employers"
          title="Posting guidelines"
          description="Clear, complete listings get better applicants and spend less time in review. Use this checklist before you submit."
        />
        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-bold text-brand-navy">Basics</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Use a specific title (role + programme or location level), not only a project acronym.</li>
              <li>
                Set a realistic <strong>deadline</strong> and keep application instructions
                consistent across the short summary and full description.
              </li>
              <li>State location, modality (remote / hybrid / on-site), and language requirements up front.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">Compensation & logistics</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Clarify paid vs volunteer, stipend, or unpaid where relevant.</li>
              <li>For consultancies and tenders: mention deliverables, LOE or lot structure, and evaluation approach.</li>
              <li>For trainings: dates, modality, fees or subsidies, and prerequisites.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">How to apply</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Choose the application channel that matches how you will actually process candidates.</li>
              <li>If you use email, use a monitored inbox and say what to put in the subject line.</li>
              <li>If you use an external portal, verify the link works for logged-out users.</li>
            </ul>
          </section>
          <p>
            Ready to post?{" "}
            <Link
              href="/dashboard/organization"
              className="font-semibold text-brand-gold underline"
            >
              Open the organization workspace →
            </Link>
          </p>
        </div>
      </PageShell>
    </div>
  );
}
