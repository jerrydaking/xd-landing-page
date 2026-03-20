import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FloatingQuickActions from "@/components/FloatingQuickActions";
import { NetlifyIdentityProvider } from "@/components/NetlifyIdentityProvider";
import { getSiteUrl } from "@/lib/siteUrl";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Xocdia8688 — Thiên đường giải trí casino",
  description:
    "Không chỉ là một website, đây là không gian giải trí trực tuyến được xây dựng để tạo cảm giác cuốn hút ngay từ lần truy cập đầu tiên.",
  openGraph: {
    url: siteUrl,
    siteName: "Xocdia8688",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <body className={inter.className}>
        <NetlifyIdentityProvider>
          <Header />
          {children}
          <FloatingQuickActions />
        </NetlifyIdentityProvider>
      </body>
    </html>
  );
}