import { remark } from "remark";
import html from "remark-html";
import { decorateHeadings, wrapLessonSections } from "./lesson-rhythm";

/**
 * Enhanced HTML post-processor for Markdown across all content types.
 *
 * Automatically handles:
 * - GitHub-style alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
 * - Key idea & Mental model callouts
 * - Responsive images with figure + figcaption + lazy loading
 * - Heading IDs and anchor links with scroll-margin
 * - Responsive table containers with horizontal scroll
 * - Lesson rhythm blocks (why / learn / practice / gate) for /learn days
 */
export function enhanceHtml(rawHtml: string): string {
  let enhanced = rawHtml;

  enhanced = enhanced.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type: string, content: string) => {
      const alertType = type.toLowerCase();
      return `<div class="callout callout-${alertType}" role="note"><div class="callout-header"><span class="callout-badge">${type}</span></div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
    }
  );

  enhanced = enhanced.replace(
    /<blockquote>\s*<p>\s*(?:<strong>)?Key\s+idea:?(?:<\/strong>)?\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, content: string) => {
      return `<div class="callout callout-key-idea" role="note"><div class="callout-header"><span class="callout-badge">KEY TAKEAWAY</span></div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
    }
  );

  enhanced = enhanced.replace(
    /<blockquote>\s*<p>\s*(?:<strong>)?Mental\s+model:?(?:<\/strong>)?\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, content: string) => {
      return `<div class="callout callout-note" role="note"><div class="callout-header"><span class="callout-badge">MENTAL MODEL</span></div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
    }
  );

  enhanced = enhanced.replace(
    /<h([23])>(.*?)<\/h\1>/gi,
    (_, level: string, text: string) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h${level} id="${id}" class="group scroll-mt-28"><a href="#${id}" class="anchor-link" aria-hidden="true">#</a><span>${text}</span></h${level}>`;
    }
  );

  enhanced = enhanced.replace(
    /(<table>[\s\S]*?<\/table>)/gi,
    '<div class="table-container my-6 overflow-x-auto border border-hairline p-1">$1</div>'
  );

  enhanced = enhanced.replace(
    /<img\s+src="([^"]+)"\s*(?:alt="([^"]*)")?\/?>(?:\s*<br\s*\/?>\s*<em>([^<]*)<\/em>)?/gi,
    (_, src: string, alt: string = "", caption?: string) => {
      const captionHtml = caption
        ? `<figcaption class="mt-2.5 text-center text-xs text-cream/40 italic font-mono">${caption}</figcaption>`
        : "";
      return `<figure class="my-6"><img src="${src}" alt="${alt}" loading="lazy" class="w-full border border-hairline bg-ink object-contain max-h-[600px]" />${captionHtml}</figure>`;
    }
  );

  return wrapLessonSections(decorateHeadings(enhanced));
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html, { sanitize: false }).process(markdown);
  return enhanceHtml(processed.toString());
}
