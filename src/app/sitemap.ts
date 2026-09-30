import type { MetadataRoute } from "next";
import { siteContent } from "@/content";

// Static export: se genera como archivo estático (out/sitemap.xml) en el build.
export const dynamic = "force-static";

// El sitio es una sola página: solo la home (sin la 404, __forms.html ni anclas).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteContent.site.url}/` }];
}
