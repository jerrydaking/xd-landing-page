"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { clearAdminSession, setAdminSessionActive } from "@/lib/adminSession";
import { ensureNetlifyIdentity } from "@/lib/netlifyIdentitySingleton";

const sections = [
  {
    title: "Decap CMS (tin tức Git)",
    desc: "Soạn bài trong repo → commit — giao diện Decap tại /cms (đăng nhập Netlify Identity trước).",
    href: "/cms/",
    decap: true as const,
  },
  {
    title: "Cẩm nang Tân Thủ",
    desc: "Quản lý bài viết kênh Cẩm nang (thêm / sửa / xóa / đồng bộ).",
    href: "/news?admin=1",
  },
  {
    title: "FAQ",
    desc: "Quản lý câu hỏi thường gặp (thêm / sửa / xóa / đồng bộ).",
    href: "/faq?admin=1",
  },
  {
    title: "Cẩm nang Game",
    desc: "Quản lý bài viết chi tiết từng trò chơi (thêm / sửa / xóa / đồng bộ).",
    href: "/game-guides?admin=1",
  },
];

type IdentityUser = { email?: string } | null;

export default function SiteAdminPage() {
  const [user, setUser] = useState<IdentityUser | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let detachListeners: (() => void) | undefined;

    void (async () => {
      const ni = await ensureNetlifyIdentity();
      if (cancelled || !ni) {
        if (!cancelled) setUser(null);
        return;
      }

      const refreshUser = () => {
        const u = ni.currentUser() ?? null;
        setUser(u);
        if (u?.email) {
          setAdminSessionActive();
        } else {
          clearAdminSession();
        }
      };

      const onLogin = () => refreshUser();
      const onLogout = () => {
        clearAdminSession();
        setUser(null);
      };
      const onInit = () => refreshUser();

      ni.on("init", onInit);
      ni.on("login", onLogin);
      ni.on("logout", onLogout);
      refreshUser();

      detachListeners = () => {
        ni.off("init", onInit);
        ni.off("login", onLogin);
        ni.off("logout", onLogout);
      };
    })();

    return () => {
      cancelled = true;
      detachListeners?.();
    };
  }, []);

  const goNetlifyLogin = useCallback(async () => {
    const ni = await ensureNetlifyIdentity();
    ni?.open("login");
  }, []);

  const handleLogout = useCallback(async () => {
    const ni = await ensureNetlifyIdentity();
    ni?.logout();
  }, []);

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F1115]">
        <p className="text-[#A7B0BE]">Đang tải...</p>
      </main>
    );
  }

  if (!user?.email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F1115] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171A21] p-8 shadow-xl">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]"
          >
            ‹ Quay lại trang chủ
          </Link>
          <h1 className="mt-6 text-2xl font-black text-white">Bảng quản trị</h1>
          <p className="mt-2 text-sm text-[#A7B0BE]">
            Đăng nhập bằng <strong className="text-[#C8D1DE]">Netlify Identity</strong> (không còn form email/mật khẩu
            tùy chỉnh). Bạn có thể vào <Link href="/admin" className="font-semibold text-[#D4AF37] hover:text-[#F5D76E]">/admin</Link> để mời / khôi phục mật khẩu qua email.
          </p>
          <button
            type="button"
            onClick={goNetlifyLogin}
            className="btn-gold-effect mt-6 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] py-3 text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/20 transition hover:scale-[1.01]"
          >
            Đăng nhập quản trị (Netlify Identity)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]"
          >
            ‹ Quay lại trang chủ
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#A7B0BE] transition hover:border-red-500/40 hover:text-red-400"
          >
            Đăng xuất Netlify Identity
          </button>
        </div>

        <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">
          Bảng quản trị (local)
        </h1>
        <p className="mt-2 text-[#A7B0BE]">
          Đã đăng nhập: <span className="font-semibold text-[#F5D76E]">{user.email}</span>. Tin tức Git: Decap tại{" "}
          <a href="/cms/" className="font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
            /cms
          </a>
          .
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {sections.map((item) =>
            "decap" in item && item.decap ? (
              <a
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/8 bg-[#171A21] p-6 transition hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5"
              >
                <h2 className="text-lg font-black text-[#F5D76E] transition group-hover:text-[#F8E08A]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#A7B0BE]">{item.desc}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[#D4AF37] transition group-hover:text-[#F5D76E]">
                  Mở Decap CMS →
                </span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/8 bg-[#171A21] p-6 transition hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5"
              >
                <h2 className="text-lg font-black text-[#F5D76E] transition group-hover:text-[#F8E08A]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#A7B0BE]">{item.desc}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[#D4AF37] transition group-hover:text-[#F5D76E]">
                  Mở quản lý →
                </span>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}
