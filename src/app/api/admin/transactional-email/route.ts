import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import {
  sendOpportunityApprovedEmail,
  sendOpportunityRejectedEmail,
  sendOrganizationApprovedEmail,
  sendOrganizationRejectedEmail,
} from "@/lib/email/transactional";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("organization-approved"),
    to: z.string().email().max(254),
    organizationName: z.string().min(1).max(200),
  }),
  z.object({
    kind: z.literal("organization-rejected"),
    to: z.string().email().max(254),
    organizationName: z.string().min(1).max(200),
  }),
  z.object({
    kind: z.literal("opportunity-approved"),
    to: z.string().email().max(254),
    opportunityTitle: z.string().min(1).max(300),
    organizationName: z.string().min(1).max(200),
  }),
  z.object({
    kind: z.literal("opportunity-rejected"),
    to: z.string().email().max(254),
    opportunityTitle: z.string().min(1).max(300),
    organizationName: z.string().min(1).max(200),
  }),
]);

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-tx-email:${ip}`, 40);
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

  const d = parsed.data;
  try {
    switch (d.kind) {
      case "organization-approved":
        sendOrganizationApprovedEmail(d.to, d.organizationName);
        break;
      case "organization-rejected":
        sendOrganizationRejectedEmail(d.to, d.organizationName);
        break;
      case "opportunity-approved":
        sendOpportunityApprovedEmail(d.to, {
          opportunityTitle: d.opportunityTitle,
          organizationName: d.organizationName,
        });
        break;
      case "opportunity-rejected":
        sendOpportunityRejectedEmail(d.to, {
          opportunityTitle: d.opportunityTitle,
          organizationName: d.organizationName,
        });
        break;
      default:
        break;
    }
  } catch (e) {
    console.error("[email] admin transactional dispatch", e);
  }

  return NextResponse.json({ ok: true });
}
