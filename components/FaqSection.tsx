 "use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_FAQS, FAQ_STORAGE_KEY, FaqItem, normalizeFaqs } from "@/lib/faqContent";

let cachedRaw: string | null | undefined;
let cachedFaqs: FaqItem[] = DEFAULT_FAQS;

function parseFaqs(raw: string | null): FaqItem[] {
  if (!raw) return DEFAULT_FAQS;
  try {
    const normalized = normalizeFaqs(JSON.parse(raw));
    return normalized.length > 0 ? normalized : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

function getFaqsSnapshot(): FaqItem[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  const raw = localStorage.getItem(FAQ_STORAGE_KEY);
  if (raw === cachedRaw) return cachedFaqs;
  cachedRaw = raw;
  cachedFaqs = parseFaqs(raw);
  return cachedFaqs;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === FAQ_STORAGE_KEY) onStoreChange();
  };
  const handleFocus = () => onStoreChange();
  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", handleFocus);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", handleFocus);
  };
}

export default function FaqSection() {
  const faqs = useSyncExternalStore(subscribe, getFaqsSnapshot, () => DEFAULT_FAQS);
  return (
    <section id="faq" className="border-t border-white/5 bg-[#13171D] py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#F5F7FA] md:text-4xl">
            Câu hỏi thường gặp
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-white/8 bg-[#171A21] transition hover:border-[#D4AF37]/20"
            >
              <summary className="cursor-pointer list-none px-6 py-4 text-left font-bold text-[#F5F7FA] transition hover:text-[#F5D76E] focus:outline-none [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="border-t border-white/5 px-6 pb-4 pt-2 leading-7 text-[#A7B0BE]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
