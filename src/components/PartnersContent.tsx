"use client";

import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useLanguage } from "@/context/LanguageContext";

export function PartnersContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow={t("partnersEyebrow")}
          title={t("partnersTitle")}
          description={t("partnersDescription")}
        />
        <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <p>{t("partnersPara1")}</p>
          <p>
            {t("partnersPara2Before")}{" "}
            <Link href="/contact" className="font-semibold text-brand-gold underline">
              {t("partnersPara2LinkLabel")}
            </Link>
            {t("partnersPara2After")}
          </p>
          <div className="rounded-2xl border border-dashed border-brand-border bg-brand-muted/40 p-6 text-center text-foreground/70">
            {t("partnersPlaceholder")}
          </div>
        </div>
      </PageShell>
    </div>
  );
}
