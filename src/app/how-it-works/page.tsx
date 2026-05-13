import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export const metadata = {
  title: "How MasrJobs.org works",
  description:
    "Who can post listings, how review works, verified employers, and how applications flow on MasrJobs.org.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="Guides"
          title="How MasrJobs.org works"
          description="A short map of the platform so you know what to expect — whether you are applying, hiring, or browsing the directory."
        />
        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-bold text-brand-navy">For applicants</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Browse published opportunities, save listings, and track applications from
                your{" "}
                <Link href="/dashboard/user" className="font-semibold text-brand-gold underline">
                  applicant dashboard
                </Link>
                .
              </li>
              <li>
                Listings are posted by organizations and reviewed before they appear publicly
                where the workflow requires it.
              </li>
              <li>
                Some roles use <strong>internal apply</strong> on MasrJobs.org; others use
                email or an external link — the listing always states which path to use.
              </li>
            </ul>
            <p className="mt-4">
              <Link
                href="/resources/internal-application-checklist-masrjobs"
                className="font-semibold text-brand-gold underline"
              >
                Internal application checklist →
              </Link>
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">For employers</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Organizations register, then an administrator verifies the account before
                new listings can be submitted (where that workflow is enabled).
              </li>
              <li>
                You can post jobs, consultancies, trainings, volunteer roles, tenders, and
                grants using the structured employer form.
              </li>
              <li>
                Each submission is reviewed for quality and fit before it is published on
                the public directory.
              </li>
            </ul>
            <p className="mt-4">
              <Link href="/posting-guidelines" className="font-semibold text-brand-gold underline">
                Posting guidelines for faster approval →
              </Link>
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">Trust & directory</h2>
            <p className="mt-3">
              The{" "}
              <Link href="/organizations" className="font-semibold text-brand-gold underline">
                organization directory
              </Link>{" "}
              highlights verified employers. Badges and filters help you scan quickly before
              you open a full listing.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">Explore more</h2>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/sectors" className="font-semibold text-brand-gold underline">
                  Browse by theme / category
                </Link>
              </li>
              <li>
                <Link href="/events" className="font-semibold text-brand-gold underline">
                  Events & key dates
                </Link>
              </li>
              <li>
                <Link href="/spotlights" className="font-semibold text-brand-gold underline">
                  Employer spotlights
                </Link>
              </li>
              <li>
                <Link href="/impact" className="font-semibold text-brand-gold underline">
                  Transparency & principles
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
