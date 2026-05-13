import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  listingId: z.string().min(1),
  applicantEmail: z.string().email(),
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

  try {
    const row = await prisma.externalApplyIntent.upsert({
      where: {
        listingId_applicantEmail_channel: {
          listingId: d.listingId,
          applicantEmail: d.applicantEmail.trim().toLowerCase(),
          channel,
        },
      },
      create: {
        listingId: d.listingId,
        applicantEmail: d.applicantEmail.trim().toLowerCase(),
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
