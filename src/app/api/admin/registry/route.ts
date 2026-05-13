import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Summary lists for the admin console (Neon). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({
      ok: true,
      users: [],
      organizations: [],
      opportunities: [],
    });
  }

  const [users, organizations, opportunities] = await Promise.all([
    prisma.user.findMany({
      take: 400,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        firstName: true,
        lastName: true,
        organizationId: true,
        createdAt: true,
        organization: { select: { name: true } },
      },
    }),
    prisma.organization.findMany({
      take: 300,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        verificationStatus: true,
        isActive: true,
        _count: { select: { users: true, opportunities: true } },
      },
    }),
    prisma.opportunity.findMany({
      take: 400,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        organizationId: true,
        organization: { select: { name: true, isActive: true } },
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    users,
    organizations,
    opportunities,
  });
}
