import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { AdminActionType } from "@/generated/prisma/enums";

export async function writeAdminAudit(
  prisma: PrismaClient,
  args: {
    action: AdminActionType;
    actorUserId: string | null;
    targetType?: string;
    targetId?: string;
    meta?: Record<string, unknown>;
  },
): Promise<void> {
  await prisma.adminActionLog.create({
    data: {
      action: args.action,
      actorUserId: args.actorUserId,
      targetType: args.targetType,
      targetId: args.targetId,
      meta: args.meta === undefined ? undefined : (args.meta as Prisma.InputJsonValue),
    },
  });
}
