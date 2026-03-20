import ArticleRenderer from "@/components/article/ArticleRenderer";
import BlockItemEditor from "@/components/article/editor/BlockItemEditor";
import BlockToolbar from "@/components/article/editor/BlockToolbar";
import { ArticleBlock, createBlock } from "@/lib/articleBlocks";

type Props = {
  blocks: ArticleBlock[];
  onChange: (next: ArticleBlock[]) => void;
  saveActionLabel: string;
  onSave: () => void;
  saving?: boolean;
};

export default function BlockEditor({ blocks, onChange, saveActionLabel, onSave, saving = false }: Props) {
  const addBlock = (type: ArticleBlock["type"]) => {
    onChange([...blocks, createBlock(type)]);
  };

  const updateBlock = (index: number, nextBlock: ArticleBlock) => {
    const next = [...blocks];
    next[index] = nextBlock;
    onChange(next);
  };

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div className="mb-8 rounded-2xl border border-[#D4AF37]/20 bg-[#171A21] p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#F5D76E]">Content Builder</p>
        <span className="text-xs text-[#A7B0BE]">{blocks.length} block</span>
      </div>

      <BlockToolbar onAdd={addBlock} />

      {blocks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-[#A7B0BE]">
          Chưa có block. Bấm nút + bên trên để thêm nội dung.
        </p>
      ) : (
        blocks.map((block, index) => (
          <BlockItemEditor
            key={`${block.type}-${index}`}
            block={block}
            index={index}
            total={blocks.length}
            onChange={(nextBlock) => updateBlock(index, nextBlock)}
            onDelete={() => deleteBlock(index)}
            onMoveUp={() => moveBlock(index, -1)}
            onMoveDown={() => moveBlock(index, 1)}
          />
        ))
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-[#0F1115] transition hover:bg-[#F5D76E] disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : saveActionLabel}
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-[#0F1115] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">Preview</p>
        <ArticleRenderer content={blocks} />
      </div>
    </div>
  );
}

