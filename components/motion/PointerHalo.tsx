"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

/** Context halo. Never captures clicks and never replaces the system cursor. */
export default function PointerHalo() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced || window.matchMedia("(pointer: coarse)").matches) {
      node.dataset.on = "false";
      return;
    }

    node.dataset.on = "true";
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame = 0;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const releaseMagnet = () => {
      if (!magnet) return;
      const current = magnet;
      current.style.transition = "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)";
      current.style.transform = "";
      magnet = null;
    };

    const releaseTilt = () => {
      if (!tilt) return;
      const current = tilt;
      current.style.transition = "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)";
      current.style.transform = "";
      current.style.removeProperty("--spot-x");
      current.style.removeProperty("--spot-y");
      tilt = null;
    };

    const tick = () => {
      frame = 0;
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(x - cx) > 0.35 || Math.abs(y - cy) > 0.35) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const hit = target?.closest("[data-cursor], [data-magnetic], a, button, .universe-scene");
      let kind = "orb";
      if (hit) {
        const explicit = hit.getAttribute("data-cursor");
        if (explicit) kind = explicit;
        else if (hit.closest("[data-magnetic]")) kind = "cta";
        else if (hit.closest(".universe-scene")) kind = "object";
        else kind = "link";
      }
      if (node.dataset.kind !== kind) node.dataset.kind = kind;

      const nextMagnet = (target?.closest("[data-magnetic]") as HTMLElement | null) ?? null;
      if (magnet && magnet !== nextMagnet) releaseMagnet();
      magnet = nextMagnet;
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const dx = (x - (rect.left + rect.width / 2)) * 0.16;
        const dy = (y - (rect.top + rect.height / 2)) * 0.2;
        magnet.style.transition = "none";
        magnet.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      }

      const nextTilt = (target?.closest("[data-tilt]") as HTMLElement | null) ?? null;
      if (tilt && tilt !== nextTilt) releaseTilt();
      tilt = nextTilt;
      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const px = (x - rect.left) / Math.max(1, rect.width);
        const py = (y - rect.top) / Math.max(1, rect.height);
        tilt.style.transition = "none";
        tilt.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 8).toFixed(2)}deg)`;
        tilt.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
      }

      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onLeave = () => {
      releaseMagnet();
      releaseTilt();
      node.dataset.kind = "orb";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      node.dataset.on = "false";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      releaseMagnet();
      releaseTilt();
    };
  }, [reduced]);

  return (
    <div ref={ref} className="pointer-halo" data-kind="orb" aria-hidden="true">
      <span />
    </div>
  );
}
