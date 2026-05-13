import { PageIntro, PageShell } from "@/components/PageShell";
import { OrganizationsDirectory } from "@/components/OrganizationsDirectory";
import { loadDirectoryOrganizations } from "@/lib/db/catalog-queries";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const prisma = getPrisma();
  const organizations = prisma
    ? await loadDirectoryOrganizations(prisma)
    : [];

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Directory"
          title="Organization directory"
          description="Explore NGOs, UN agencies, and social impact employers posting on MasrJobs.org. Verified and featured badges help you spot trusted partners."
        />
        <OrganizationsDirectory organizations={organizations} />
      </PageShell>
    </div>
  );
}
