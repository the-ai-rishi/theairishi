"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import brandLanguage from "@/content/config/brand-language.json";
import type { LearnerCatalog } from "@/lib/continue-learning";
import { resolveContinue } from "@/lib/continue-learning";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import { fieldOf } from "@/lib/phase-color";

export type DayFact = {
  day: number;
  phaseId: string;
  goal: string;
  concepts: string[];
};

const W = 1200;
const BASE = 440;
const SEAMS = [0.42, 0.22, 0.5, 0.3, 0.38, 0.16, 0.46, 0.28, 0.4, 0.18, 0.34];

function ridge(seam: number) {
  return 28 + seam * 70;
}

function landPath(index: number, x0: number, x1: number) {
  const y0 = ridge(SEAMS[index] ?? 0.4);
  const y1 = ridge(SEAMS[index + 1] ?? 0.4);
  const mid = (x0 + x1) / 2;
  const peak = Math.min(y0, y1) - 16;
  return `M ${x0.toFixed(1)} ${BASE} L ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${mid.toFixed(1)} ${peak.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x1.toFixed(1)} ${BASE} Z`;
}

export default function ForgeWorld({
  catalog,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  facts,
}: {
  catalog: LearnerCatalog;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  facts: DayFact[];
}) {
  const phases = catalog.phases;
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [focusConcept, setFocusConcept] = useState<string | null>(null);
  const { state, hasHydrated } = useLessonProgress();
  const continueTarget = resolveContinue(hasHydrated ? state : null, catalog);
  const followed =
    continueTarget.phaseNumber != null
      ? phases.findIndex((item) => item.number === continueTarget.phaseNumber)
      : 0;
  const index = pickedIndex ?? (followed >= 0 ? followed : 0);
  const phase = phases[index] || phases[0];

  const days = useMemo(
    () => (phase ? catalog.days.filter((day) => day.phaseId === phase.id) : []),
    [catalog.days, phase],
  );

  useEffect(() => {
    function readHash() {
      const hash = window.location.hash;
      const dayMatch = /day-(\d+)/.exec(hash);
      const phaseMatch = /phase-(\d+)/.exec(hash);
      if (dayMatch) {
        const day = Number(dayMatch[1]);
        const owner = catalog.days.find((item) => item.day === day);
        if (owner) {
          const next = phases.findIndex((item) => item.id === owner.phaseId);
          if (next >= 0) setPickedIndex(next);
          setActiveDay(day);
          return;
        }
      }
      if (phaseMatch) {
        const next = phases.findIndex((item) => item.number === Number(phaseMatch[1]));
        if (next >= 0) setPickedIndex(next);
      }
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [catalog.days, phases]);

  function selectPhase(next: number) {
    const clamped = Math.max(0, Math.min(phases.length - 1, next));
    setPickedIndex(clamped);
    setFocusConcept(null);
    const chosen = phases[clamped];
    const phaseDays = chosen ? catalog.days.filter((day) => day.phaseId === chosen.id) : [];
    const open = phaseDays.find((day) => day.published) || phaseDays[0];
    setActiveDay(open?.day ?? null);
    if (chosen) history.replaceState(null, "", `#${chosen.id}`);
  }

  if (!phase) return null;

  const tone = fieldOf(phase.number);
  const preferredDay = activeDay ?? (pickedIndex == null ? continueTarget.day : null);
  const shown = days.find((day) => day.day === preferredDay) || days.find((day) => day.published) || days[0];
  const fact = facts.find((item) => item.day === shown?.day);
  const lit = new Set(
    focusConcept
      ? facts.filter((item) => item.phaseId === phase.id && item.concepts.includes(focusConcept)).map((item) => item.day)
      : [],
  );
  const startHref = hasHydrated && continueTarget.href ? continueTarget.href : primaryHref;
  const startLabel = hasHydrated ? continueTarget.ctaLabel : primaryLabel;
  const openCount = days.filter((day) => day.published).length;
  const whereAi = phases.find((item) => item.number === 9);

  return (
    <section
      className="atlas"
      aria-label={`${brandLanguage.displayName}. ${brandLanguage.programmeName}`}
      style={{ ["--accent" as string]: tone.ink }}
    >
      <div className="atlas-copy">
        <p className="atlas-brand">{brandLanguage.displayName}</p>
        <h1>{brandLanguage.programmeName}</h1>
        <p className="atlas-lead">{brandLanguage.programmeDescription}</p>
        <p className="atlas-actions">
          <Link className="atlas-start" href={startHref}>
            {startLabel}
          </Link>
          <Link className="atlas-plan" href={`${secondaryHref}#${phase.id}`}>
            {secondaryLabel}
          </Link>
        </p>
        {whereAi ? (
          <p className="atlas-where">
            Retrieval and controlled tool use begin at day {whereAi.startDay}, after the system can be operated.
          </p>
        ) : null}
      </div>

      <div className="atlas-stage">
        <div className="atlas-field">
          <svg className="atlas-svg" viewBox={`0 0 ${W} 460`} aria-hidden="true">
            <rect width={W} height="460" fill="#f4efe6" />
            {phases.map((item, itemIndex) => {
              const x0 = ((item.startDay - 1) / 120) * W;
              const x1 = (item.endDay / 120) * W;
              const field = fieldOf(item.number);
              const on = itemIndex === index;
              return (
                <path key={item.id} d={landPath(itemIndex, x0, x1)} fill={on ? field.ink : field.pigment} />
              );
            })}
            {catalog.days.map((day) => {
              const on = day.phaseId === phase.id;
              const mark = on ? "#efe8dc" : "#1a1714";
              const x = ((day.day - 0.5) / 120) * W;
              return (
                <circle
                  key={day.slug}
                  cx={x}
                  cy="360"
                  r={on ? 5 : 3}
                  fill={day.published ? mark : "none"}
                  stroke={mark}
                  strokeWidth={on ? 1.6 : 1.2}
                />
              );
            })}
          </svg>
          <div
            className="atlas-hits"
            role="group"
            aria-label="Phases"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                selectPhase(index + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                selectPhase(index - 1);
              }
            }}
          >
            {phases.map((item, itemIndex) => {
              const on = itemIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={on ? "is-on" : ""}
                  aria-current={on ? "true" : undefined}
                  aria-label={`${String(item.number).padStart(2, "0")} ${item.name}, days ${item.daysLabel}`}
                  style={{
                    left: `${((item.startDay - 1) / 120) * 100}%`,
                    width: `${((item.endDay - item.startDay + 1) / 120) * 100}%`,
                    color: on ? "#efe8dc" : "#1a1714",
                  }}
                  onClick={() => selectPhase(itemIndex)}
                >
                  <span>{String(item.number).padStart(2, "0")}</span>
                  <span className="atlas-hit-name">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="atlas-index" role="group" aria-label="Phases">
          {phases.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className={itemIndex === index ? "is-on" : ""}
              aria-current={itemIndex === index ? "true" : undefined}
              aria-label={`${String(item.number).padStart(2, "0")} ${item.name}, days ${item.daysLabel}`}
              onClick={() => selectPhase(itemIndex)}
            >
              {String(item.number).padStart(2, "0")}
            </button>
          ))}
        </div>

        <div className="atlas-focus">
          <h2>{phase.name}</h2>
          <p>
            Days {phase.daysLabel}
            <span>
              {" "}
              · {openCount} of {days.length} open
            </span>
          </p>
          {phase.summary ? <p>{phase.summary}</p> : null}
        </div>

        <ol className="atlas-days">
          {days.map((day) => {
            const className = `${day.published ? "is-open" : "is-planned"}${shown?.day === day.day ? " is-focus" : ""}${
              lit.has(day.day) ? " is-lit" : ""
            }`;
            const label = `${String(day.day).padStart(2, "0")} ${day.title}`;
            return (
              <li key={day.slug}>
                {day.published && day.href ? (
                  <Link href={day.href} className={className} onFocus={() => setActiveDay(day.day)}>
                    {label}
                  </Link>
                ) : (
                  <button type="button" className={className} onClick={() => setActiveDay(day.day)}>
                    {label}
                    <span className="sr-only">, planned</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>

        {fact ? (
          <div className="atlas-note">
            <p>
              {shown?.published ? "Open." : "Planned. The title is here. The lesson is not."} {fact.goal}
            </p>
            {fact.concepts.length > 0 ? (
              <div className="atlas-concepts" role="group" aria-label="What this day teaches">
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
          </div>
        ) : null}
      </div>
    </section>
  );
}
