import type { MetadataRoute } from "next";
import { getAllNewsArticles } from "@/lib/newsMarkdown";
import { getSiteUrl } from "@/lib/siteUrl";

/** Bắt buộc với `output: "export"` — build tĩnh cho /sitemap.xml */
export const dynamic = "force-static";

/** Sitemap tĩnh — build ra out/sitemap.xml khi dùng output: "export" */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/$/, "");
  const lastModified = new Date();

  const newsArticles = getAllNewsArticles().map((a) => ({
    url: `${base}/news/${encodeURIComponent(a.slug)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/news`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    ...newsArticles,
    { url: `${base}/faq`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/game-guides`, lastModified, changeFrequency: "weekly", priority: 0.85 },
  ];
}
