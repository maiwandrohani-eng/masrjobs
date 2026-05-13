import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
  name: z.string().min(1).max(120),
  role: z.enum(["individual", "organization"]),
  organizationName: z.string().max(200).optional(),
});

function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const base = process.env.NEXTAUTH_URL;
  if (!origin || !base) return true;
  try {
    return new URL(origin).origin === new URL(base).origin;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!assertSameOrigin(req)) {
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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hash(d.password, 12);
  const parts = d.name.trim().split(/\s+/);
  const firstName = parts[0] ?? d.name.trim();
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;

  try {
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
    console.error(e);
    return NextResponse.json({ ok: false, error: "Registration failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
