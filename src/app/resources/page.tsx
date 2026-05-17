import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { PageIntro, PageShell } from "@/components/PageShell";
import { ResourcesArticles } from "@/components/ResourcesArticles";
import { resourceArticleSummaries } from "@/lib/resources-articles";
import { getResourceArticleListMeta } from "@/lib/resources-read-time";

const articles = resourceArticleSummaries().map((a) => {
  const meta = getResourceArticleListMeta(a.slug);
  return {
    ...a,
    author: meta.author,
    readTimeMinutes: meta.readTimeMinutes,
  };
});

export default function ResourcesPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Resources"
          title="Career guidance & NGO sector tips"
          description="Practical articles for candidates and employers in Egypt’s social impact ecosystem. This MVP surfaces editorial-style content; connect a CMS when you scale."
        />
        <div className="rounded-2xl border border-brand-border bg-brand-muted/50 p-6">
          <h2 className="text-base font-bold text-brand-navy">
            Get new opportunities in your inbox every week. No spam — only what&apos;s posted
            on MasrJobs.
          </h2>
          <NewsletterSignup
            source="resources"
            placeholder="Your email address"
            buttonLabel="Subscribe"
          />
        </div>
        <div className="mt-10">
          <ResourcesArticles articles={articles} />
        </div>
        <p className="mt-6 text-sm text-foreground/65">
          Ready to search live roles?{" "}
          <Link
            href="/opportunities"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            Browse opportunities
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
