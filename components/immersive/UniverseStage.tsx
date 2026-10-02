"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { sceneBus, WORLD_IDS, WORLD_LABELS, WORLD_RANGES, worldIndex } from "./scene-bus";
import PhaseSheet from "./PhaseSheet";

export default function UniverseStage({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<SVGSVGElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rangeRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const applyMode = () => {
      sceneBus.mobile = coarse.matches || window.innerWidth < 800;
      setReduced(motion.matches);
    };
    applyMode();
    motion.addEventListener("change", applyMode);
    coarse.addEventListener("change", applyMode);

    const track = trackRef.current;
    if (!track) {
      return () => {
        motion.removeEventListener("change", applyMode);
        coarse.removeEventListener("change", applyMode);
      };
    }

    let beat = -1;
    const publish = (progress: number) => {
      const index = worldIndex(progress);
      sceneBus.world = index;
      const id = WORLD_IDS[index];
      if (document.documentElement.dataset.world !== id) {
        document.documentElement.dataset.world = id;
      }
      const sheet = sheetRef.current;
      if (sheet && sheet.dataset.phase !== id) sheet.dataset.phase = id;
      const fill = sheet?.querySelector(".measure-fill");
      if (fill) fill.setAttribute("stroke-dashoffset", (1 - progress).toFixed(4));
      if (!motion.matches && !sceneBus.mobile && sheet) {
        sheet.style.transform = `translate3d(${(sceneBus.px * 10).toFixed(2)}px, ${(sceneBus.py * 6).toFixed(2)}px, 0)`;
      } else if (sheet) {
        sheet.style.transform = "";
      }
      if (index !== beat) {
        beat = index;
        const numeral = String(index + 1).padStart(2, "0");
        if (indexRef.current) indexRef.current.textContent = numeral;
        if (labelRef.current) labelRef.current.textContent = WORLD_LABELS[index];
        if (rangeRef.current) rangeRef.current.textContent = `Days ${WORLD_RANGES[index]}`;
        const readout = document.getElementById("world-readout");
        if (readout) {
          readout.hidden = false;
          const next = WORLD_LABELS[index];
          if (readout.textContent !== next) readout.textContent = next;
        }
      }
    };

    const measure = () => {
      const total = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -track.getBoundingClientRect().top));
      const progress = scrolled / total;
      sceneBus.scroll = progress;
      track.style.setProperty("--awakening", progress.toFixed(3));
      publish(progress);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      sceneBus.px = (event.clientX / window.innerWidth) * 2 - 1;
      sceneBus.py = (event.clientY / window.innerHeight) * 2 - 1;
      if (!motion.matches && !sceneBus.mobile && sheetRef.current) {
        sheetRef.current.style.transform = `translate3d(${(sceneBus.px * 10).toFixed(2)}px, ${(sceneBus.py * 6).toFixed(2)}px, 0)`;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        sceneBus.visible = false;
        return;
      }
      const rect = track.getBoundingClientRect();
      sceneBus.visible = rect.bottom > 0 && rect.top < window.innerHeight;
    };

    measure();
    const observer = new IntersectionObserver(
      ([entry]) => {
        sceneBus.visible = Boolean(entry?.isIntersecting) && !document.hidden;
      },
      { threshold: 0.08 },
    );
    observer.observe(track);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      motion.removeEventListener("change", applyMode);
      coarse.removeEventListener("change", applyMode);
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      delete document.documentElement.dataset.world;
      const readout = document.getElementById("world-readout");
      if (readout) {
        readout.textContent = "";
        readout.hidden = true;
      }
    };
  }, []);

  return (
    <div ref={trackRef} className="universe-track">
      <div className="universe-sticky">
        <div className={`universe-scene ${reduced ? "is-still" : ""}`}>
          <PhaseSheet ref={sheetRef} />
        </div>
        <p className="universe-beat" aria-hidden="true">
          <span ref={indexRef}>01</span>
          <span ref={labelRef}>Foundations</span>
          <span ref={rangeRef}>Days 1–12</span>
        </p>
        {children}
      </div>
    </div>
  );
}
