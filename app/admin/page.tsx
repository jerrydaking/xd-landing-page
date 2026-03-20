"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { clearAdminSession, setAdminSessionActive } from "@/lib/adminSession";
import { ensureNetlifyIdentity } from "@/lib/netlifyIdentitySingleton";

type IdentityUser = { email?: string } | null;

export default function AdminPage() {
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

      const hash = window.location.hash;
      console.log("[admin] hash hiện tại:", hash);
      console.log("[admin] phát hiện invite_token:", /invite_token=/.test(hash));
      console.log("[admin] phát hiện recovery_token:", /recovery_token=/.test(hash));

      const refreshUser = () => {
        const u = ni.currentUser() ?? null;
        setUser(u);
        if (u?.email) {
          setAdminSessionActive();
        } else {
          clearAdminSession();
        }
      };

      const onLogin = (u: unknown) => {
        console.log("[admin] login success:", u);
        refreshUser();
      };
      const onLogout = () => {
        console.log("[admin] logout");
        clearAdminSession();
        setUser(null);
      };
      const onInit = (u: unknown) => {
        console.log("[admin] identity init:", u);
        refreshUser();
      };

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

  const openLogin = useCallback(async () => {
    const ni = await ensureNetlifyIdentity();
    if (!ni) return;
    console.log("[admin] widget opened (nút Đăng nhập quản trị)");
    ni.open("login");
  }, []);

  const openLogout = useCallback(async () => {
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

  return (
    <main className="min-h-screen bg-[#0F1115] px-4 py-12 text-[#F5F7FA]">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm text-white/50 transition hover:text-[#F5D76E]">
          ‹ Về trang chủ
        </Link>
        <h1 className="mt-6 text-2xl font-black text-white md:text-3xl">Quản trị Netlify</h1>
        <p className="mt-2 text-sm text-[#A7B0BE]">
          Đăng nhập bằng Netlify Identity (invite, khôi phục mật khẩu, v.v.). Sau khi đăng nhập có thể mở Decap
          CMS.
        </p>

        {!user?.email ? (
          <button
            type="button"
            onClick={openLogin}
            className="mt-8 w-full rounded-xl border border-[#D4AF37]/50 bg-[#171A21] py-3 text-sm font-bold text-[#F5D76E] transition hover:bg-[#D4AF37]/15"
          >
            Đăng nhập quản trị
          </button>
        ) : (
          <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-[#171A21] p-6">
            <p className="text-sm text-[#A7B0BE]">
              Đã đăng nhập:{" "}
              <span className="font-semibold text-[#F5D76E]">{user.email}</span>
            </p>
            <a
              href="/cms/"
              className="block w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] py-3 text-center text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/20"
            >
              Mở Decap CMS
            </a>
            <button
              type="button"
              onClick={openLogout}
              className="w-full rounded-xl border border-white/15 py-2 text-sm text-[#A7B0BE] transition hover:border-red-500/40 hover:text-red-400"
            >
              Đăng xuất Netlify Identity
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
