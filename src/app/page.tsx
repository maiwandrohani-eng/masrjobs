import { Suspense } from "react";
import { HomeCatalog } from "@/components/HomeCatalog";
import { HomeExplore } from "@/components/HomeExplore";
import { HomeEmployerCta } from "@/components/home/HomeEmployerCta";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
import {
  getPublishedOpportunityCount,
  getVerifiedOrganizationsForStrip,
} from "@/lib/home-page-data";

export default async function Home() {
  const [publishedOpportunityCount, verifiedOrganizations] = await Promise.all([
    getPublishedOpportunityCount(),
    getVerifiedOrganizationsForStrip(),
  ]);

  return (
    <div className="bg-background">
      <HomeHero
        publishedOpportunityCount={publishedOpportunityCount}
        verifiedOrganizations={verifiedOrganizations}
      />
      <HomeExplore />
      <HomeNewsletter />
      <HomeEmployerCta />
      <Suspense fallback={null}>
        <HomeCatalog />
      </Suspense>
    </div>
  );
}
