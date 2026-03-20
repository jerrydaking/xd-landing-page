import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp (FAQ)",
  description: "Giải đáp nhanh các thắc mắc về tài khoản, khuyến mãi và trải nghiệm tại XOCDIA88.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
