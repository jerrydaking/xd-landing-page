import { Suspense } from "react";
import { NewsContent } from "@/components/news/NewsContent";
import { getAllNewsArticles, getNewsSlugs } from "@/lib/newsMarkdown";

/** HTML tĩnh cho mỗi file `content/news/*.md` */
export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function NewsArticleBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = getAllNewsArticles();
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0F1115]">
          <p className="text-[#A7B0BE]">Đang tải...</p>
        </main>
      }
    >
      <NewsContent slugFromPath={slug} repoArticles={articles} />
    </Suspense>
  );
}
