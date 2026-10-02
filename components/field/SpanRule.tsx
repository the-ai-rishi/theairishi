"use client";

import { useState } from "react";
import Link from "next/link";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import type { LearnerCatalog } from "@/lib/continue-learning";

/** One measured rule. Width is the real day count, not ten equal nodes. */
export default function SpanRule({ catalog }: { catalog: LearnerCatalog }) {
  const { isCompleted, hasHydrated } = useLessonProgress();
  const [focus, setFocus] = useState(catalog.currentPhaseId || catalog.phases[0]?.id || "");
  const phase = catalog.phases.find((item) => item.id === focus) || catalog.phases[0];
  const total = Math.max(1, catalog.totalDays || 120);
  const days = phase ? catalog.days.filter((day) => day.phaseId === phase.id) : [];
  const claimed = hasHydrated ? days.filter((day) => isCompleted(day.slug)).length : 0;

  if (!phase) return null;

  return (
    <div className="span-rule">
      <div className="span-bands" role="listbox" aria-label="Phases by length">
        {catalog.phases.map((item) => {
          const width = ((item.endDay - item.startDay + 1) / total) * 100;
          const on = item.id === phase.id;
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={on}
              className={on ? "is-on" : ""}
              style={{ width: `${width}%` }}
              onClick={() => setFocus(item.id)}
            >
              <span>{String(item.number).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <div className="span-detail">
        <p className="span-meta">
          {phase.daysLabel}
          <span>
            {hasHydrated
              ? `${claimed} of ${days.length} claimed on this device`
              : `${phase.publishedCount} published`}
          </span>
        </p>
        <h3>{phase.name}</h3>
        {phase.summary ? <p>{phase.summary}</p> : null}
        <ol>
          {days.map((day) => {
            const label = `${String(day.day).padStart(3, "0")} ${day.title}`;
            return (
              <li key={day.slug} className={day.published ? "is-open" : "is-planned"}>
                {day.published && day.href ? <Link href={day.href}>{label}</Link> : <span>{label}</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
