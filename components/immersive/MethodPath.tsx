"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Step {
  n: string;
  title: string;
  body: string;
}

/** Scroll lights each practice step in order. The signal is the method, not decoration. */
export default function MethodPath({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.querySelectorAll(".method-step").forEach((item) => item.classList.add("is-lit"));
      node.style.setProperty("--lit", "1");
      return;
    }
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view * 0.62 - rect.top) / Math.max(rect.height, 1);
      const index = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)));
      setActive((current) => (current === index ? current : index));
    };
    const frame = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [steps.length]);

  return (
    <ol
      ref={ref}
      className="method-rail"
      style={{ "--lit": (active + 1) / Math.max(1, steps.length) } as CSSProperties}
    >
      {steps.map((step, index) => (
        <li key={step.n} className={`method-step ${index <= active ? "is-lit" : ""}`}>
          <p className="font-mono text-[11px] tracking-[0.18em] text-gold/70">{step.n}</p>
          <h3 className="mt-2 font-serif text-xl text-cream sm:text-2xl">{step.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-cream/45">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
