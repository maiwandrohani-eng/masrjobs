import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const profileFields = z.object({
  organizationName: z.string().min(1).max(200),
  contactEmail: z.string().max(254).optional().default(""),
  about: z.string().max(12000),
  location: z.string().max(200),
  website: z.string().max(500),
  phone: z.string().max(40),
});

function normalizeContactEmail(raw: string): string | null {
  const t = raw.trim().toLowerCase();
  if (!t) return null;
  return t;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json(
      { ok: false, error: "No organization linked to this account." },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        name: true,
        email: true,
        description: true,
        location: true,
        website: true,
        phone: true,
        verificationStatus: true,
        isActive: true,
      },
    });
    if (!org) {
      return NextResponse.json({ ok: false, error: "Organization not found." }, { status: 404 });
    }
    if (!org.isActive) {
      return NextResponse.json(
        { ok: false, error: "This organization has been suspended by an administrator." },
        { status: 403 },
      );
    }

    const pending = await prisma.organizationProfileChange.findFirst({
      where: { organizationId: orgId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    const published = {
      organizationName: org.name,
      contactEmail: org.email ?? "",
      about: org.description ?? "",
      location: org.location ?? "",
      website: org.website ?? "",
      phone: org.phone ?? "",
      verificationStatus: org.verificationStatus,
    };

    return NextResponse.json({
      ok: true,
      data: {
        published,
        pending: pending
          ? {
              id: pending.id,
              organizationName: pending.proposedName,
              contactEmail: pending.proposedEmail ?? "",
              about: pending.proposedDescription ?? "",
              location: pending.proposedLocation ?? "",
              website: pending.proposedWebsite ?? "",
              phone: pending.proposedPhone ?? "",
              submittedAt: pending.createdAt.toISOString(),
            }
          : null,
      },
    });
  } catch (e) {
    console.error("GET /api/organization/profile", e);
    return NextResponse.json({ ok: false, error: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`org-profile:${ip}`, 30);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json(
      { ok: false, error: "No organization linked to this account." },
      { status: 400 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = profileFields.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const contactEmailNorm = normalizeContactEmail(parsed.data.contactEmail);
  if (contactEmailNorm && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmailNorm)) {
    return NextResponse.json(
      { ok: false, error: { contactEmail: ["Enter a valid contact email or leave it empty."] } },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const aboutTrim = parsed.data.about.trim();
  const locTrim = parsed.data.location.trim();
  const phoneTrim = parsed.data.phone.trim();
  const websiteRaw = parsed.data.website.trim();
  if (websiteRaw) {
    if (!/^https:\/\//i.test(websiteRaw)) {
      return NextResponse.json(
        { ok: false, error: { website: ["Use a full https:// link (e.g. your official site)."] } },
        { status: 400 },
      );
    }
    try {
      const u = new URL(websiteRaw);
      if (u.protocol !== "https:") {
        return NextResponse.json(
          { ok: false, error: { website: ["Only https links are allowed."] } },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: { website: ["Invalid website URL."] } },
        { status: 400 },
      );
    }
  }

  try {
    const orgCheck = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { isActive: true },
    });
    if (!orgCheck) {
      return NextResponse.json({ ok: false, error: "Organization not found." }, { status: 404 });
    }
    if (!orgCheck.isActive) {
      return NextResponse.json(
        { ok: false, error: "This organization has been suspended; profile edits are disabled." },
        { status: 403 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.organizationProfileChange.deleteMany({
        where: { organizationId: orgId, status: "PENDING" },
      });
      await tx.organizationProfileChange.create({
        data: {
          organizationId: orgId,
          submittedByUserId: session.user.id,
          status: "PENDING",
          proposedName: parsed.data.organizationName.trim(),
          proposedEmail: contactEmailNorm,
          proposedPhone: phoneTrim.length > 0 ? phoneTrim : null,
          proposedWebsite: websiteRaw.length > 0 ? websiteRaw : null,
          proposedLocation: locTrim.length > 0 ? locTrim : null,
          proposedDescription: aboutTrim.length > 0 ? aboutTrim : null,
        },
      });
    });

    return NextResponse.json({
      ok: true,
      message:
        "Your updates were submitted for administrator review. They will appear on the public site after approval.",
    });
  } catch (e) {
    console.error("PUT /api/organization/profile", e);
    const code = prismaErrorCode(e);
    if (code === "P2025") {
      return NextResponse.json({ ok: false, error: "Organization not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: "Failed to submit profile update." }, { status: 500 });
  }
}
