"use client";

import Link from "next/link";
import { phaseProgress, resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { formatPhaseLabel } from "@/lib/labels";
import { useLessonProgress } from "@/components/learning/useLessonProgress";

export default function JourneyMap({
  catalog,
  showTitles = false,
  compact = false,
}: {
  catalog: LearnerCatalog;
  showTitles?: boolean;
  compact?: boolean;
}) {
  const { state, hasHydrated, isCompleted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const phases = phaseProgress(catalog, hasHydrated ? state : null);

  return (
    <ol className={compact ? "space-y-5" : "space-y-7"} aria-label="120-day path">
      {phases.map((phase) => {
        const days = catalog.days.filter((day) => day.phaseId === phase.id);
        const isCurrentPhase = target.phaseNumber === phase.number || phase.id === catalog.currentPhaseId;
        return (
          <li
            key={phase.id}
            id={showTitles ? phase.id : undefined}
            className={`scroll-mt-24 ${isCurrentPhase ? "phase-now" : ""}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold/80">
                {formatPhaseLabel(phase.number).replace(/Phase (\d+)/, (_, n) => `Phase ${String(n).padStart(2, "0")}`)}
                <span className="ml-2 tracking-[0.08em] text-cream/70 normal-case">{phase.name}</span>
              </p>
              <p className="font-mono text-[11px] tabular-nums text-cream/35">
                Days {phase.daysLabel}
                <span className="ml-2">
                  {phase.completedCount}/{phase.totalDays}
                </span>
                {isCurrentPhase ? <span className="ml-2 text-gold/80">now</span> : null}
              </p>
            </div>
            <div className="mt-2.5 flex max-w-full flex-wrap gap-1.5" role="list" aria-label={`${phase.name} days`}>
              {days.map((day) => {
                const done = hasHydrated && isCompleted(day.slug);
                const current = target.slug === day.slug;
                const cls = done
                  ? "day-dot-done"
                  : current
                    ? "day-dot-now"
                    : day.published
                      ? "day-dot-live"
                      : "day-dot-plan";
                const label = `Day ${day.day} — ${day.title}${done ? ", complete" : day.published ? ", available" : ", planned"}`;
                const inner = <span className={`day-dot ${cls}`} aria-hidden="true" />;
                return (
                  <span key={day.slug} role="listitem">
                    {day.published && day.href ? (
                      <Link
                        href={day.href}
                        className="inline-flex min-h-8 min-w-8 items-center justify-center"
                        title={label}
                        aria-label={label}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <span
                        className="inline-flex min-h-8 min-w-8 items-center justify-center"
                        title={label}
                        aria-label={label}
                      >
                        {inner}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            {showTitles ? (
              <ol className="mt-4 divide-y divide-hairline border-y border-hairline">
                {days.map((day) => {
                  const done = hasHydrated && isCompleted(day.slug);
                  const current = target.slug === day.slug;
                  const row = (
                    <span className="grid gap-1 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-baseline">
                      <span className="font-mono text-[12px] text-cream/45">
                        Day {String(day.day).padStart(2, "0")}
                      </span>
                      <span>
                        <span className={`font-serif text-lg ${day.published ? "text-cream" : "text-cream/50"}`}>
                          {day.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-cream/40">{day.summary}</span>
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                        {done ? "Complete" : current ? "Now" : day.published ? "Available" : "Planned"}
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
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
