export default function ArticleList({ items }: { items: string[] }) {
  const filtered = items.map((item) => item.trim()).filter(Boolean);
  if (filtered.length === 0) return null;

  return (
    <ul className="my-5 list-disc space-y-2 pl-6 text-[#D1D8E5] marker:text-[#D4AF37]">
      {filtered.map((item, index) => (
        <li key={index} className="leading-8">{item}</li>
      ))}
    </ul>
  );
}

