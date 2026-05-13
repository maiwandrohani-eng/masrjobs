import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { PageIntro, PageShell } from "@/components/PageShell";
import { ResourcesArticles } from "@/components/ResourcesArticles";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import { resourceArticleSummaries } from "@/lib/resources-articles";

const articles = resourceArticleSummaries();

export default function ResourcesPage() {
  const demo = isDemoAuthEnabled();

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
          <NewsletterSignup demoAuthEnabled={demo} />
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
