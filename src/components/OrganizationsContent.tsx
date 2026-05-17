"use client";

import { PageIntro, PageShell } from "@/components/PageShell";
import { OrganizationsDirectory } from "@/components/OrganizationsDirectory";
import { useLanguage } from "@/context/LanguageContext";
import type { Organization } from "@/lib/types";

export function OrganizationsContent({ organizations }: { organizations: Organization[] }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("organizationsEyebrow")}
          title={t("organizationsTitle")}
          description={t("organizationsDescription")}
        />
        <OrganizationsDirectory organizations={organizations} />
      </PageShell>
    </div>
  );
}
