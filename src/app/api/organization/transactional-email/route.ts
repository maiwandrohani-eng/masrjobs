import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import { sendApplicationStatusUpdatedEmail } from "@/lib/email/transactional";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  kind: z.literal("application-status-updated"),
  applicationServerId: z.string().min(1).max(80),
  statusLabel: z.string().min(1).max(120),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ORG_USER" || !session.user.organizationId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`org-tx-email:${ip}`, 30);
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
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const { applicationServerId, statusLabel } = parsed.data;
  const app = await prisma.application.findUnique({
    where: { id: applicationServerId },
    include: {
      user: { select: { email: true } },
      opportunity: {
        select: {
          title: true,
          organizationId: true,
          organization: { select: { name: true } },
        },
      },
    },
  });

  if (!app) {
    return NextResponse.json({ ok: false, error: "Application not found." }, { status: 404 });
  }
  if (app.opportunity.organizationId !== session.user.organizationId) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    sendApplicationStatusUpdatedEmail(app.user.email, {
      opportunityTitle: app.opportunity.title,
      organizationName: app.opportunity.organization.name,
      statusLabel,
    });
  } catch (e) {
    console.error("[email] org transactional dispatch", e);
  }

  return NextResponse.json({ ok: true });
}
