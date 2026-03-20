import { ReactNode } from "react";

export default function ArticleSectionHeader({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#141C2C] via-[#131A26] to-[#101722] shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_8px_26px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3 border-l-2 border-[#D4AF37] px-4 py-3 md:px-5 md:py-4">
        <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#F5D76E] via-[#E3BE59] to-[#C79B34]" />
        <h3 className="text-lg font-black tracking-[0.015em] text-[#F5D76E] md:text-xl">{children}</h3>
      </div>
    </div>
  );
}

