import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

/** Bắt buộc với `output: "export"` — build tĩnh cho /robots.txt */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/site-admin"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ""),
  };
}
