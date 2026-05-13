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

function hostnameFromForwardedOrHost(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const h = xf || req.headers.get("host");
  if (!h) return null;
  return h.split(":")[0]?.toLowerCase() ?? null;
}

/** CSRF-ish guard: browser Origin must match this deployment or configured site URLs. */
function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  let requestOrigin: string;
  let originHost: string;
  try {
    const u = new URL(origin);
    requestOrigin = u.origin;
    originHost = u.hostname.toLowerCase();
  } catch {
    return false;
  }

  for (const raw of [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ]) {
    if (!raw?.trim()) continue;
    try {
      if (new URL(raw).origin === requestOrigin) return true;
    } catch {
      /* ignore invalid env URL */
    }
  }

  const host = hostnameFromForwardedOrHost(req);
  if (host && originHost === host) return true;

  return false;
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
    console.error("POST /api/auth/register", e);
    if (e && typeof e === "object" && "code" in e) {
      const code = String((e as { code: unknown }).code);
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
      if (
        code === "P1001" ||
        code === "P1000" ||
        code === "P1002" ||
        code === "P1017"
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Could not reach the database. Check DATABASE_URL (use Neon’s pooled URL; remove channel_binding=require if present) and try again.",
          },
          { status: 503 },
        );
      }
    }
    return NextResponse.json(
      { ok: false, error: "Registration failed. Try again or contact support if it persists." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
