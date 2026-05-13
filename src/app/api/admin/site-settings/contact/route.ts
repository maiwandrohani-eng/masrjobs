import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import { SITE_SETTING_KEYS, getContactPublicData } from "@/lib/site-contact";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const socialItem = z.object({
  href: z.string().url().max(500),
  label: z.string().min(1).max(80),
  abbr: z.string().max(8).optional(),
});

const putSchema = z.object({
  officeTitle: z.string().min(1).max(120),
  body: z.string().min(1).max(8000),
  mapEmbedUrl: z.string().max(2048).optional().default(""),
  social: z.array(socialItem).min(1).max(12),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await getContactPublicData();
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("GET /api/admin/site-settings/contact", e);
    return NextResponse.json({ ok: false, error: "Failed to load settings." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-site-settings:${ip}`, 30);
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

  const parsed = putSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const mapUrl = parsed.data.mapEmbedUrl?.trim() ?? "";
  if (mapUrl && !mapUrl.startsWith("https://")) {
    return NextResponse.json(
      { ok: false, error: { mapEmbedUrl: ["Map embed URL must be an https link."] } },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const socialJson = JSON.stringify(
    parsed.data.social.map((s) => ({
      href: s.href.trim(),
      label: s.label.trim(),
      abbr: (s.abbr ?? s.label).trim().slice(0, 8),
    })),
  );

  try {
    await prisma.$transaction([
      prisma.siteSetting.upsert({
        where: { key: SITE_SETTING_KEYS.officeTitle },
        create: { key: SITE_SETTING_KEYS.officeTitle, value: parsed.data.officeTitle.trim() },
        update: { value: parsed.data.officeTitle.trim() },
      }),
      prisma.siteSetting.upsert({
        where: { key: SITE_SETTING_KEYS.body },
        create: { key: SITE_SETTING_KEYS.body, value: parsed.data.body },
        update: { value: parsed.data.body },
      }),
      prisma.siteSetting.upsert({
        where: { key: SITE_SETTING_KEYS.mapEmbedUrl },
        create: { key: SITE_SETTING_KEYS.mapEmbedUrl, value: mapUrl },
        update: { value: mapUrl },
      }),
      prisma.siteSetting.upsert({
        where: { key: SITE_SETTING_KEYS.social },
        create: { key: SITE_SETTING_KEYS.social, value: socialJson },
        update: { value: socialJson },
      }),
    ]);

    const data = await getContactPublicData();
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("PUT /api/admin/site-settings/contact", e);
    const code = prismaErrorCode(e);
    if (code === "P2021" || code === "P2022") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The SiteSetting table is missing. Run `npx prisma db push` on this database.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: "Could not save settings." }, { status: 500 });
  }
}
