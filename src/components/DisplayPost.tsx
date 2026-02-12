"use client";

import { useUserStore } from "@/store/userStore";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import type { OutputData, OutputBlockData } from "@editorjs/editorjs";

interface DisplayPostProps {
  content: OutputData;
}

export default function DisplayPost({ content }: DisplayPostProps) {
  const { settings, isAuthorized } = useUserStore();

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const typographyStyles = useMemo(() => {
    if (!isAuthorized || !settings) return "text-lg leading-relaxed";
    const sizeMap: Record<string, string> = {
      SMALL: "text-base",
      MEDIUM: "text-lg",
      LARGE: "text-xl",
    };
    const leadingMap: Record<string, string> = {
      NORMAL: "leading-relaxed",
      WIDE: "leading-loose",
    };
    return `${sizeMap[settings.fontSize] || "text-lg"} ${
      leadingMap[settings.lineHeight] || "leading-relaxed"
    }`;
  }, [settings, isAuthorized]);

  const htmlContent = useMemo(() => {
    const blocks: OutputBlockData[] = content?.blocks || [];
    if (!Array.isArray(blocks)) return "";

    const rawHtml = blocks
      .map((block) => {
        const data = block.data;
        switch (block.type) {
          case "header": {
            const level = data?.level || 2;
            const plainText = stripHtml(data.text);
            const id = plainText
              .toLowerCase()
              .replace(/[^\w ]+/g, "")
              .replace(/ +/g, "-");

            const headerClasses: Record<number, string> = {
              1: "text-4xl md:text-5xl font-extrabold mb-8 tracking-tight",
              2: "text-3xl font-bold mb-6 mt-16 tracking-tight",
              3: "text-2xl font-semibold mb-4 mt-12",
              4: "text-xl font-medium mb-3 mt-10",
            };

            return `<h${level} id="${id}" class="${headerClasses[level]} text-foreground scroll-mt-32 font-serif">${data.text}</h${level}>`;
          }
          case "paragraph":
            return `<p class="mb-7 text-card-foreground/90 antialiased">${data?.text}</p>`;
          case "list": {
            const tag = data?.style === "ordered" ? "ol" : "ul";
            const listType =
              data?.style === "ordered" ? "list-decimal" : "list-disc";
            const items = data?.items
              ?.map(
                (item: any) =>
                  `<li class="pl-2">${typeof item === "string" ? item : item.content}</li>`,
              )
              .join("");
            return `<${tag} class="ml-6 my-8 ${listType} space-y-4 text-card-foreground/85">${items}</${tag}>`;
          }
          case "image":
            return `<figure class="my-14 flex flex-col items-center"><img src="${data?.file?.url}" alt="${data?.caption || ""}" class="w-full rounded-2xl shadow-md border border-border/50" />${data?.caption ? `<figcaption class="text-center text-xs text-muted-foreground mt-4 italic tracking-wide">${data.caption}</figcaption>` : ""}</figure>`;
          case "quote":
            return `<blockquote class="my-12 border-l-4 border-primary/30 pl-8 py-2 italic text-muted-foreground bg-muted/5 rounded-r-2xl font-serif"><p class="text-xl leading-relaxed">"${data?.text}"</p>${data?.caption ? `<cite class="not-italic block text-sm font-semibold mt-4 text-foreground/50">— ${data.caption}</cite>` : ""}</blockquote>`;
          case "code":
            return `<div class="my-10 rounded-2xl bg-zinc-950 p-6 font-mono text-[14px] text-zinc-300 overflow-x-auto border border-white/5 shadow-2xl relative group"><div class="absolute top-3 right-4 text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">Code</div><code class="block leading-relaxed">${data?.code}</code></div>`;
          default:
            return "";
        }
      })
      .join("");

    return DOMPurify.sanitize(rawHtml);
  }, [content]);

  return (
    <div className="w-full bg-card min-h-screen selection:bg-primary/20">
      <main className="max-w-3xl mx-auto px-6 py-12 lg:py-24">
        <article
          className={`${typographyStyles} prose prose-stone dark:prose-invert max-w-none prose-headings:text-foreground transition-all duration-300`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>
    </div>
  );
}
