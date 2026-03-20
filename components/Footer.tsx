const footerLinks = {
  danhMuc: [
    { label: "Trang chủ", href: "#" },
    { label: "Trò chơi", href: "#games" },
    { label: "Khuyến mãi", href: "#promo" },
    { label: "FAQ", href: "#faq" },
  ],
  hoTro: [
    { label: "Hướng dẫn", href: "#" },
    { label: "Liên hệ", href: "#" },
    { label: "Chính sách", href: "#" },
    { label: "Bảo mật", href: "#" },
  ],
  thongTin: [
    { label: "Điều khoản", href: "#" },
    { label: "Hệ thống", href: "#" },
    { label: "Tin tức", href: "#news" },
    { label: "Khuyến mãi", href: "#promo" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0C0F14]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-2xl font-black text-[#D4AF37]">XOCDIA8688</p>
            <p className="mt-4 leading-7 text-[#A7B0BE]">
              Không chỉ là một website, đây là không gian giải trí trực tuyến được xây dựng để tạo cảm giác cuốn hút ngay từ lần truy cập đầu tiên 🚀💎
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#F5F7FA]">Danh mục</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.danhMuc.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A7B0BE] transition hover:text-[#F5D76E]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#F5F7FA]">Hỗ trợ</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.hoTro.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A7B0BE] transition hover:text-[#F5D76E]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#F5F7FA]">Thông tin</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.thongTin.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A7B0BE] transition hover:text-[#F5D76E]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-[#A7B0BE]">
          © {new Date().getFullYear()} XOCDIA8688. Giao diện mẫu — không sử dụng ảnh thật.
        </div>
      </div>
    </footer>
  );
}
