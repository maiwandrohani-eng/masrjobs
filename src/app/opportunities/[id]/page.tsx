import type { Metadata } from "next";
import { SAMPLE_OPPORTUNITIES } from "@/lib/sample-data";
import { absoluteUrl } from "@/lib/site-url";
import OpportunityDetailPageClient from "./OpportunityDetailPageClient";
import { JobPostingJsonLd } from "./JobPostingJsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const o = SAMPLE_OPPORTUNITIES.find((x) => x.id === id);
  const title = o ? `${o.title} | MasrJobs.org` : "Opportunity | MasrJobs.org";
  const description =
    o?.shortDescription ??
    "Jobs, consultancies, and impact roles for Egypt’s NGO and development sector on MasrJobs.org.";
  const url = absoluteUrl(`/opportunities/${id}`);
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
  const o = SAMPLE_OPPORTUNITIES.find((x) => x.id === id);
  const url = absoluteUrl(`/opportunities/${id}`);

  return (
    <>
      {o ? <JobPostingJsonLd opportunity={o} url={url} /> : null}
      <OpportunityDetailPageClient />
    </>
  );
}
