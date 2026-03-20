/**
 * Phiên đăng nhập /admin — lưu localStorage để giữ môi trường admin khi điều hướng,
 * cho đến khi bấm "Đăng xuất".
 */
export const ADMIN_SESSION_KEY = "xocdia_admin_session";

/** Custom event: đồng bộ UI khi đăng nhập/đăng xuất trong cùng tab */
export const ADMIN_SESSION_EVENT = "xocdia-admin-session";

const ADMIN_PATH_PREFIXES = ["/news", "/faq", "/game-guides"] as const;

export function isAdminSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(ADMIN_SESSION_KEY) === "1") return true;
    // Di chuyển từ sessionStorage (phiên bản cũ) sang localStorage
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") {
      localStorage.setItem(ADMIN_SESSION_KEY, "1");
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return true;
    }
  } catch {
    /* private mode */
  }
  return false;
}

export function setAdminSessionActive(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, "1");
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

/**
 * Thêm ?admin=1 vào link /news, /faq, /game-guides khi đang trong phiên admin.
 * Giữ nguyên anchor (#), không đụng link ngoài.
 */
export function withAdminHref(href: string, loggedInAdmin: boolean): string {
  if (!loggedInAdmin || href.startsWith("/#") || href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  if (href.includes("admin=1")) return href;

  const hashIndex = href.indexOf("#");
  const pathAndQuery = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

  const qIndex = pathAndQuery.indexOf("?");
  const pathname = qIndex >= 0 ? pathAndQuery.slice(0, qIndex) : pathAndQuery;
  const query = qIndex >= 0 ? pathAndQuery.slice(qIndex + 1) : "";

  const isAdminPath = ADMIN_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isAdminPath) return href;

  const params = new URLSearchParams(query);
  params.set("admin", "1");
  return `${pathname}?${params.toString()}${hash}`;
}
