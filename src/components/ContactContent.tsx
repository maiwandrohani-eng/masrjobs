"use client";

import { ContactForm } from "@/components/ContactForm";
import { ContactSidebar } from "@/components/ContactSidebar";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useLanguage } from "@/context/LanguageContext";
import type { ContactPublicData } from "@/lib/site-contact";

export function ContactContent({ contact }: { contact: ContactPublicData }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("contactEyebrow")}
          title={t("contactTitle")}
          description={t("contactDescription")}
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <ContactForm />
          <ContactSidebar data={contact} />
        </div>
      </PageShell>
    </div>
  );
}
