export default function ArticleNote({ content }: { content: string }) {
  if (!content.trim()) return null;

  return (
    <div className="my-6 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#1A1510] via-[#141923] to-[#10141F] p-4 md:p-5 shadow-[0_0_24px_rgba(212,175,55,0.08)]">
      <div className="flex gap-3">
        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37]/20 text-xs font-black text-[#F5D76E]">
          !
        </span>
        <p className="leading-8 text-[#E1D6B0]">{content}</p>
      </div>
    </div>
  );
}

