import { PageIntro, PageShell } from "@/components/PageShell";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Contact"
          title="We would love to hear from you"
          description="Partnerships, media, employer onboarding, or technical support — send us a note and we will route it to the right team."
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <ContactForm />
          <aside className="space-y-4 rounded-2xl border border-brand-border bg-brand-muted/50 p-6">
            <h2 className="text-sm font-bold text-brand-navy">Office (demo)</h2>
            <p className="text-sm text-foreground/75">
              Cairo, Egypt
              <br />
              Email: hello@masrjobs.org
              <br />
              Hours: Sun–Thu, 9:00–17:00 (EET)
            </p>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                Social
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <a
                  className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
                  href="https://facebook.com/masrjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a
                  className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
                  href="https://instagram.com/masrjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
                  href="https://x.com/masrjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X
                </a>
                <a
                  className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
                  href="https://linkedin.com/company/masrjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
                  href="https://tiktok.com/@masrjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
                <a
                  className="text-brand-gold underline decoration-brand-gold/40 underline-offset-2"
                  href="https://youtube.com/@masrjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </div>
            </div>
            <p className="text-xs text-foreground/60">
              Replace these details with your production contacts and optional map embed.
            </p>
          </aside>
        </div>
      </PageShell>
    </div>
  );
}
