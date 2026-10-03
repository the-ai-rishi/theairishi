"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import brandLanguage from "@/content/config/brand-language.json";
import type { LearnerCatalog } from "@/lib/continue-learning";
import { resolveContinue } from "@/lib/continue-learning";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import { phaseColor } from "@/lib/phase-color";

export type DayFact = {
  day: number;
  phaseId: string;
  goal: string;
  concepts: string[];
};

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

  function selectPhase(next: number) {
    const clamped = Math.max(0, Math.min(phases.length - 1, next));
    setPickedIndex(clamped);
    setFocusConcept(null);
    const chosen = phases[clamped];
    const phaseDays = chosen ? catalog.days.filter((day) => day.phaseId === chosen.id) : [];
    const open = phaseDays.find((day) => day.published) || phaseDays[0];
    setActiveDay(open?.day ?? null);
  }

  if (!phase) return null;

  const tone = phaseColor(phase.number);
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

  return (
    <section
      className="forge-world"
      aria-label={`${brandLanguage.displayName}. ${brandLanguage.programmeName}`}
      style={{ ["--accent" as string]: tone.ink }}
    >
      <p className="forge-brand">{brandLanguage.displayName}</p>
      <h1>{brandLanguage.programmeName}</h1>
      <p className="forge-lead">{brandLanguage.programmeDescription}</p>
      <p className="forge-actions">
        <Link className="forge-start" href={startHref}>
          {startLabel}
        </Link>
        <Link className="forge-plan" href={`${secondaryHref}#${phase.id}`}>
          {secondaryLabel}
        </Link>
      </p>

      <div className="forge-journey">
        <div className="forge-track" aria-hidden="true">
          {phases.map((item, itemIndex) => (
            <span
              key={item.id}
              className={itemIndex === index ? "is-on" : ""}
              style={{ flexGrow: Math.max(1, item.endDay - item.startDay + 1) }}
            />
          ))}
        </div>
        <div className="forge-index" role="group" aria-label="Phases">
          {phases.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className={itemIndex === index ? "is-on" : ""}
              aria-current={itemIndex === index ? "true" : undefined}
              aria-label={`${String(item.number).padStart(2, "0")} ${item.name}, days ${item.daysLabel}`}
              style={{ flexGrow: Math.max(1, item.endDay - item.startDay + 1) }}
              onClick={() => selectPhase(itemIndex)}
            >
              {String(item.number).padStart(2, "0")}
            </button>
          ))}
        </div>

        <div className="forge-focus">
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

        <ol className="forge-days">
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
          <div className="forge-note">
            <p>{shown?.published ? "Open." : "Planned. The title is here. The lesson is not."} {fact.goal}</p>
            {fact.concepts.length > 0 ? (
              <div className="forge-concepts" role="group" aria-label="What this day teaches">
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
                      .filter((day) => day !== shown?.day)
                      .map((day) => String(day).padStart(2, "0"))
                      .join(", ")}.`
                  : "Taught on this day."}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
