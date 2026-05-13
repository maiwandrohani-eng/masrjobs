import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Live org verification for employer UI (not derived from cached public catalog). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ORG_USER") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ ok: true, canPost: false });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { verificationStatus: true },
  });

  const canPost = org?.verificationStatus === "VERIFIED";
  return NextResponse.json({ ok: true, canPost });
}
