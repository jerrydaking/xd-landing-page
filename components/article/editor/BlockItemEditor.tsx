import { BLOCK_TYPE_LABEL, ArticleBlock, ListBlock, TableBlock } from "@/lib/articleBlocks";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { useRef, useState } from "react";

type Props = {
  block: ArticleBlock;
  index: number;
  total: number;
  onChange: (next: ArticleBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function updateList(block: ListBlock, text: string): ListBlock {
  return {
    ...block,
    items: text.split("\n").map((line) => line.trim()).filter(Boolean),
  };
}

function updateTableCell(table: TableBlock, rowIndex: number, colIndex: number, value: string): TableBlock {
  const rows = table.rows.map((row) => [...row]);
  if (!rows[rowIndex]) rows[rowIndex] = [];
  rows[rowIndex][colIndex] = value;
  return { ...table, rows };
}

export default function BlockItemEditor({
  block,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [openEmoji, setOpenEmoji] = useState(false);
  const paragraphRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const appendParagraphImages = (newImages: string[]) => {
    if (block.type !== "paragraph" || newImages.length === 0) return;
    const current = block.images ?? [];
    onChange({ ...block, images: [...current, ...newImages] });
  };

  const readFilesAsDataUrl = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const urls = await Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.readAsDataURL(file);
          })
      )
    );
    appendParagraphImages(urls.filter(Boolean));
  };

  const insertEmoji = (emojiData: EmojiClickData) => {
    if (block.type !== "paragraph") return;

    const textarea = paragraphRef.current;
    if (!textarea) {
      onChange({ ...block, text: `${block.text}${emojiData.emoji}` });
      return;
    }

    const start = textarea.selectionStart ?? block.text.length;
    const end = textarea.selectionEnd ?? block.text.length;
    const nextText = `${block.text.slice(0, start)}${emojiData.emoji}${block.text.slice(end)}`;
    onChange({ ...block, text: nextText });

    requestAnimationFrame(() => {
      textarea.focus();
      const nextCaret = start + emojiData.emoji.length;
      textarea.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const handleParagraphPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (block.type !== "paragraph") return;
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      void readFilesAsDataUrl(imageFiles);
    }
  };

  const removeParagraphImage = (removeIndex: number) => {
    if (block.type !== "paragraph") return;
    const current = block.images ?? [];
    onChange({ ...block, images: current.filter((_, index) => index !== removeIndex) });
  };

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-[#10151E] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">
          Block {index + 1} - {BLOCK_TYPE_LABEL[block.type]}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onMoveUp} disabled={index === 0} className="rounded border border-white/15 px-2 py-1 text-xs text-[#A7B0BE] disabled:opacity-40">Lên</button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="rounded border border-white/15 px-2 py-1 text-xs text-[#A7B0BE] disabled:opacity-40">Xuống</button>
          <button type="button" onClick={onDelete} className="rounded border border-[#7A5A2A] px-2 py-1 text-xs text-[#E6C37A]">Xóa</button>
        </div>
      </div>

      {block.type === "paragraph" && (
        <div className="relative">
          <div className="mb-2 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenEmoji((prev) => !prev)}
              className="rounded-md border border-[#D4AF37]/35 bg-[#131821] px-2.5 py-1 text-xs font-semibold text-[#F5D76E] transition hover:bg-[#1B222E]"
            >
              😊 Emoji
            </button>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="rounded-md border border-[#D4AF37]/35 bg-[#131821] px-2.5 py-1 text-xs font-semibold text-[#F5D76E] transition hover:bg-[#1B222E]"
            >
              🖼️ Thêm ảnh
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) void readFilesAsDataUrl(e.target.files);
                e.currentTarget.value = "";
              }}
            />
          </div>
          <textarea
            ref={paragraphRef}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            onPaste={handleParagraphPaste}
            rows={5}
            className="w-full rounded-lg border border-white/10 bg-[#0B1018] px-3 py-2 text-sm leading-7 text-[#D1D8E5]"
            placeholder="Nhập đoạn văn... (có thể Ctrl+V screenshot vào đây)"
          />

          {(block.images ?? []).length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(block.images ?? []).map((image, imageIndex) => (
                <div key={`${image.slice(0, 24)}-${imageIndex}`} className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0B1018]">
                  <img src={image} alt={`Ảnh đoạn văn ${imageIndex + 1}`} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeParagraphImage(imageIndex)}
                    className="absolute right-1 top-1 rounded bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-[#F5D76E] hover:bg-black/80"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}

          {openEmoji && (
            <div className="absolute right-0 z-30 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0F141D] shadow-2xl shadow-black/40">
              <EmojiPicker
                onEmojiClick={insertEmoji}
                emojiStyle={EmojiStyle.FACEBOOK}
                width={340}
                height={420}
                lazyLoadEmojis
                searchDisabled={false}
                skinTonesDisabled={false}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>
      )}

      {block.type === "section" && (
        <input
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-[#0B1018] px-3 py-2 text-sm text-[#F5F7FA]"
          placeholder="Tiêu đề section"
        />
      )}

      {block.type === "list" && (
        <textarea
          value={block.items.join("\n")}
          onChange={(e) => onChange(updateList(block, e.target.value))}
          rows={6}
          className="w-full rounded-lg border border-white/10 bg-[#0B1018] px-3 py-2 text-sm leading-7 text-[#D1D8E5]"
          placeholder="Mỗi dòng là một item"
        />
      )}

      {block.type === "note" && (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-[#0B1018] px-3 py-2 text-sm leading-7 text-[#D1D8E5]"
          placeholder="Nội dung ghi chú"
        />
      )}

      {block.type === "spacer" && (
        <div className="flex gap-2">
          {(["sm", "md", "lg"] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onChange({ ...block, size })}
              className={`rounded px-3 py-1 text-xs ${block.size === size ? "bg-[#D4AF37] text-[#0F1115]" : "border border-white/20 text-[#A7B0BE]"}`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {block.type === "table" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...block, headers: [...block.headers, `Cột ${block.headers.length + 1}`], rows: block.rows.map((row) => [...row, ""]) })}
              className="rounded border border-white/20 px-2 py-1 text-xs text-[#D4AF37]"
            >
              + Cột
            </button>
            <button
              type="button"
              onClick={() => {
                if (block.headers.length <= 1) return;
                onChange({
                  ...block,
                  headers: block.headers.slice(0, -1),
                  rows: block.rows.map((row) => row.slice(0, -1)),
                });
              }}
              className="rounded border border-white/20 px-2 py-1 text-xs text-[#A7B0BE]"
            >
              - Cột
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...block, rows: [...block.rows, Array.from({ length: block.headers.length }, () => "")] })}
              className="rounded border border-white/20 px-2 py-1 text-xs text-[#D4AF37]"
            >
              + Dòng
            </button>
            <button
              type="button"
              onClick={() => {
                if (block.rows.length <= 1) return;
                onChange({ ...block, rows: block.rows.slice(0, -1) });
              }}
              className="rounded border border-white/20 px-2 py-1 text-xs text-[#A7B0BE]"
            >
              - Dòng
            </button>
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.headers.length}, minmax(0, 1fr))` }}>
            {block.headers.map((header, headerIndex) => (
              <input
                key={`h-${headerIndex}`}
                value={header}
                onChange={(e) => {
                  const headers = [...block.headers];
                  headers[headerIndex] = e.target.value;
                  onChange({ ...block, headers });
                }}
                className="rounded border border-[#D4AF37]/30 bg-[#1A1410] px-2 py-1 text-xs text-[#F5D76E]"
                placeholder={`Cột ${headerIndex + 1}`}
              />
            ))}
          </div>

          {block.rows.map((row, rowIndex) => (
            <div key={`r-${rowIndex}`} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.headers.length}, minmax(0, 1fr))` }}>
              {block.headers.map((_, colIndex) => (
                <input
                  key={`c-${rowIndex}-${colIndex}`}
                  value={row[colIndex] || ""}
                  onChange={(e) => onChange(updateTableCell(block, rowIndex, colIndex, e.target.value))}
                  className="rounded border border-white/10 bg-[#0B1018] px-2 py-1 text-xs text-[#D1D8E5]"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

