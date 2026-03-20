"use client";

import Image from "next/image";
import Link from "next/link";
import { usePersistedAdmin } from "@/hooks/usePersistedAdmin";
import { withAdminHref } from "@/lib/adminSession";

const games = [
  {
    slug: "xoc-dia-online",
    title: "Xóc Đĩa Online",
    desc: "Giao diện nổi bật, nhấn mạnh CTA và chuyển đổi người dùng mới.",
    tag: "Hot",
    gradient: "from-[#2A2110] via-[#171A21] to-[#0F1115]",
    image: "/image/xocdiaonline.jpg",
    imagePosition: undefined as string | undefined,
  },
  {
    slug: "casino-truc-tuyen",
    title: "Casino Trực Tuyến",
    desc: "Thiết kế sang, hợp phong cách giải trí cao cấp và hiện đại.",
    tag: "New",
    gradient: "from-[#201B12] via-[#171A21] to-[#0F1115]",
    image: "/image/livecasino2.jpg",
    imagePosition: "center 35%", // căn nhân vật vừa khung
  },
  {
    slug: "the-thao",
    title: "Thể Thao",
    desc: "Bố cục mạnh, rõ ràng, dễ trình bày kèo và danh mục.",
    tag: "Top",
    gradient: "from-[#1B1F27] via-[#171A21] to-[#0F1115]",
    image: "/image/thethao2.jpg",
    imagePosition: "center center",
  },
  {
    slug: "ban-ca",
    title: "Bắn Cá",
    desc: "Màu sắc nổi bật, card bắt mắt và dễ thay hình về sau.",
    tag: "Hot",
    gradient: "from-[#221c12] via-[#171A21] to-[#0F1115]",
    image: "/image/banca.jpg",
    imagePosition: undefined as string | undefined,
  },
  {
    slug: "tai-xiu",
    title: "Tài Xỉu",
    desc: "Cược tài xỉu nhanh, tỷ lệ hấp dẫn, dễ chơi dễ trúng.",
    tag: "VIP",
    gradient: "from-[#1E222A] via-[#171A21] to-[#0F1115]",
    image: "/image/taixiu.jpg",
    imagePosition: undefined as string | undefined,
  },
  {
    slug: "no-hu",
    title: "Nổ Hũ",
    desc: "Dễ dựng jackpot, bonus box và hiệu ứng thu hút người xem.",
    tag: "Hot",
    gradient: "from-[#2A2110] via-[#171A21] to-[#0F1115]",
    image: "/image/nohu.jpg",
    imagePosition: undefined as string | undefined,
  },
];

export default function GameGrid() {
  const persistedAdmin = usePersistedAdmin();

  return (
    <section id="games" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          Danh mục
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#F5F7FA] md:text-4xl">
          Các trò chơi nổi bật tại XOCDIA88
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <article
            key={game.title}
            className="group overflow-hidden rounded-[28px] border border-white/8 bg-[#171A21] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-[#D4AF37]/35 hover:shadow-xl hover:shadow-[#D4AF37]/10"
          >
            <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${game.gradient}`}>
              {game.image ? (
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 10%" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,215,110,0.12),transparent_40%)]" />
              {/* Hover: làm mờ ảnh + hiện nút Chơi ngay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 right-4 z-20 flex h-14 items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <a
                  href="https://xocdia88.ec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-promo-strong inline-block rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-6 py-3 text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/30"
                >
                  Chơi ngay
                </a>
              </div>
            </div>
            <div className="p-6 pt-7">
              <h3 className="text-xl font-black leading-tight text-[#F5D76E] md:text-2xl" style={{ paddingTop: "0.15em" }}>{game.title}</h3>
              <p className="mt-3 leading-7 text-[#A7B0BE]">{game.desc}</p>
              <Link
                href={withAdminHref(`/game-guides?game=${encodeURIComponent(game.slug)}`, persistedAdmin)}
                className="mt-5 inline-block text-sm font-bold text-[#D4AF37] transition hover:text-[#F5D76E]"
              >
                Xem chi tiết →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
