"use client";

import { useRef } from "react";

/** Drag or hover the balance between generation and ownership. Copy stays the platform's. */
export default function OwnershipSplit({
  generate,
  stillNeed,
}: {
  generate: string[];
  stillNeed: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const setBias = (clientX: number) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const bias = Math.min(0.82, Math.max(0.18, (clientX - rect.left) / rect.width));
    node.style.setProperty("--bias", bias.toFixed(3));
  };

  return (
    <div
      ref={ref}
      className="ownership"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        setBias(event.clientX);
      }}
    >
      <div className="ownership-pane ownership-ai">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-cream/40">AI can generate</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {generate.map((item) => (
            <li key={item} className="border border-hairline px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-cream/70">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="ownership-pane ownership-you">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-gold/75">You still need to</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {stillNeed.map((item) => (
            <li
              key={item}
              className="border border-gold/25 bg-gold/[0.04] px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-gold/90"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="ownership-rule" aria-hidden="true" />
      <label className="ownership-range">
        <span className="sr-only">Balance between what AI can generate and what you still own</span>
        <input
          type="range"
          min={18}
          max={82}
          defaultValue={50}
          onInput={(event) => {
            const node = ref.current;
            if (!node) return;
            node.style.setProperty("--bias", String(Number((event.target as HTMLInputElement).value) / 100));
          }}
        />
      </label>
    </div>
  );
}
