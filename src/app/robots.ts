import type { MetadataRoute } from "next";
import { siteContent } from "@/content";

// Static export: se genera como archivo estático (out/robots.txt) en el build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteContent.site.url}/sitemap.xml`,
  };
}
