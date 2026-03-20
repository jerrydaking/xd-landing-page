export type ParagraphBlock = { type: "paragraph"; text: string; images?: string[] };
export type SectionBlock = { type: "section"; title: string };
export type ListBlock = { type: "list"; items: string[] };
export type TableBlock = { type: "table"; headers: string[]; rows: string[][] };
export type NoteBlock = { type: "note"; text: string };
export type SpacerBlock = { type: "spacer"; size?: "sm" | "md" | "lg" };

export type ArticleBlock =
  | ParagraphBlock
  | SectionBlock
  | ListBlock
  | TableBlock
  | NoteBlock
  | SpacerBlock;

export const BLOCK_TYPE_LABEL: Record<ArticleBlock["type"], string> = {
  paragraph: "Đoạn văn",
  section: "Section",
  list: "Danh sách",
  table: "Bảng",
  note: "Ghi chú",
  spacer: "Khoảng cách",
};

export function createBlock(type: ArticleBlock["type"]): ArticleBlock {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "", images: [] };
    case "section":
      return { type: "section", title: "" };
    case "list":
      return { type: "list", items: [""] };
    case "table":
      return { type: "table", headers: ["Cột 1", "Cột 2"], rows: [["", ""]] };
    case "note":
      return { type: "note", text: "" };
    case "spacer":
      return { type: "spacer", size: "md" };
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isArticleBlocks(value: unknown): value is ArticleBlock[] {
  if (!Array.isArray(value)) return false;
  return value.every((block) => {
    if (!block || typeof block !== "object" || !("type" in block)) return false;
    const b = block as Record<string, unknown>;
    switch (b.type) {
      case "paragraph":
        return typeof b.text === "string" && (b.images === undefined || isStringArray(b.images));
      case "section":
        return typeof b.title === "string";
      case "list":
        return isStringArray(b.items);
      case "table":
        return (
          isStringArray(b.headers) &&
          Array.isArray(b.rows) &&
          b.rows.every((row) => isStringArray(row))
        );
      case "note":
        return typeof b.text === "string";
      case "spacer":
        return b.size === undefined || b.size === "sm" || b.size === "md" || b.size === "lg";
      default:
        return false;
    }
  });
}

export function contentToBlocks(content: string | ArticleBlock[]): ArticleBlock[] {
  if (isArticleBlocks(content)) return content;
  return [{ type: "paragraph", text: content }];
}
