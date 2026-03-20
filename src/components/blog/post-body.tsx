import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostBodyProps {
  markdown: string;
}

/**
 * Renders Notion → markdown in the app shell. Styles mirror readable article layout without @tailwindcss/typography.
 */
export function PostBody({ markdown }: PostBodyProps) {
  return (
    <article
      className={[
        "max-w-none text-[17px] leading-relaxed text-foreground",
        "[&_h1]:mt-10 [&_h1]:scroll-m-20 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight",
        "[&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:scroll-m-20 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
        "[&_h4]:mt-8 [&_h4]:text-lg [&_h4]:font-semibold",
        "[&_p]:mt-4 [&_p]:leading-7",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_strong]:font-semibold",
        "[&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2",
        "[&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2",
        "[&_li]:pl-1",
        "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_code]:relative [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-sm",
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:text-sm",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_hr]:my-8 [&_hr]:border-border",
        "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-md [&_table]:border [&_table]:border-border",
        "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
        "[&_img]:my-4 [&_img]:max-h-[480px] [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border",
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
