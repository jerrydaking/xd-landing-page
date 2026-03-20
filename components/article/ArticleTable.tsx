export default function ArticleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (headers.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-[#D1D8E5]">
          <thead>
            <tr className="bg-gradient-to-r from-[#3A2A0E] via-[#2B2113] to-[#232024]">
              {headers.map((header, i) => (
                <th key={i} className="border-b border-[#D4AF37]/25 px-4 py-3 font-bold text-[#F5D76E]">
                  {header || `C?t ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-[#171C27]/60 even:bg-[#131722]/40 hover:bg-[#1E2330]">
                {headers.map((_, colIndex) => (
                  <td key={colIndex} className="border-b border-white/10 px-4 py-3 leading-7">
                    {row[colIndex] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

