"use client";

import { useState } from "react";
import Link from "next/link";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { formatDayLabel } from "@/lib/labels";
import { useLessonProgress } from "./useLessonProgress";
import CurrentWorkCard from "@/components/product/CurrentWorkCard";

export default function ProgramCommandCenter({ catalog }: { catalog: LearnerCatalog }) {
  const { state, hasHydrated, isCompleted, isStarted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const published = catalog.days.filter((day) => day.published && day.href);
  const planned = Math.max(0, catalog.totalDays - published.length);
  const currentPhase =
    catalog.phases.find((phase) => phase.number === target.phaseNumber) ||
    catalog.phases.find((phase) => phase.id === catalog.currentPhaseId) ||
    catalog.phases[0];
  const [phaseId, setPhaseId] = useState(currentPhase?.id || "");
  const selected = catalog.phases.find((phase) => phase.id === phaseId) || currentPhase;
  const viewingNow = selected?.id === currentPhase?.id;
  const currentIndex = catalog.days.findIndex((day) => day.slug === target.slug);
  const upNext =
    currentIndex >= 0
      ? catalog.days.slice(currentIndex + 1).find((day) => day.published) ||
        catalog.days[currentIndex + 1] ||
        null
      : catalog.days.find((day) => day.published && day.slug !== target.slug) || null;
  const phaseDays = selected ? catalog.days.filter((day) => day.phaseId === selected.id) : published;
  const retrieval = selected ? selected.number === 9 : false;

  return (
    <div className="learn-stage">
      <header className="learn-mast">
        <div className="min-w-0">
          <p className="kicker text-gold/80">Program</p>
          <h1 className="mt-2 font-serif text-[1.85rem] leading-[0.95] text-cream sm:text-5xl">{catalog.title}</h1>
          <p className="stat-line mt-3">
            <span>{catalog.durationLabel}</span>
            <span>{published.length} available</span>
            <span>{planned} planned</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-serif text-3xl tabular-nums text-cream sm:text-5xl">
            {target.completedCount}
            <span className="text-cream/30">/{target.totalDays}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">claimed on this device</p>
        </div>
      </header>

      <div className="phase-switch" role="tablist" aria-label="Phases">
        {catalog.phases.map((phase) => {
          const on = selected?.id === phase.id;
          return (
            <button
              key={phase.id}
              type="button"
              role="tab"
              id={`phase-tab-${phase.id}`}
              aria-selected={on}
              aria-controls="phase-place"
              className={on ? "is-on" : ""}
              onClick={() => setPhaseId(phase.id)}
            >
              <span>{String(phase.number).padStart(2, "0")}</span>
              {phase.name}
            </button>
          );
        })}
      </div>

      <div
        id="phase-place"
        className="phase-place"
        role="tabpanel"
        aria-labelledby={selected ? `phase-tab-${selected.id}` : undefined}
        data-mode={retrieval ? "retrieval" : "plan"}
      >
        {viewingNow ? <CurrentWorkCard catalog={catalog} /> : null}

        <h2 className="mt-6 font-serif text-[1.85rem] text-cream sm:text-4xl">
          {selected ? selected.name : "Published days"}
        </h2>
        {selected ? (
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-cream/40">
            Days {selected.startDay}–{selected.endDay}
            <span className="text-cream/25"> · </span>
            {selected.publishedCount} available
            <span className="text-cream/25"> · </span>
            {selected.totalDays - selected.publishedCount} planned
          </p>
        ) : null}
        {selected?.summary ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/55">{selected.summary}</p>
        ) : null}
        {retrieval ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/55">
            These days are retrieval, policy, and evaluation. The teaching fixtures for them sit on the
            home instruments.{" "}
            <Link href="/#control" className="link-editorial text-gold">
              Open the instruments
            </Link>
          </p>
        ) : null}

        {viewingNow && upNext && target.kind !== "wait" ? (
          <div className="mt-6">
            <p className="kicker text-gold/80">Up next</p>
            {upNext.published && upNext.href ? (
              <Link
                href={upNext.href}
                className="mt-2 flex min-h-12 flex-wrap items-baseline justify-between gap-2 border-b border-hairline py-3"
              >
                <span className="font-serif text-xl text-cream">{upNext.title}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/40">
                  {formatDayLabel(upNext.day)}
                </span>
              </Link>
            ) : (
              <p className="mt-2 text-[15px] leading-relaxed text-cream/50">
                {formatDayLabel(upNext.day)} - {upNext.title} is planned, not a page yet.
              </p>
            )}
          </div>
        ) : null}

        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
          <span className="inline-flex items-center gap-2">
            <span className="day-dot day-dot-done" aria-hidden="true" /> Complete
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="day-dot day-dot-now" aria-hidden="true" /> Now
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="day-dot day-dot-live" aria-hidden="true" /> Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="day-dot day-dot-plan" aria-hidden="true" /> Planned
          </span>
        </p>

        {phaseDays.length === 0 ? (
          <p className="mt-6 text-cream/45">No daily lessons are published on this site yet.</p>
        ) : (
          <ol className="mt-3 divide-y divide-hairline border-y border-hairline">
            {phaseDays.map((day) => {
              const completed = hasHydrated && isCompleted(day.slug);
              const started = hasHydrated && isStarted(day.slug) && !completed;
              const current = target.slug === day.slug;
              const row = (
                <span className="group grid gap-1 py-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-4">
                  <span className="flex items-center gap-2 font-mono text-[13px] text-gold/80">
                    <span
                      className={`day-dot ${
                        completed ? "day-dot-done" : current ? "day-dot-now" : day.published ? "day-dot-live" : "day-dot-plan"
                      }`}
                      aria-hidden="true"
                    />
                    {formatDayLabel(day.day)}
                  </span>
                  <span>
                    <span className={`font-serif text-xl sm:text-2xl ${day.published ? "text-cream" : "text-cream/50"}`}>
                      {day.title}
                    </span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-cream/45">{day.summary}</span>
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">
                    {completed ? "Complete" : current ? "Now" : started ? "Continue" : day.published ? "Start" : "Planned"}
                  </span>
                </span>
              );
              return (
                <li key={day.slug}>
                  {day.published && day.href ? (
                    <Link href={day.href} className="block hover:bg-cream/[0.02]" aria-current={current ? "true" : undefined}>
                      {row}
                    </Link>
                  ) : (
                    <div>{row}</div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
