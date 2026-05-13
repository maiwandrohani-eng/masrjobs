import type { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { mapOpportunityRecord } from "@/lib/db/map-prisma-catalog";
import { loadOpportunityByRef } from "@/lib/db/catalog-queries";
import { absoluteUrl } from "@/lib/site-url";
import type { Opportunity } from "@/lib/types";
import OpportunityDetailPageClient from "./OpportunityDetailPageClient";
import { JobPostingJsonLd } from "./JobPostingJsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const prisma = getPrisma();
  if (!prisma) {
    return {
      title: "Opportunity | MasrJobs.org",
      description:
        "Jobs, consultancies, and impact roles for Egypt’s NGO and development sector on MasrJobs.org.",
    };
  }
  const row = await loadOpportunityByRef(prisma, id);
  if (!row) {
    return {
      title: "Opportunity | MasrJobs.org",
      description:
        "Jobs, consultancies, and impact roles for Egypt’s NGO and development sector on MasrJobs.org.",
    };
  }
  const o = mapOpportunityRecord(row);
  const pathSeg = o.slug ?? o.id;
  const title = `${o.title} | MasrJobs.org`;
  const description =
    o.shortDescription ??
    "Jobs, consultancies, and impact roles for Egypt’s NGO and development sector on MasrJobs.org.";
  const url = absoluteUrl(`/opportunities/${pathSeg}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "MasrJobs.org",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  const prisma = getPrisma();
  let initial: Opportunity | null | undefined = undefined;
  if (prisma) {
    const row = await loadOpportunityByRef(prisma, id);
    initial = row ? mapOpportunityRecord(row) : null;
  }

  const o = initial ?? null;
  const pathSeg = o ? (o.slug ?? o.id) : id;
  const url = absoluteUrl(`/opportunities/${pathSeg}`);

  return (
    <>
      {o ? <JobPostingJsonLd opportunity={o} url={url} /> : null}
      <OpportunityDetailPageClient initialOpportunity={initial} pathParam={id} />
    </>
  );
}
