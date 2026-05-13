import type { Opportunity } from "@/lib/types";
import { absoluteUrl } from "@/lib/site-url";

function toIsoDate(isoDay: string) {
  return new Date(isoDay + "T12:00:00.000Z").toISOString();
}

function daysFromIsoDay(isoDay: string, deltaDays: number) {
  const d = new Date(isoDay + "T12:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString();
}

export function JobPostingJsonLd({
  opportunity,
  url,
}: {
  opportunity: Opportunity;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opportunity.title,
    description: `${opportunity.shortDescription}\n\n${opportunity.description}`.slice(0, 50000),
    datePosted: daysFromIsoDay(opportunity.deadline, -21),
    validThrough: toIsoDate(opportunity.deadline),
    employmentType: opportunity.type,
    hiringOrganization: {
      "@type": "Organization",
      name: opportunity.organizationName,
      sameAs: absoluteUrl("/organizations"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: opportunity.location,
        addressCountry: "EG",
      },
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
