import { PageIntro, PageShell } from "@/components/PageShell";
import { OrganizationsDirectory } from "@/components/OrganizationsDirectory";
import { SAMPLE_ORGANIZATIONS } from "@/lib/sample-data";

export default function OrganizationsPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Directory"
          title="Organization directory"
          description="Explore NGOs, UN agencies, and social impact employers posting on MasrJobs.org. Verified and featured badges help you spot trusted partners."
        />
        <OrganizationsDirectory organizations={SAMPLE_ORGANIZATIONS} />
      </PageShell>
    </div>
  );
}
