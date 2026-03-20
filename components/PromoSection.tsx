const SITE_URL = "https://xocdia88.ec";

const promos = [
  {
    title: "Thưởng thành viên mới",
    value: "+888K",
    desc: "Gói ưu đãi dành cho tài khoản mới đăng ký hôm nay.",
    ctaUrl: "https://t.me/xocdia88_bot_uytin_bot",
  },
  {
    title: "Nạp đầu nhận thưởng",
    value: "100%",
    desc: "Nạp lần đầu nhận thưởng lên đến 100% giá trị nạp.",
    ctaUrl: SITE_URL,
  },
  {
    title: "Hoàn trả mỗi ngày",
    value: "1.5%",
    desc: "Tăng cảm giác uy tín và giữ chân người dùng quay lại.",
    ctaUrl: SITE_URL,
  },
];

export default function PromoSection() {
  return (
    <section id="promo" className="border-t border-white/5 bg-[#13171D] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Khuyến mãi
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#F5F7FA] md:text-4xl">
            Ưu đãi nổi bật trên trang chủ
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {promos.map((promo, index) => (
            <div
              key={promo.title}
              className="relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#171A21] shadow-lg shadow-black/20 transition hover:border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/5"
            >
              {/* Khối gradient + số lớn */}
              <div className="relative flex min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-t-[24px] bg-gradient-to-b from-[#2A2218] via-[#1F1D22] to-[#171A21] px-4 py-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_20%,rgba(212,175,55,0.18),transparent_55%)]" />
                {index === 0 && (
                  <div className="absolute right-3 top-3 z-10 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0F1115] shadow-md shadow-[#D4AF37]/30">
                    HOT
                  </div>
                )}
                <span className="relative text-4xl font-black leading-none text-[#F5D76E] drop-shadow-sm md:text-5xl">
                  {promo.value}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A7B0BE]">
                  {promo.title}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#A7B0BE]">
                  {promo.desc}
                </p>
                <a
                  href={promo.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-promo-strong mt-5 block w-full rounded-xl bg-[#D4AF37] py-3 text-center text-sm font-bold text-[#0F1115] shadow-lg shadow-[#D4AF37]/25 transition hover:bg-[#F5D76E] hover:shadow-[#D4AF37]/35"
                >
                  Nhận ngay
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
