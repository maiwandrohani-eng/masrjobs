import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().email().max(254),
});

function normEmail(e: string) {
  return e.trim().toLowerCase();
}

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`early-access:${ip}`, 20);
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

  try {
    const existing = await prisma.earlyAccessEmail.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }
    await prisma.earlyAccessEmail.create({ data: { email } });
    return NextResponse.json({ ok: true, alreadyRegistered: false });
  } catch (e) {
    console.error("POST /api/early-access", e);
    const code = prismaErrorCode(e);
    if (code === "P2002") {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }
    return NextResponse.json(
      { ok: false, error: "Could not save your email. Please try again later." },
      { status: 500 },
    );
  }
}
