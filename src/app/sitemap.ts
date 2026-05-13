import type { MetadataRoute } from "next";
import { SAMPLE_OPPORTUNITIES } from "@/lib/sample-data";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/opportunities" ? 0.9 : 0.6,
  }));

  for (const o of SAMPLE_OPPORTUNITIES) {
    entries.push({
      url: `${base}/opportunities/${o.id}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
