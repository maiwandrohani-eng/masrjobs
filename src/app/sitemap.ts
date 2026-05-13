import type { MetadataRoute } from "next";
import { loadSitemapOpportunityRefs } from "@/lib/db/catalog-queries";
import { getPrisma } from "@/lib/prisma";
import { RESOURCE_ARTICLES } from "@/lib/resources-articles";
import { siteUrl } from "@/lib/site-url";

const staticPaths = [
  "",
  "/opportunities",
  "/organizations",
  "/resources",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/opportunities" ? 0.9 : 0.6,
  }));

  const prisma = getPrisma();
  if (prisma) {
    const refs = await loadSitemapOpportunityRefs(prisma);
    for (const r of refs) {
      const seg = r.slug ?? r.id;
      entries.push({
        url: `${base}/opportunities/${seg}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const a of RESOURCE_ARTICLES) {
    entries.push({
      url: `${base}/resources/${a.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
