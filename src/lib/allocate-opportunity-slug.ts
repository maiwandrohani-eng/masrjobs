import type { PrismaClient } from "@/generated/prisma/client";
import { slugify } from "@/lib/slugify";

export async function allocateUniqueOpportunitySlug(
  prisma: Pick<PrismaClient, "opportunity">,
  title: string,
): Promise<string> {
  const base = slugify(title) || "listing";
  let slug = base;
  let n = 0;
  for (;;) {
    const clash = await prisma.opportunity.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!clash) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}
