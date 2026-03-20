"use client";

import { useEffect, useState } from "react";
import { ADMIN_SESSION_EVENT, isAdminSessionActive } from "@/lib/adminSession";

/** true khi đã đăng nhập /admin (localStorage), cập nhật khi đăng xuất hoặc tab khác đổi storage */
export function usePersistedAdmin(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(isAdminSessionActive());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_SESSION_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_SESSION_EVENT, sync);
    };
  }, []);

  return active;
}
