"use client";

/**
 * lib/progress-repository.ts
 *
 * Clean architectural abstraction separating PLATFORM DATA from USER DATA.
 *
 * Defines the contract for user progress, bookmarks, likes, and followed topics.
 * Currently backed by `LocalProgressRepository` (localStorage).
 * Future implementation can seamlessly swap in `AuthenticatedProgressRepository`
 * (Supabase, Postgres, Firebase, or custom backend API) without changing any UI component.
 */

export interface UserProgressData {
  completedLessons: readonly string[];
  lastVisitedLesson: string | null;
  bookmarks: readonly string[];
  followedTopics: readonly string[];
  likedContent: readonly string[];
}

export interface IUserProgressRepository {
  // Lesson progress
  getCompletedLessons(): readonly string[];
  isLessonCompleted(slug: string): boolean;
  markLessonCompleted(slug: string): void;
  toggleLessonCompleted(slug: string): boolean;
  getLastVisitedLesson(): string | null;
  setLastVisitedLesson(slug: string): void;

  // Bookmarks & Saved items (future user feature)
  getBookmarks(): readonly string[];
  isBookmarked(contentId: string): boolean;
  toggleBookmark(contentId: string): boolean;

  // Followed Topics (future personalization)
  getFollowedTopics(): readonly string[];
  isTopicFollowed(topicSlug: string): boolean;
  toggleFollowTopic(topicSlug: string): boolean;

  // Subscriptions for reactive React state
  subscribe(callback: () => void): () => void;
}

const EMPTY_ARRAY: readonly string[] = Object.freeze([]);

const STORAGE_KEYS = {
  COMPLETED_LESSONS: "theairishi_completed_lessons",
  LAST_VISITED: "theairishi_last_visited_lesson",
  BOOKMARKS: "theairishi_bookmarks",
  FOLLOWED_TOPICS: "theairishi_followed_topics",
  LIKED_CONTENT: "theairishi_liked_content",
} as const;

const REPO_EVENT = "theairishi_user_state_change";

class LocalProgressRepository implements IUserProgressRepository {
  private cachedCompletedRaw: string | null = null;
  private cachedCompletedSnapshot: readonly string[] = EMPTY_ARRAY;

  private cachedBookmarksRaw: string | null = null;
  private cachedBookmarksSnapshot: readonly string[] = EMPTY_ARRAY;

  private cachedFollowedRaw: string | null = null;
  private cachedFollowedSnapshot: readonly string[] = EMPTY_ARRAY;

  private emitChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(REPO_EVENT));
    }
  }

  // ── Lesson Progress ─────────────────────────────────────────────────────────

  getCompletedLessons(): readonly string[] {
    if (typeof window === "undefined") return EMPTY_ARRAY;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      if (!raw) {
        this.cachedCompletedRaw = null;
        this.cachedCompletedSnapshot = EMPTY_ARRAY;
        return EMPTY_ARRAY;
      }
      if (raw === this.cachedCompletedRaw) {
        return this.cachedCompletedSnapshot;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.cachedCompletedRaw = raw;
        this.cachedCompletedSnapshot = Object.freeze([...parsed]);
        return this.cachedCompletedSnapshot;
      }
      return EMPTY_ARRAY;
    } catch {
      return this.cachedCompletedSnapshot;
    }
  }

  isLessonCompleted(slug: string): boolean {
    return this.getCompletedLessons().includes(slug);
  }

  markLessonCompleted(slug: string): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getCompletedLessons();
      if (!current.includes(slug)) {
        const next = [...current, slug];
        const raw = JSON.stringify(next);
        this.cachedCompletedRaw = raw;
        this.cachedCompletedSnapshot = Object.freeze(next);
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, raw);
        this.emitChange();
      }
    } catch (e) {
      console.warn("Failed to save completed lesson:", e);
    }
  }

  toggleLessonCompleted(slug: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      const current = this.getCompletedLessons();
      const isCurrentlyCompleted = current.includes(slug);
      const next = isCurrentlyCompleted
        ? current.filter((s) => s !== slug)
        : [...current, slug];

      const raw = JSON.stringify(next);
      this.cachedCompletedRaw = raw;
      this.cachedCompletedSnapshot = Object.freeze(next);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, raw);
      this.emitChange();
      return !isCurrentlyCompleted;
    } catch (e) {
      console.warn("Failed to toggle completed lesson:", e);
      return false;
    }
  }

  getLastVisitedLesson(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_VISITED);
    } catch {
      return null;
    }
  }

  setLastVisitedLesson(slug: string): void {
    if (typeof window === "undefined") return;
    try {
      const current = localStorage.getItem(STORAGE_KEYS.LAST_VISITED);
      if (current !== slug) {
        localStorage.setItem(STORAGE_KEYS.LAST_VISITED, slug);
        this.emitChange();
      }
    } catch {
      // Ignore storage errors
    }
  }

  // ── Bookmarks ───────────────────────────────────────────────────────────────

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

  // ── Followed Topics ─────────────────────────────────────────────────────────

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

  // ── Reactive Subscription ───────────────────────────────────────────────────

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }
    window.addEventListener(REPO_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(REPO_EVENT, callback);
      window.removeEventListener("storage", callback);
    };
  }
}

// Singleton repository instance
let _progressRepositoryInstance: IUserProgressRepository | null = null;

export function getProgressRepository(): IUserProgressRepository {
  if (!_progressRepositoryInstance) {
    _progressRepositoryInstance = new LocalProgressRepository();
  }
  return _progressRepositoryInstance;
}
