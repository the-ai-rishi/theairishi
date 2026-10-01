"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

/** Desktop-only halo. Does not replace the cursor or capture clicks. */
export default function PointerHalo() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      node.dataset.on = "false";
      return;
    }
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset.on = "true";
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame = 0;

    const tick = () => {
      frame = 0;
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(x - cx) > 0.4 || Math.abs(y - cy) > 0.4) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      node.dataset.on = "false";
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return <div ref={ref} className="pointer-halo" aria-hidden="true" />;
}
