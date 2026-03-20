"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePersistedAdmin } from "@/hooks/usePersistedAdmin";
import { withAdminHref } from "@/lib/adminSession";
import AnnouncementTicker from "./AnnouncementTicker";
import MobileMenu from "./MobileMenu";

const navLinksBase = [
  { href: "/#games", label: "Trò chơi" },
  { href: "/#promo", label: "Khuyến mãi" },
  { href: "/#features", label: "Ưu đãi" },
  { href: "/news", label: "Tin tức" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const persistedAdmin = usePersistedAdmin();
  const navLinks = useMemo(
    () => navLinksBase.map((l) => ({ ...l, href: withAdminHref(l.href, persistedAdmin) })),
    [persistedAdmin]
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#D4AF37]/10 bg-[#0F1115]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] shadow-lg shadow-[#D4AF37]/25">
              <Image
                src="/image/logo.jpg"
                alt="XOCDIA8688"
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xl font-black tracking-wide text-[#D4AF37] md:text-2xl">
                XOCDIA8688
              </p>
              <p className="text-xs text-[#A7B0BE]">Thiên đường giải trí casino</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#A7B0BE] transition hover:text-[#F5D76E] focus:text-[#F5D76E] focus:outline-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="https://xocdia88.ec"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#D4AF37]/40 hover:text-[#F5D76E] md:inline-block"
            >
              Đăng nhập
            </a>
            <a
              href="https://xocdia88.ec"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-effect hidden rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-4 py-2.5 text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/20 transition hover:scale-[1.02] md:inline-block"
            >
              Đăng ký
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#171A21] text-[#F5F7FA] transition hover:border-[#D4AF37]/30 hover:bg-[#171A21]/80 md:hidden"
              aria-label="Mở menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <section
          className="border-t border-white/[0.06] bg-gradient-to-r from-[#D4AF37]/[0.07] via-[#0F1115] to-[#0F1115]"
          aria-label="Thông báo"
        >
          <div className="mx-auto flex min-h-[3rem] max-w-7xl items-center px-4 py-3 sm:px-5">
            <AnnouncementTicker />
          </div>
        </section>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  );
}
