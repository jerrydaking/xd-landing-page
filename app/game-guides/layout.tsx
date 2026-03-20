import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cẩm nang Game — Hướng dẫn theo từng trò chơi",
  description: "Hướng dẫn chi tiết xóc đĩa, casino, thể thao, bắn cá, tài xỉu, nổ hũ và hơn thế nữa.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function GameGuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
