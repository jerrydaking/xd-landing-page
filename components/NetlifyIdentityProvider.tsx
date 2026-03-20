"use client";

import { useEffect, type ReactNode } from "react";
import {
  getNetlifyIdentityApiUrl,
  shouldOpenIdentityFromHash,
} from "@/lib/netlifyIdentityApiUrl";

/**
 * Khởi tạo Netlify Identity Widget trên client (tránh SSR).
 * Tự mở modal khi hash có invite / recovery / confirmation từ email.
 */
export function NetlifyIdentityProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    let cleanupHash: (() => void) | undefined;

    void (async () => {
      const { default: netlifyIdentity } = await import("netlify-identity-widget");
      if (cancelled) return;

      const apiUrl = getNetlifyIdentityApiUrl();
      if (!apiUrl) return;

      netlifyIdentity.init({ APIUrl: apiUrl });

      const tryOpenFromHash = () => {
        if (shouldOpenIdentityFromHash(window.location.hash)) {
          netlifyIdentity.open();
        }
      };

      tryOpenFromHash();

      const onHashChange = () => tryOpenFromHash();
      window.addEventListener("hashchange", onHashChange);
      cleanupHash = () => window.removeEventListener("hashchange", onHashChange);
    })();

    return () => {
      cancelled = true;
      cleanupHash?.();
    };
  }, []);

  return <>{children}</>;
}
