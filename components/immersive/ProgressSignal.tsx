"use client";

import { useEffect } from "react";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import { sceneBus } from "./scene-bus";

/** Writes real lesson progress into the scene bus. Does not invent a score. */
export default function ProgressSignal({ total }: { total: number }) {
  const { hasHydrated, state } = useLessonProgress();
  const count = hasHydrated ? state.completed.length : 0;
  const safeTotal = Math.max(0, total);

  useEffect(() => {
    sceneBus.mastery = safeTotal > 0 ? Math.min(1, count / safeTotal) : 0;
  }, [count, safeTotal]);

  return (
    <p className="universe-mastery" aria-live="polite">
      {hasHydrated ? `${count} of ${safeTotal} days complete` : "Progress stays on this device"}
    </p>
  );
}
