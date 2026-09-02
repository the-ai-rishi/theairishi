/**
 * lib/brand.ts
 *
 * Convenience re-exports for brand and copy configuration.
 * All values are backed by content/config/platform.json.
 */
export type { BrandConfig, CopyConfig } from "./config";
export { getBrandConfig, getPlatformCopy, getDefaultsConfig } from "./config";
