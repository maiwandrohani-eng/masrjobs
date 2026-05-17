"use client";

import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useLanguage } from "@/context/LanguageContext";

export function PostingGuidelinesContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow={t("postingEyebrow")}
          title={t("postingTitle")}
          description={t("postingDescription")}
        />
        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-bold text-brand-navy">{t("postingBasicsHeading")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{t("postingBasics1")}</li>
              <li>
                {t("postingBasics2Before")}{" "}
                <strong>{t("postingBasics2Bold")}</strong>{" "}
                {t("postingBasics2After")}
              </li>
              <li>{t("postingBasics3")}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">{t("postingCompHeading")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{t("postingComp1")}</li>
              <li>{t("postingComp2")}</li>
              <li>{t("postingComp3")}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand-navy">{t("postingApplyHeading")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{t("postingApply1")}</li>
              <li>{t("postingApply2")}</li>
              <li>{t("postingApply3")}</li>
            </ul>
          </section>
          <p>
            {t("postingReadyBefore")}{" "}
            <Link
              href="/dashboard/organization"
              className="font-semibold text-brand-gold underline"
            >
              {t("postingReadyLinkLabel")}
            </Link>
          </p>
        </div>
      </PageShell>
    </div>
  );
}
