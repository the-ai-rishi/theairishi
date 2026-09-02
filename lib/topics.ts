/**
 * lib/topics.ts
 *
 * Topics are now fully configuration-driven via content/config/platform.json.
 * This file re-exports the canonical topic functions from lib/config.ts.
 *
 * To add, rename, disable, or reorder topics: edit content/config/platform.json.
 * No TypeScript changes required for topic management.
 */
export type { TopicConfig } from "./config";
export {
  getAllTopics,
  getHomepageTopics,
  getNavigationTopics,
  getTopicBySlug,
} from "./config";
