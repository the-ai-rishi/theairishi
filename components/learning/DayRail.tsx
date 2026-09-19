"use client";

import Link from "next/link";
import type { LearnerCatalog } from "@/lib/continue-learning";
import { useLessonProgress } from "./useLessonProgress";

export default function DayRail({
  catalog,
  currentSlug,
}: {
  catalog: LearnerCatalog;
  currentSlug: string;
}) {
  const { isCompleted, hasHydrated } = useLessonProgress();
  const published = catalog.days.filter((day) => day.published);

  if (!published.length) return null;

  return (
    <nav aria-label="Published days" className="hidden xl:block">
      <div className="sticky top-28 space-y-1">
        <p className="px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">Days</p>
        {published.map((day) => {
          const current = day.slug === currentSlug;
          const done = hasHydrated && isCompleted(day.slug);
          return (
            <Link
              key={day.slug}
              href={day.href || `/learn/${day.slug}`}
              aria-current={current ? "page" : undefined}
              className={`flex min-h-11 items-center gap-2 rounded-md px-2 py-2 text-[13px] ${
                current ? "bg-cream/[0.06] text-cream" : "text-cream/45 hover:text-cream"
              }`}
            >
              <span
                className={`day-dot ${done ? "day-dot-done" : current ? "day-dot-now" : "day-dot-live"}`}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] text-cream/40">{String(day.day).padStart(2, "0")}</span>
              <span className="truncate">{day.title}</span>
            </Link>
          );
        })}
        <Link
          href="/learn"
          className="mt-3 block px-2 font-mono text-[11px] tracking-[0.12em] text-gold/80 hover:text-gold"
        >
          Full map
        </Link>
      </div>
    </nav>
  );
}
