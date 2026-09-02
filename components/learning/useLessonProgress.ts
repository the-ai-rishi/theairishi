"use client";

import { useSyncExternalStore, useMemo, useCallback } from "react";
import {
  EMPTY_COMPLETED_LESSONS,
  getCompletedLessons,
  getLastVisitedLesson,
  markLessonCompleted,
  setLastVisitedLesson,
  subscribeToProgress,
  toggleLessonCompleted,
} from "@/lib/progress";

function getServerSnapshot(): readonly string[] {
  return EMPTY_COMPLETED_LESSONS;
}

export function useLessonProgress() {
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const completedSlugs = useSyncExternalStore(
    subscribeToProgress,
    getCompletedLessons,
    getServerSnapshot
  );

  const completedSet = useMemo(
    () => new Set(completedSlugs),
    [completedSlugs]
  );

  const isCompleted = useCallback(
    (slug: string) => completedSet.has(slug),
    [completedSet]
  );

  const getCompletedCount = useCallback(
    (lessons: { slug: string }[]) => {
      return lessons.filter((l) => completedSet.has(l.slug)).length;
    },
    [completedSet]
  );

  const getProgressPercent = useCallback(
    (lessons: { slug: string }[]) => {
      if (lessons.length === 0) return 0;
      const count = lessons.filter((l) => completedSet.has(l.slug)).length;
      return Math.round((count / lessons.length) * 100);
    },
    [completedSet]
  );

  return {
    hasHydrated,
    completedSlugs,
    isCompleted,
    getCompletedCount,
    getProgressPercent,
    markComplete: markLessonCompleted,
    toggleComplete: toggleLessonCompleted,
    lastVisited: hasHydrated ? getLastVisitedLesson() : null,
    setLastVisited: setLastVisitedLesson,
  };
}
