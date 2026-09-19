"use client";

import { useEffect, useRef, useState } from "react";

interface LessonContentProps {
  content: string;
}

export default function LessonContent({ content }: LessonContentProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const preElements = article.querySelectorAll("pre");

    preElements.forEach((pre) => {
      if (pre.dataset.enhanced === "true") return;
      pre.dataset.enhanced = "true";

      const code = pre.querySelector("code");
      const textContent = code ? code.innerText : pre.innerText;

      const className = code?.className || "";
      const match = className.match(/language-([a-zA-Z0-9_-]+)/);
      let lang = match ? match[1].toUpperCase() : "CODE";

      const isDiagram =
        textContent.includes("──►") ||
        textContent.includes("┌──") ||
        textContent.includes("└──") ||
        textContent.includes("│");

      if (isDiagram && lang === "TEXT") {
        lang = "DIAGRAM";
      }

      const header = document.createElement("div");
      header.className =
        "flex items-center justify-between border-b border-hairline bg-field px-3 py-2 text-[11px] font-mono text-cream/40 tracking-wider";

      const labelWrapper = document.createElement("div");
      labelWrapper.className = "flex items-center gap-2";

      if (isDiagram) {
        const dot = document.createElement("span");
        dot.className = "h-1.5 w-1.5 bg-gold";
        labelWrapper.appendChild(dot);
      }

      const langSpan = document.createElement("span");
      langSpan.textContent = lang;
      langSpan.className = isDiagram ? "text-gold font-semibold" : "";
      labelWrapper.appendChild(langSpan);

      header.appendChild(labelWrapper);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-cream/40 transition hover:bg-cream/[0.06] hover:text-cream";
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span class="btn-text">Copy</span>
      `;

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(textContent);
          copyBtn.classList.add("text-gold-bright");
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <span>Copied</span>
          `;
          setTimeout(() => {
            copyBtn.classList.remove("text-gold-bright");
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
        code.style.padding = "1rem";
      }
    });
  }, [content]);

  return (
    <>
      <div
        className="read-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <article
        ref={articleRef}
        className="
          workspace-prose

          [&_strong]:font-semibold
          [&_strong]:text-cream
          [&_em]:text-cream/75
          [&_a]:text-gold
          [&_a]:underline
          [&_a]:decoration-gold/40
          [&_a]:underline-offset-4
          [&_a:hover]:text-gold-bright

          [&_blockquote]:my-5
          [&_blockquote]:border-l-2
          [&_blockquote]:border-gold/40
          [&_blockquote]:bg-white/[0.015]
          [&_blockquote]:py-3
          [&_blockquote]:pl-5
          [&_blockquote]:pr-4
          [&_blockquote]:text-cream/70

          [&_code]:rounded-sm
          [&_code]:bg-white/[0.07]
          [&_code]:px-1.5
          [&_code]:py-0.5
          [&_code]:font-mono
          [&_code]:text-[0.86em]
          [&_code]:text-circuit-bright/90

          [&_pre_code]:bg-transparent
          [&_pre_code]:p-0
          [&_pre_code]:text-[0.8125rem]
          [&_pre_code]:leading-relaxed
          [&_pre_code]:text-cream/80
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
