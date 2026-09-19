"use client";

import Link from "next/link";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
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

  return (
    <aside className={`panel panel-hero p-5 ${size === "hero" ? "sm:p-7" : "sm:p-6"}`} aria-label="Current work">
      <div className="flex items-baseline justify-between gap-3">
        <p className="kicker text-gold/80">Current work</p>
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
            {day ? `Day ${String(day.day).padStart(2, "0")}` : "Day 01"}
            {day?.phaseName ? ` · ${formatPhaseLabel(day.phaseNumber)} · ${day.phaseName}` : ""}
          </p>
          <h2 className="mt-2 font-serif text-[1.65rem] leading-[1.12] text-cream sm:text-3xl">
            {day?.title || target.title || "Shell from zero"}
          </h2>
          {day?.summary ? (
            <p className="mt-3 text-[15px] leading-relaxed text-cream/50">{day.summary}</p>
          ) : null}
          {outcomes && outcomes.length > 0 ? (
            <ul className="mt-4 space-y-1.5">
              {outcomes.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-cream/60">
                  <span className="mt-1.5 h-1 w-1 shrink-0 bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={target.href || catalog.startHref} className="btn-primary btn-block">
              {target.ctaLabel}
            </Link>
            {estimatedMinutes ? (
              <span className="font-mono text-[12px] text-cream/40">~{estimatedMinutes} min</span>
            ) : null}
          </div>
        </>
      )}
      <div className="mt-6">
        <div
          className="h-1 overflow-hidden bg-hairline"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={target.totalDays}
          aria-valuenow={target.completedCount}
          aria-label="Program progress"
        >
          <div
            className="h-full bg-gold transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(target.completedCount > 0 ? 3 : 0, percent))}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] tabular-nums text-cream/35">{percent}% complete</p>
      </div>
    </aside>
  );
}
