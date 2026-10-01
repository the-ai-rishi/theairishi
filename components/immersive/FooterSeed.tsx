"use client";

import { useEffect, useRef } from "react";

/** The universe settles back into the mark as the footer arrives. */
export default function FooterSeed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--collapse", "0.35");
      return;
    }
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = 1 - Math.min(1, Math.max(0, (rect.top - view * 0.2) / (view * 0.45)));
      node.style.setProperty("--collapse", progress.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="footer-seed" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <g fill="none" strokeLinejoin="round">
          <circle className="seed-ring seed-ring-a" cx="100" cy="100" r="92" />
          <ellipse className="seed-ring seed-ring-b" cx="100" cy="100" rx="78" ry="26" transform="rotate(24 100 100)" />
          <ellipse className="seed-ring seed-ring-c" cx="100" cy="100" rx="78" ry="26" transform="rotate(-32 100 100)" />
          <g transform="translate(100 100) scale(4.2) translate(-16 -16)">
            {Array.from({ length: 8 }, (_, index) => (
              <path
                key={index}
                d="M16 3.2C19.4 8.2 19.7 12.6 16 16C12.3 12.6 12.6 8.2 16 3.2Z"
                transform={`rotate(${index * 45} 16 16)`}
              />
            ))}
          </g>
          <circle cx="100" cy="100" r="3.2" fill="#f3eee4" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
