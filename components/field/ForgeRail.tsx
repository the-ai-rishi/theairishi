"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import brandLanguage from "@/content/config/brand-language.json";
import experience from "@/content/config/experience.json";
import type { LearnerCatalog } from "@/lib/continue-learning";
import { resolveContinue } from "@/lib/continue-learning";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import RegistryIcon from "@/components/icons/RegistryIcon";

export type DayFact = {
  day: number;
  phaseId: string;
  goal: string;
  concepts: string[];
};

const notes = experience.phases as Record<string, { plain: string; icon: string; accent: string }>;

export default function ForgeRail({
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
          document.getElementById(owner.phaseId)?.scrollIntoView({ block: "nearest" });
          return;
        }
      }
      if (phaseMatch) {
        const next = phases.findIndex((item) => item.number === Number(phaseMatch[1]));
        if (next >= 0) {
          setPickedIndex(next);
          document.getElementById(phases[next].id)?.scrollIntoView({ block: "nearest" });
        }
      }
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [catalog.days, phases]);

  function selectPhase(next: number, moveFocus = false) {
    const clamped = Math.max(0, Math.min(phases.length - 1, next));
    setPickedIndex(clamped);
    setFocusConcept(null);
    const chosen = phases[clamped];
    const phaseDays = chosen ? catalog.days.filter((day) => day.phaseId === chosen.id) : [];
    const open = phaseDays.find((day) => day.published) || phaseDays[0];
    setActiveDay(open?.day ?? null);
    if (chosen) {
      history.replaceState(null, "", `#${chosen.id}`);
      if (moveFocus) {
        window.requestAnimationFrame(() => {
          document.getElementById(chosen.id)?.querySelector<HTMLButtonElement>(".rail-station")?.focus();
        });
      }
    }
  }

  if (!phase) return null;

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
  const publishedTotal = catalog.days.filter((day) => day.published).length;
  const statusLine = !hasHydrated
    ? ""
    : continueTarget.kind === "continue"
      ? continueTarget.ctaLabel
      : continueTarget.kind === "wait"
        ? `Next title is Day ${continueTarget.waitDay}`
        : "Start at Day 1";

  return (
    <section className="rail-home" aria-label={`${brandLanguage.displayName}. ${brandLanguage.programmeName}`}>
      <header className="rail-identity">
        <p className="rail-brand">{brandLanguage.displayName}</p>
        <h1>{brandLanguage.programmeName}</h1>
        <p className="rail-status">
          <span>{catalog.totalDays} days</span>
          <span>{phases.length} phases</span>
          <span>{publishedTotal} published</span>
          {statusLine ? <span>{statusLine}</span> : null}
        </p>
        <p className="rail-lead">{experience.hero.lead}</p>
        <p className="rail-detail-copy">{experience.hero.detail}</p>
        <p className="rail-because">{experience.hero.because}</p>
        <p className="rail-actions">
          <Link className="rail-start" href={startHref}>
            {startLabel}
          </Link>
          <Link className="rail-plan" href={`${secondaryHref}#${phase.id}`}>
            {secondaryLabel}
          </Link>
        </p>
      </header>

      <ol
        className="rail-list"
        aria-label="Ten phases"
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          const current = (event.target as HTMLElement).closest("li[data-phase]");
          const from = phases.findIndex((item) => item.id === current?.getAttribute("data-phase"));
          const base = from >= 0 ? from : index;
          event.preventDefault();
          selectPhase(base + (event.key === "ArrowDown" ? 1 : -1), true);
        }}
      >
        {phases.map((item, itemIndex) => {
          const itemNote = notes[item.id];
          const phaseDays = catalog.days.filter((day) => day.phaseId === item.id);
          const published = phaseDays.filter((day) => day.published).length;
          const planned = phaseDays.length - published;
          const done = hasHydrated ? phaseDays.filter((day) => state.completed.includes(day.slug)).length : 0;
          const on = itemIndex === index;
          return (
            <li key={item.id} id={item.id} className={on ? "is-on" : ""} data-accent={itemNote?.accent || "ink"} data-phase={item.id}>
              <button
                type="button"
                className="rail-station"
                aria-expanded={on}
                aria-current={on ? "true" : undefined}
                onClick={() => selectPhase(itemIndex)}
              >
                <RegistryIcon name={itemNote?.icon} className="rail-icon" />
                <span className="rail-copy">
                  <span className="rail-num">{String(item.number).padStart(2, "0")}</span>
                  <span className="rail-name">{item.name}</span>
                  <span className="rail-range">Days {item.daysLabel}</span>
                  <span className="rail-plain">{itemNote?.plain || item.summary}</span>
                  <span className="rail-state">
                    {published} published
                    <span aria-hidden="true"> · </span>
                    {planned} planned
                    {hasHydrated ? (
                      <>
                        <span aria-hidden="true"> · </span>
                        {done} completed on this device
                      </>
                    ) : null}
                    <span className="rail-ticks" aria-hidden="true">
                      {phaseDays.map((day) => (
                        <i key={day.slug} className={day.published ? "is-open" : ""} />
                      ))}
                    </span>
                  </span>
                </span>
              </button>
              {on ? (
                <div className="rail-panel">
                  <p>
                    {openCount} of {days.length} days are open. The rest are planned titles.
                  </p>
                  {phase.summary ? <p>{phase.summary}</p> : null}
                  <ol className="rail-days">
                    {days.map((day) => {
                      const className = `rail-day${day.published ? " is-open" : " is-planned"}${
                        shown?.day === day.day ? " is-focus" : ""
                      }${lit.has(day.day) ? " is-lit" : ""}`;
                      const name = `Day ${day.day}, ${day.title}. ${day.published ? "Open" : "Planned"}`;
                      const num = String(day.day).padStart(2, "0");
                      return (
                        <li key={day.slug}>
                          {day.published && day.href ? (
                            <Link
                              href={day.href}
                              className={className}
                              aria-label={name}
                              aria-current={shown?.day === day.day ? "true" : undefined}
                              onFocus={() => setActiveDay(day.day)}
                            >
                              {num}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className={className}
                              aria-label={name}
                              aria-pressed={shown?.day === day.day}
                              onClick={() => setActiveDay(day.day)}
                            >
                              {num}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                  {shown ? (
                    <div className="rail-note">
                      <p>
                        <strong>
                          Day {shown.day}. {shown.title}.
                        </strong>{" "}
                        {shown.published ? "Open." : "Planned. The title is here. The lesson is not."} {fact?.goal}
                      </p>
                      {fact && fact.concepts.length > 0 ? (
                        <div className="rail-concepts" role="group" aria-label="What this day teaches">
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
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
