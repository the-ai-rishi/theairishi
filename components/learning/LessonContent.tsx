"use client";

import { useEffect, useRef, useState } from "react";


interface LessonContentProps {
  content: string;
}

export default function LessonContent({ content }: LessonContentProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = el.offsetHeight;
      const scrolled = windowHeight - rect.top;

      if (scrolled <= 0) {
        setScrollProgress(0);
      } else if (scrolled >= totalHeight) {
        setScrollProgress(100);
      } else {
        setScrollProgress(Math.min(100, Math.round((scrolled / totalHeight) * 100)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhance code blocks with copy buttons and language badges
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const preElements = article.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Avoid duplicate enhancement
      if (pre.dataset.enhanced === "true") return;
      pre.dataset.enhanced = "true";

      const code = pre.querySelector("code");
      const textContent = code ? code.innerText : pre.innerText;

      // Detect language from class or content
      const className = code?.className || "";
      const match = className.match(/language-([a-zA-Z0-9_-]+)/);
      let lang = match ? match[1].toUpperCase() : "CODE";

      // Detect ASCII diagrams / flowcharts
      const isDiagram =
        textContent.includes("──►") ||
        textContent.includes("┌──") ||
        textContent.includes("└──") ||
        textContent.includes("│");

      if (isDiagram && lang === "TEXT") {
        lang = "DIAGRAM";
      }

      // Create header bar
      const header = document.createElement("div");
      header.className =
        "flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[11px] font-mono text-white/40 tracking-wider";

      const labelWrapper = document.createElement("div");
      labelWrapper.className = "flex items-center gap-2";

      if (isDiagram) {
        const dot = document.createElement("span");
        dot.className = "h-1.5 w-1.5 rounded-full bg-violet-400";
        labelWrapper.appendChild(dot);
      }

      const langSpan = document.createElement("span");
      langSpan.textContent = lang;
      langSpan.className = isDiagram ? "text-violet-300 font-semibold" : "";
      labelWrapper.appendChild(langSpan);

      header.appendChild(labelWrapper);

      // Copy button
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/40 transition hover:bg-white/[0.06] hover:text-white";
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span class="btn-text">Copy</span>
      `;

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(textContent);
          copyBtn.classList.add("text-emerald-300");
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.classList.remove("text-emerald-300");
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span class="btn-text">Copy</span>
            `;
          }, 2000);
        } catch {
          // Fallback
        }
      });

      header.appendChild(copyBtn);

      pre.style.paddingTop = "0";
      pre.style.paddingLeft = "0";
      pre.style.paddingRight = "0";
      pre.insertBefore(header, pre.firstChild);

      if (code) {
        code.style.display = "block";
        code.style.padding = "1.25rem";
      }
    });
  }, [content]);

  return (
    <>
      {/* Fixed top reading progress indicator */}
      <div
        className="fixed left-0 top-0 z-50 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-400 to-violet-300 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <article
        ref={articleRef}
        className="
          max-w-3xl

          [&_h1]:mb-8
          [&_h1]:text-3xl
          [&_h1]:font-semibold
          [&_h1]:leading-tight
          [&_h1]:tracking-[-0.035em]
          sm:[&_h1]:text-4xl

          [&_h2]:mt-16
          [&_h2]:text-2xl
          [&_h2]:font-semibold
          [&_h2]:leading-tight
          [&_h2]:tracking-[-0.03em]
          sm:[&_h2]:text-3xl

          [&_h3]:mt-10
          [&_h3]:text-lg
          [&_h3]:font-semibold
          [&_h3]:tracking-[-0.025em]
          sm:[&_h3]:text-xl

          [&_p]:mt-5
          [&_p]:text-[16px]
          [&_p]:leading-8
          [&_p]:text-white/60
          sm:[&_p]:text-[17px]

          [&_ul]:my-6
          [&_ul]:list-disc
          [&_ul]:space-y-2
          [&_ul]:pl-6
          [&_ol]:my-6
          [&_ol]:list-decimal
          [&_ol]:space-y-2
          [&_ol]:pl-6
          [&_li]:text-white/60
          [&_li]:leading-7

          [&_strong]:font-semibold
          [&_strong]:text-white
          [&_em]:text-white/75
          [&_a]:text-violet-300
          [&_a]:underline
          [&_a]:decoration-violet-400/40
          [&_a]:underline-offset-4
          [&_a:hover]:text-violet-200

          [&_blockquote]:my-8
          [&_blockquote]:border-l-2
          [&_blockquote]:border-violet-300/30
          [&_blockquote]:bg-white/[0.015]
          [&_blockquote]:py-3
          [&_blockquote]:pl-6
          [&_blockquote]:pr-4
          [&_blockquote]:rounded-r-xl
          [&_blockquote]:text-white/70

          [&_code]:rounded-md
          [&_code]:bg-white/[0.07]
          [&_code]:px-1.5
          [&_code]:py-0.5
          [&_code]:font-mono
          [&_code]:text-[0.88em]
          [&_code]:text-violet-200/90

          [&_pre]:my-8
          [&_pre]:overflow-x-auto
          [&_pre]:rounded-2xl
          [&_pre]:border
          [&_pre]:border-white/[0.08]
          [&_pre]:bg-[#08080a]
          [&_pre_code]:bg-transparent
          [&_pre_code]:p-0
          [&_pre_code]:text-[0.875rem]
          [&_pre_code]:leading-relaxed
          [&_pre_code]:text-white/80

          [&_hr]:my-16
          [&_hr]:border-white/[0.08]
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
