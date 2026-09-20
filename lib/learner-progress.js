"use strict";

/**
 * Versioned local-first learner progress.
 *
 * Pure functions are safe in Node tests. The store is a no-op on the server
 * and degrades to memory when localStorage is missing or throws.
 *
 * Schema v1:
 *   { v: 1, completed: string[], started: string[], lastVisited: string|null, completedAt: { [slug]: ISO } }
 */

const VERSION = 1;
const STORAGE_KEY = "theairishi_learner_progress_v1";
const LEGACY_COMPLETED_KEY = "theairishi_completed_lessons";
const LEGACY_LAST_VISITED_KEY = "theairishi_last_visited_lesson";
const CHANGE_EVENT = "theairishi_user_state_change";

function emptyState() {
  return {
    v: VERSION,
    completed: [],
    started: [],
    lastVisited: null,
    completedAt: {},
  };
}

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const slug = item.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out;
}

function asCompletedAt(value, completed) {
  const out = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  const allowed = new Set(completed);
  for (const [key, stamp] of Object.entries(value)) {
    if (!allowed.has(key)) continue;
    if (typeof stamp !== "string" || !stamp.trim()) continue;
    out[key] = stamp;
  }
  return out;
}

function parseProgress(raw) {
  if (raw == null || raw === "") return emptyState();

  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return emptyState();
    }
  }

  if (Array.isArray(parsed)) {
    return migrateFromLegacy(JSON.stringify(parsed), null);
  }

  if (!parsed || typeof parsed !== "object") return emptyState();

  const completed = asStringArray(parsed.completed);
  const startedSeed = asStringArray(parsed.started);
  const lastVisited =
    typeof parsed.lastVisited === "string" && parsed.lastVisited.trim()
      ? parsed.lastVisited.trim()
      : null;
  const started = new Set([...startedSeed, ...completed]);
  if (lastVisited) started.add(lastVisited);

  return {
    v: VERSION,
    completed,
    started: Array.from(started),
    lastVisited,
    completedAt: asCompletedAt(parsed.completedAt, completed),
  };
}

function migrateFromLegacy(completedRaw, lastVisitedRaw) {
  let completed = [];
  if (typeof completedRaw === "string" && completedRaw.trim()) {
    try {
      completed = asStringArray(JSON.parse(completedRaw));
    } catch {
      completed = [];
    }
  } else if (Array.isArray(completedRaw)) {
    completed = asStringArray(completedRaw);
  }
  const lastVisited =
    typeof lastVisitedRaw === "string" && lastVisitedRaw.trim() ? lastVisitedRaw.trim() : null;
  return parseProgress({
    v: VERSION,
    completed,
    started: lastVisited ? [lastVisited, ...completed] : completed,
    lastVisited,
    completedAt: {},
  });
}

function cloneState(state) {
  const parsed = parseProgress(state);
  return {
    v: VERSION,
    completed: parsed.completed.slice(),
    started: parsed.started.slice(),
    lastVisited: parsed.lastVisited,
    completedAt: { ...parsed.completedAt },
  };
}

function markStarted(state, slug) {
  const next = cloneState(state);
  const id = typeof slug === "string" ? slug.trim() : "";
  if (!id) return next;
  if (!next.started.includes(id)) next.started.push(id);
  next.lastVisited = id;
  return next;
}

function markCompleted(state, slug, at) {
  const next = markStarted(state, slug);
  const id = typeof slug === "string" ? slug.trim() : "";
  if (!id) return next;
  if (!next.completed.includes(id)) next.completed.push(id);
  next.completedAt[id] = typeof at === "string" && at.trim() ? at : new Date().toISOString();
  return next;
}

function unmarkCompleted(state, slug) {
  const next = cloneState(state);
  const id = typeof slug === "string" ? slug.trim() : "";
  if (!id) return next;
  next.completed = next.completed.filter((item) => item !== id);
  delete next.completedAt[id];
  return next;
}

function toggleCompleted(state, slug, at) {
  const current = cloneState(state);
  if (current.completed.includes(typeof slug === "string" ? slug.trim() : "")) {
    return unmarkCompleted(current, slug);
  }
  return markCompleted(current, slug, at);
}

function setLastVisited(state, slug) {
  return markStarted(state, slug);
}

function isCompleted(state, slug) {
  const id = typeof slug === "string" ? slug.trim() : "";
  return Boolean(id) && parseProgress(state).completed.includes(id);
}

function isStarted(state, slug) {
  const id = typeof slug === "string" ? slug.trim() : "";
  return Boolean(id) && parseProgress(state).started.includes(id);
}

function countCompleted(state, catalogSlugs) {
  const completed = new Set(parseProgress(state).completed);
  const slugs = Array.isArray(catalogSlugs) ? catalogSlugs : [];
  let count = 0;
  for (const slug of slugs) {
    if (typeof slug === "string" && completed.has(slug)) count += 1;
  }
  return count;
}

function canUseStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const probe = "__theairishi_progress_probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

let memoryState = emptyState();
let loaded = false;
const listeners = new Set();

function emit() {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      // Ignore listener failures so one UI island cannot break others.
    }
  }
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Ignore.
    }
  }
}

function persist(state) {
  memoryState = cloneState(state);
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    window.localStorage.setItem(LEGACY_COMPLETED_KEY, JSON.stringify(memoryState.completed));
    if (memoryState.lastVisited) {
      window.localStorage.setItem(LEGACY_LAST_VISITED_KEY, memoryState.lastVisited);
    }
  } catch {
    // Quota / private mode: memory is the source of truth for this tab.
  }
}

function loadState() {
  if (loaded) return memoryState;
  loaded = true;
  if (!canUseStorage()) {
    memoryState = emptyState();
    return memoryState;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryState = parseProgress(raw);
      return memoryState;
    }
    const legacyCompleted = window.localStorage.getItem(LEGACY_COMPLETED_KEY);
    const legacyLast = window.localStorage.getItem(LEGACY_LAST_VISITED_KEY);
    if (legacyCompleted || legacyLast) {
      memoryState = migrateFromLegacy(legacyCompleted, legacyLast);
      persist(memoryState);
      return memoryState;
    }
  } catch {
    memoryState = emptyState();
    return memoryState;
  }
  memoryState = emptyState();
  return memoryState;
}

function getState() {
  return loadState();
}

function commit(next) {
  persist(next);
  emit();
  return getState();
}

function subscribe(listener) {
  if (typeof listener !== "function") return () => {};
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function storeMarkStarted(slug) {
  return commit(markStarted(getState(), slug));
}

function storeMarkCompleted(slug) {
  return commit(markCompleted(getState(), slug));
}

function storeUnmarkCompleted(slug) {
  return commit(unmarkCompleted(getState(), slug));
}

function storeToggleCompleted(slug) {
  const next = toggleCompleted(getState(), slug);
  commit(next);
  return next.completed.includes(typeof slug === "string" ? slug.trim() : "");
}

function storeSetLastVisited(slug) {
  return commit(setLastVisited(getState(), slug));
}

function resetStoreForTests() {
  loaded = false;
  memoryState = emptyState();
  listeners.clear();
}

module.exports = {
  VERSION,
  STORAGE_KEY,
  LEGACY_COMPLETED_KEY,
  LEGACY_LAST_VISITED_KEY,
  CHANGE_EVENT,
  emptyState,
  parseProgress,
  migrateFromLegacy,
  markStarted,
  markCompleted,
  unmarkCompleted,
  toggleCompleted,
  setLastVisited,
  isCompleted,
  isStarted,
  countCompleted,
  getState,
  subscribe,
  storeMarkStarted,
  storeMarkCompleted,
  storeUnmarkCompleted,
  storeToggleCompleted,
  storeSetLastVisited,
  resetStoreForTests,
};
