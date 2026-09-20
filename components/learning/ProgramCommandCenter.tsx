"use client";

import Link from "next/link";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { formatDayLabel } from "@/lib/labels";
import { useLessonProgress } from "./useLessonProgress";
import CurrentWorkCard from "@/components/product/CurrentWorkCard";
import JourneyMap from "@/components/product/JourneyMap";

export default function ProgramCommandCenter({ catalog }: { catalog: LearnerCatalog }) {
  const { state, hasHydrated, isCompleted, isStarted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const published = catalog.days.filter((day) => day.published && day.href);
  const planned = Math.max(0, catalog.totalDays - published.length);
  const percent =
    target.totalDays > 0 ? Math.round((target.completedCount / target.totalDays) * 100) : 0;
  const currentPhase =
    catalog.phases.find((phase) => phase.number === target.phaseNumber) ||
    catalog.phases.find((phase) => phase.id === catalog.currentPhaseId);
  const currentIndex = catalog.days.findIndex((day) => day.slug === target.slug);
  const upNext =
    currentIndex >= 0
      ? catalog.days.slice(currentIndex + 1).find((day) => day.published) ||
        catalog.days[currentIndex + 1] ||
        null
      : catalog.days.find((day) => day.published && day.slug !== target.slug) || null;
  const phaseDays = currentPhase
    ? catalog.days.filter((day) => day.phaseId === currentPhase.id)
    : published;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="kicker text-gold/80">Program</p>
          <h1 className="mt-2 font-serif text-[2.1rem] leading-[0.95] text-cream sm:text-5xl">
            {catalog.title}
          </h1>
          <p className="stat-line mt-4">
            <span>{catalog.durationLabel}</span>
            <span>{published.length} available</span>
            <span>{planned} planned</span>
            {currentPhase ? <span>Phase {String(currentPhase.number).padStart(2, "0")} now</span> : null}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-serif text-4xl tabular-nums text-cream sm:text-5xl">
            {target.completedCount}
            <span className="text-cream/30">/{target.totalDays}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            {percent}% complete
          </p>
        </div>
      </header>

      <section className="mt-8" aria-labelledby="today-heading">
        <h2 id="today-heading" className="sr-only">
          Today
        </h2>
        <CurrentWorkCard catalog={catalog} size="hero" />
      </section>

      {upNext ? (
        <section className="mt-6" aria-labelledby="up-next-heading">
          <p id="up-next-heading" className="kicker text-gold/80">
            Up next
          </p>
          {upNext.published && upNext.href ? (
            <Link
              href={upNext.href}
              className="mt-3 flex min-h-12 flex-wrap items-baseline justify-between gap-2 border-b border-hairline py-3"
            >
              <span className="font-serif text-xl text-cream">{upNext.title}</span>
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/40">
                {formatDayLabel(upNext.day)}
              </span>
            </Link>
          ) : (
            <p className="mt-3 text-[15px] leading-relaxed text-cream/50">
              {formatDayLabel(upNext.day)} — {upNext.title} is planned, not a page yet.
            </p>
          )}
        </section>
      ) : null}

      <section className="mt-10 sm:mt-12" aria-labelledby="this-phase-heading">
        <p className="kicker text-gold/80">This phase</p>
        <h2 id="this-phase-heading" className="mt-3 font-serif text-[1.85rem] text-cream sm:text-3xl">
          {currentPhase
            ? `Phase ${String(currentPhase.number).padStart(2, "0")} · ${currentPhase.name}`
            : "Published days"}
        </h2>
        {phaseDays.length === 0 ? (
          <p className="mt-6 text-cream/45">No daily lessons are published on this site yet.</p>
        ) : (
          <ol className="mt-5 divide-y divide-hairline border-y border-hairline">
            {phaseDays.map((day) => {
              const completed = hasHydrated && isCompleted(day.slug);
              const started = hasHydrated && isStarted(day.slug) && !completed;
              const current = target.slug === day.slug;
              const row = (
                <span
                  className={`group grid gap-1 py-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-4 ${
                    current ? "bg-gold/[0.04]" : ""
                  }`}
                >
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
                    <Link href={day.href} className="block hover:bg-cream/[0.02]">
                      {row}
                    </Link>
                  ) : (
                    <div aria-disabled="true">{row}</div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="mt-12 sm:mt-14" aria-labelledby="spine-heading">
        <p className="kicker text-gold/80">The spine</p>
        <h2 id="spine-heading" className="mt-3 font-serif text-[1.85rem] text-cream sm:text-3xl">
          {catalog.mapTitle || `${catalog.phases.length} phases`}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
          Open a phase to see every day. Planned days stay titles until the lesson is published.
        </p>
        <div className="mt-6">
          <JourneyMap catalog={catalog} showTitles />
        </div>
      </section>
    </div>
  );
}
