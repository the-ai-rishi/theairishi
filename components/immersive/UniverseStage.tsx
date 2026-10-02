"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { sceneBus, WORLD_IDS, WORLD_LABELS, worldIndex } from "./scene-bus";
import StillCore from "./StillCore";

const RishiScene = dynamic(() => import("./RishiScene"), {
  ssr: false,
  loading: () => <StillCore />,
});

const BEATS = WORLD_LABELS;

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
  const veilRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"boot" | "live" | "still">("boot");
  const [awake, setAwake] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sceneBus.mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 800;
    const frame = window.requestAnimationFrame(() => setMode(reduced ? "still" : "live"));
    if (reduced) {
      if (veilRef.current) veilRef.current.dataset.state = "gone";
      return () => window.cancelAnimationFrame(frame);
    }

    const track = trackRef.current;
    if (!track) return () => window.cancelAnimationFrame(frame);
    let beat = -1;

    const publish = (progress: number) => {
      const index = worldIndex(progress, sceneBus.boot);
      sceneBus.world = index;
      const id = WORLD_IDS[index];
      if (document.documentElement.dataset.world !== id) {
        document.documentElement.dataset.world = id;
      }
      if (index !== beat && labelRef.current) {
        beat = index;
        labelRef.current.textContent = BEATS[index];
      }
      const readout = document.getElementById("world-readout");
      if (readout) {
        readout.hidden = false;
        if (readout.textContent !== BEATS[index]) readout.textContent = BEATS[index];
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
    const veil = veilRef.current;
    let bootTimer = 0;
    const dismiss = () => {
      if (!veil) return;
      veil.dataset.state = "gone";
      try {
        sessionStorage.setItem("rishi-awake", "1");
      } catch {
        /* private mode */
      }
    };
    let seenBoot = false;
    try {
      seenBoot = sessionStorage.getItem("rishi-awake") === "1";
    } catch {
      seenBoot = true;
    }
    if (veil && !seenBoot) {
      bootTimer = window.setTimeout(dismiss, 2600);
      window.addEventListener("pointerdown", dismiss, { once: true });
      window.addEventListener("keydown", dismiss, { once: true });
    } else if (veil) {
      veil.dataset.state = "gone";
    }
    const bootPulse = window.setInterval(() => {
      if (sceneBus.boot >= 1 && sceneBus.world > 0) {
        window.clearInterval(bootPulse);
        return;
      }
      measure();
    }, 120);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrient);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(bootTimer);
      window.clearInterval(bootPulse);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
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
          <span ref={labelRef}>Seed</span>
        </p>
        <div ref={veilRef} className="awaken" aria-hidden="true">
          <p>Dormant</p>
          <p>120-day path</p>
          <p>Signal</p>
        </div>
        {children}
      </div>
    </div>
  );
}
