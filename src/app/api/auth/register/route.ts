import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { sendRegistrationEmailBundle } from "@/lib/email/transactional";
import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { slugify } from "@/lib/slugify";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
  name: z.string().min(1).max(120),
  role: z.enum(["individual", "organization"]),
  organizationName: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`register:${ip}`, 8);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured (DATABASE_URL)." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const email = d.email.trim().toLowerCase();
  if (d.role === "organization" && !d.organizationName?.trim()) {
    return NextResponse.json(
      { ok: false, error: { organizationName: ["Required for organization accounts"] } },
      { status: 400 },
    );
  }

  const parts = d.name.trim().split(/\s+/);
  const firstName = parts[0] ?? d.name.trim();
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hash(d.password, 12);

    if (d.role === "individual") {
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: "INDIVIDUAL",
          firstName,
          lastName,
        },
      });
    } else {
      const orgName = d.organizationName!.trim();
      const baseSlug = slugify(orgName);
      let slug = baseSlug;
      let suffix = 0;
      while (await prisma.organization.findUnique({ where: { slug } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
      const org = await prisma.organization.create({
        data: {
          name: orgName,
          slug,
          email,
          verificationStatus: "PENDING",
          profileCompleteness: 0,
        },
      });
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: "ORG_USER",
          firstName,
          lastName,
          organizationId: org.id,
        },
      });
    }
  } catch (e) {
    console.error("POST /api/auth/register", e);
    const code = prismaErrorCode(e);
    if (code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Email already registered" },
        { status: 409 },
      );
    }
    if (code === "P2021" || code === "P2022") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Database is missing required tables. Apply the Prisma schema to this Neon database (e.g. prisma db push), then try again.",
        },
        { status: 503 },
      );
    }
    if (code === "P1001" || code === "P1000" || code === "P1002" || code === "P1017") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not reach the database. Check DATABASE_URL (use Neon’s pooled URL; remove channel_binding=require if present) and try again.",
        },
        { status: 503 },
      );
    }
    const msg = e instanceof Error ? e.message : String(e);
    if (/does not exist|relation .* not found|42P01/i.test(msg)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Database is missing required tables. Apply the Prisma schema to this Neon database (e.g. prisma db push), then try again.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Registration failed. Try again or contact support if it persists." },
      { status: 500 },
    );
  }

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    d.name.trim() ||
    email.split("@")[0] ||
    "there";
  sendRegistrationEmailBundle(email, displayName);

  return NextResponse.json({ ok: true });
}
