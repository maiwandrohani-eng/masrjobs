import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

function normEmail(e: string) {
  return e.trim().toLowerCase();
}

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`newsletter-subscribe:${ip}`, 20);
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

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured." },
      { status: 503 },
    );
  }

  const email = normEmail(parsed.data.email);
  const source = parsed.data.source?.trim() || "resources";

  try {
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    await prisma.newsletterSubscription.create({
      data: { email, source },
    });
    return NextResponse.json({ ok: true, alreadySubscribed: false });
  } catch (e) {
    console.error("POST /api/newsletter/subscribe", e);
    const code = prismaErrorCode(e);
    if (code === "P2002") {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    if (code === "P2021" || code === "P2022") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The newsletter table is not in the database yet. Run `npx prisma db push` (or apply migrations) on this environment, then try again.",
        },
        { status: 503 },
      );
    }
    const msg = e instanceof Error ? e.message : "";
    if (/does not exist|relation .* not found|42P01/i.test(msg)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The newsletter table is missing. Apply the latest Prisma schema to your database (e.g. `npx prisma db push`), then try again.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not save your subscription. If this continues, the database may be unreachable or the schema may need updating.",
      },
      { status: 500 },
    );
  }
}
