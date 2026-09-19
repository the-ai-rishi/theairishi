"use client";

import { formatDayLabel } from "@/lib/labels";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { useLessonProgress } from "./useLessonProgress";

interface LessonStickyNavProps {
  slug: string;
  day?: number;
  stage: string;
  catalog: LearnerCatalog;
  nav: Array<{ nav: string; href: string; label: string }>;
}

export default function LessonStickyNav({
  slug,
  day,
  stage,
  catalog,
  nav,
}: LessonStickyNavProps) {
  const { state, hasHydrated, isCompleted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const completedHere = hasHydrated && isCompleted(slug);
  const count = hasHydrated ? target.completedCount : 0;

  return (
    <div className="sticky top-20 z-20 border-b border-hairline bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-11 max-w-7xl items-center gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8">
        <p className="shrink-0 font-mono text-[12px] text-cream/70">
          {day ? (
            <>
              <span className="hidden sm:inline">
                {formatDayLabel(day)} of {catalog.totalDays}
              </span>
              <span className="sm:hidden">
                {formatDayLabel(day)} · {stage}
              </span>
            </>
          ) : (
            stage
          )}
        </p>
        {nav.length > 0 ? (
          <nav aria-label="On this day" className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
            {nav.map((item) => (
              <a
                key={item.nav}
                href={item.href}
                className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40 hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <span className="flex-1" />
        )}
        <p className="ml-auto shrink-0 font-mono text-[12px] tabular-nums text-cream/40">
          {count} / {catalog.totalDays}
          {completedHere ? <span className="sr-only"> This day is complete.</span> : null}
        </p>
      </div>
    </div>
  );
}
