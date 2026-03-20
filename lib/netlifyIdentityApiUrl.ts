/**
 * Endpoint GoTrue của Netlify Identity.
 * Prod: mặc định `/.netlify/identity` trên cùng origin.
 * Override: `NEXT_PUBLIC_NETLIFY_IDENTITY_URL` (vd: preview URL khác domain).
 */
export function getNetlifyIdentityApiUrl(): string {
  const fromEnv =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_NETLIFY_IDENTITY_URL?.trim() : "";
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/.netlify/identity`;
}

export function shouldOpenIdentityFromHash(hash: string): boolean {
  return /invite_token|recovery_token|confirmation_token/i.test(hash);
}
