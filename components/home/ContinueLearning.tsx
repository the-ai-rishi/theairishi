"use client";

import Link from "next/link";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { formatDayLabel } from "@/lib/labels";
import { useLessonProgress } from "@/components/learning/useLessonProgress";

export default function ContinueLearning({
  catalog,
}: {
  catalog: LearnerCatalog;
  courses?: unknown;
}) {
  const { state, hasHydrated } = useLessonProgress();
  if (!hasHydrated) return null;

  const target = resolveContinue(state, catalog);
  if (target.completedCount === 0 && target.startedCount === 0 && !state.lastVisited) {
    return null;
  }

  const percent =
    target.totalDays > 0 ? Math.round((target.completedCount / target.totalDays) * 100) : 0;
  const heading =
    target.kind === "wait"
      ? target.waitTitle
        ? `${formatDayLabel(target.waitDay || 0)} is next — not published yet`
        : "Published days are complete"
      : `${target.ctaLabel.replace(/^Continue /, "").replace(/^Start /, "")}${target.title ? ` — ${target.title}` : ""}`;

  return (
    <section id="continue" className="py-2 sm:py-3" aria-label="Continue learning">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-y border-hairline py-4 sm:flex-row sm:items-center sm:gap-6">
          <span className="kicker shrink-0 text-gold/80">
            {target.kind === "wait" ? "Waiting" : "Continue"}
          </span>
          <h2 className="min-w-0 flex-1 font-serif text-xl tracking-[0.01em] text-cream sm:text-2xl">
            {heading}
          </h2>
          <div className="flex items-center gap-3 sm:w-44">
            <div
              className="h-px flex-1 bg-hairline"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={target.totalDays}
              aria-valuenow={target.completedCount}
              aria-label="Program progress"
            >
              <div className="h-px bg-gold" style={{ width: `${Math.max(percent, percent > 0 ? 6 : 0)}%` }} />
            </div>
            <span className="font-mono text-[12px] tabular-nums text-cream/40">
              {target.completedCount}/{target.totalDays}
            </span>
          </div>
          <Link
            href={target.href || "/learn"}
            className="link-editorial shrink-0 font-mono text-[13px] tracking-[0.12em] text-cream/70 hover:text-gold"
          >
            {target.kind === "wait" ? "See the plan →" : `${target.ctaLabel} →`}
          </Link>
        </div>
      </div>
    </section>
  );
}
