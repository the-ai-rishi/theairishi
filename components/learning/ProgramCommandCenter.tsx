"use client";

import Link from "next/link";
import { phaseProgress, resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { formatDayLabel, formatPhaseLabel } from "@/lib/labels";
import { useLessonProgress } from "./useLessonProgress";
import ProgramPhaseMap from "./ProgramPhaseMap";
import type { HydratedPhase } from "@/lib/programs";

interface ProgramCommandCenterProps {
  catalog: LearnerCatalog;
  phases: HydratedPhase[];
}

export default function ProgramCommandCenter({ catalog, phases }: ProgramCommandCenterProps) {
  const { state, hasHydrated, isCompleted, isStarted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const phasesLive = phaseProgress(catalog, hasHydrated ? state : null);
  const currentPhase =
    phasesLive.find((phase) => phase.number === target.phaseNumber) ||
    phasesLive.find((phase) => phase.id === catalog.currentPhaseId) ||
    phasesLive[0];
  const percent =
    target.totalDays > 0 ? Math.round((target.completedCount / target.totalDays) * 100) : 0;
  const published = catalog.days.filter((day) => day.published && day.href);

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <p className="kicker text-gold/80">{catalog.durationLabel}</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[0.01em] text-cream sm:text-7xl">
          {catalog.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cream/55 sm:text-lg">
          {catalog.description}
        </p>
        {catalog.outcome ? (
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/45">{catalog.outcome}</p>
        ) : null}

        <div className="mt-10 border-y border-hairline py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-cream/40">Progress</p>
              <p className="mt-2 font-serif text-3xl text-cream tabular-nums">
                {target.completedCount} / {target.totalDays}
                <span className="ml-2 font-sans text-base text-cream/40">days complete</span>
              </p>
            </div>
            {currentPhase ? (
              <p className="font-mono text-[13px] text-cream/50">
                {formatPhaseLabel(currentPhase.number)} — {currentPhase.name}
                <span className="text-cream/35">
                  {" "}
                  · {currentPhase.completedCount} / {currentPhase.totalDays}
                </span>
              </p>
            ) : null}
          </div>
          <div
            className="mt-4 h-1.5 bg-hairline"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={target.totalDays}
            aria-valuenow={target.completedCount}
            aria-label="Program progress"
          >
            <div
              className="h-full bg-gold transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.max(target.completedCount > 0 ? 2 : 0, percent))}%` }}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {target.kind === "wait" ? (
              <p className="max-w-xl text-[15px] leading-relaxed text-cream/55">
                Published days are complete.
                {target.waitTitle
                  ? ` ${formatDayLabel(target.waitDay || 0)} — ${target.waitTitle} is planned, not a page yet.`
                  : " The next day is not published yet."}
              </p>
            ) : (
              <>
                <Link href={target.href || catalog.startHref} className="btn-primary">
                  {target.ctaLabel}
                </Link>
                {target.title ? (
                  <p className="font-mono text-[13px] text-cream/45">
                    {formatDayLabel(target.day || 1)} — {target.title}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8" aria-label="Phases">
        <p className="kicker text-gold/80">Phases</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phasesLive.map((phase) => (
            <li key={phase.id}>
              <a
                href={`#${phase.id}`}
                className="block border border-hairline p-4 transition hover:border-gold/40"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold/70">
                  {formatPhaseLabel(phase.number)} · {phase.daysLabel}
                </p>
                <p className="mt-2 font-serif text-xl text-cream">{phase.name}</p>
                <p className="mt-2 font-mono text-[12px] tabular-nums text-cream/40">
                  {phase.completedCount} / {phase.totalDays}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">Live today</p>
        <h2 className="mt-3 font-serif text-4xl text-cream">Available days</h2>
        {published.length === 0 ? (
          <p className="mt-6 text-cream/45">No daily lessons are published on this site yet.</p>
        ) : (
          <ol className="mt-8 divide-y divide-hairline border-y border-hairline">
            {published.map((day) => {
              const completed = hasHydrated && isCompleted(day.slug);
              const started = hasHydrated && isStarted(day.slug) && !completed;
              const current = target.slug === day.slug;
              return (
                <li key={day.slug}>
                  <Link
                    href={day.href || `/learn/${day.slug}`}
                    className="group grid gap-2 py-5 sm:grid-cols-[5.5rem_1fr_auto] sm:items-baseline"
                  >
                    <span className="font-mono text-[13px] text-gold/80">{formatDayLabel(day.day)}</span>
                    <span>
                      <span className="font-serif text-2xl text-cream group-hover:text-gold-bright">
                        {day.title}
                      </span>
                      <span className="mt-1 block text-[15px] leading-relaxed text-cream/45">
                        {day.summary}
                      </span>
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

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">The map</p>
        <h2 className="mt-3 font-serif text-4xl text-cream">
          {catalog.mapTitle || `${catalog.phases.length} phases`}
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-cream/50">
          Titles below come from the locked execution plan. A day becomes a page on this
          site only when its lesson file is published. Planned days are titles, not empty
          articles.
        </p>
        <div className="mt-10">
          <ProgramPhaseMap phases={phases} completedSlugs={hasHydrated ? state.completed : []} />
        </div>
      </section>
    </>
  );
}
