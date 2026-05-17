"use client";

import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useLanguage } from "@/context/LanguageContext";

export function HomeNewsletter() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-brand-border bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-bold text-brand-navy">{t("newsletterHeading")}</h2>
        <p className="mt-2 text-sm text-foreground/70">{t("newsletterSubtext")}</p>
        <NewsletterSignup
          source="homepage"
          placeholder="Your email address"
          buttonLabel={t("newsletterButton")}
        />
      </div>
    </section>
  );
}
