import { ArticleBlock, isArticleBlocks } from "@/lib/articleBlocks";
import { markdownToHtml } from "@/lib/markdown";
import ArticleSectionHeader from "@/components/article/ArticleSectionHeader";
import ArticleList from "@/components/article/ArticleList";
import ArticleTable from "@/components/article/ArticleTable";
import ArticleNote from "@/components/article/ArticleNote";

export default function ArticleRenderer({ content }: { content: string | ArticleBlock[] }) {
  if (!isArticleBlocks(content)) {
    const html = markdownToHtml(content || "");
    return (
      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:text-white prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-3xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-2xl prose-h4:mb-3 prose-h4:mt-7 prose-h4:text-xl prose-h4:text-[#F5D76E] prose-p:my-3 prose-p:leading-8 prose-p:text-[#C8D1DE] prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-li:leading-8 prose-li:text-[#C8D1DE]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="mt-10">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <div key={index} className="my-3">
                {block.text.trim() && (
                  <p className="whitespace-pre-line leading-8 text-[#C8D1DE]">
                    {block.text}
                  </p>
                )}
                {(block.images ?? []).length > 0 && (
                  <div className={(block.images ?? []).length === 1 ? "mt-4" : "mt-4 grid gap-3 sm:grid-cols-2"}>
                    {(block.images ?? []).map((image, imageIndex) => (
                      <div
                        key={`${image.slice(0, 24)}-${imageIndex}`}
                        className={
                          (block.images ?? []).length === 1
                            ? "mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-[#131722] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                            : "overflow-hidden rounded-xl border border-white/10 bg-[#131722]"
                        }
                      >
                        <img
                          src={image}
                          alt={`Hình minh họa ${imageIndex + 1}`}
                          className={
                            (block.images ?? []).length === 1
                              ? "h-auto w-full object-contain"
                              : "h-auto w-full object-cover"
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          case "section":
            return <ArticleSectionHeader key={index}>{block.title}</ArticleSectionHeader>;
          case "list":
            return <ArticleList key={index} items={block.items} />;
          case "table":
            return <ArticleTable key={index} headers={block.headers} rows={block.rows} />;
          case "note":
            return <ArticleNote key={index} content={block.text} />;
          case "spacer": {
            const sizes = {
              sm: "h-4",
              md: "h-8",
              lg: "h-12",
            } as const;
            return <div key={index} className={sizes[block.size || "md"]} />;
          }
          default:
            return null;
        }
      })}
    </div>
  );
}

