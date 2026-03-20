import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị nội dung (local)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function SiteAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
