import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article } from "@/lib/articleContent";
import { articlesToNewsPostCards, type NewsPostCard } from "@/lib/defaultNewsArticles";

const NEWS_DIR = path.join(process.cwd(), "content/news");

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, "");
}

export function getNewsSlugs(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(slugFromFilename);
}

function readArticleFile(fileSlug: string): { article: Article; sortTime: number } {
  const filePath = path.join(NEWS_DIR, `${fileSlug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const d = data as { title?: string; description?: string; date?: string; slug?: string };
  const slug = String(d.slug ?? fileSlug);
  const title = String(d.title ?? slug);
  const description = String(d.description ?? "");
  const sortTime = d.date ? new Date(d.date).getTime() : 0;

  return {
    article: {
      slug,
      title,
      description,
      content: content.trim() ? content : "",
    },
    sortTime: Number.isFinite(sortTime) ? sortTime : 0,
  };
}

/** Dùng lúc build (static export): đọc toàn bộ bài trong `content/news` */
export function getAllNewsArticles(): Article[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  const files = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".md"));
  const rows = files.map((file) => readArticleFile(slugFromFilename(file)));
  rows.sort((a, b) => b.sortTime - a.sortTime);
  return rows.map((r) => r.article);
}

export function getNewsArticleBySlug(slug: string): Article | null {
  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readArticleFile(slug).article;
}

export function getNewsPostCards(): NewsPostCard[] {
  return articlesToNewsPostCards(getAllNewsArticles());
}
