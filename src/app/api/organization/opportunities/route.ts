import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import type { OpportunityStatus } from "@/generated/prisma/client";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { allocateUniqueOpportunitySlug } from "@/lib/allocate-opportunity-slug";
import { authOptions } from "@/lib/auth-options";
import { parseCategoryName } from "@/lib/db/map-prisma-catalog";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { ListingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

function prismaStatusToListing(status: OpportunityStatus): ListingStatus {
  switch (status) {
    case "PENDING_APPROVAL":
      return "Pending approval";
    case "PUBLISHED":
      return "Published";
    case "REJECTED":
      return "Rejected";
    case "CLOSED":
      return "Closed";
    default:
      return "Pending approval";
  }
}

const bodySchema = z.object({
  title: z.string().min(1),
  category: z.enum([
    "Jobs",
    "Consultancies",
    "Trainings",
    "Volunteer Roles",
    "Tenders",
    "Grants",
  ]),
  type: z.string().min(1),
  location: z.string().min(1),
  deadline: z.string().min(1),
  workArrangement: z.enum(["Remote", "Hybrid", "On-site"]),
  compensation: z.enum(["Paid", "Unpaid"]),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().min(1),
  howToApply: z.string().min(1),
  applicationMethod: z.enum(["internal", "email", "external"]),
  applicationEmail: z.string().optional().default(""),
  externalApplicationUrl: z.string().optional().default(""),
  contactEmail: z.string().min(1),
});

function categoryToSlug(category: string): string {
  switch (category) {
    case "Jobs":
      return "jobs";
    case "Consultancies":
      return "consultancies";
    case "Trainings":
      return "trainings";
    case "Volunteer Roles":
      return "volunteer-roles";
    case "Tenders":
      return "tenders";
    case "Grants":
      return "grants";
    default:
      return "jobs";
  }
}

/** Employer dashboard: all opportunities for the signed-in organization (Neon). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ ok: true, listings: [] });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  const rows = await prisma.opportunity.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      category: { select: { nameEn: true } },
      _count: { select: { applications: true } },
    },
  });

  const listings = rows.map((row) => ({
    id: `ol-${row.id}`,
    opportunityId: row.id,
    title: row.title,
    category: parseCategoryName(row.category?.nameEn),
    status: prismaStatusToListing(row.status),
    submittedAt: row.createdAt.toISOString().slice(0, 10),
    applicantCount: row._count.applications,
    submittedByOrgId: orgId,
  }));

  return NextResponse.json(
    { ok: true, listings },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    },
  );
}

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`org-opp-submit:${ip}`, 30);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ ok: false, error: "No organization" }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database unavailable" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true, verificationStatus: true, isActive: true },
  });
  if (!org || !org.isActive || org.verificationStatus !== "VERIFIED") {
    return NextResponse.json(
      { ok: false, error: "Organization is not approved to post." },
      { status: 403 },
    );
  }

  const data = parsed.data;
  const deadlineDate = new Date(`${data.deadline}T12:00:00.000Z`);
  if (Number.isNaN(deadlineDate.getTime())) {
    return NextResponse.json({ ok: false, error: "Invalid deadline." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { slug: categoryToSlug(data.category) },
    select: { id: true },
  });

  const applicationEmail = data.applicationEmail.trim();
  const externalApplicationUrl = data.externalApplicationUrl.trim();

  const slug = await allocateUniqueOpportunitySlug(prisma, data.title);
  const descriptionBody = data.description.trim();
  const summary = data.shortDescription.trim();
  const combinedDescription =
    summary.length > 0 ? `${summary}\n\n${descriptionBody}` : descriptionBody;

  const created = await prisma.opportunity.create({
    data: {
      slug,
      title: data.title.trim(),
      description: combinedDescription,
      requirements: data.requirements.trim(),
      howToApply: data.howToApply.trim(),
      applyMode:
        data.applicationMethod === "email"
          ? "APPLY_BY_EMAIL"
          : data.applicationMethod === "external"
            ? "EXTERNAL_LINK"
            : "INTERNAL",
      applicationEmail:
        data.applicationMethod === "email" && applicationEmail ? applicationEmail : null,
      externalApplicationUrl:
        data.applicationMethod === "external" && externalApplicationUrl
          ? externalApplicationUrl
          : null,
      externalApplyUrl:
        data.applicationMethod === "external" && externalApplicationUrl
          ? externalApplicationUrl
          : null,
      location: data.location.trim(),
      deadline: deadlineDate,
      type: data.type.trim(),
      workArrangement:
        data.workArrangement === "Remote"
          ? "REMOTE"
          : data.workArrangement === "Hybrid"
            ? "HYBRID"
            : "ONSITE",
      compensation: data.compensation === "Unpaid" ? "UNPAID" : "PAID",
      status: "PENDING_APPROVAL",
      organizationId: org.id,
      categoryId: category?.id ?? null,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      organization: { select: { name: true } },
    },
  });

  return NextResponse.json({
    ok: true,
    item: {
      id: `popp-${created.id}`,
      opportunityId: created.id,
      title: created.title,
      organizationName: created.organization?.name ?? org.name,
      category: data.category,
      submittedAt: created.createdAt.toISOString().slice(0, 10),
    },
    listing: {
      opportunityId: created.id,
      title: created.title,
      category: data.category,
      submittedAt: created.createdAt.toISOString().slice(0, 10),
    },
  });
}