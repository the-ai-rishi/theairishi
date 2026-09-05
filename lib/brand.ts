/**
 * lib/brand.ts
 *
 * Convenience re-exports for brand and copy configuration.
 * All values are backed by content/config/platform.json.
 */
export type { BrandConfig, CopyConfig } from "./config";
export { getBrandConfig, getPlatformCopy, getDefaultsConfig } from "./config";
import type { BrandConfig } from "./config";

export function getBrandShortName(brand: BrandConfig): string {
  if (brand.shortName) return brand.shortName;
  const parts = brand.name.trim().split(/\s+/);
  return parts[parts.length - 1] || brand.name;
}
