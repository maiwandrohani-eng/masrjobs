import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import {
  sendOrganizationApprovedEmail,
  sendOrganizationRejectedEmail,
} from "@/lib/email/transactional";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  organizationId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-org-moderate:${ip}`, 40);
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

  const { organizationId, action } = parsed.data;
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      name: true,
      email: true,
      verificationStatus: true,
      users: {
        where: { role: "ORG_USER" },
        take: 1,
        select: { email: true },
      },
    },
  });

  if (!org || org.verificationStatus !== "PENDING") {
    return NextResponse.json(
      { ok: false, error: "Organization not found or not pending." },
      { status: 404 },
    );
  }

  const notifyTo = org.email?.trim() || org.users[0]?.email?.trim() || null;

  try {
    if (action === "approve") {
      await prisma.organization.update({
        where: { id: org.id },
        data: {
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
        },
      });
      if (notifyTo?.includes("@")) {
        sendOrganizationApprovedEmail(notifyTo, org.name);
      }
    } else {
      await prisma.organization.update({
        where: { id: org.id },
        data: {
          verificationStatus: "REJECTED",
          verifiedAt: null,
        },
      });
      if (notifyTo?.includes("@")) {
        sendOrganizationRejectedEmail(notifyTo, org.name);
      }
    }
  } catch (e) {
    console.error("POST /api/admin/organizations/moderate", e);
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
