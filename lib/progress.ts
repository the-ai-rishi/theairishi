"use client";

import { getProgressRepository } from "./progress-repository";

export const EMPTY_COMPLETED_LESSONS: readonly string[] = Object.freeze([]);

export function getCompletedLessons(): readonly string[] {
  return getProgressRepository().getCompletedLessons();
}

export function isLessonCompleted(slug: string): boolean {
  return getProgressRepository().isLessonCompleted(slug);
}

export function markLessonCompleted(slug: string): void {
  getProgressRepository().markLessonCompleted(slug);
}

export function toggleLessonCompleted(slug: string): boolean {
  return getProgressRepository().toggleLessonCompleted(slug);
}

export function getLastVisitedLesson(): string | null {
  return getProgressRepository().getLastVisitedLesson();
}

export function setLastVisitedLesson(slug: string): void {
  getProgressRepository().setLastVisitedLesson(slug);
}

export function subscribeToProgress(callback: () => void): () => void {
  return getProgressRepository().subscribe(callback);
}

export { getProgressRepository } from "./progress-repository";
export type { IUserProgressRepository, UserProgressData } from "./progress-repository";
