"use client";

import { DEFAULT_FAQS } from "@/lib/faqContent";

export default function FaqSection() {
  const faqs = DEFAULT_FAQS;
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
