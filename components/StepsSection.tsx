const steps = [
  {
    step: 1,
    title: "Dựng giao diện",
    desc: "Hoàn thiện layout, component và style theo đúng brand.",
  },
  {
    step: 2,
    title: "Thay nội dung",
    desc: "Cập nhật copy, ảnh và link theo nội dung thật.",
  },
  {
    step: 3,
    title: "Deploy lên hosting",
    desc: "Build và đưa site lên Vercel hoặc hosting của bạn.",
  },
];

export default function StepsSection() {
  return (
    <section id="steps" className="border-t border-white/5 bg-[#13171D] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Quy trình
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#F5F7FA] md:text-4xl">
            Từ giao diện đến website thật
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative rounded-[28px] border border-[#D4AF37]/15 bg-[#171A21] p-6 transition hover:border-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/5"
            >
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-full hidden h-px w-0 md:block" aria-hidden />
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] text-lg font-black text-[#0F1115]">
                {item.step}
              </div>
              <h3 className="mt-5 text-xl font-black text-[#F5D76E]">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#A7B0BE]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
