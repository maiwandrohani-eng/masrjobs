import { OrganizationsContent } from "@/components/OrganizationsContent";
import { loadDirectoryOrganizations } from "@/lib/db/catalog-queries";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const prisma = getPrisma();
  const organizations = prisma
    ? await loadDirectoryOrganizations(prisma)
    : [];

  return <OrganizationsContent organizations={organizations} />;
}
