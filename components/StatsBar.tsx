const stats = [
  { label: "Người dùng", value: "100K+", suffix: "" },
  { label: "Trò chơi", value: "500+", suffix: "" },
  { label: "Khuyến mãi", value: "24/7", suffix: "" },
  { label: "Hỗ trợ", value: "24/7", suffix: "" },
];

export default function StatsBar() {
  return (
    <section className="border-b border-white/5 bg-[#13171D] py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/8 bg-[#171A21] px-6 py-5 text-center transition hover:border-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/5"
            >
              <p className="text-2xl font-black text-[#F5D76E] md:text-3xl">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="mt-1 text-sm font-medium text-[#A7B0BE]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
