import { remark } from "remark";
import html from "remark-html";

/**
 * Enhanced HTML post-processor for Markdown across all content types.
 *
 * Automatically handles:
 * - GitHub-style alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
 * - Key idea & Mental model callouts
 * - Responsive images with figure + figcaption + lazy loading
 * - Heading IDs and anchor links with scroll-margin
 * - Responsive table containers with horizontal scroll
 */
export function enhanceHtml(rawHtml: string): string {
  let enhanced = rawHtml;

  // 1. GitHub-style alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
  enhanced = enhanced.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type: string, content: string) => {
      const alertType = type.toLowerCase();
      return `<div class="callout callout-${alertType}" role="note"><div class="callout-header"><span class="callout-badge">${type}</span></div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
    }
  );

  // 2. Key takeaway / Mental model callouts
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

  // 3. Enhance headings (h2, h3) with anchor IDs and scroll-margin
  enhanced = enhanced.replace(
    /<h([23])>(.*?)<\/h\1>/gi,
    (_, level: string, text: string) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h${level} id="${id}" class="group scroll-mt-24"><a href="#${id}" class="anchor-link" aria-hidden="true">#</a><span>${text}</span></h${level}>`;
    }
  );

  // 4. Wrap tables in responsive horizontal-scroll container
  enhanced = enhanced.replace(
    /(<table>[\s\S]*?<\/table>)/gi,
    '<div class="table-container my-8 overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.015] p-1">$1</div>'
  );

  // 5. Enhance images with responsive wrapper, rounded styling, and optional caption
  enhanced = enhanced.replace(
    /<img\s+src="([^"]+)"\s*(?:alt="([^"]*)")?\/?>(?:\s*<br\s*\/?>\s*<em>([^<]*)<\/em>)?/gi,
    (_, src: string, alt: string = "", caption?: string) => {
      const captionHtml = caption
        ? `<figcaption class="mt-2.5 text-center text-xs text-white/40 italic font-mono">${caption}</figcaption>`
        : "";
      return `<figure class="my-8"><img src="${src}" alt="${alt}" loading="lazy" class="w-full rounded-2xl border border-white/[0.08] bg-black/40 object-contain max-h-[600px] shadow-2xl" />${captionHtml}</figure>`;
    }
  );

  return enhanced;
}

/**
 * Process Markdown string into enhanced HTML.
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html, { sanitize: false }).process(markdown);
  return enhanceHtml(processed.toString());
}
