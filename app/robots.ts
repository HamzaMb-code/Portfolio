import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://${profile.domain}/sitemap.xml`,
  };
}
