"use client";

import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useLanguage } from "@/context/LanguageContext";

const SPOTLIGHTS = [
  {
    orgKey: "spotlightsCard1Org",
    titleKey: "spotlightsCard1Title",
    bodyKey: "spotlightsCard1Body",
    link: "/organizations",
  },
  {
    orgKey: "spotlightsCard2Org",
    titleKey: "spotlightsCard2Title",
    bodyKey: "spotlightsCard2Body",
    link: "/opportunities",
  },
  {
    orgKey: "spotlightsCard3Org",
    titleKey: "spotlightsCard3Title",
    bodyKey: "spotlightsCard3Body",
    link: "/opportunities?category=Consultancies",
  },
] as const;

export function SpotlightsContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("spotlightsEyebrow")}
          title={t("spotlightsTitle")}
          description={t("spotlightsDescription")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {SPOTLIGHTS.map((s) => (
            <article
              key={s.titleKey}
              className="flex flex-col rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {t(s.orgKey)}
              </p>
              <h2 className="mt-2 text-lg font-bold text-brand-navy">{t(s.titleKey)}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{t(s.bodyKey)}</p>
              <Link
                href={s.link}
                className="mt-4 text-sm font-semibold text-brand-gold underline"
              >
                {t("exploreListings")}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-foreground/70">
          {t("spotlightsFooterBefore")}{" "}
          <Link href="/contact" className="font-semibold text-brand-gold underline">
            {t("spotlightsFooterLinkLabel")}
          </Link>
          {t("spotlightsFooterAfter")}
        </p>
      </PageShell>
    </div>
  );
}
