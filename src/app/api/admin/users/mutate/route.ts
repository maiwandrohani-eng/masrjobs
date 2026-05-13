import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { writeAdminAudit } from "@/lib/admin-audit";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  userId: z.string().min(1),
  action: z.enum(["deactivate", "reactivate", "delete"]),
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
  const rl = rateLimit(`admin-user-mutate:${ip}`, 60);
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

  const db = prisma;

  const { userId, action } = parsed.data;
  const actorId = session.user.id;

  if (userId === actorId) {
    return NextResponse.json(
      { ok: false, error: "You cannot deactivate or delete your own administrator account." },
      { status: 400 },
    );
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true, email: true },
  });
  if (!target) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  async function countOtherActiveAdmins(): Promise<number> {
    return db.user.count({
      where: { role: "ADMIN", isActive: true, id: { not: userId } },
    });
  }

  if (target.role === "ADMIN") {
    const others = await countOtherActiveAdmins();
    if (action === "delete" || action === "deactivate") {
      if (others === 0) {
        return NextResponse.json(
          { ok: false, error: "Cannot remove or deactivate the last active administrator." },
          { status: 400 },
        );
      }
    }
  }

  try {
    if (action === "deactivate") {
      await db.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
      await writeAdminAudit(db, {
        action: "USER_DISABLED",
        actorUserId: actorId,
        targetType: "User",
        targetId: userId,
        meta: { email: target.email },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "reactivate") {
      await db.user.update({
        where: { id: userId },
        data: { isActive: true },
      });
      await writeAdminAudit(db, {
        action: "USER_REACTIVATED",
        actorUserId: actorId,
        targetType: "User",
        targetId: userId,
        meta: { email: target.email },
      });
      return NextResponse.json({ ok: true });
    }

    await db.adminActionLog.updateMany({
      where: { actorUserId: userId },
      data: { actorUserId: null },
    });
    await db.user.delete({ where: { id: userId } });
    await writeAdminAudit(db, {
      action: "USER_DELETED",
      actorUserId: actorId,
      targetType: "User",
      targetId: userId,
      meta: { email: target.email },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/users/mutate", e);
    return NextResponse.json({ ok: false, error: "Operation failed." }, { status: 500 });
  }
}
