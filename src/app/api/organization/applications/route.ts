import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import {
  prismaApplicationStatusToUi,
  uiApplicationStatusToPrisma,
} from "@/lib/application-status-map";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum([
    "Submitted",
    "Under review",
    "Shortlisted",
    "Rejected",
    "Accepted",
  ]),
});

/** Internal applications to this employer's listings (Neon). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ ok: true, applications: [] });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  const rows = await prisma.application.findMany({
    where: {
      opportunity: { organizationId: orgId },
    },
    orderBy: { createdAt: "desc" },
    take: 400,
    include: {
      opportunity: {
        select: {
          title: true,
          organizationId: true,
          organization: { select: { name: true } },
        },
      },
      user: { select: { email: true, firstName: true, lastName: true } },
    },
  });

  const applications = rows.map((row) => {
    const u = row.user;
    const display =
      [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
      u.email.split("@")[0]?.replace(/[._-]/g, " ") ||
      "Applicant";
    return {
      id: row.id,
      serverId: row.id,
      opportunityId: row.opportunityId,
      opportunityTitle: row.opportunity.title,
      organizationName: row.opportunity.organization.name,
      organizationId: row.opportunity.organizationId,
      status: prismaApplicationStatusToUi(row.status),
      submittedAt: row.createdAt.toISOString().slice(0, 10),
      coverLetter: row.coverLetter ?? undefined,
      applicantEmail: u.email.trim().toLowerCase(),
      applicantDisplayName: display,
      applicantFullName: row.applicantFullName ?? display,
      applicantPhone: row.applicantPhone ?? undefined,
      cvUrl: row.cvUrl ?? undefined,
      linkedinUrl: row.linkedinUrl ?? undefined,
      portfolioUrl: row.portfolioUrl ?? undefined,
      channel: "internal" as const,
    };
  });

  return NextResponse.json(
    { ok: true, applications },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    },
  );
}

/** Update application pipeline status (employer); persists to Neon. */
export async function PATCH(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ ok: false, error: "No organization" }, { status: 400 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`org-app-status:${ip}`, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  const prismaStatus = uiApplicationStatusToPrisma(parsed.data.status);
  if (!prismaStatus) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.application.findFirst({
    where: {
      id: parsed.data.applicationId,
      opportunity: { organizationId: orgId },
    },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Application not found." }, { status: 404 });
  }

  await prisma.application.update({
    where: { id: existing.id },
    data: { status: prismaStatus },
  });

  return NextResponse.json({ ok: true, status: parsed.data.status });
}
