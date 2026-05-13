import type {
  Opportunity,
  OrgOpportunitySubmissionInput,
  SessionUser,
} from "@/lib/types";

export function buildOpportunityFromSubmission(
  session: SessionUser,
  input: OrgOpportunitySubmissionInput,
  id: string,
): Opportunity {
  /** Never use the contact person's display name as the employer brand on listings. */
  const orgName = session.organizationName?.trim() || "Organization";
  const orgId = session.organizationId ?? "org-unknown";

  const trim = (s: string) => s.trim();
  const opt = (s: string) => {
    const t = trim(s);
    return t.length ? t : undefined;
  };

  const method = input.applicationMethod ?? "internal";
  const appEmail = trim(input.applicationEmail ?? "");
  const ext = trim(input.externalApplicationUrl ?? "");

  return {
    id,
    title: trim(input.title),
    organizationId: orgId,
    organizationName: orgName,
    category: input.category,
    location: trim(input.location),
    deadline: input.deadline,
    type: trim(input.type),
    workArrangement: input.workArrangement,
    compensation: input.compensation,
    shortDescription: trim(input.shortDescription),
    description: trim(input.description),
    requirements: trim(input.requirements),
    howToApply: trim(input.howToApply),
    applicationMethod: method,
    applicationEmail: method === "email" ? opt(appEmail) : undefined,
    externalApplicationUrl: method === "external" ? opt(ext) : undefined,
    externalApplyUrl: method === "external" ? opt(ext) : undefined,
    visibility: "pending_approval",
    contractType: opt(input.contractType),
    startDate: opt(input.startDate),
    duration: opt(input.duration),
    salaryOrCompensationDetail: opt(input.salaryOrCompensationDetail),
    budgetOrContractValue: opt(input.budgetOrContractValue),
    experienceLevel: opt(input.experienceLevel),
    educationRequirements: opt(input.educationRequirements),
    languagesRequired: opt(input.languagesRequired),
    positionsAvailable: opt(input.positionsAvailable),
    sectorThematicArea: opt(input.sectorThematicArea),
    tenderOrGrantReference: opt(input.tenderOrGrantReference),
    eligibilitySummary: opt(input.eligibilitySummary),
    contactPersonName: opt(input.contactPersonName),
    contactEmail: opt(input.contactEmail),
    contactPhone: opt(input.contactPhone),
    attachmentsUrl: opt(input.attachmentsUrl),
    additionalInformation: opt(input.additionalInformation),
  };
}
