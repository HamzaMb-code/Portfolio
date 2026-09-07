import type { MetadataRoute } from "next";
import { profile, projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${profile.domain}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const caseRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/work/${p.id}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseRoutes];
}
