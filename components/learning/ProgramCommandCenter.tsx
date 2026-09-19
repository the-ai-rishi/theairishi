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

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="kicker text-gold/80">Program</p>
          <h1 className="mt-2 font-serif text-[2.1rem] leading-[0.95] text-cream sm:text-5xl lg:text-6xl">
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

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <CurrentWorkCard catalog={catalog} size="hero" />
        <div className="panel p-4 sm:p-6">
          <p className="kicker text-gold/80">The map</p>
          <p className="mt-3 text-[14px] leading-relaxed text-cream/45">
            {catalog.totalDays} days. Gold means you marked it complete. A quiet square is still a title.
          </p>
          <div className="mt-5">
            <JourneyMap catalog={catalog} compact />
          </div>
        </div>
      </div>

      <section className="mt-10 sm:mt-12">
        <p className="kicker text-gold/80">Available now</p>
        <h2 className="mt-3 font-serif text-[1.85rem] text-cream sm:text-3xl">Published days</h2>
        {published.length === 0 ? (
          <p className="mt-6 text-cream/45">No daily lessons are published on this site yet.</p>
        ) : (
          <ol className="mt-5 divide-y divide-hairline border-y border-hairline">
            {published.map((day) => {
              const completed = hasHydrated && isCompleted(day.slug);
              const started = hasHydrated && isStarted(day.slug) && !completed;
              const current = target.slug === day.slug;
              return (
                <li key={day.slug}>
                  <Link
                    href={day.href || `/learn/${day.slug}`}
                    className={`group grid gap-1 py-4 transition sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-4 ${
                      current ? "bg-gold/[0.04]" : "hover:bg-cream/[0.02]"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono text-[13px] text-gold/80">
                      <span
                        className={`day-dot ${completed ? "day-dot-done" : current ? "day-dot-now" : "day-dot-live"}`}
                        aria-hidden="true"
                      />
                      {formatDayLabel(day.day)}
                    </span>
                    <span>
                      <span className="font-serif text-xl text-cream group-hover:text-gold-bright sm:text-2xl">
                        {day.title}
                      </span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-cream/45">{day.summary}</span>
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">
                      {completed ? "Complete" : started || current ? "Continue" : "Start"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="mt-12 sm:mt-14">
        <p className="kicker text-gold/80">Full plan</p>
        <h2 className="mt-3 font-serif text-[1.85rem] text-cream sm:text-3xl">
          {catalog.mapTitle || `${catalog.phases.length} phases`}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/50">
          A day becomes a page only when its lesson file is published. Planned days stay titles.
        </p>
        <div className="panel mt-6 p-4 sm:mt-8 sm:p-7">
          <JourneyMap catalog={catalog} showTitles />
        </div>
      </section>
    </div>
  );
}
