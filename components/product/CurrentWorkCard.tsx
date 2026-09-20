"use client";

import Link from "next/link";
import { phaseProgress, resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { formatDayLabel, formatPhaseLabel } from "@/lib/labels";
import { useLessonProgress } from "@/components/learning/useLessonProgress";

export default function CurrentWorkCard({
  catalog,
  outcomes,
  estimatedMinutes,
  size = "default",
}: {
  catalog: LearnerCatalog;
  outcomes?: string[];
  estimatedMinutes?: number;
  size?: "default" | "hero";
}) {
  const { state, hasHydrated } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const day = catalog.days.find((item) => item.slug === target.slug) || catalog.days.find((item) => item.published);
  const percent = target.totalDays > 0 ? Math.round((target.completedCount / target.totalDays) * 100) : 0;
  const phases = phaseProgress(catalog, hasHydrated ? state : null);
  const kicker =
    target.kind === "wait" ? "Waiting" : target.kind === "continue" ? "Now" : "Today";
  const phaseNow = target.phaseNumber || catalog.phases[0]?.number || 1;
  const phaseName =
    catalog.phases.find((phase) => phase.number === phaseNow)?.name ||
    day?.phaseName ||
    "";

  return (
    <aside className={`shift-ticket ${size === "hero" ? "p-5 sm:p-8" : "p-5 sm:p-6"}`} aria-label="Today's shift">
      <div className="flex items-baseline justify-between gap-3">
        <p className="kicker text-gold/85">{kicker}</p>
        <p className="font-mono text-[11px] tabular-nums text-cream/40">
          {target.completedCount} / {target.totalDays}
        </p>
      </div>
      {target.kind === "wait" ? (
        <>
          <h2 className="mt-3 font-serif text-2xl text-cream sm:text-[1.85rem]">Published days complete</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-cream/50">
            {target.waitTitle
              ? `${formatDayLabel(target.waitDay || 0)} — ${target.waitTitle} is planned, not a page yet.`
              : "The next day is not published yet."}
          </p>
          <Link href="/learn" className="btn-ghost mt-6">
            See the plan
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            {day ? `Day ${String(day.day).padStart(2, "0")} of ${catalog.totalDays}` : "Day 01"}
            {day?.phaseName ? ` · ${formatPhaseLabel(day.phaseNumber)} · ${day.phaseName}` : ""}
            {estimatedMinutes ? ` · ~${estimatedMinutes} min` : ""}
          </p>
          <h2 className="mt-2 font-serif text-[1.85rem] leading-[1.08] text-cream sm:text-[2.35rem]">
            {day?.title || target.title || "Shell from zero"}
          </h2>
          {outcomes && outcomes.length > 0 ? (
            <ul className="mt-4 space-y-1.5">
              {outcomes.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2 text-[14px] leading-relaxed text-cream/65">
                  <span className="mt-1.5 h-1 w-1 shrink-0 bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : day?.summary ? (
            <p className="mt-3 text-[15px] leading-relaxed text-cream/50">{day.summary}</p>
          ) : null}
          <div className="mt-6">
            <Link href={target.href || catalog.startHref} className="btn-primary btn-block">
              {target.ctaLabel}
            </Link>
          </div>
        </>
      )}
      <div className="mt-6">
        <div
          className="shift-ticks"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={Math.max(1, catalog.phases.length)}
          aria-valuenow={phaseNow}
          aria-valuetext={`Phase ${String(phaseNow).padStart(2, "0")} of ${catalog.phases.length}${phaseName ? `, ${phaseName}` : ""}`}
          aria-label="Phase on the 120-day spine"
        >
          {phases.map((phase) => {
            const now = phaseNow === phase.number;
            const done = phase.completedCount >= phase.totalDays && phase.totalDays > 0;
            return (
              <span
                key={phase.id}
                className={`shift-tick ${done ? "shift-tick-done" : now ? "shift-tick-now" : ""}`}
                title={`${formatPhaseLabel(phase.number)} · ${phase.name}`}
              />
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[11px] tabular-nums text-cream/35">
          {percent}% of {catalog.totalDays} days
        </p>
      </div>
    </aside>
  );
}
