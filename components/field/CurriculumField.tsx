"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { LearnerCatalog } from "@/lib/continue-learning";
import { resolveContinue } from "@/lib/continue-learning";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import { dayUnderPointer, drawPlate, type PlateModel } from "./draw-plate";
import { phaseColor } from "@/lib/phase-color";

export type DayFact = {
  day: number;
  phaseId: string;
  goal: string;
  concepts: string[];
};

function clock() {
  return performance.now();
}

export default function CurriculumField({
  catalog,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  facts,
}: {
  catalog: LearnerCatalog;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  facts: DayFact[];
}) {
  const phases = catalog.phases;
  const [index, setIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [focusConcept, setFocusConcept] = useState<string | null>(null);
  const { state, hasHydrated } = useLessonProgress();
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const lockRef = useRef(0);
  const modelRef = useRef<PlateModel>({
    index: 0,
    summary: "",
    startDay: 1,
    endDay: 1,
    publishedDays: [],
    activeDay: null,
  });
  const phase = phases[index] || phases[0];
  const days = useMemo(
    () => (phase ? catalog.days.filter((day) => day.phaseId === phase.id) : []),
    [catalog.days, phase],
  );

  useLayoutEffect(() => {
    modelRef.current = {
      index,
      summary: phase?.summary || "",
      startDay: phase?.startDay || 1,
      endDay: phase?.endDay || 1,
      publishedDays: days.filter((day) => day.published).map((day) => day.day),
      activeDay,
      accent: phaseColor(phase?.number || 1).ink,
    };
  }, [index, phase, days, activeDay]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 860px)");
    const apply = () => setMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;

    const paint = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const pw = Math.floor(w * dpr);
      const ph = Math.floor(h * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawPlate(ctx, modelRef.current, w, h, pointerRef.current, reduce ? 0 : now / 1000);
      if (alive && !reduce && !document.hidden) raf = requestAnimationFrame(paint);
    };

    paint(clock());
    const onVis = () => {
      if (!document.hidden && !reduce) raf = requestAnimationFrame(paint);
    };
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => paint(clock());
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, [index, activeDay]);

  useEffect(() => {
    const readout = document.getElementById("world-readout");
    if (!readout || !phase) return;
    readout.hidden = mobile;
    readout.textContent = mobile ? "" : phase.name;
    readout.setAttribute("aria-hidden", mobile ? "true" : "false");
    window.dispatchEvent(new CustomEvent("forge-phase", { detail: { index } }));
    return () => {
      readout.hidden = true;
      readout.textContent = "";
    };
  }, [index, mobile, phase]);

  useEffect(() => {
    if (mobile) return;
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (clock() < lockRef.current) return;
      const start = track.offsetTop;
      const span = Math.max(1, track.offsetHeight - window.innerHeight);
      const progress = Math.min(0.999, Math.max(0, (window.scrollY - start) / span));
      const next = Math.min(phases.length - 1, Math.floor(progress * phases.length));
      setIndex((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobile, phases.length]);

  function focusPhase(next: number) {
    const clamped = Math.max(0, Math.min(phases.length - 1, next));
    setIndex(clamped);
    setActiveDay(null);
    setFocusConcept(null);
    if (mobile) return;
    const track = trackRef.current;
    if (!track) return;
    lockRef.current = clock() + 700;
    const span = Math.max(1, track.offsetHeight - window.innerHeight);
    const top = track.offsetTop + ((clamped + 0.15) / phases.length) * span;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  if (!phase) return null;
  const shown = days.find((day) => day.day === activeDay) || days.find((day) => day.published) || days[0];
  const fact = facts.find((item) => item.day === shown?.day);
  const lit = new Set(
    focusConcept
      ? facts
          .filter((item) => item.phaseId === phase.id && item.concepts.includes(focusConcept))
          .map((item) => item.day)
      : [],
  );
  const continueTarget = resolveContinue(hasHydrated ? state : null, catalog);
  const startHref = hasHydrated && continueTarget.href ? continueTarget.href : primaryHref;
  const startLabel = hasHydrated ? continueTarget.ctaLabel : primaryLabel;

  const tone = phaseColor(phase.number);

  return (
    <div
      className={mobile ? "field-track is-mobile" : "field-track"}
      ref={trackRef}
      data-phase={phase.number}
      style={{ ["--phase" as string]: tone.ink, ["--phase-wash" as string]: tone.wash }}
    >
      <div className="field-sticky">
        <div className="field-stage">
          <nav className="field-measure" aria-label="Phases">
            {phases.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={itemIndex === index ? "is-on" : ""}
                aria-current={itemIndex === index ? "true" : undefined}
                style={{ ["--swatch" as string]: phaseColor(item.number).ink }}
                onClick={() => focusPhase(itemIndex)}
              >
                <i className="phase-swatch" aria-hidden="true" />
                <span>{String(item.number).padStart(2, "0")}</span>
                {item.name}
              </button>
            ))}
          </nav>

          <div className="field-plate">
            <div className="field-copy">
              <p className="field-kicker">
                {catalog.title}
                <span> {phase.daysLabel}</span>
              </p>
              <h1>{phase.name}</h1>
              {phase.summary ? <p className="field-summary">{phase.summary}</p> : null}
              <p className="field-program">{description}</p>
              <p className="field-actions">
                <Link href={startHref}>{startLabel}</Link>
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </p>
            </div>
            <div className="field-canvas-wrap">
              <canvas
                ref={canvasRef}
                className="field-canvas"
                aria-hidden="true"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const day = dayUnderPointer(modelRef.current, rect.width, rect.height, {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  });
                  if (day != null) setActiveDay(day);
                }}
                onPointerMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
                }}
                onPointerLeave={() => {
                  pointerRef.current = null;
                }}
              />
            </div>
          </div>

          <div className="field-step">
            <button type="button" onClick={() => focusPhase(index - 1)} disabled={index === 0}>
              Previous phase
            </button>
            <button type="button" onClick={() => focusPhase(index + 1)} disabled={index === phases.length - 1}>
              Next phase
            </button>
          </div>

          <div className="field-days">
            <p className="field-day-live" aria-live="polite">
              {shown ? `${String(shown.day).padStart(3, "0")} ${shown.title}${shown.published ? "" : " · Planned"}` : ""}
            </p>
            <ol>
              {days.map((day) => {
                const label = `${String(day.day).padStart(3, "0")} ${day.title}`;
                const body = (
                  <>
                    <span>{String(day.day).padStart(2, "0")}</span>
                    <span>{day.title}</span>
                    <span>{day.published ? "Open" : "Planned"}</span>
                  </>
                );
                return (
                  <li
                    key={day.slug}
                    className={`${day.published ? "is-open" : "is-planned"}${
                      shown?.day === day.day ? " is-focus" : ""
                    }${lit.has(day.day) ? " is-lit" : ""}`}
                  >
                    {day.published && day.href ? (
                      <Link
                        href={day.href}
                        onFocus={() => setActiveDay(day.day)}
                        onMouseEnter={() => setActiveDay(day.day)}
                      >
                        {body}
                      </Link>
                    ) : (
                      <span tabIndex={0} onFocus={() => setActiveDay(day.day)} aria-label={`${label}, planned`}>
                        {body}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            {fact && shown ? (
              <div className="field-inspect">
                <p>
                  {shown.published ? "Open." : "Planned. The title is here. The lesson is not."} {fact.goal}
                </p>
                {fact.concepts.length > 0 ? (
                  <div className="field-concepts" role="group" aria-label="What this day teaches">
                    {fact.concepts.map((concept) => (
                      <button
                        key={concept}
                        type="button"
                        className={focusConcept === concept ? "is-on" : ""}
                        aria-pressed={focusConcept === concept}
                        onClick={() => setFocusConcept((current) => (current === concept ? null : concept))}
                      >
                        {concept}
                      </button>
                    ))}
                  </div>
                ) : null}
                {focusConcept ? (
                  <p>
                    {lit.size > 1
                      ? `Also in this phase: ${[...lit]
                          .filter((day) => day !== shown.day)
                          .map((day) => String(day).padStart(2, "0"))
                          .join(", ")}.`
                      : "Taught on this day."}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
