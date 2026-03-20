import { Suspense } from "react";
import { NewsContent } from "@/components/news/NewsContent";
import { getAllNewsArticles } from "@/lib/newsMarkdown";

export default function NewsPage() {
  const articles = getAllNewsArticles();
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0F1115]">
          <p className="text-[#A7B0BE]">Đang tải...</p>
        </main>
      }
    >
      <NewsContent repoArticles={articles} />
    </Suspense>
  );
}
