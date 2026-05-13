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
              <li>Donors and partners looking for visible, well-governed listings</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">Quality & moderation</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              Organization accounts and new listings pass through an admin review step
              before going live. This reduces spam, protects applicants, and keeps the
              platform credible for Egypt’s social impact ecosystem.
            </p>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
