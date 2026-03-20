"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleRenderer from "@/components/article/ArticleRenderer";
import BlockEditor from "@/components/article/editor/BlockEditor";
import { Article, NEWS_STORAGE_KEY, repairMojibake, slugify } from "@/lib/articleContent";
import { ArticleBlock, contentToBlocks, createBlock, isArticleBlocks } from "@/lib/articleBlocks";
import { usePersistedAdmin } from "@/hooks/usePersistedAdmin";

const DEFAULT_ARTICLES: Article[] = [
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

const SYNC_MESSAGE_TYPE = "xocdia-news-sync";

type ArticleMetaForm = {
  title: string;
  description: string;
  slug: string;
};

function repairArticleBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
  return blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        return { ...block, text: repairMojibake(block.text) };
      case "section":
        return { ...block, title: repairMojibake(block.title) };
      case "list":
        return { ...block, items: block.items.map((item) => repairMojibake(item)) };
      case "table":
        return {
          ...block,
          headers: block.headers.map((header) => repairMojibake(header)),
          rows: block.rows.map((row) => row.map((cell) => repairMojibake(cell))),
        };
      case "note":
        return { ...block, text: repairMojibake(block.text) };
      case "spacer":
        return block;
    }
  });
}

function normalizeArticles(raw: unknown): Article[] {
  if (!Array.isArray(raw)) return [];
  const valid = raw.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const article = item as Record<string, unknown>;
    const validContent = typeof article.content === "string" || isArticleBlocks(article.content);
    return (
      typeof article.slug === "string" &&
      typeof article.title === "string" &&
      typeof article.description === "string" &&
      validContent
    );
  }) as Article[];

  const repaired = valid.map((article) => ({
    ...article,
    title: repairMojibake(article.title),
    description: repairMojibake(article.description),
    content:
      typeof article.content === "string"
        ? repairMojibake(article.content)
        : repairArticleBlocks(article.content),
  }));

  return repaired;
}

function loadArticlesFromStorage(): Article[] {
  if (typeof window === "undefined") return DEFAULT_ARTICLES;
  try {
    const raw = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!raw) return DEFAULT_ARTICLES;
    const normalized = normalizeArticles(JSON.parse(raw));
    if (normalized.length === 0) return DEFAULT_ARTICLES;
    const normalizedJson = JSON.stringify(normalized);
    if (normalizedJson !== raw) {
      localStorage.setItem(NEWS_STORAGE_KEY, normalizedJson);
    }
    return normalized;
  } catch {
    return DEFAULT_ARTICLES;
  }
}

function persistArticles(next: Article[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(next));
}

function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

async function downscaleImageDataUrl(
  dataUrl: string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.78
): Promise<string> {
  if (typeof window === "undefined" || !dataUrl.startsWith("data:image/")) return dataUrl;

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Cannot load image"));
    img.src = dataUrl;
  });

  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const targetWidth = Math.max(1, Math.round(image.width * ratio));
  const targetHeight = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/jpeg", quality);
}

async function optimizeArticlesForStorage(next: Article[]): Promise<Article[]> {
  const optimized: Article[] = [];

  for (const article of next) {
    if (!isArticleBlocks(article.content)) {
      optimized.push(article);
      continue;
    }

    const blocks: ArticleBlock[] = [];
    for (const block of article.content) {
      if (block.type !== "paragraph" || !block.images || block.images.length === 0) {
        blocks.push(block);
        continue;
      }

      const keepTop = block.images.slice(0, 6);
      const compressedImages: string[] = [];
      for (const image of keepTop) {
        try {
          const compressed = await downscaleImageDataUrl(image);
          compressedImages.push(compressed);
        } catch {
          compressedImages.push(image);
        }
      }
      blocks.push({ ...block, images: compressedImages });
    }

    optimized.push({ ...article, content: blocks });
  }

  return optimized;
}

type PersistResult = {
  ok: boolean;
  articles: Article[];
  mode: "normal" | "compressed" | "without-images" | "failed";
};

async function persistArticlesSafely(next: Article[]): Promise<PersistResult> {
  if (typeof window === "undefined") return { ok: false, articles: next, mode: "failed" };

  try {
    persistArticles(next);
    return { ok: true, articles: next, mode: "normal" };
  } catch (error) {
    if (!isQuotaExceededError(error)) return { ok: false, articles: next, mode: "failed" };
  }

  try {
    const compressed = await optimizeArticlesForStorage(next);
    persistArticles(compressed);
    return { ok: true, articles: compressed, mode: "compressed" };
  } catch (error) {
    if (!isQuotaExceededError(error)) return { ok: false, articles: next, mode: "failed" };
  }

  try {
    const withoutImages = next.map((article) => {
      if (!isArticleBlocks(article.content)) return article;
      const blocks = article.content.map((block) =>
        block.type === "paragraph" ? { ...block, images: [] } : block
      );
      return { ...article, content: blocks };
    });
    persistArticles(withoutImages);
    return { ok: true, articles: withoutImages, mode: "without-images" };
  } catch {
    return { ok: false, articles: next, mode: "failed" };
  }
}

function getArticleCoverImage(article: Pick<Article, "slug" | "title">): string | null {
  const normalized = `${article.slug} ${article.title}`.toLowerCase();
  if (
    normalized.includes("huong-dan-tao-tai-khoan") ||
    normalized.includes("hướng dẫn tạo tài khoản")
  ) {
    return "/image/huongdantaotaikhoan.png";
  }
  if (
    normalized.includes("nap-rut-sieu-toc") ||
    normalized.includes("nạp/rút siêu tốc") ||
    normalized.includes("nap/rut sieu toc")
  ) {
    return "/image/naprutsieutoc.png";
  }
  if (
    normalized.includes("uu-dai-thanh-vien") ||
    normalized.includes("ưu đãi thành viên")
  ) {
    return "/image/cachnhanuudai.png";
  }
  if (
    normalized.includes("dang-nhap") ||
    normalized.includes("đăng nhập")
  ) {
    return "/image/cachdangnhapantoanvanhanhchong.png";
  }
  if (
    normalized.includes("cskh") ||
    normalized.includes("liên hệ") ||
    normalized.includes("chăm sóc khách hàng")
  ) {
    return "/image/cskh.png";
  }
  return null;
}

function NewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug");
  const mode = searchParams.get("mode");
  const persistedAdmin = usePersistedAdmin();
  const isAdmin = searchParams.get("admin") === "1" || persistedAdmin;
  const openEditFromQuery = searchParams.get("edit") === "1";

  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [ready, setReady] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const [exportJson, setExportJson] = useState("");

  const [metaForm, setMetaForm] = useState<ArticleMetaForm>({
    title: "",
    description: "",
    slug: "",
  });
  const [blocks, setBlocks] = useState<ArticleBlock[]>([createBlock("paragraph")]);

  useEffect(() => {
    setArticles(loadArticlesFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data || event.data.type !== SYNC_MESSAGE_TYPE) return;
      const incoming = normalizeArticles(event.data.payload);
      if (incoming.length === 0) {
        setSaveNote("Không tìm thấy dữ liệu hợp lệ để đồng bộ từ origin cũ.");
        return;
      }
      const result = await persistArticlesSafely(incoming);
      if (!result.ok) {
        setSaveNote("Đồng bộ thất bại: bộ nhớ trình duyệt hiện tại đã đầy.");
        return;
      }
      setArticles(result.articles);
      if (result.mode === "compressed") {
        setSaveNote("Đồng bộ xong (ảnh đã tự nén để vừa dung lượng).");
      } else if (result.mode === "without-images") {
        setSaveNote("Đồng bộ xong nhưng ảnh quá nhiều nên đã bỏ ảnh để lưu.");
      } else {
        setSaveNote("Đồng bộ dữ liệu thành công từ Chrome cũ.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (mode !== "sync-export") return;
    const target = searchParams.get("target");
    let payload: unknown[] = [];
    try {
      const raw = localStorage.getItem(NEWS_STORAGE_KEY);
      payload = raw ? JSON.parse(raw) : [];
      setExportJson(JSON.stringify(payload, null, 2));
      if (target && window.opener) {
        window.opener.postMessage({ type: SYNC_MESSAGE_TYPE, payload }, target);
      }
    } catch {
      setExportJson("[]");
      if (target && window.opener) {
        window.opener.postMessage({ type: SYNC_MESSAGE_TYPE, payload: [] }, target);
      }
    }
  }, [mode, searchParams]);

  const currentArticle = useMemo(() => {
    if (!slug) return null;
    return articles.find((item) => item.slug === slug) ?? null;
  }, [slug, articles]);

  const handleSyncFromAnotherPort = () => {
    if (typeof window === "undefined") return;
    const currentOrigin = window.location.origin;
    const fromOrigin = window.prompt(
      "Nhập origin Chrome cũ cần đồng bộ (ví dụ: http://localhost:3000)",
      "http://localhost:3000"
    );
    if (!fromOrigin) return;

    const popupUrl = `${fromOrigin}/news?mode=sync-export&target=${encodeURIComponent(currentOrigin)}`;
    const popup = window.open(
      popupUrl,
      "xocdia-news-sync",
      "width=680,height=720,menubar=no,toolbar=no,location=yes,status=no"
    );
    if (!popup) {
      setSaveNote("Trình duyệt chặn popup. Hãy cho phép popup và thử lại.");
      return;
    }
    setSaveNote("Đang đồng bộ dữ liệu từ origin cũ...");
  };

  const applyImportedArticles = async (incoming: unknown) => {
    const normalized = normalizeArticles(incoming);
    if (normalized.length === 0) {
      setSaveNote("Không có dữ liệu hợp lệ để nhập.");
      return;
    }
    const result = await persistArticlesSafely(normalized);
    if (!result.ok) {
      setSaveNote("Nhập dữ liệu thất bại: bộ nhớ trình duyệt hiện tại đã đầy.");
      return;
    }
    setArticles(result.articles);
    if (result.mode === "compressed") {
      setSaveNote("Đã nhập dữ liệu (ảnh tự nén để vừa dung lượng).");
    } else if (result.mode === "without-images") {
      setSaveNote("Đã nhập dữ liệu nhưng ảnh quá nhiều nên đã bỏ ảnh để lưu.");
    } else {
      setSaveNote("Đã nhập dữ liệu thành công.");
    }
  };

  const handleExportJson = async () => {
    try {
      const text = JSON.stringify(articles, null, 2);
      await navigator.clipboard.writeText(text);
      setSaveNote("Đã copy dữ liệu JSON vào clipboard.");
    } catch {
      setSaveNote("Không copy được clipboard. Hãy dùng /news?mode=sync-export để copy thủ công.");
    }
  };

  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setSaveNote("Clipboard đang trống.");
        return;
      }
      await applyImportedArticles(JSON.parse(text));
    } catch {
      setSaveNote("Không đọc được clipboard hoặc JSON không hợp lệ.");
    }
  };

  useEffect(() => {
    if (mode === "write") {
      setEditOpen(false);
      setMetaForm({ title: "", description: "", slug: "" });
      setBlocks([createBlock("section"), createBlock("paragraph")]);
      return;
    }

    if (currentArticle) {
      setMetaForm({
        title: currentArticle.title,
        description: currentArticle.description,
        slug: currentArticle.slug,
      });
      setBlocks(contentToBlocks(currentArticle.content));
    }
  }, [mode, currentArticle]);

  useEffect(() => {
    if (!openEditFromQuery || !isAdmin || !currentArticle) return;
    setEditOpen(true);
  }, [openEditFromQuery, isAdmin, currentArticle]);

  const handleCreate = async () => {
    const finalSlug = slugify(metaForm.slug || metaForm.title);
    if (!finalSlug || !metaForm.title.trim()) {
      setSaveNote("Thiếu tiêu đề hoặc slug.");
      return;
    }
    if (blocks.length === 0) {
      setSaveNote("Nội dung đang trống.");
      return;
    }
    if (articles.some((item) => item.slug === finalSlug)) {
      setSaveNote("Slug đã tồn tại, vui lòng đổi slug.");
      return;
    }

    setSaving(true);
    const nextArticle: Article = {
      slug: finalSlug,
      title: metaForm.title.trim(),
      description: metaForm.description.trim(),
      content: blocks,
    };
    const next = [nextArticle, ...articles];
    const result = await persistArticlesSafely(next);
    if (!result.ok) {
      setSaving(false);
      setSaveNote("Lưu thất bại: dung lượng bộ nhớ trình duyệt đã đầy.");
      return;
    }
    setArticles(result.articles);
    setSaving(false);
    if (result.mode === "compressed") {
      setSaveNote("Đã đăng bài mới (ảnh đã tự nén để vừa dung lượng).");
    } else if (result.mode === "without-images") {
      setSaveNote("Đã đăng bài, nhưng ảnh quá nhiều nên đã bỏ ảnh để lưu được.");
    } else {
      setSaveNote("Đã đăng bài mới.");
    }
    router.push(`/news?slug=${encodeURIComponent(finalSlug)}${isAdmin ? "&admin=1" : ""}`);
  };

  const handleUpdate = async () => {
    if (!currentArticle) return;
    if (!metaForm.title.trim()) {
      setSaveNote("Tiêu đề không được để trống.");
      return;
    }
    if (blocks.length === 0) {
      setSaveNote("Nội dung đang trống.");
      return;
    }

    setSaving(true);
    const next = articles.map((item) =>
      item.slug === currentArticle.slug
        ? {
            ...item,
            title: metaForm.title.trim(),
            description: metaForm.description.trim(),
            content: blocks,
          }
        : item
    );
    const result = await persistArticlesSafely(next);
    if (!result.ok) {
      setSaving(false);
      setSaveNote("Lưu thất bại: dung lượng bộ nhớ trình duyệt đã đầy.");
      return;
    }
    setArticles(result.articles);
    setSaving(false);
    setEditOpen(false);
    if (openEditFromQuery && currentArticle) {
      router.replace(
        `/news?slug=${encodeURIComponent(currentArticle.slug)}${isAdmin ? "&admin=1" : ""}`
      );
    }
    if (result.mode === "compressed") {
      setSaveNote("Đã lưu thay đổi (ảnh đã tự nén để vừa dung lượng).");
    } else if (result.mode === "without-images") {
      setSaveNote("Đã lưu thay đổi, nhưng ảnh quá nhiều nên đã bỏ ảnh để lưu được.");
    } else {
      setSaveNote("Đã lưu thay đổi.");
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F1115]">
        <p className="text-[#A7B0BE]">Đang tải...</p>
      </main>
    );
  }

  if (mode === "sync-export") {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-lg font-semibold text-[#F5D76E]">Xuất dữ liệu đồng bộ</p>
          <p className="mt-2 text-sm text-[#A7B0BE]">
            Nếu popup tự đồng bộ không chạy, hãy copy JSON này rồi qua tab/port mới bấm &quot;Nhập từ clipboard&quot;.
          </p>
          <textarea
            readOnly
            value={exportJson}
            rows={14}
            className="mt-4 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-xs leading-6 text-[#C8D1DE]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(exportJson || "[]");
                } catch {
                  // ignore
                }
              }}
              className="rounded-lg border border-[#D4AF37]/50 bg-[#171A21] px-3 py-1.5 text-sm font-semibold text-[#F5D76E]"
            >
              Copy JSON
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              className="rounded-lg border border-white/15 bg-[#171A21] px-3 py-1.5 text-sm text-[#C8D1DE]"
            >
              Đóng
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (mode === "write" && isAdmin) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link href={isAdmin ? "/news?admin=1" : "/news"} className="text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
              ← Quay lại tin tức
            </Link>
            <h1 className="text-2xl font-black text-white md:text-3xl">Viết bài viết mới</h1>
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">Tiêu đề</label>
              <input
                value={metaForm.title}
                onChange={(e) => setMetaForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">Slug URL</label>
              <input
                value={metaForm.slug}
                onChange={(e) => setMetaForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
                placeholder="tu-dong-tao-neu-bo-trong"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#A7B0BE]">Mô tả ngắn</label>
            <textarea
              value={metaForm.description}
              onChange={(e) => setMetaForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 leading-7 text-[#C8D1DE]"
            />
          </div>

          <BlockEditor
            blocks={blocks}
            onChange={setBlocks}
            saveActionLabel="Đăng bài viết"
            onSave={handleCreate}
            saving={saving}
          />

          {saveNote && <p className="text-sm text-emerald-400">{saveNote}</p>}
        </section>
      </main>
    );
  }

  if (slug && !currentArticle) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <Link href={isAdmin ? "/news?admin=1" : "/news"} className="inline-block text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
            ← Quay lại tin tức
          </Link>
          <p className="mt-8 text-[#A7B0BE]">Không tìm thấy bài viết.</p>
        </div>
      </main>
    );
  }

  if (currentArticle) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <article className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link href={isAdmin ? "/news?admin=1" : "/news"} className="text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
              ← Quay lại tin tức
            </Link>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (editOpen) {
                    setEditOpen(false);
                    if (openEditFromQuery && currentArticle) {
                      router.replace(
                        `/news?slug=${encodeURIComponent(currentArticle.slug)}${isAdmin ? "&admin=1" : ""}`
                      );
                    }
                  } else {
                    setEditOpen(true);
                  }
                }}
                className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20"
              >
                {editOpen ? "Đóng sửa" : "Sửa nội dung"}
              </button>
            )}
          </div>

          {isAdmin && editOpen && (
            <>
              <div className="mb-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#A7B0BE]">Tiêu đề</label>
                  <input
                    value={metaForm.title}
                    onChange={(e) => setMetaForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7B0BE]">Mô tả ngắn</label>
                  <input
                    value={metaForm.description}
                    onChange={(e) => setMetaForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
                  />
                </div>
              </div>
              <BlockEditor
                blocks={blocks}
                onChange={setBlocks}
                saveActionLabel="Lưu thay đổi"
                onSave={handleUpdate}
                saving={saving}
              />
            </>
          )}

          {saveNote && <p className="mb-4 text-sm text-emerald-400">{saveNote}</p>}
          <h1 className="text-3xl font-black text-white md:text-4xl">{currentArticle.title}</h1>
          {currentArticle.description && (
            <p className="mt-4 text-xl leading-8 text-[#A7B0BE]">{currentArticle.description}</p>
          )}
          <ArticleRenderer content={currentArticle.content} />
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Link
                href="/#news"
                className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]"
              >
                ‹ Quay lại
              </Link>
              <span className="text-[10px] text-white/20">·</span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Cẩm nang</span>
            </div>
            <h1 className="text-3xl font-black text-white md:text-4xl">Tân Thủ XOCDIA88</h1>
          </div>
          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSyncFromAnotherPort}
                className="rounded-xl border border-white/15 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#C9D0DC] transition hover:border-[#D4AF37]/35 hover:text-[#F5D76E]"
              >
                Đồng bộ từ Chrome cũ
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="rounded-xl border border-white/15 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#C9D0DC] transition hover:border-[#D4AF37]/35 hover:text-[#F5D76E]"
              >
                Xuất dữ liệu
              </button>
              <button
                type="button"
                onClick={handleImportFromClipboard}
                className="rounded-xl border border-white/15 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#C9D0DC] transition hover:border-[#D4AF37]/35 hover:text-[#F5D76E]"
              >
                Nhập từ clipboard
              </button>
              <Link
                href="/news?mode=write&admin=1"
                className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20"
              >
                Viết bài viết
              </Link>
            </div>
          )}
        </div>
        {saveNote && <p className="mb-5 text-sm text-emerald-400">{saveNote}</p>}

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-[28px] border border-white/8 bg-[#171A21] transition hover:border-[#D4AF37]/25"
            >
              <div className="relative h-48 md:h-56 w-full bg-gradient-to-br from-[#2A2110] via-[#171A21] to-[#0F1115]">
                {getArticleCoverImage(item) ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getArticleCoverImage(item)})` }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,215,110,0.08),transparent_40%)]" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-black text-[#F5D76E] md:text-2xl">{item.title}</h2>
                <p className="mt-3 line-clamp-3 leading-7 text-[#A7B0BE]">{item.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Link
                    href={`/news?slug=${encodeURIComponent(item.slug)}${isAdmin ? "&admin=1" : ""}`}
                    className="inline-block text-sm font-bold text-[#D4AF37] transition hover:text-[#F5D76E]"
                  >
                    Xem thêm →
                  </Link>
                  {isAdmin ? (
                    <Link
                      href={`/news?slug=${encodeURIComponent(item.slug)}&admin=1&edit=1`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C9A227]/90 transition hover:text-[#F5D76E]"
                      title="Sửa bài viết"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Sửa
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0F1115] flex items-center justify-center">
          <p className="text-[#A7B0BE]">Đang tải...</p>
        </main>
      }
    >
      <NewsContent />
    </Suspense>
  );
}



