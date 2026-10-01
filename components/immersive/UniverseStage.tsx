"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { sceneBus } from "./scene-bus";
import StillCore from "./StillCore";

const RishiScene = dynamic(() => import("./RishiScene"), {
  ssr: false,
  loading: () => <StillCore />,
});

const BEATS = ["Wisdom", "Foundations", "Engineering", "Intelligence", "Signal"];

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function UniverseStage({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"boot" | "live" | "still">("boot");
  const [awake, setAwake] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sceneBus.mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 800;
    const frame = window.requestAnimationFrame(() => setMode(reduced ? "still" : "live"));
    if (reduced) return () => window.cancelAnimationFrame(frame);

    const track = trackRef.current;
    if (!track) return () => window.cancelAnimationFrame(frame);
    let beat = 0;

    const measure = () => {
      const total = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -track.getBoundingClientRect().top));
      const progress = scrolled / total;
      sceneBus.scroll = progress;
      track.style.setProperty("--awakening", progress.toFixed(3));
      const next = Math.min(BEATS.length - 1, Math.floor(progress * BEATS.length));
      if (next !== beat && labelRef.current) {
        beat = next;
        labelRef.current.textContent = BEATS[next];
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      sceneBus.px = (event.clientX / window.innerWidth) * 2 - 1;
      sceneBus.py = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onOrient = (event: DeviceOrientationEvent) => {
      if (!sceneBus.mobile) return;
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 40;
      sceneBus.px = Math.max(-1, Math.min(1, gamma / 28));
      sceneBus.py = Math.max(-1, Math.min(1, (beta - 40) / 32));
    };

    const onVisibility = () => {
      if (document.hidden) {
        sceneBus.visible = false;
        setAwake(false);
        return;
      }
      const rect = track.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      sceneBus.visible = visible;
      setAwake(visible);
    };

    measure();
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting) && !document.hidden;
        sceneBus.visible = visible;
        setAwake(visible);
      },
      { threshold: 0.08 },
    );
    observer.observe(track);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrient);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrient);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={trackRef} className="universe-track">
      <div className="universe-sticky">
        <div className="universe-scene" aria-hidden="true">
          {mode === "live" ? (
            <SceneBoundary fallback={<StillCore />}>
              <RishiScene awake={awake} />
            </SceneBoundary>
          ) : (
            <StillCore />
          )}
        </div>
        <p className="universe-beat" aria-hidden="true">
          <span>System</span>
          <span ref={labelRef}>Wisdom</span>
        </p>
        {children}
      </div>
    </div>
  );
}
