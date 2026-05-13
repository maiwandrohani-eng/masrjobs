import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  token: z.string().min(16).max(128),
  password: z.string().min(10).max(128),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`reset-password:${ip}`, 12);
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

  const { token, password } = parsed.data;
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured." },
      { status: 503 },
    );
  }

  const row = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, isActive: true } } },
  });

  const now = new Date();
  if (!row || row.expiresAt <= now || !row.user.isActive) {
    return NextResponse.json(
      { ok: false, error: "This reset link is invalid or has expired. Request a new one." },
      { status: 400 },
    );
  }

  const passwordHash = await hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
  ]);

  return NextResponse.json({ ok: true });
}
