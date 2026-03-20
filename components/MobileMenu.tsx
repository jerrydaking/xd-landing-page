"use client";

import { useEffect } from "react";

type LinkItem = { href: string; label: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
};

export default function MobileMenu({ isOpen, onClose, links }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[#0F1115]/90 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div
        className={`fixed top-0 right-0 z-[61] flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#0F1115] shadow-2xl transition-transform duration-300 ease-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="text-lg font-bold text-[#D4AF37]">XOCDIA8688</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#A7B0BE] transition hover:bg-white/10 hover:text-[#F5F7FA]"
            aria-label="Đóng menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-[#F5F7FA] transition hover:bg-[#171A21] hover:text-[#F5D76E]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 space-y-2">
          <a
            href="https://xocdia88.ec"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block rounded-xl border border-white/10 py-3 text-center text-sm font-semibold text-[#F5F7FA] transition hover:border-[#D4AF37]/40 hover:text-[#F5D76E]"
          >
            Đăng nhập
          </a>
          <a
            href="https://xocdia88.ec"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn-gold-effect block rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] py-3 text-center text-sm font-bold text-[#0F1115]"
          >
            Đăng ký
          </a>
        </div>
      </div>
    </>
  );
}
