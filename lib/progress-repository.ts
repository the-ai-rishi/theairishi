"use client";

/**
 * lib/progress-repository.ts
 *
 * Clean architectural abstraction separating PLATFORM DATA from USER DATA.
 *
 * Lesson progress is owned by `lib/learner-progress.js` (versioned v1).
 * Bookmarks and followed topics remain here for a future authenticated store.
 */

import {
  getState,
  isCompleted as progressIsCompleted,
  storeMarkCompleted,
  storeSetLastVisited,
  storeToggleCompleted,
  subscribe as subscribeLearnerProgress,
} from "./learner-progress";

export interface UserProgressData {
  completedLessons: readonly string[];
  lastVisitedLesson: string | null;
  bookmarks: readonly string[];
  followedTopics: readonly string[];
  likedContent: readonly string[];
}

export interface IUserProgressRepository {
  getCompletedLessons(): readonly string[];
  isLessonCompleted(slug: string): boolean;
  markLessonCompleted(slug: string): void;
  toggleLessonCompleted(slug: string): boolean;
  getLastVisitedLesson(): string | null;
  setLastVisitedLesson(slug: string): void;

  getBookmarks(): readonly string[];
  isBookmarked(contentId: string): boolean;
  toggleBookmark(contentId: string): boolean;

  getFollowedTopics(): readonly string[];
  isTopicFollowed(topicSlug: string): boolean;
  toggleFollowTopic(topicSlug: string): boolean;

  subscribe(callback: () => void): () => void;
}

const EMPTY_ARRAY: readonly string[] = Object.freeze([]);

const STORAGE_KEYS = {
  BOOKMARKS: "theairishi_bookmarks",
  FOLLOWED_TOPICS: "theairishi_followed_topics",
  LIKED_CONTENT: "theairishi_liked_content",
} as const;

const REPO_EVENT = "theairishi_user_state_change";

class LocalProgressRepository implements IUserProgressRepository {
  private cachedBookmarksRaw: string | null = null;
  private cachedBookmarksSnapshot: readonly string[] = EMPTY_ARRAY;

  private cachedFollowedRaw: string | null = null;
  private cachedFollowedSnapshot: readonly string[] = EMPTY_ARRAY;

  private emitChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(REPO_EVENT));
    }
  }

  getCompletedLessons(): readonly string[] {
    return getState().completed;
  }

  isLessonCompleted(slug: string): boolean {
    return progressIsCompleted(getState(), slug);
  }

  markLessonCompleted(slug: string): void {
    storeMarkCompleted(slug);
  }

  toggleLessonCompleted(slug: string): boolean {
    return storeToggleCompleted(slug);
  }

  getLastVisitedLesson(): string | null {
    return getState().lastVisited;
  }

  setLastVisitedLesson(slug: string): void {
    storeSetLastVisited(slug);
  }

  getBookmarks(): readonly string[] {
    if (typeof window === "undefined") return EMPTY_ARRAY;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (!raw) return EMPTY_ARRAY;
      if (raw === this.cachedBookmarksRaw) return this.cachedBookmarksSnapshot;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.cachedBookmarksRaw = raw;
        this.cachedBookmarksSnapshot = Object.freeze([...parsed]);
        return this.cachedBookmarksSnapshot;
      }
      return EMPTY_ARRAY;
    } catch {
      return EMPTY_ARRAY;
    }
  }

  isBookmarked(contentId: string): boolean {
    return this.getBookmarks().includes(contentId);
  }

  toggleBookmark(contentId: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      const current = this.getBookmarks();
      const isBookmarked = current.includes(contentId);
      const next = isBookmarked
        ? current.filter((id) => id !== contentId)
        : [...current, contentId];
      const raw = JSON.stringify(next);
      this.cachedBookmarksRaw = raw;
      this.cachedBookmarksSnapshot = Object.freeze(next);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, raw);
      this.emitChange();
      return !isBookmarked;
    } catch {
      return false;
    }
  }

  getFollowedTopics(): readonly string[] {
    if (typeof window === "undefined") return EMPTY_ARRAY;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FOLLOWED_TOPICS);
      if (!raw) return EMPTY_ARRAY;
      if (raw === this.cachedFollowedRaw) return this.cachedFollowedSnapshot;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.cachedFollowedRaw = raw;
        this.cachedFollowedSnapshot = Object.freeze([...parsed]);
        return this.cachedFollowedSnapshot;
      }
      return EMPTY_ARRAY;
    } catch {
      return EMPTY_ARRAY;
    }
  }

  isTopicFollowed(topicSlug: string): boolean {
    return this.getFollowedTopics().includes(topicSlug);
  }

  toggleFollowTopic(topicSlug: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      const current = this.getFollowedTopics();
      const isFollowed = current.includes(topicSlug);
      const next = isFollowed
        ? current.filter((s) => s !== topicSlug)
        : [...current, topicSlug];
      const raw = JSON.stringify(next);
      this.cachedFollowedRaw = raw;
      this.cachedFollowedSnapshot = Object.freeze(next);
      localStorage.setItem(STORAGE_KEYS.FOLLOWED_TOPICS, raw);
      this.emitChange();
      return !isFollowed;
    } catch {
      return false;
    }
  }

  subscribe(callback: () => void): () => void {
    const unsubscribeProgress = subscribeLearnerProgress(callback);
    if (typeof window === "undefined") {
      return unsubscribeProgress;
    }
    window.addEventListener(REPO_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
      unsubscribeProgress();
      window.removeEventListener(REPO_EVENT, callback);
      window.removeEventListener("storage", callback);
    };
  }
}

let _progressRepositoryInstance: IUserProgressRepository | null = null;

export function getProgressRepository(): IUserProgressRepository {
  if (!_progressRepositoryInstance) {
    _progressRepositoryInstance = new LocalProgressRepository();
  }
  return _progressRepositoryInstance;
}
