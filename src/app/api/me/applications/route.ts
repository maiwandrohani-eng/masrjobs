import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prismaApplicationStatusToUi } from "@/lib/application-status-map";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Applicant's internal applications (Neon) for dashboard / tracker. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "INDIVIDUAL") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  const rows = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      opportunity: {
        select: {
          title: true,
          organizationId: true,
          organization: { select: { name: true } },
        },
      },
    },
  });

  const email = session.user.email?.trim().toLowerCase() ?? "";
  const displayName =
    (session.user.name && session.user.name.trim()) ||
    email.split("@")[0]?.replace(/[._-]/g, " ") ||
    "Applicant";

  const applications = rows.map((row) => ({
    id: row.id,
    serverId: row.id,
    opportunityId: row.opportunityId,
    opportunityTitle: row.opportunity.title,
    organizationName: row.opportunity.organization.name,
    organizationId: row.opportunity.organizationId,
    status: prismaApplicationStatusToUi(row.status),
    submittedAt: row.createdAt.toISOString().slice(0, 10),
    coverLetter: row.coverLetter ?? undefined,
    applicantEmail: email,
    applicantDisplayName: displayName,
    applicantFullName: row.applicantFullName ?? undefined,
    applicantPhone: row.applicantPhone ?? undefined,
    cvUrl: row.cvUrl ?? undefined,
    linkedinUrl: row.linkedinUrl ?? undefined,
    portfolioUrl: row.portfolioUrl ?? undefined,
    channel: "internal" as const,
  }));

  return NextResponse.json(
    { ok: true, applications },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    },
  );
}
