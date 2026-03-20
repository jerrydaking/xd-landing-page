"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleRenderer from "@/components/article/ArticleRenderer";
import BlockEditor from "@/components/article/editor/BlockEditor";
import { Article, repairMojibake, slugify } from "@/lib/articleContent";
import { ArticleBlock, contentToBlocks, createBlock, isArticleBlocks } from "@/lib/articleBlocks";
import { usePersistedAdmin } from "@/hooks/usePersistedAdmin";

const GAME_GUIDES_STORAGE_KEY = "game-guides-v1";
const SYNC_MESSAGE_TYPE = "xocdia-game-guides-sync";

const GAME_OPTIONS = [
  { slug: "xoc-dia-online", title: "Xóc Đĩa Online" },
  { slug: "casino-truc-tuyen", title: "Casino Trực Tuyến" },
  { slug: "the-thao", title: "Thể Thao" },
  { slug: "ban-ca", title: "Bắn Cá" },
  { slug: "tai-xiu", title: "Tài Xỉu" },
  { slug: "no-hu", title: "Nổ Hũ" },
] as const;

type GuideArticle = Article & {
  game: string;
};

const DEFAULT_GUIDES: GuideArticle[] = [
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

type ArticleMetaForm = {
  title: string;
  description: string;
  slug: string;
  game: string;
};

function repairGuideBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
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

function normalizeGuides(raw: unknown): GuideArticle[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => {
      if (!item || typeof item !== "object") return false;
      const article = item as Record<string, unknown>;
      const validContent = typeof article.content === "string" || isArticleBlocks(article.content);
      return (
        typeof article.slug === "string" &&
        typeof article.title === "string" &&
        typeof article.description === "string" &&
        typeof article.game === "string" &&
        validContent
      );
    })
    .map((article) => {
      const item = article as GuideArticle;
      return {
        ...item,
        title: repairMojibake(item.title),
        description: repairMojibake(item.description),
        game: repairMojibake(item.game),
        content:
          typeof item.content === "string"
            ? repairMojibake(item.content)
            : repairGuideBlocks(item.content),
      };
    })
    .filter((item) => GAME_OPTIONS.some((option) => option.slug === item.game));
}

function loadGuidesFromStorage(): GuideArticle[] {
  if (typeof window === "undefined") return DEFAULT_GUIDES;
  try {
    const raw = localStorage.getItem(GAME_GUIDES_STORAGE_KEY);
    if (!raw) return DEFAULT_GUIDES;
    const normalized = normalizeGuides(JSON.parse(raw));
    if (normalized.length === 0) return DEFAULT_GUIDES;
    const normalizedJson = JSON.stringify(normalized);
    if (normalizedJson !== raw) {
      localStorage.setItem(GAME_GUIDES_STORAGE_KEY, normalizedJson);
    }
    return normalized;
  } catch {
    return DEFAULT_GUIDES;
  }
}

function persistGuides(next: GuideArticle[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GAME_GUIDES_STORAGE_KEY, JSON.stringify(next));
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

async function optimizeGuidesForStorage(next: GuideArticle[]): Promise<GuideArticle[]> {
  const optimized: GuideArticle[] = [];

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
  articles: GuideArticle[];
  mode: "normal" | "compressed" | "without-images" | "failed";
};

async function persistGuidesSafely(next: GuideArticle[]): Promise<PersistResult> {
  if (typeof window === "undefined") return { ok: false, articles: next, mode: "failed" };

  try {
    persistGuides(next);
    return { ok: true, articles: next, mode: "normal" };
  } catch (error) {
    if (!isQuotaExceededError(error)) return { ok: false, articles: next, mode: "failed" };
  }

  try {
    const compressed = await optimizeGuidesForStorage(next);
    persistGuides(compressed);
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
    persistGuides(withoutImages);
    return { ok: true, articles: withoutImages, mode: "without-images" };
  } catch {
    return { ok: false, articles: next, mode: "failed" };
  }
}

function GameGuidesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug");
  const mode = searchParams.get("mode");
  const game = searchParams.get("game");
  const persistedAdmin = usePersistedAdmin();
  const isAdmin = searchParams.get("admin") === "1" || persistedAdmin;

  const [articles, setArticles] = useState<GuideArticle[]>(DEFAULT_GUIDES);
  const [ready, setReady] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const [exportJson, setExportJson] = useState("");
  const [metaForm, setMetaForm] = useState<ArticleMetaForm>({
    title: "",
    description: "",
    slug: "",
    game: GAME_OPTIONS[0].slug,
  });
  const [blocks, setBlocks] = useState<ArticleBlock[]>([createBlock("paragraph")]);

  useEffect(() => {
    setArticles(loadGuidesFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data || event.data.type !== SYNC_MESSAGE_TYPE) return;
      const incoming = normalizeGuides(event.data.payload);
      if (incoming.length === 0) {
        setSaveNote("Không tìm thấy dữ liệu hợp lệ để đồng bộ.");
        return;
      }
      const result = await persistGuidesSafely(incoming);
      if (!result.ok) {
        setSaveNote("Đồng bộ thất bại: bộ nhớ trình duyệt hiện tại đã đầy.");
        return;
      }
      setArticles(result.articles);
      setSaveNote("Đồng bộ dữ liệu thành công từ Chrome cũ.");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (mode !== "sync-export") return;
    const target = searchParams.get("target");
    let payload: unknown[] = [];
    try {
      const raw = localStorage.getItem(GAME_GUIDES_STORAGE_KEY);
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

  const selectedGame = useMemo(
    () => GAME_OPTIONS.find((option) => option.slug === game) ?? null,
    [game]
  );

  const currentArticle = useMemo(() => {
    if (slug) {
      return articles.find((item) => item.slug === slug) ?? null;
    }
    if (mode === "write" || mode === "sync-export") return null;
    if (!selectedGame) return null;
    // Open latest article of the selected game directly (skip list view).
    return articles.find((item) => item.game === selectedGame.slug) ?? null;
  }, [slug, mode, selectedGame, articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedGame) return articles;
    return articles.filter((item) => item.game === selectedGame.slug);
  }, [articles, selectedGame]);

  const handleSyncFromAnotherPort = () => {
    if (typeof window === "undefined") return;
    const currentOrigin = window.location.origin;
    const fromOrigin = window.prompt(
      "Nhập origin Chrome cũ cần đồng bộ (ví dụ: http://localhost:3000)",
      "http://localhost:3000"
    );
    if (!fromOrigin) return;
    const popupUrl = `${fromOrigin}/game-guides?mode=sync-export&target=${encodeURIComponent(currentOrigin)}`;
    const popup = window.open(
      popupUrl,
      "xocdia-game-guides-sync",
      "width=680,height=720,menubar=no,toolbar=no,location=yes,status=no"
    );
    if (!popup) {
      setSaveNote("Trình duyệt chặn popup. Hãy cho phép popup và thử lại.");
      return;
    }
    setSaveNote("Đang đồng bộ dữ liệu từ origin cũ...");
  };

  const handleExportJson = async () => {
    try {
      const text = JSON.stringify(articles, null, 2);
      await navigator.clipboard.writeText(text);
      setSaveNote("Đã copy dữ liệu JSON vào clipboard.");
    } catch {
      setSaveNote("Không copy được clipboard. Hãy dùng /game-guides?mode=sync-export để copy thủ công.");
    }
  };

  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setSaveNote("Clipboard đang trống.");
        return;
      }
      const incoming = normalizeGuides(JSON.parse(text));
      if (incoming.length === 0) {
        setSaveNote("Không có dữ liệu hợp lệ để nhập.");
        return;
      }
      const result = await persistGuidesSafely(incoming);
      if (!result.ok) {
        setSaveNote("Nhập dữ liệu thất bại: bộ nhớ trình duyệt hiện tại đã đầy.");
        return;
      }
      setArticles(result.articles);
      setSaveNote("Đã nhập dữ liệu thành công.");
    } catch {
      setSaveNote("Không đọc được clipboard hoặc JSON không hợp lệ.");
    }
  };

  useEffect(() => {
    if (mode === "write") {
      setEditOpen(false);
      setMetaForm({
        title: "",
        description: "",
        slug: "",
        game: selectedGame?.slug ?? GAME_OPTIONS[0].slug,
      });
      setBlocks([createBlock("section"), createBlock("paragraph")]);
      return;
    }

    if (currentArticle) {
      setMetaForm({
        title: currentArticle.title,
        description: currentArticle.description,
        slug: currentArticle.slug,
        game: currentArticle.game,
      });
      setBlocks(contentToBlocks(currentArticle.content));
    }
  }, [mode, currentArticle, selectedGame]);

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
    if (!GAME_OPTIONS.some((item) => item.slug === metaForm.game)) {
      setSaveNote("Vui lòng chọn danh mục game hợp lệ.");
      return;
    }
    if (articles.some((item) => item.slug === finalSlug)) {
      setSaveNote("Slug đã tồn tại, vui lòng đổi slug.");
      return;
    }

    setSaving(true);
    const nextArticle: GuideArticle = {
      slug: finalSlug,
      game: metaForm.game,
      title: metaForm.title.trim(),
      description: metaForm.description.trim(),
      content: blocks,
    };
    const next = [nextArticle, ...articles];
    const result = await persistGuidesSafely(next);
    setSaving(false);
    if (!result.ok) {
      setSaveNote("Lưu thất bại: dung lượng bộ nhớ trình duyệt đã đầy.");
      return;
    }
    setArticles(result.articles);
    setSaveNote("Đã đăng bài mới.");
    const q = new URLSearchParams();
    q.set("slug", finalSlug);
    if (isAdmin) q.set("admin", "1");
    q.set("game", metaForm.game);
    router.push(`/game-guides?${q.toString()}`);
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
    if (!GAME_OPTIONS.some((item) => item.slug === metaForm.game)) {
      setSaveNote("Vui lòng chọn danh mục game hợp lệ.");
      return;
    }

    setSaving(true);
    const next = articles.map((item) =>
      item.slug === currentArticle.slug
        ? {
            ...item,
            game: metaForm.game,
            title: metaForm.title.trim(),
            description: metaForm.description.trim(),
            content: blocks,
          }
        : item
    );
    const result = await persistGuidesSafely(next);
    setSaving(false);
    if (!result.ok) {
      setSaveNote("Lưu thất bại: dung lượng bộ nhớ trình duyệt đã đầy.");
      return;
    }
    setArticles(result.articles);
    setEditOpen(false);
    setSaveNote("Đã lưu thay đổi.");
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
            Nếu popup tự đồng bộ không chạy, hãy copy JSON này rồi qua tab/port mới bấm
            &quot;Nhập từ clipboard&quot;.
          </p>
          <textarea
            readOnly
            value={exportJson}
            rows={14}
            className="mt-4 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-xs leading-6 text-[#C8D1DE]"
          />
        </div>
      </main>
    );
  }

  if (mode === "write" && isAdmin) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-1.5">
              <Link href="/#games" className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]">
                ‹ Quay lại
              </Link>
              {selectedGame && (
                <>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">{selectedGame.title}</span>
                </>
              )}
            </div>
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
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">Danh mục game</label>
              <select
                value={metaForm.game}
                onChange={(e) => setMetaForm((prev) => ({ ...prev, game: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
              >
                {GAME_OPTIONS.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">Mô tả ngắn</label>
              <textarea
                value={metaForm.description}
                onChange={(e) => setMetaForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 leading-7 text-[#C8D1DE]"
              />
            </div>
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
          <div className="flex items-center gap-1.5">
            <Link href="/#games" className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]">
              ‹ Quay lại
            </Link>
            <span className="text-[10px] text-white/20">·</span>
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Trò chơi nổi bật</span>
          </div>
          <p className="mt-8 text-[#A7B0BE]">Không tìm thấy bài viết.</p>
        </div>
      </main>
    );
  }

  if (currentArticle) {
    const gameTitle = GAME_OPTIONS.find((item) => item.slug === currentArticle.game)?.title;
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <article className="mx-auto max-w-4xl px-4 py-12">
          {isAdmin && (
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
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
              <button
                type="button"
                onClick={() => setEditOpen((prev) => !prev)}
                className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20"
              >
                {editOpen ? "Đóng sửa" : "Sửa nội dung"}
              </button>
            </div>
          )}

          <div className="mb-2 flex items-center gap-1.5">
            <Link
              href="/#games"
              className="text-[13px] font-medium text-white/50 transition hover:text-[#F5D76E]"
            >
              ‹ Quay lại
            </Link>
            {gameTitle && (
              <>
                <span className="text-[10px] text-white/20">·</span>
                <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">{gameTitle}</span>
              </>
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
                  <label className="block text-xs font-medium text-[#A7B0BE]">Danh mục game</label>
                  <select
                    value={metaForm.game}
                    onChange={(e) => setMetaForm((prev) => ({ ...prev, game: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
                  >
                    {GAME_OPTIONS.map((option) => (
                      <option key={option.slug} value={option.slug}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#A7B0BE]">Mô tả ngắn</label>
                <input
                  value={metaForm.description}
                  onChange={(e) => setMetaForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
                />
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Cẩm nang game</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
              {selectedGame ? `Tân Thủ ${selectedGame.title}` : "Tân Thủ XOCDIA88"}
            </h1>
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
                href={selectedGame ? `/game-guides?mode=write&game=${encodeURIComponent(selectedGame.slug)}&admin=1` : "/game-guides?mode=write&admin=1"}
                className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20"
              >
                Đăng bài
              </Link>
            </div>
          )}
        </div>
        {saveNote && <p className="mb-5 text-sm text-emerald-400">{saveNote}</p>}

        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#171A21] p-6">
            <p className="text-[#A7B0BE]">
              Chưa có bài viết cho mục này. Bấm <span className="font-semibold text-[#F5D76E]">Đăng bài</span> để tạo bài đầu tiên.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filteredArticles.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-[28px] border border-white/8 bg-[#171A21] transition hover:border-[#D4AF37]/25"
              >
                <div className="relative h-48 w-full bg-gradient-to-br from-[#2A2110] via-[#171A21] to-[#0F1115] md:h-56">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,215,110,0.08),transparent_40%)]" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-black text-[#F5D76E] md:text-2xl">{item.title}</h2>
                  <p className="mt-3 line-clamp-3 leading-7 text-[#A7B0BE]">{item.description}</p>
                  <Link
                    href={`/game-guides?slug=${encodeURIComponent(item.slug)}${isAdmin ? "&admin=1" : ""}${game ? `&game=${encodeURIComponent(game)}` : ""}`}
                    className="mt-5 inline-block text-sm font-bold text-[#D4AF37] transition hover:text-[#F5D76E]"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function GameGuidesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0F1115]">
          <p className="text-[#A7B0BE]">Đang tải...</p>
        </main>
      }
    >
      <GameGuidesContent />
    </Suspense>
  );
}

