import type { ApplicationStatus as PrismaApplicationStatus } from "@/generated/prisma/client";
import type { ApplicationStatus } from "@/lib/types";

export function prismaApplicationStatusToUi(
  s: PrismaApplicationStatus,
): ApplicationStatus {
  switch (s) {
    case "SUBMITTED":
      return "Submitted";
    case "UNDER_REVIEW":
      return "Under review";
    case "SHORTLISTED":
      return "Shortlisted";
    case "REJECTED":
      return "Rejected";
    case "ACCEPTED":
      return "Accepted";
    default:
      return "Submitted";
  }
}

export function uiApplicationStatusToPrisma(
  s: ApplicationStatus,
): PrismaApplicationStatus | null {
  const m: Record<ApplicationStatus, PrismaApplicationStatus> = {
    Submitted: "SUBMITTED",
    "Under review": "UNDER_REVIEW",
    Shortlisted: "SHORTLISTED",
    Rejected: "REJECTED",
    Accepted: "ACCEPTED",
  };
  return m[s] ?? null;
}
