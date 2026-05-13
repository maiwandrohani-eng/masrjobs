import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";

const bodySchema = z.object({
  email: z.string().email().max(254),
});

function publicAppOrigin(): string | null {
  const raw =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`forgot-password:${ip}`, 5);
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

  const email = parsed.data.email.trim().toLowerCase();
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured." },
      { status: 503 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, isActive: true },
  });

  if (!user?.isActive) {
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, you will receive reset instructions shortly.",
    });
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "PASSWORD_RESET: RESEND_API_KEY is not set; forgot-password is a no-op for",
      email,
    );
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, you will receive reset instructions shortly.",
      emailConfigured: false,
    });
  }

  const base = publicAppOrigin();
  if (!base) {
    console.error("PASSWORD_RESET: set NEXTAUTH_URL or NEXT_PUBLIC_SITE_URL for reset links.");
    return NextResponse.json(
      { ok: false, error: "Server is missing NEXTAUTH_URL or NEXT_PUBLIC_SITE_URL." },
      { status: 503 },
    );
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`;
  const sent = await sendPasswordResetEmail(user.email, resetUrl);
  if (!sent.ok) {
    await prisma.passwordResetToken.deleteMany({ where: { token } });
    console.error("PASSWORD_RESET email failed:", sent.status, sent.body);
    return NextResponse.json(
      { ok: false, error: "Could not send reset email. Try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "If an account exists for that email, you will receive reset instructions shortly.",
    emailConfigured: true,
  });
}
