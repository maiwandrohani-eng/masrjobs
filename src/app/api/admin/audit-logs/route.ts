import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ items: [] });
  }

  const items = await prisma.adminActionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      actorUser: { select: { email: true, id: true } },
    },
  });

  return NextResponse.json({ items });
}
