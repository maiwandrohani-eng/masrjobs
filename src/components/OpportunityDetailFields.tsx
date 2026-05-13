import type { Opportunity } from "@/lib/types";

function Row({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value?.trim()) return null;
  return (
    <div className="border-b border-brand-border py-2 last:border-0 sm:grid sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        {label}
      </dt>
      <dd className="text-sm text-foreground/85">{value}</dd>
    </div>
  );
}

export function OpportunityDetailFields({ o }: { o: Opportunity }) {
  const keys: (keyof Opportunity)[] = [
    "contractType",
    "startDate",
    "duration",
    "salaryOrCompensationDetail",
    "budgetOrContractValue",
    "experienceLevel",
    "educationRequirements",
    "languagesRequired",
    "positionsAvailable",
    "sectorThematicArea",
    "tenderOrGrantReference",
    "eligibilitySummary",
    "contactPersonName",
    "contactEmail",
    "contactPhone",
    "attachmentsUrl",
    "additionalInformation",
  ];
  const hasAny = keys.some((k) => {
    const v = o[k];
    return typeof v === "string" && v.trim().length > 0;
  });
  if (!hasAny) return null;
  return (
    <section className="mt-8 rounded-2xl border border-brand-border bg-brand-muted/30 p-5">
      <h2 className="text-base font-bold text-brand-navy">Listing details</h2>
      <dl className="mt-3 divide-y divide-brand-border/80">
        <Row label="Contract / engagement type" value={o.contractType} />
        <Row label="Start date" value={o.startDate} />
        <Row label="Duration / LOE" value={o.duration} />
        <Row label="Salary, stipend, or fee" value={o.salaryOrCompensationDetail} />
        <Row label="Budget / contract value" value={o.budgetOrContractValue} />
        <Row label="Experience level" value={o.experienceLevel} />
        <Row label="Education" value={o.educationRequirements} />
        <Row label="Languages" value={o.languagesRequired} />
        <Row label="Positions / slots" value={o.positionsAvailable} />
        <Row label="Sector / thematic area" value={o.sectorThematicArea} />
        <Row label="Tender or grant reference" value={o.tenderOrGrantReference} />
        <Row label="Eligibility" value={o.eligibilitySummary} />
        <Row label="Contact person" value={o.contactPersonName} />
        <Row label="Contact email" value={o.contactEmail} />
        <Row label="Contact phone" value={o.contactPhone} />
        <Row label="Attachments / documents (URL)" value={o.attachmentsUrl} />
        <Row label="Additional information" value={o.additionalInformation} />
      </dl>
    </section>
  );
}
