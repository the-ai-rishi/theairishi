export const VERSION: 1;
export const STORAGE_KEY: "theairishi_learner_progress_v1";
export const LEGACY_COMPLETED_KEY: "theairishi_completed_lessons";
export const LEGACY_LAST_VISITED_KEY: "theairishi_last_visited_lesson";
export const CHANGE_EVENT: "theairishi_user_state_change";

export interface LearnerProgressState {
  v: 1;
  completed: string[];
  started: string[];
  lastVisited: string | null;
  completedAt: Record<string, string>;
}

export function emptyState(): LearnerProgressState;
export function parseProgress(raw: unknown): LearnerProgressState;
export function migrateFromLegacy(
  completedRaw: string | string[] | null | undefined,
  lastVisitedRaw: string | null | undefined
): LearnerProgressState;
export function markStarted(state: unknown, slug: string): LearnerProgressState;
export function markCompleted(state: unknown, slug: string, at?: string): LearnerProgressState;
export function unmarkCompleted(state: unknown, slug: string): LearnerProgressState;
export function toggleCompleted(state: unknown, slug: string, at?: string): LearnerProgressState;
export function setLastVisited(state: unknown, slug: string): LearnerProgressState;
export function isCompleted(state: unknown, slug: string): boolean;
export function isStarted(state: unknown, slug: string): boolean;
export function countCompleted(state: unknown, catalogSlugs: string[]): number;
export function getState(): LearnerProgressState;
export function subscribe(listener: () => void): () => void;
export function storeMarkStarted(slug: string): LearnerProgressState;
export function storeMarkCompleted(slug: string): LearnerProgressState;
export function storeUnmarkCompleted(slug: string): LearnerProgressState;
export function storeToggleCompleted(slug: string): boolean;
export function storeSetLastVisited(slug: string): LearnerProgressState;
export function resetStoreForTests(): void;
