"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearAdminSession,
  isAdminSessionActive,
  setAdminSessionActive,
} from "@/lib/adminSession";

const sections = [
  {
    title: "Decap CMS (tin tức Git)",
    desc: "Soạn bài trong repo → commit — mở giao diện quản trị tại /admin.",
    href: "/admin/",
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

export default function SiteAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setAuthenticated(isAdminSessionActive());
    setChecking(false);
  }, [mounted]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const expectedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase();
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";
    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password;
    if (expectedEmail && expectedPassword && inputEmail === expectedEmail && inputPassword === expectedPassword) {
      setAdminSessionActive();
      setAuthenticated(true);
      setEmail("");
      setPassword("");
    } else {
      setError("Email hoặc mật khẩu không đúng.");
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setAuthenticated(false);
  };

  if (!mounted || checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F1115]">
        <p className="text-[#A7B0BE]">Đang tải...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F1115] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171A21] p-8 shadow-xl">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]"
          >
            ‹ Quay lại trang chủ
          </Link>
          <h1 className="mt-6 text-2xl font-black text-white">
            Đăng nhập quản trị
          </h1>
          <p className="mt-2 text-sm text-[#A7B0BE]">
            Nhập email và mật khẩu để truy cập Bảng quản trị (local).
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="sr-only">
                Email đăng nhập
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Email đăng nhập"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-[#10151E] px-4 py-3 text-[#F5F7FA] placeholder:text-[#A7B0BE]/60 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Mật khẩu"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-[#10151E] px-4 py-3 text-[#F5F7FA] placeholder:text-[#A7B0BE]/60 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="btn-gold-effect w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] py-3 text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/20 transition hover:scale-[1.01]"
            >
              Đăng nhập
            </button>
          </form>
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
            Đăng xuất
          </button>
        </div>

        <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">
          Bảng quản trị (local)
        </h1>
        <p className="mt-2 text-[#A7B0BE]">
          Chọn mục cần quản lý. Các kênh FAQ / Game còn lưu trong localStorage trình duyệt; tin tức chính nên dùng Decap CMS tại{" "}
          <a href="/admin/" className="font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
            /admin
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
