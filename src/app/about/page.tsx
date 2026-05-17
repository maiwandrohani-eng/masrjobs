import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function AboutPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="About MasrJobs.org"
          title="Egypt’s Development & Social Impact Jobs Platform"
          description="MasrJobs.org connects mission-driven talent with NGOs, development agencies, and social enterprises across Egypt — making it easier to find meaningful work and partnerships."
        />

        <div className="max-w-none space-y-10">
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">Our mission</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              We believe Egypt’s nonprofit and development sector grows stronger when
              opportunities are transparent, accessible, and trustworthy. MasrJobs.org
              aggregates roles across humanitarian response, sustainable development,
              education, climate resilience, gender equality, and more — in one
              bilingual-ready, mobile-friendly experience.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">Who we serve</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-foreground/80">
              <li>Professionals seeking NGO jobs, consultancies, and fellowships</li>
              <li>Students and graduates exploring trainings and volunteering</li>
              <li>Organizations recruiting vetted talent and publishing tenders or grants</li>
              <li>
                Egyptian and international organizations seeking to reach pre-vetted,
                mission-aligned candidates in Egypt.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">Quality & moderation</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              MasrJobs uses a two-stage review process. First, every organization account
              is verified by the admin team before the organization can post anything.
              Second, every individual listing is reviewed for quality and fit before it
              appears publicly. This means nothing on MasrJobs is unreviewed — not the
              employer, not the role.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">Who built this</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              MasrJobs.org was founded by Maiwand Rohani, CEO of{" "}
              <Link
                href="https://inara.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-gold underline"
              >
                INARA
              </Link>{" "}
              (International Network for Aid, Relief, and Assistance), with the support of
              volunteers from Egypt’s NGO sector who contributed their time and expertise to
              build the platform.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              The platform grew out of a direct need observed through humanitarian and
              development work in Egypt — the absence of a single, trustworthy,
              sector-specific space where mission-driven professionals and organizations
              could find each other. MasrJobs is the answer to that gap.
            </p>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
