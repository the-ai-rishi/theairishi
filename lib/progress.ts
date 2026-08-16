"use client";

export const EMPTY_COMPLETED_LESSONS: readonly string[] = Object.freeze([]);

const PROGRESS_STORAGE_KEY = "theairishi_completed_lessons";
const LAST_VISITED_KEY = "theairishi_last_visited_lesson";
const PROGRESS_EVENT = "theairishi_progress_change";

let cachedCompletedRaw: string | null = null;
let cachedCompletedSnapshot: readonly string[] = EMPTY_COMPLETED_LESSONS;

export function getCompletedLessons(): readonly string[] {
  if (typeof window === "undefined") {
    return EMPTY_COMPLETED_LESSONS;
  }

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      cachedCompletedRaw = null;
      cachedCompletedSnapshot = EMPTY_COMPLETED_LESSONS;
      return EMPTY_COMPLETED_LESSONS;
    }

    if (raw === cachedCompletedRaw) {
      return cachedCompletedSnapshot;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedCompletedRaw = raw;
      cachedCompletedSnapshot = Object.freeze([...parsed]);
      return cachedCompletedSnapshot;
    }

    cachedCompletedRaw = raw;
    cachedCompletedSnapshot = EMPTY_COMPLETED_LESSONS;
    return EMPTY_COMPLETED_LESSONS;
  } catch (error) {
    console.warn("Failed to read lesson progress from localStorage:", error);
    return cachedCompletedSnapshot;
  }
}

export function isLessonCompleted(slug: string): boolean {
  return getCompletedLessons().includes(slug);
}

export function markLessonCompleted(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = getCompletedLessons();
    if (!current.includes(slug)) {
      const next = [...current, slug];
      const raw = JSON.stringify(next);
      cachedCompletedRaw = raw;
      cachedCompletedSnapshot = Object.freeze(next);
      localStorage.setItem(PROGRESS_STORAGE_KEY, raw);
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    }
  } catch (error) {
    console.warn("Failed to save completed lesson:", error);
  }
}

export function toggleLessonCompleted(slug: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const current = getCompletedLessons();
    const isCurrentlyCompleted = current.includes(slug);
    const next = isCurrentlyCompleted
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    const raw = JSON.stringify(next);
    cachedCompletedRaw = raw;
    cachedCompletedSnapshot = Object.freeze(next);
    localStorage.setItem(PROGRESS_STORAGE_KEY, raw);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
    return !isCurrentlyCompleted;
  } catch (error) {
    console.warn("Failed to toggle completed lesson:", error);
    return false;
  }
}

export function getLastVisitedLesson(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(LAST_VISITED_KEY);
  } catch {
    return null;
  }
}

export function setLastVisitedLesson(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = localStorage.getItem(LAST_VISITED_KEY);
    if (current !== slug) {
      localStorage.setItem(LAST_VISITED_KEY, slug);
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    }
  } catch {
    // Ignore storage errors
  }
}

export function subscribeToProgress(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(PROGRESS_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(PROGRESS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
