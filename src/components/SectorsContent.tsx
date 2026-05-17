"use client";

import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useLanguage } from "@/context/LanguageContext";
import type { HomeTranslationKey } from "@/lib/i18n/home-translations";
import type { OpportunityCategory } from "@/lib/types";

const THEMES: {
  titleKey: HomeTranslationKey;
  blurbKey: HomeTranslationKey;
  category: OpportunityCategory;
}[] = [
  { titleKey: "sectorsJobsTitle", blurbKey: "sectorsJobsBlurb", category: "Jobs" },
  { titleKey: "sectorsConsultanciesTitle", blurbKey: "sectorsConsultanciesBlurb", category: "Consultancies" },
  { titleKey: "sectorsTrainingsTitle", blurbKey: "sectorsTrainingsBlurb", category: "Trainings" },
  { titleKey: "sectorsVolunteerTitle", blurbKey: "sectorsVolunteerBlurb", category: "Volunteer Roles" },
  { titleKey: "sectorsTendersTitle", blurbKey: "sectorsTendersBlurb", category: "Tenders" },
  { titleKey: "sectorsGrantsTitle", blurbKey: "sectorsGrantsBlurb", category: "Grants" },
] as const;

export function SectorsContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("sectorsEyebrow")}
          title={t("sectorsTitle")}
          description={t("sectorsDescription")}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme) => {
            const href = `/opportunities?category=${encodeURIComponent(theme.category)}`;
            return (
              <Link
                key={theme.category}
                href={href}
                className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-shadow hover:border-brand-gold/40 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-brand-navy">{t(theme.titleKey)}</h2>
                <p className="mt-2 text-sm text-foreground/75">{t(theme.blurbKey)}</p>
                <p className="mt-4 text-sm font-semibold text-brand-gold">{t("viewListings")}</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-10 text-sm text-foreground/70">
          {t("sectorsPreferGrid")}{" "}
          <Link href="/opportunities" className="font-semibold text-brand-gold underline">
            {t("sectorsOpenAll")}
          </Link>{" "}
          {t("sectorsOr")}{" "}
          <Link href="/how-it-works" className="font-semibold text-brand-gold underline">
            {t("sectorsHowItWorksLink")}
          </Link>
          .
        </p>
      </PageShell>
    </div>
  );
}
