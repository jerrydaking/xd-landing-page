type NewsLinkOpts = { admin?: boolean; edit?: boolean };

/**
 * URL chi tiết bài: slug có trong `content/news` (build) → `/news/slug`;
 * bài chỉ có trong localStorage (admin) → `/news?slug=` nếu truyền `bundledSlugs` và slug không nằm trong đó.
 */
export function hrefNewsArticle(
  slug: string,
  opts?: NewsLinkOpts,
  bundledSlugs?: ReadonlySet<string>
): string {
  const admin = opts?.admin ?? false;
  const edit = opts?.edit ?? false;
  const q = new URLSearchParams();
  if (admin) q.set("admin", "1");
  if (edit) q.set("edit", "1");
  const suffix = q.toString() ? `?${q.toString()}` : "";

  const usePath = bundledSlugs === undefined || bundledSlugs.has(slug);
  if (usePath) {
    return `/news/${encodeURIComponent(slug)}${suffix}`;
  }

  const q2 = new URLSearchParams();
  q2.set("slug", slug);
  if (admin) q2.set("admin", "1");
  if (edit) q2.set("edit", "1");
  return `/news?${q2.toString()}`;
}
