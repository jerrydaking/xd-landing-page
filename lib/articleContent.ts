import type { ArticleBlock } from "@/lib/articleBlocks";

export type Article = {
  slug: string;
  title: string;
  description: string;
  content: string | ArticleBlock[];
};

export const NEWS_STORAGE_KEY = "news-articles-v1";

const MOJIBAKE_PATTERN = /(Ã.|Æ.|Ä.|á»|Â|â€|â€™|â€œ|â€�|â€“|â€”)/;

export function repairMojibake(input: string): string {
  if (!input || !MOJIBAKE_PATTERN.test(input)) return input;
  try {
    const bytes = Uint8Array.from(input, (char) => char.charCodeAt(0) & 0xff);
    const fixed = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return fixed.includes("�") ? input : fixed;
  } catch {
    return input;
  }
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInline(input: string): string {
  const escaped = escapeHtml(input);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatArticleContent(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  const paragraphLines: string[] = [];
  const listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    html.push(`<p>${paragraphLines.map((line) => formatInline(line)).join("<br />")}</p>`);
    paragraphLines.length = 0;
  };

  const flushList = () => {
    if (listItems.length === 0 || !listType) return;
    const tag = listType;
    const items = listItems.map((item) => `<li>${formatInline(item)}</li>`).join("");
    html.push(`<${tag}>${items}</${tag}>`);
    listItems.length = 0;
    listType = null;
  };

  for (const originalLine of lines) {
    const line = originalLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) {
      flushParagraph();
      flushList();
      html.push(`<h2>${formatInline(h1[1])}</h2>`);
      continue;
    }

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flushParagraph();
      flushList();
      html.push(`<h3>${formatInline(h2[1])}</h3>`);
      continue;
    }

    const step = line.match(/^Bước\s*\d+\s*:\s*(.+)$/i);
    if (step) {
      flushParagraph();
      flushList();
      html.push(`<h4>${formatInline(line)}</h4>`);
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(bullet[1]);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(ordered[1]);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}
