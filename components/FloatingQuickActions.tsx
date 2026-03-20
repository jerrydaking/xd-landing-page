const quickActions = [
  {
    title: "Link chính thức",
    icon: "🔗",
    href: "https://xocdia88.ec",
    style:
      "border-[#D4AF37]/65 bg-gradient-to-br from-[#F5D76E] via-[#D4AF37] to-[#B78A1D] text-[#111318] shadow-[0_0_34px_rgba(212,175,55,0.45)] hover:shadow-[0_0_44px_rgba(245,215,110,0.62)]",
  },
  {
    title: "CSKH 24/7",
    icon: "🎧",
    href: "https://t.me/XOCDIA88_CSKH_2025",
    style:
      "border-[#D4AF37]/45 bg-gradient-to-br from-[#1A202B] via-[#121724] to-[#0E131E] text-[#F6DF84] shadow-[0_0_26px_rgba(212,175,55,0.22)] hover:border-[#F5D76E]/65 hover:shadow-[0_0_34px_rgba(245,215,110,0.4)]",
  },
  {
    title: "Nhận quà",
    icon: "🎁",
    href: "https://t.me/xocdia88_bot_uytin_bot",
    style:
      "border-[#35517A]/55 bg-gradient-to-br from-[#162238] via-[#101C2D] to-[#0B1524] text-[#DCE7FF] shadow-[0_0_26px_rgba(53,81,122,0.35)] hover:border-[#5E86C2]/65 hover:shadow-[0_0_34px_rgba(94,134,194,0.45)]",
  },
];

export default function FloatingQuickActions() {
  return (
    <aside className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:right-4 lg:flex">
      {quickActions.map((action) => (
        <a
          key={action.title}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex h-[102px] w-[102px] flex-col items-center justify-center overflow-hidden rounded-2xl border text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.03] ${action.style}`}
        >
          <span className="pointer-events-none absolute -top-12 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-white/25 blur-2xl opacity-40 transition duration-300 group-hover:opacity-70" />
          <span className="relative text-[24px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            {action.icon}
          </span>
          <span className="relative mt-1 px-1 text-[12px] font-extrabold uppercase leading-tight tracking-[0.04em]">
            {action.title}
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-white/25" />
        </a>
      ))}
    </aside>
  );
}

