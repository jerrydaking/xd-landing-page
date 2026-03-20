/**
 * URL gốc của site (SEO, sitemap, robots).
 * Đặt NEXT_PUBLIC_SITE_URL trong .env khi deploy domain thật.
 */
export const DEFAULT_SITE_URL = "https://xocdia88club.sbs";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}
