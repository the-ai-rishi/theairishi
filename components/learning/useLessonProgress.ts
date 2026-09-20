"use client";

import { useSyncExternalStore, useMemo, useCallback } from "react";
import {
  emptyState,
  getState,
  isCompleted as stateIsCompleted,
  isStarted as stateIsStarted,
  storeMarkCompleted,
  storeSetLastVisited,
  storeToggleCompleted,
  subscribe,
} from "@/lib/learner-progress";

const SERVER_PROGRESS = emptyState();

function getServerSnapshot() {
  return SERVER_PROGRESS;
}

export function useLessonProgress() {
  const state = useSyncExternalStore(subscribe, getState, getServerSnapshot);

  const completedSet = useMemo(() => new Set(state.completed), [state]);
  const startedSet = useMemo(() => new Set(state.started), [state]);

  const isCompleted = useCallback(
    (slug: string) => stateIsCompleted(state, slug),
    [state]
  );

  const isStarted = useCallback(
    (slug: string) => stateIsStarted(state, slug),
    [state]
  );

  const getCompletedCount = useCallback(
    (lessons: { slug: string }[]) => lessons.filter((lesson) => completedSet.has(lesson.slug)).length,
    [completedSet]
  );

  const getProgressPercent = useCallback(
    (lessons: { slug: string }[]) => {
      if (lessons.length === 0) return 0;
      return Math.round((lessons.filter((lesson) => completedSet.has(lesson.slug)).length / lessons.length) * 100);
    },
    [completedSet]
  );

  return {
    hasHydrated: state !== SERVER_PROGRESS,
    state,
    completedSlugs: state.completed,
    startedSlugs: state.started,
    isCompleted,
    isStarted,
    getCompletedCount,
    getProgressPercent,
    markComplete: storeMarkCompleted,
    toggleComplete: storeToggleCompleted,
    lastVisited: state.lastVisited,
    setLastVisited: storeSetLastVisited,
    completedSet,
    startedSet,
  };
}
