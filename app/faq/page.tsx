"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/lib/articleContent";
import { usePersistedAdmin } from "@/hooks/usePersistedAdmin";
import { DEFAULT_FAQS, FAQ_STORAGE_KEY, FaqItem, normalizeFaqs } from "@/lib/faqContent";

const SYNC_MESSAGE_TYPE = "xocdia-faq-sync";

type FaqForm = {
  q: string;
  a: string;
  id: string;
};

function loadFaqsFromStorage(): FaqItem[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(FAQ_STORAGE_KEY);
    if (!raw) return DEFAULT_FAQS;
    const normalized = normalizeFaqs(JSON.parse(raw));
    if (normalized.length === 0) return DEFAULT_FAQS;
    const normalizedJson = JSON.stringify(normalized);
    if (normalizedJson !== raw) {
      localStorage.setItem(FAQ_STORAGE_KEY, normalizedJson);
    }
    return normalized;
  } catch {
    return DEFAULT_FAQS;
  }
}

function persistFaqs(next: FaqItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(next));
}

function FaqContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const persistedAdmin = usePersistedAdmin();
  const isAdmin = searchParams.get("admin") === "1" || persistedAdmin;

  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const [exportJson, setExportJson] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<FaqForm>({ q: "", a: "", id: "" });

  useEffect(() => {
    setFaqs(loadFaqsFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== SYNC_MESSAGE_TYPE) return;
      const incoming = normalizeFaqs(event.data.payload);
      if (incoming.length === 0) {
        setSaveNote("Không tìm thấy dữ liệu FAQ hợp lệ để đồng bộ.");
        return;
      }
      persistFaqs(incoming);
      setFaqs(incoming);
      setSaveNote("Đồng bộ FAQ thành công từ Chrome cũ.");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (mode !== "sync-export") return;
    const target = searchParams.get("target");
    let payload: unknown[] = [];
    try {
      const raw = localStorage.getItem(FAQ_STORAGE_KEY);
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

  const currentFaq = useMemo(() => {
    if (!id) return null;
    return faqs.find((item) => item.id === id) ?? null;
  }, [id, faqs]);

  useEffect(() => {
    if (mode === "write") {
      setEditOpen(true);
      setForm({ q: "", a: "", id: "" });
      return;
    }
    if (currentFaq) {
      setForm({ q: currentFaq.q, a: currentFaq.a, id: currentFaq.id });
    }
  }, [mode, currentFaq]);

  const handleSyncFromAnotherPort = () => {
    if (typeof window === "undefined") return;
    const currentOrigin = window.location.origin;
    const fromOrigin = window.prompt(
      "Nhập origin Chrome cũ cần đồng bộ FAQ (ví dụ: http://localhost:3000)",
      "http://localhost:3000"
    );
    if (!fromOrigin) return;
    const popupUrl = `${fromOrigin}/faq?mode=sync-export&target=${encodeURIComponent(currentOrigin)}`;
    const popup = window.open(
      popupUrl,
      "xocdia-faq-sync",
      "width=680,height=720,menubar=no,toolbar=no,location=yes,status=no"
    );
    if (!popup) {
      setSaveNote("Trình duyệt chặn popup. Hãy cho phép popup và thử lại.");
      return;
    }
    setSaveNote("Đang đồng bộ FAQ từ origin cũ...");
  };

  const handleExportJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(faqs, null, 2));
      setSaveNote("Đã copy dữ liệu FAQ JSON vào clipboard.");
    } catch {
      setSaveNote("Không copy được clipboard. Hãy dùng /faq?mode=sync-export để copy thủ công.");
    }
  };

  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setSaveNote("Clipboard đang trống.");
        return;
      }
      const incoming = normalizeFaqs(JSON.parse(text));
      if (incoming.length === 0) {
        setSaveNote("Không có dữ liệu FAQ hợp lệ để nhập.");
        return;
      }
      persistFaqs(incoming);
      setFaqs(incoming);
      setSaveNote("Đã nhập dữ liệu FAQ thành công.");
    } catch {
      setSaveNote("Không đọc được clipboard hoặc JSON không hợp lệ.");
    }
  };

  const handleCreate = () => {
    const q = form.q.trim();
    const a = form.a.trim();
    const nextId = slugify(form.id || form.q);
    if (!q || !a || !nextId) {
      setSaveNote("Vui lòng nhập đầy đủ câu hỏi, trả lời và ID.");
      return;
    }
    if (faqs.some((item) => item.id === nextId)) {
      setSaveNote("ID FAQ đã tồn tại, vui lòng đổi ID.");
      return;
    }
    setSaving(true);
    const next = [...faqs, { id: nextId, q, a }];
    persistFaqs(next);
    setFaqs(next);
    setSaving(false);
    setSaveNote("Đã thêm FAQ mới.");
    router.push(`/faq?id=${encodeURIComponent(nextId)}${isAdmin ? "&admin=1" : ""}`);
  };

  const handleUpdate = () => {
    if (!currentFaq) return;
    const q = form.q.trim();
    const a = form.a.trim();
    if (!q || !a) {
      setSaveNote("Câu hỏi và câu trả lời không được để trống.");
      return;
    }
    setSaving(true);
    const next = faqs.map((item) => (item.id === currentFaq.id ? { ...item, q, a } : item));
    persistFaqs(next);
    setFaqs(next);
    setSaving(false);
    setEditOpen(false);
    setSaveNote("Đã lưu thay đổi FAQ.");
  };

  const handleDelete = () => {
    if (!currentFaq) return;
    const ok = window.confirm("Bạn có chắc muốn xóa FAQ này không?");
    if (!ok) return;
    const next = faqs.filter((item) => item.id !== currentFaq.id);
    persistFaqs(next.length > 0 ? next : DEFAULT_FAQS);
    setFaqs(next.length > 0 ? next : DEFAULT_FAQS);
    setSaveNote("Đã xóa FAQ.");
    router.push(isAdmin ? "/faq?admin=1" : "/faq");
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
          <p className="text-lg font-semibold text-[#F5D76E]">Xuất dữ liệu đồng bộ FAQ</p>
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
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link href="/faq?admin=1" className="text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
              ← Quay lại FAQ
            </Link>
            <h1 className="text-2xl font-black text-white md:text-3xl">Viết FAQ mới</h1>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#171A21] p-5">
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">Câu hỏi</label>
              <input
                value={form.q}
                onChange={(e) => setForm((prev) => ({ ...prev, q: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">ID URL</label>
              <input
                value={form.id}
                onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
                placeholder="tu-dong-tao-neu-bo-trong"
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A7B0BE]">Câu trả lời</label>
              <textarea
                value={form.a}
                onChange={(e) => setForm((prev) => ({ ...prev, a: e.target.value }))}
                rows={6}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 leading-7 text-[#C8D1DE]"
              />
            </div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20 disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Đăng FAQ"}
            </button>
          </div>
          {saveNote && <p className="mt-4 text-sm text-emerald-400">{saveNote}</p>}
        </section>
      </main>
    );
  }

  if (id && !currentFaq) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <Link href={isAdmin ? "/faq?admin=1" : "/faq"} className="inline-block text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
            ← Quay lại FAQ
          </Link>
          <p className="mt-8 text-[#A7B0BE]">Không tìm thấy FAQ.</p>
        </div>
      </main>
    );
  }

  if (currentFaq) {
    return (
      <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href={isAdmin ? "/faq?admin=1" : "/faq"} className="text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]">
              ← Quay lại FAQ
            </Link>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen((prev) => !prev)}
                  className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20"
                >
                  {editOpen ? "Đóng sửa" : "Sửa nội dung"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl border border-rose-400/40 bg-[#171A21] px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10"
                >
                  Xóa FAQ
                </button>
              </div>
            )}
          </div>

          {isAdmin && editOpen && (
            <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-[#171A21] p-5">
              <div>
                <label className="block text-xs font-medium text-[#A7B0BE]">Câu hỏi</label>
                <input
                  value={form.q}
                  onChange={(e) => setForm((prev) => ({ ...prev, q: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 text-[#F5F7FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7B0BE]">Câu trả lời</label>
                <textarea
                  value={form.a}
                  onChange={(e) => setForm((prev) => ({ ...prev, a: e.target.value }))}
                  rows={7}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#10151E] px-3 py-2 leading-7 text-[#C8D1DE]"
                />
              </div>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )}

          {saveNote && <p className="mb-4 text-sm text-emerald-400">{saveNote}</p>}
          <h1 className="text-3xl font-black text-white md:text-4xl">{currentFaq.q}</h1>
          <p className="mt-5 rounded-2xl border border-white/8 bg-[#171A21] p-5 leading-8 text-[#C8D1DE]">
            {currentFaq.a}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F5F7FA]">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">FAQ</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">Câu hỏi thường gặp</h1>
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
                href="/faq?mode=write&admin=1"
                className="rounded-xl border border-[#D4AF37]/50 bg-[#171A21] px-4 py-2 text-sm font-semibold text-[#F5D76E] transition hover:bg-[#D4AF37]/20"
              >
                Viết FAQ
              </Link>
            </div>
          )}
        </div>

        {saveNote && <p className="mb-4 text-sm text-emerald-400">{saveNote}</p>}

        <div className="space-y-3">
          {faqs.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/8 bg-[#171A21] p-5">
              <h2 className="text-lg font-black text-[#F5D76E]">{item.q}</h2>
              <p className="mt-2 leading-7 text-[#A7B0BE]">{item.a}</p>
              <Link
                href={`/faq?id=${encodeURIComponent(item.id)}${isAdmin ? "&admin=1" : ""}`}
                className="mt-4 inline-block text-sm font-semibold text-[#D4AF37] hover:text-[#F5D76E]"
              >
                Sửa FAQ →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function FaqPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0F1115] flex items-center justify-center">
          <p className="text-[#A7B0BE]">Đang tải...</p>
        </main>
      }
    >
      <FaqContent />
    </Suspense>
  );
}

