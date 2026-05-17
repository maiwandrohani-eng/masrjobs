"use client";

import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { PageIntro, PageShell } from "@/components/PageShell";
import { ResourcesArticles, type ResourceArticle } from "@/components/ResourcesArticles";
import { useLanguage } from "@/context/LanguageContext";

export function ResourcesContent({ articles }: { articles: ResourceArticle[] }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("resourcesEyebrow")}
          title={t("resourcesTitle")}
          description={t("resourcesDescription")}
        />
        <div className="rounded-2xl border border-brand-border bg-brand-muted/50 p-6">
          <h2 className="text-base font-bold text-brand-navy">
            {t("resourcesNewsletterHeading")}
          </h2>
          <NewsletterSignup
            source="resources"
            placeholder={t("resourcesNewsletterPlaceholder")}
            buttonLabel={t("resourcesNewsletterButton")}
          />
        </div>
        <div className="mt-10">
          <ResourcesArticles articles={articles} />
        </div>
        <p className="mt-6 text-sm text-foreground/65">
          {t("resourcesReadyBefore")}{" "}
          <Link
            href="/opportunities"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            {t("resourcesBrowseLink")}
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
