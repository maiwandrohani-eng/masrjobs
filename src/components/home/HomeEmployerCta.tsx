"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function HomeEmployerCta() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-brand-border bg-brand-muted/50 py-14">
      <div className="mx-auto max-w-3xl px-4 text-center">
      <h2 className="text-2xl font-bold text-brand-navy">{t("employerHeading")}</h2>
      <p className="mt-4 text-base leading-relaxed text-foreground/75">{t("employerBody")}</p>
      <Link
        href="/dashboard/organization"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-brand-navy px-8 text-sm font-semibold text-white shadow-sm hover:opacity-95"
      >
        {t("employerButton")}
      </Link>
      <p className="mt-4 text-sm text-foreground/55">{t("employerSupport")}</p>
      </div>
    </section>
  );
}
