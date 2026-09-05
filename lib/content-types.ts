/**
 * lib/content-types.ts
 *
 * Content types are now fully configuration-driven via content/config/platform.json.
 * This file re-exports the canonical content type functions from lib/config.ts.
 *
 * To add, rename, disable, or reorder content types:
 *   edit content/config/platform.json → "contentTypes" array.
 * No TypeScript changes required.
 */
export type {
  ContentTypeConfig,
  ContentTypeCategory,
  ContentTypeStatus,
} from "./config";

export { getAllContentTypes } from "./config";
