"use client";

const FEATURES = [
  { title: "Nạp/rút siêu tốc", desc: "Trải nghiệm công nghệ nạp/rút hoàn toàn mới chỉ 10 giây nổ bank, bảo mật kỹ lưỡng từng giao dịch của khách hàng.", icon: "1" },
  { title: "Chăm sóc khách hàng 24/7", desc: "Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 qua LiveChat và Telegram nếu như bạn cần hỗ trợ bởi đội ngũ CSKH của chúng tôi.", icon: "2" },
  { title: "Tặng code hàng ngày", desc: "Tại Xocdia88, hàng ngàn giftcode ưu đãi mới nhất đang chờ bạn sử dụng.", icon: "3" },
  { title: "An toàn - Bảo mật", desc: "Tại Xocdia88, chúng tôi luôn xây dựng hệ thống bảo mật một cách chặt chẽ nhất nhằm bảo mật thông tin của khách hàng.", icon: "4" },
];

export default function WhyChooseUs() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          Lý do nên chọn
        </p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-wide text-white md:text-4xl">
          XOCDIA88
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => (
          <div
            key={`${feature.title}-${index}`}
            className="rounded-[28px] border border-white/8 bg-[#171A21] p-6 transition hover:border-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/25 to-[#F5D76E]/10 text-xl font-black text-[#F5D76E]">
              {feature.icon}
            </div>
            <h3 className="mt-5 text-lg font-black text-[#F5F7FA]">{feature.title}</h3>
            <p className="mt-3 leading-7 text-[#A7B0BE]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
