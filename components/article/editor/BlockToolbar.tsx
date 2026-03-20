import { ArticleBlock } from "@/lib/articleBlocks";

type Props = {
  onAdd: (type: ArticleBlock["type"]) => void;
};

const buttons: Array<{ type: ArticleBlock["type"]; label: string }> = [
  { type: "paragraph", label: "+ Đoạn văn" },
  { type: "section", label: "+ Section highlight" },
  { type: "list", label: "+ Danh sách" },
  { type: "table", label: "+ Bảng" },
  { type: "note", label: "+ Ghi chú" },
  { type: "spacer", label: "+ Spacer" },
];

export default function BlockToolbar({ onAdd }: Props) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {buttons.map((button) => (
        <button
          key={button.type}
          type="button"
          onClick={() => onAdd(button.type)}
          className="rounded-lg border border-[#D4AF37]/40 bg-[#131821] px-3 py-2 text-xs font-semibold text-[#F5D76E] transition hover:bg-[#1B222E]"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

