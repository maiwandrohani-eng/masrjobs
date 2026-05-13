import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  listingId: z.string().min(1),
  organizationId: z.string().optional(),
  opportunityTitle: z.string().optional(),
  applicantEmail: z.string().email(),
  applicantFullName: z.string().min(1),
  applicantPhone: z.string().min(1).max(80),
  cvUrl: z
    .string()
    .min(1)
    .max(2048)
    .refine((s) => /^https?:\/\//i.test(s.trim()), "CV URL must start with http:// or https://"),
  linkedinUrl: z.string().max(2048).optional(),
  portfolioUrl: z.string().max(2048).optional(),
  coverLetter: z.string().max(20000).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`apply-internal:${ip}`, 40);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is not configured; applications are not persisted to Neon." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const emailLower = d.applicantEmail.trim().toLowerCase();
  const empty = (s: string | undefined) => {
    const t = s?.trim();
    return t?.length ? t : undefined;
  };

  try {
    const [dbOpp, dbUser] = await Promise.all([
      prisma.opportunity.findUnique({
        where: { id: d.listingId },
        select: { id: true },
      }),
      prisma.user.findUnique({
        where: { email: emailLower },
        select: { id: true },
      }),
    ]);

    /** When listing + user exist in Neon, use the canonical `Application` row (FK graph). */
    if (dbOpp && dbUser) {
      const app = await prisma.application.upsert({
        where: {
          opportunityId_userId: {
            opportunityId: dbOpp.id,
            userId: dbUser.id,
          },
        },
        create: {
          opportunityId: dbOpp.id,
          userId: dbUser.id,
          coverLetter: empty(d.coverLetter),
          applicantFullName: d.applicantFullName.trim(),
          applicantPhone: empty(d.applicantPhone),
          cvUrl: empty(d.cvUrl),
          linkedinUrl: empty(d.linkedinUrl),
          portfolioUrl: empty(d.portfolioUrl),
        },
        update: {
          coverLetter: empty(d.coverLetter),
          applicantFullName: d.applicantFullName.trim(),
          applicantPhone: empty(d.applicantPhone),
          cvUrl: empty(d.cvUrl),
          linkedinUrl: empty(d.linkedinUrl),
          portfolioUrl: empty(d.portfolioUrl),
        },
      });
      return NextResponse.json({ ok: true, id: app.id, table: "Application" });
    }

    const row = await prisma.internalListingApplication.upsert({
      where: {
        listingId_applicantEmail: {
          listingId: d.listingId,
          applicantEmail: emailLower,
        },
      },
      create: {
        listingId: d.listingId,
        organizationId: empty(d.organizationId),
        opportunityTitle: empty(d.opportunityTitle),
        applicantEmail: emailLower,
        applicantFullName: d.applicantFullName.trim(),
        applicantPhone: empty(d.applicantPhone),
        cvUrl: empty(d.cvUrl),
        linkedinUrl: empty(d.linkedinUrl),
        portfolioUrl: empty(d.portfolioUrl),
        coverLetter: empty(d.coverLetter),
      },
      update: {
        organizationId: empty(d.organizationId),
        opportunityTitle: empty(d.opportunityTitle),
        applicantFullName: d.applicantFullName.trim(),
        applicantPhone: empty(d.applicantPhone),
        cvUrl: empty(d.cvUrl),
        linkedinUrl: empty(d.linkedinUrl),
        portfolioUrl: empty(d.portfolioUrl),
        coverLetter: empty(d.coverLetter),
      },
    });
    return NextResponse.json({
      ok: true,
      id: row.id,
      table: "InternalListingApplication",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Failed to save application" },
      { status: 500 },
    );
  }
}
