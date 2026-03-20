"use client";

import { useEffect, type ReactNode } from "react";
import {
  attachIdentityHashAutoOpen,
  ensureNetlifyIdentity,
} from "@/lib/netlifyIdentitySingleton";

/**
 * Khởi tạo Netlify Identity một lần + tự mở modal theo hash (invite/recovery trên mọi route).
 */
export function NetlifyIdentityProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    let detachHash: (() => void) | undefined;

    void (async () => {
      const ni = await ensureNetlifyIdentity();
      if (cancelled || !ni) return;
      detachHash = attachIdentityHashAutoOpen(ni);
    })();

    return () => {
      cancelled = true;
      detachHash?.();
    };
  }, []);

  return <>{children}</>;
}
