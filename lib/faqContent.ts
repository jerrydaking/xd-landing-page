import { repairMojibake, slugify } from "@/lib/articleContent";

export type FaqItem = {
  id: string;
  q: string;
  a: string;
};

/** Key localStorage — chỉ dùng khi admin soạn thảo / xuất nháp, không phải nguồn public */
export const FAQ_STORAGE_KEY = "faq-items-v1";

/** FAQ hiển thị cho khách (localhost & Vercel giống nhau) — sửa file này rồi commit để cập nhật production */
export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "web-nay-da-la-web-hoan-chinh-chua",
    q: "Web này đã là web hoàn chỉnh chưa?",
    a: "Đây là giao diện landing page premium. Bạn có thể thêm ảnh thật, tích hợp API và deploy lên hosting.",
  },
  {
    id: "co-the-them-form-dang-ky-that-khong",
    q: "Có thể thêm form đăng ký thật không?",
    a: "Có. Bạn có thể nối form với backend hoặc dịch vụ bên thứ ba để xử lý đăng ký.",
  },
  {
    id: "co-the-thay-toan-bo-noi-dung-sau-khong",
    q: "Có thể thay toàn bộ nội dung sau không?",
    a: "Có. Toàn bộ nội dung đang là dữ liệu mẫu, bạn có thể chỉnh trong từng component.",
  },
  {
    id: "ho-tro-mobile-tot-khong",
    q: "Hỗ trợ mobile tốt không?",
    a: "Có. Giao diện responsive, có menu mobile và tối ưu hiển thị trên mọi kích thước màn hình.",
  },
  {
    id: "co-can-cai-them-thu-vien-ui-khong",
    q: "Có cần cài thêm thư viện UI không?",
    a: "Không. Toàn bộ style dùng Tailwind CSS, không phụ thuộc thư viện UI bên ngoài.",
  },
  {
    id: "deploy-len-dau-duoc",
    q: "Deploy lên đâu được?",
    a: "Next.js có thể deploy lên Vercel, Netlify, hoặc bất kỳ hosting hỗ trợ Node.js / static export.",
  },
];

export function normalizeFaqs(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const faq = item as Record<string, unknown>;
      if (typeof faq.q !== "string" || typeof faq.a !== "string") return null;
      const q = repairMojibake(faq.q).trim();
      const a = repairMojibake(faq.a).trim();
      if (!q || !a) return null;
      const id =
        typeof faq.id === "string" && faq.id.trim()
          ? slugify(repairMojibake(faq.id))
          : slugify(q);
      return { id: id || slugify(q), q, a };
    })
    .filter((item): item is FaqItem => Boolean(item));
}

