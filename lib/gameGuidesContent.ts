import type { Article } from "@/lib/articleContent";
import type { ArticleBlock } from "@/lib/articleBlocks";

/** Key localStorage — chỉ dùng khi admin, không phải nguồn hiển thị public */
export const GAME_GUIDES_STORAGE_KEY = "game-guides-v1";

export const GAME_OPTIONS = [
  { slug: "xoc-dia-online", title: "Xóc Đĩa Online" },
  { slug: "casino-truc-tuyen", title: "Casino Trực Tuyến" },
  { slug: "the-thao", title: "Thể Thao" },
  { slug: "ban-ca", title: "Bắn Cá" },
  { slug: "tai-xiu", title: "Tài Xỉu" },
  { slug: "no-hu", title: "Nổ Hũ" },
] as const;

export type GuideArticle = Article & {
  game: string;
};

/**
 * Nội dung public (khách / production) — luôn lấy từ đây sau khi build.
 * Muốn đổi nội dung web: sửa file này → commit → deploy.
 */
export const DEFAULT_GAME_GUIDES: GuideArticle[] = [
  {
    slug: "cam-nang-xoc-dia-cho-nguoi-moi",
    game: "xoc-dia-online",
    title: "Cẩm nang Xóc Đĩa cho người mới",
    description: "Mẹo vào vốn, đọc cửa và kiểm soát cảm xúc khi bắt đầu.",
    content: [
      { type: "section", title: "Bắt đầu đúng nhịp" },
      {
        type: "paragraph",
        text: "Người mới nên đi vốn nhỏ và bám một chiến thuật cố định trong 10-20 phiên đầu. Tránh all-in khi chưa có dữ liệu.",
      },
      {
        type: "list",
        items: [
          "Chia ngân sách theo phiên chơi",
          "Đặt giới hạn lãi/lỗ trước khi vào bàn",
          "Dừng đúng kế hoạch, không gỡ cảm xúc",
        ],
      },
    ] as ArticleBlock[],
  },
  {
    slug: "chien-luoc-nhap-mon-tai-xiu",
    game: "tai-xiu",
    title: "Chiến lược nhập môn Tài Xỉu",
    description: "Khung chơi an toàn cho người mới bắt đầu.",
    content: [
      { type: "section", title: "Khung vốn 5 phần" },
      {
        type: "paragraph",
        text: "Chia vốn thành 5 phần bằng nhau để tránh cháy vốn sớm. Nếu thua 2 phần liên tiếp, nghỉ 15 phút rồi quay lại.",
      },
    ] as ArticleBlock[],
  },
];
