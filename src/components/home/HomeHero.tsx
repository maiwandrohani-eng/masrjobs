"use client";

import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { HomeCategorySection } from "@/components/home/HomeCategorySection";
import { HomeOrganizationsStrip } from "@/components/home/HomeOrganizationsStrip";
import { useLanguage } from "@/context/LanguageContext";
import type { VerifiedOrgStripItem } from "@/lib/home-page-data";

type Props = {
  publishedOpportunityCount: number;
  verifiedOrganizations: VerifiedOrgStripItem[];
};

export function HomeHero({ publishedOpportunityCount, verifiedOrganizations }: Props) {
  const { t } = useLanguage();

  return (
    <section className="border-b border-brand-border bg-gradient-to-b from-white to-brand-muted/80">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-gold" />
            {t("heroBadge")}
          </p>
          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-brand-navy md:text-5xl md:leading-tight">
            {t("heroHeading")}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
            {t("heroLine1")}
          </p>
          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
            {t("heroLine2")}
          </p>
          <p className="mt-3 text-sm text-foreground/55">{t("heroTrust")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/opportunities"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-navy px-6 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/dashboard/organization"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brand-border bg-white px-6 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-muted"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <div className="relative rounded-3xl border border-brand-border bg-white p-8 shadow-md">
          <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-brand-gold via-brand-gold-soft to-brand-navy opacity-95" />
          <div className="flex flex-col items-center text-center">
            <LogoMark />
            <p className="mt-6 text-sm font-semibold text-brand-navy">{t("heroCardTitle")}</p>
            <p className="mt-2 text-sm text-foreground/65">{t("heroCardBody")}</p>
            <Link
              href="/opportunities"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-gold py-3 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft"
            >
              {t("heroCardCta")}
            </Link>
          </div>
        </div>
      </div>
      <HomeOrganizationsStrip organizations={verifiedOrganizations} />
      <HomeCategorySection publishedOpportunityCount={publishedOpportunityCount} />
    </section>
  );
}
