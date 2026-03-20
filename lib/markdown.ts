import matter from "gray-matter";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

export type MarkdownFrontMatter = {
  title?: string;
  description?: string;
  date?: string;
  slug?: string;
};

export function parseFrontMatterAndBody(raw: string) {
  const parsed = matter(raw);
  const data = parsed.data as MarkdownFrontMatter;
  return { data, body: parsed.content };
}

/** Render Markdown (GFM) → HTML cho bài tin từ Decap / file .md */
export function markdownToHtml(markdown: string): string {
  const result = marked.parse(markdown.trim() || "", { async: false });
  if (typeof result !== "string") {
    throw new Error("marked: expected sync HTML string");
  }
  return result;
}
