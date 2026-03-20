"use client";

import { useState, useEffect } from "react";

// Video file local (public/image/intro.mp4) — dùng thẻ <video>
const HERO_VIDEO_FILE = "/image/intro.mp4";
// Hoặc link YouTube/Vimeo embed — dùng iframe (ưu tiên file nếu có cả hai)
const HERO_VIDEO_URL = "";

const INITIAL_ONLINE_COUNT = 12847;
const COUNT_INTERVAL_MS = 30 * 1000; // 30 giây

export default function Hero() {
  const [onlineCount, setOnlineCount] = useState(INITIAL_ONLINE_COUNT);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount((n) => n + 1);
    }, COUNT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[#0F1115]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.12),transparent)]" />
      <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(245,215,110,0.06)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px] lg:items-center lg:gap-12">
          {/* Cột trái */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 text-sm text-[#A7B0BE]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              Đang có <span className="font-semibold text-[#F5F7FA]">{onlineCount.toLocaleString()}</span> người chơi online
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
              <span className="text-[#F5D76E]">Xocdia8688</span>
              <br />
              <span className="text-[#F5F7FA]">Thiên đường giải trí casino</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#A7B0BE] lg:mx-0 md:text-lg">
              Không chỉ là một website, đây là không gian giải trí trực tuyến được xây dựng để tạo cảm giác cuốn hút ngay từ lần truy cập đầu tiên 🚀💎
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a
                href="https://xocdia88.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#D4AF37]/60 bg-[#0F1115] px-6 py-3.5 text-sm font-bold text-[#F5F7FA] shadow-[0_0_20px_rgba(212,175,55,0.2)] transition hover:border-[#F5D76E] hover:shadow-[0_0_24px_rgba(212,175,55,0.35)]"
              >
                <span className="text-lg">🎁</span>
                Đăng ký nhận 888K
              </a>
              <a
                href="https://xocdia88.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-effect inline-block rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-6 py-3.5 text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/25 transition hover:scale-[1.02]"
              >
                Chơi thử miễn phí
              </a>
            </div>
          </div>

          {/* Cột phải: PHẦN VIDEO — thêm link ở đầu file Hero.tsx (HERO_VIDEO_URL) */}
          <div className="relative mx-auto w-full max-w-[320px] lg:max-w-none">
            <div className="overflow-hidden rounded-[24px] border-2 border-[#D4AF37]/30 bg-[#171A21] shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              {/* Khung video: file .mp4 hoặc link YouTube embed */}
              <div className="relative aspect-video w-full bg-[#0F1115]">
                {HERO_VIDEO_FILE ? (
                  <video
                    src={HERO_VIDEO_FILE}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    controls
                    loop
                    playsInline
                    title="Video giới thiệu"
                  />
                ) : HERO_VIDEO_URL ? (
                  <iframe
                    src={HERO_VIDEO_URL}
                    title="Video giới thiệu"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-t-[22px] bg-gradient-to-b from-[#1a1a1a] to-[#0F1115] px-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10 text-3xl text-[#F5D76E]">
                      ▶
                    </div>
                    <p className="text-center text-sm font-semibold text-[#F5F7FA]">
                      Phần thêm video
                    </p>
                    <p className="text-center text-xs text-[#A7B0BE]">
                      Thêm file video vào <span className="font-mono text-[#F5D76E]">public/image/</span> và khai báo <span className="font-mono text-[#F5D76E]">HERO_VIDEO_FILE</span> trong Hero.tsx
                    </p>
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 p-5">
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { value: "1M+", label: "lượt thắng" },
                    { value: "99,99%", label: "Tỉ lệ chi trả" },
                    { value: "10 giây", label: "Rút tiền" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-lg font-black text-[#F5D76E]">{item.value}</p>
                      <p className="text-xs text-[#A7B0BE]">{item.label}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 text-sm text-[#A7B0BE]">
                  {["Không giới hạn rút thưởng", "Hoàn trả 1.5% mỗi ngày", "VIP rewards độc quyền"].map(
                    (text) => (
                      <li key={text} className="flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        {text}
                      </li>
                    )
                  )}
                </ul>
                <a
                  href="https://t.me/xocdia88_bot_uytin_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-promo-strong mt-5 block w-full rounded-xl border-2 border-[#D4AF37]/50 bg-[#0F1115] py-3.5 text-center text-sm font-bold text-[#F5D76E] shadow-[0_0_16px_rgba(212,175,55,0.2)] transition hover:border-[#F5D76E] hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                >
                  Nhận thưởng ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
