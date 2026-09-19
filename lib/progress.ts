"use client";

import {
  emptyState,
  getState,
  isCompleted as stateIsCompleted,
  storeMarkCompleted,
  storeSetLastVisited,
  storeToggleCompleted,
  subscribe,
  type LearnerProgressState,
} from "./learner-progress";

export const EMPTY_COMPLETED_LESSONS: readonly string[] = Object.freeze([]);

export function getProgressSnapshot(): LearnerProgressState {
  return getState();
}

export function getCompletedLessons(): readonly string[] {
  return getState().completed;
}

export function isLessonCompleted(slug: string): boolean {
  return stateIsCompleted(getState(), slug);
}

export function markLessonCompleted(slug: string): void {
  storeMarkCompleted(slug);
}

export function toggleLessonCompleted(slug: string): boolean {
  return storeToggleCompleted(slug);
}

export function getLastVisitedLesson(): string | null {
  return getState().lastVisited;
}

export function setLastVisitedLesson(slug: string): void {
  storeSetLastVisited(slug);
}

export function subscribeToProgress(callback: () => void): () => void {
  return subscribe(callback);
}

export function getEmptyProgress(): LearnerProgressState {
  return emptyState();
}

export { getProgressRepository } from "./progress-repository";
export type { IUserProgressRepository, UserProgressData } from "./progress-repository";
export type { LearnerProgressState };
