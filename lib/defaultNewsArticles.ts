import type { Article } from "@/lib/articleContent";
import type { ArticleBlock } from "@/lib/articleBlocks";

/**
 * Bài viết mặc định — nằm trong bundle (Git), dùng khi chưa có localStorage.
 * Trang chủ (slider) và /news phải dùng cùng slug/title để link không bị "Không tìm thấy bài" trên production.
 */
export const DEFAULT_NEWS_ARTICLES: Article[] = [
  {
    slug: "huong-dan-nap-rut-sieu-toc",
    title: "Hướng dẫn nạp/rút siêu tốc tại XOCDIA88",
    description: "Bài demo block editor: section, list, table, note và spacer cùng tone dark luxury.",
    content: [
      { type: "section", title: "Tổng quan giao dịch" },
      {
        type: "paragraph",
        text: "Tại XOCDIA88, quy trình nạp/rút được tối ưu để thao tác nhanh, rõ ràng và bảo mật.\nHãy làm đúng từng bước để giao dịch mượt nhất.",
      },
      { type: "spacer", size: "sm" },
      { type: "section", title: "Checklist trước khi giao dịch" },
      {
        type: "list",
        items: [
          "Kiểm tra đúng tài khoản ngân hàng đã liên kết.",
          "Xác thực số điện thoại và email.",
          "Không chia sẻ OTP cho bất kỳ ai.",
        ],
      },
      { type: "section", title: "Bảng thời gian xử lý tham khảo" },
      {
        type: "table",
        headers: ["Loại giao dịch", "Thời gian", "Ghi chú"],
        rows: [
          ["Nạp tiền", "10-30 giây", "Tùy ngân hàng"],
          ["Rút tiền", "1-3 phút", "Giờ cao điểm có thể lâu hơn"],
          ["Hỗ trợ", "24/7", "LiveChat & Telegram"],
        ],
      },
      {
        type: "note",
        text: "Nếu giao dịch chậm bất thường, liên hệ CSKH 24/7 để được xử lý ngay. Luôn kiểm tra đúng thông tin trước khi xác nhận.",
      },
    ] as ArticleBlock[],
  },
  {
    slug: "cach-nhan-uu-dai-thanh-vien-moi",
    title: "Cách nhận ưu đãi thành viên mới",
    description: "Bài fallback dạng text cũ để đảm bảo tương thích.",
    content:
      "# Cách nhận ưu đãi thành viên mới\n\nBước 1: Hoàn tất đăng ký tài khoản.\nBước 2: Nạp lần đầu đúng điều kiện.\n\n## Danh sách ưu đãi\n- Thưởng nạp lần đầu\n- Hoàn trả theo ngày\n- Mã code sự kiện theo tuần",
  },
  {
    slug: "meo-toi-uu-giao-dien-chuyen-doi-cao",
    title: "Mẹo tối ưu giao diện chuyển đổi cao",
    description: "Thêm phần tin tức giúp trang nhìn giống website thật hơn.",
    content:
      "# Mẹo tối ưu giao diện\n\nNội dung chia section rõ ràng sẽ giúp người dùng đọc nhanh và bấm CTA tốt hơn.",
  },
];

const HOME_CARD_GRADIENTS = [
  "from-[#2A2110] via-[#171A21] to-[#0F1115]",
  "from-[#1E222A] via-[#171A21] to-[#0F1115]",
  "from-[#221c12] via-[#171A21] to-[#0F1115]",
] as const;

export type NewsPostCard = {
  slug: string;
  title: string;
  desc: string;
  gradient: string;
};

/** Slider trang chủ — luôn khớp DEFAULT_NEWS_ARTICLES (slug/title/mô tả). */
export function getDefaultNewsPostCards(): NewsPostCard[] {
  return DEFAULT_NEWS_ARTICLES.map((article, index) => ({
    slug: article.slug,
    title: article.title,
    desc: article.description,
    gradient: HOME_CARD_GRADIENTS[index % HOME_CARD_GRADIENTS.length],
  }));
}
