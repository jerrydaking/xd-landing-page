import { getNetlifyIdentityApiUrl, shouldOpenIdentityFromHash } from "@/lib/netlifyIdentityApiUrl";

async function loadNetlifyIdentity() {
  const { default: netlifyIdentity } = await import("netlify-identity-widget");
  const apiUrl = getNetlifyIdentityApiUrl();
  if (!apiUrl) {
    return netlifyIdentity;
  }
  netlifyIdentity.init({ APIUrl: apiUrl });
  console.log("[netlify-identity] widget initialized");
  return netlifyIdentity;
}

type NI = Awaited<ReturnType<typeof loadNetlifyIdentity>>;

let identityPromise: Promise<NI> | null = null;

/** Một lần init cho toàn app (Provider + trang /admin). */
export function ensureNetlifyIdentity(): Promise<NI | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (!identityPromise) {
    identityPromise = loadNetlifyIdentity();
  }
  return identityPromise;
}

export function attachIdentityHashAutoOpen(netlifyIdentity: NI): () => void {
  const tryOpen = () => {
    const hash = window.location.hash;
    if (!shouldOpenIdentityFromHash(hash)) return;
    if (window.location.pathname.startsWith("/admin")) {
      console.log("[admin] widget opened (hash)");
    }
    netlifyIdentity.open();
  };
  tryOpen();
  const onHash = () => tryOpen();
  window.addEventListener("hashchange", onHash);
  return () => window.removeEventListener("hashchange", onHash);
}
