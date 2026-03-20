import type { Article } from "@/lib/articleContent";

const HOME_CARD_GRADIENTS = [
  "from-[#2A2110] via-[#171A21] to-[#0F1115]",
  "from-[#1E222A] via-[#171A21] to-[#0F1115]",
  "from-[#221c12] via-[#171A21] to-[#0F1115]",
] as const;

export type NewsPostCard = {
  slug: string;
  title: string;
  desc: string;
  gradient: string;
};

/** Slider trang chủ / thẻ tin — map từ bài đọc từ `content/news` (markdown). */
export function articlesToNewsPostCards(articles: Article[]): NewsPostCard[] {
  return articles.map((article, index) => ({
    slug: article.slug,
    title: article.title,
    desc: article.description,
    gradient: HOME_CARD_GRADIENTS[index % HOME_CARD_GRADIENTS.length],
  }));
}
