/**
 * Remove Prisma seed/demo rows (ids prefixed with `seed_`) from the database
 * pointed at by DATABASE_URL. Does not touch real registrations.
 *
 * Usage: npx tsx scripts/remove-seed-data.ts
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const SEED_ID_PREFIX = "seed_";
const SEED_EMAIL_SUFFIX = "@masrjobs.local";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const seedOrgIds = (
    await prisma.organization.findMany({
      where: { id: { startsWith: SEED_ID_PREFIX } },
      select: { id: true },
    })
  ).map((o) => o.id);

  const seedUserIds = (
    await prisma.user.findMany({
      where: {
        OR: [
          { id: { startsWith: SEED_ID_PREFIX } },
          { email: { endsWith: SEED_EMAIL_SUFFIX } },
        ],
      },
      select: { id: true, email: true },
    })
  ).map((u) => u.id);

  const seedOppIds = (
    await prisma.opportunity.findMany({
      where: {
        OR: [
          { id: { startsWith: SEED_ID_PREFIX } },
          ...(seedOrgIds.length ? [{ organizationId: { in: seedOrgIds } }] : []),
        ],
      },
      select: { id: true },
    })
  ).map((o) => o.id);

  console.log("Seed/demo targets:", {
    organizations: seedOrgIds.length,
    users: seedUserIds.length,
    opportunities: seedOppIds.length,
  });

  if (seedOrgIds.length === 0 && seedUserIds.length === 0 && seedOppIds.length === 0) {
    console.log("Nothing to remove.");
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (seedOppIds.length) {
      await tx.application.deleteMany({
        where: { opportunityId: { in: seedOppIds } },
      });
      await tx.savedOpportunity.deleteMany({
        where: { opportunityId: { in: seedOppIds } },
      });
      await tx.featuredOpportunity.deleteMany({
        where: { opportunityId: { in: seedOppIds } },
      });
      await tx.opportunityAttachment.deleteMany({
        where: { opportunityId: { in: seedOppIds } },
      });
      await tx.notification.deleteMany({
        where: { opportunityId: { in: seedOppIds } },
      });
      await tx.externalApplyIntent.deleteMany({
        where: { listingId: { in: seedOppIds } },
      });
      await tx.opportunity.deleteMany({
        where: { id: { in: seedOppIds } },
      });
    }

    if (seedUserIds.length) {
      await tx.application.deleteMany({
        where: { userId: { in: seedUserIds } },
      });
      await tx.savedOpportunity.deleteMany({
        where: { userId: { in: seedUserIds } },
      });
      await tx.notification.deleteMany({
        where: { userId: { in: seedUserIds } },
      });
      await tx.passwordResetToken.deleteMany({
        where: { userId: { in: seedUserIds } },
      });
      await tx.adminActionLog.updateMany({
        where: { actorUserId: { in: seedUserIds } },
        data: { actorUserId: null },
      });
      await tx.user.deleteMany({
        where: { id: { in: seedUserIds } },
      });
    }

    if (seedOrgIds.length) {
      await tx.organizationProfileChange.deleteMany({
        where: { organizationId: { in: seedOrgIds } },
      });
      await tx.notification.deleteMany({
        where: { organizationId: { in: seedOrgIds } },
      });
      await tx.organization.deleteMany({
        where: { id: { in: seedOrgIds } },
      });
    }

    await tx.category.deleteMany({
      where: { id: { startsWith: SEED_ID_PREFIX } },
    });
  });

  const remaining = {
    organizations: await prisma.organization.count(),
    users: await prisma.user.count(),
    opportunities: await prisma.opportunity.count(),
  };
  console.log("Removed seed/demo data. Remaining:", remaining);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
