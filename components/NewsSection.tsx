"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePersistedAdmin } from "@/hooks/usePersistedAdmin";
import { withAdminHref } from "@/lib/adminSession";
import type { NewsPostCard } from "@/lib/defaultNewsArticles";
import { hrefNewsArticle } from "@/lib/newsLinks";

function getPostCoverImage(post: Pick<NewsPostCard, "slug" | "title">): string | null {
  const normalized = `${post.slug} ${post.title}`.toLowerCase();
  if (
    normalized.includes("huong-dan-tao-tai-khoan") ||
    normalized.includes("hướng dẫn tạo tài khoản")
  ) {
    return "/image/huongdantaotaikhoan.png";
  }
  if (
    normalized.includes("nap-rut-sieu-toc") ||
    normalized.includes("nạp/rút siêu tốc") ||
    normalized.includes("nap/rut sieu toc")
  ) {
    return "/image/naprutsieutoc.png";
  }
  if (
    normalized.includes("uu-dai-thanh-vien") ||
    normalized.includes("ưu đãi thành viên")
  ) {
    return "/image/cachnhanuudai.png";
  }
  if (
    normalized.includes("dang-nhap") ||
    normalized.includes("đăng nhập")
  ) {
    return "/image/cachdangnhapantoanvanhanhchong.png";
  }
  if (
    normalized.includes("cskh") ||
    normalized.includes("liên hệ") ||
    normalized.includes("chăm sóc khách hàng")
  ) {
    return "/image/cskh.png";
  }
  return null;
}

function SliderNavButton({
  direction,
  disabled,
  onClick,
  position,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  position: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Bài trước" : "Bài tiếp"}
      className={`group/btn absolute top-1/2 z-20 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200 md:h-[42px] md:w-[42px] ${
        position === "left" ? "-left-[18px] md:-left-[22px]" : "-right-[18px] md:-right-[22px]"
      } ${
        disabled
          ? "pointer-events-none border-white/4 bg-[#0F1115]/40 opacity-20"
          : "border-[#D4AF37]/22 bg-[#0F1318]/80 shadow-[0_2px_16px_rgba(0,0,0,0.45),0_0_10px_rgba(212,175,55,0.08)] hover:border-[#D4AF37]/45 hover:bg-[#141920]/90 hover:shadow-[0_3px_20px_rgba(0,0,0,0.5),0_0_16px_rgba(212,175,55,0.16)] active:scale-[0.9] active:shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
      }`}
    >
      <svg
        className={`h-[18px] w-[18px] transition-colors duration-200 md:h-5 md:w-5 ${
          disabled ? "text-white/12" : "text-[#D4AF37]/75 group-hover/btn:text-[#F5D76E]"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        viewBox="0 0 24 24"
      >
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function NewsSection({ posts }: { posts: NewsPostCard[] }) {
  const bundledSlugs = useMemo(() => new Set(posts.map((p) => p.slug)), [posts]);
  const persistedAdmin = usePersistedAdmin();

  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav, posts]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  return (
    <section id="news" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Cẩm nang
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#F5F7FA] md:text-4xl">
            Tân Thủ XOCDIA88
          </h2>
        </div>
        <Link
          href={withAdminHref("/news", persistedAdmin)}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[#F5F7FA] transition hover:border-[#D4AF37]/40 hover:text-[#F5D76E]"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="relative">
        <SliderNavButton direction="left" disabled={!canLeft} onClick={() => scroll("left")} position="left" />
        <SliderNavButton direction="right" disabled={!canRight} onClick={() => scroll("right")} position="right" />
        <div
          ref={trackRef}
          className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-2"
        >
          {posts.map((post) => (
            <article
              key={post.slug}
              className="w-[85vw] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/8 bg-[#171A21] transition hover:border-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/5 sm:w-[45vw] md:w-[calc((100%-3rem)/3)]"
            >
              <div className={`relative h-48 w-full bg-gradient-to-br md:h-56 ${post.gradient}`}>
                {getPostCoverImage(post) ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPostCoverImage(post)})` }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,215,110,0.08),transparent_40%)]" />
              </div>
              <div className="relative p-6">
                <h3 className="text-xl font-black text-[#F5D76E] md:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 leading-7 text-[#A7B0BE]">{post.desc}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Link
                    href={withAdminHref(hrefNewsArticle(post.slug, undefined, bundledSlugs), persistedAdmin)}
                    className="inline-block text-sm font-bold text-[#D4AF37] transition hover:text-[#F5D76E]"
                  >
                    Xem thêm →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
