import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  listingId: z.string().min(1),
  channel: z.enum(["EMAIL", "EXTERNAL_LINK"]),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`apply-external:${ip}`, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "INDIVIDUAL") {
    return NextResponse.json(
      { ok: false, error: "Only individual applicant accounts can record external apply intent." },
      { status: 403 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is not configured." },
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
  const channel =
    d.channel === "EMAIL"
      ? ("EMAIL" as const)
      : ("EXTERNAL_LINK" as const);

  const applicantEmail = session.user.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isActive: true, role: true, email: true },
  });
  if (!user?.isActive || user.role !== "INDIVIDUAL") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (user.email.trim().toLowerCase() !== applicantEmail) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await prisma.externalApplyIntent.upsert({
      where: {
        listingId_applicantEmail_channel: {
          listingId: d.listingId,
          applicantEmail,
          channel,
        },
      },
      create: {
        listingId: d.listingId,
        applicantEmail,
        channel,
      },
      update: {},
    });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Failed to record intent" },
      { status: 500 },
    );
  }
}
