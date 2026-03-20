declare module "netlify-identity-widget" {
  export interface NetlifyIdentity {
    init(opts: { APIUrl: string }): void;
    open(tab?: string): void;
    on(
      event: "init" | "login" | "logout" | "error" | "close",
      cb: (payload?: unknown) => void
    ): void;
    off(event: "init" | "login" | "logout" | "error" | "close", cb?: (payload?: unknown) => void): void;
    logout(): void;
    currentUser: () => { email?: string } | null;
  }
  const netlifyIdentity: NetlifyIdentity;
  export default netlifyIdentity;
}
