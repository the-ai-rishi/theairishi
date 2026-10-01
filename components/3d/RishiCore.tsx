"use client";

import { useEffect, useRef } from "react";

const STAGES = [
  { id: "01", name: "Wisdom" },
  { id: "02", name: "Foundations" },
  { id: "03", name: "Engineering" },
  { id: "04", name: "Intelligence" },
  { id: "05", name: "Signal" },
] as const;

/**
 * Living geometry for the homepage.
 * SVG carries the brand lotus. Canvas adds orbital nodes, a sweep, and particles.
 * CSS perspective supplies depth. Scroll moves the system through five stages.
 * Reduced motion keeps the still mark and does not run a frame loop.
 */
export default function RishiCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const stageIdRef = useRef<HTMLSpanElement>(null);
  const stageNameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tilt = tiltRef.current;
    if (!canvas || !tilt) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const ctx = context;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let visible = true;
    let awaken = 0;
    let stageIndex = -1;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const setStage = (index: number) => {
      if (index === stageIndex) return;
      stageIndex = index;
      const stage = STAGES[index] ?? STAGES[0];
      if (stageIdRef.current) stageIdRef.current.textContent = stage.id;
      if (stageNameRef.current) stageNameRef.current.textContent = stage.name;
    };

    const resize = () => {
      const rect = tilt.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      width = Math.max(1, rect.width * 0.88);
      height = Math.max(1, rect.height * 0.88);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height);
      ctx.clearRect(0, 0, width, height);

      const active = Math.min(10, Math.round(awaken * 10));
      const spin = reduced ? -Math.PI / 2 : time * 0.00012;
      const ring = size * 0.39;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(spin * 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, ring, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212,180,106,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      const sweep = reduced ? 0.9 : (time * 0.00035) % (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(0, 0, ring, sweep, sweep + 0.85 + awaken * 0.7);
      ctx.strokeStyle = awaken > 0.62 ? "rgba(103,232,249,0.85)" : "rgba(240,208,144,0.85)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < 11; i += 1) {
        const angle = (i / 11) * Math.PI * 2 - Math.PI / 2 + (reduced ? 0 : time * 0.00005);
        const x = cx + Math.cos(angle) * ring;
        const y = cy + Math.sin(angle) * ring;
        const on = i <= active;
        if (on) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.strokeStyle = i === active ? "rgba(240,208,144,0.35)" : "rgba(139,124,255,0.16)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, on ? (i === active ? 3.4 : 2.4) : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = on
          ? i === active
            ? "#f3eee4"
            : "rgba(212,180,106,0.92)"
          : "rgba(243,238,228,0.22)";
        ctx.fill();
      }

      if (!reduced) {
        const count = size < 360 ? 8 : 16;
        for (let i = 0; i < count; i += 1) {
          const dir = i % 2 === 0 ? 1 : -1;
          const angle = time * 0.00022 * dir + (i / count) * Math.PI * 2;
          const radius = size * (0.18 + (i % 4) * 0.045);
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius * (0.86 + awaken * 0.08);
          ctx.fillStyle = i % 3 === 0 ? "rgba(103,232,249,0.75)" : "rgba(212,180,106,0.6)";
          ctx.fillRect(x, y, 1.4, 1.4);
        }
      }

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.08);
      glow.addColorStop(0, awaken > 0.78 ? "rgba(103,232,249,0.55)" : "rgba(212,180,106,0.45)");
      glow.addColorStop(1, "rgba(8,8,11,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    };

    const paint = (time: number) => {
      frame = 0;
      if (!running || reduced || !visible || document.visibilityState === "hidden") return;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      if (!coarse) {
        tilt.style.transform = `rotateX(${(-pointer.y * 7).toFixed(2)}deg) rotateY(${(pointer.x * 7).toFixed(2)}deg)`;
      }
      draw(time);
      frame = window.requestAnimationFrame(paint);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      awaken = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setStage(Math.min(STAGES.length - 1, Math.floor(awaken * STAGES.length)));
      if (reduced) draw(0);
    };

    const onPointer = (event: PointerEvent) => {
      if (coarse || reduced) return;
      const rect = tilt.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.tx = Math.max(-0.5, Math.min(0.5, nx));
      pointer.ty = Math.max(-0.5, Math.min(0.5, ny));
    };

    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };

    resize();
    onScroll();
    draw(0);
    tilt.dataset.live = "true";
    if (reduced) tilt.dataset.still = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible && !reduced && document.visibilityState !== "hidden" && !frame) {
          frame = window.requestAnimationFrame(paint);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(tilt);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    resizeObserver.observe(tilt);

    window.addEventListener("scroll", onScroll, { passive: true });

    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      tilt.addEventListener("pointerleave", onLeave);
      frame = window.requestAnimationFrame(paint);
    }

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (!reduced && !frame) frame = window.requestAnimationFrame(paint);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      tilt.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <figure className="rishi-core" aria-hidden="true">
      <div className="rishi-perspective">
        <div ref={tiltRef} className="rishi-tilt">
          <div className="rishi-layer rishi-layer-back">
            <CoreMark />
          </div>
          <canvas ref={canvasRef} className="rishi-layer rishi-layer-front" aria-hidden="true" />
        </div>
      </div>
      <figcaption className="rishi-stage-label" aria-hidden="true">
        <span ref={stageIdRef}>01</span>
        <span ref={stageNameRef}>Wisdom</span>
      </figcaption>
    </figure>
  );
}

function CoreMark() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(212,180,106,0.28)" strokeWidth="1" />
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke="rgba(243,238,228,0.16)"
        strokeWidth="1"
        strokeDasharray="1.5 5"
      />
      <circle cx="100" cy="100" r="58" fill="none" stroke="rgba(139,124,255,0.42)" strokeWidth="1" />
      <circle cx="100" cy="100" r="34" fill="none" stroke="rgba(103,232,249,0.38)" strokeWidth="1" />
      <g transform="translate(100 100) scale(4.6) translate(-16 -16)" fill="none" strokeLinejoin="round">
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d="M16 3.4C19.15 8.15 19.55 12.55 16 16C12.45 12.55 12.85 8.15 16 3.4Z"
            transform={`rotate(${i * 45} 16 16)`}
            stroke={i % 2 === 0 ? "rgba(212,180,106,0.82)" : "rgba(192,132,252,0.45)"}
            strokeWidth="0.7"
          />
        ))}
      </g>
      <path
        d="M100 58V46M100 154V142M58 100H46M142 100H154"
        stroke="rgba(243,238,228,0.45)"
        strokeWidth="1"
      />
      <circle cx="100" cy="100" r="3.2" fill="#f0d090" />
    </svg>
  );
}
