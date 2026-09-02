import {
  resolveHomepageSections,
  type ResolvedHomepageSection,
  type PlatformCatalog,
} from "./visibility-core";
import { loadPlatformConfig, type PlatformConfig } from "./config";
import { getLiveCatalog } from "./catalog";
import { getAllCourses, type Course } from "./lessons";

export type { ResolvedHomepageSection };

export interface HomepageResolveOptions {
  platform?: PlatformConfig;
  catalog?: PlatformCatalog;
}

/**
 * Resolve homepage sections for the live site, or for tests with an
 * injected platform + catalog (content counts / items).
 */
export function getResolvedHomepage(
  options: HomepageResolveOptions = {}
): ResolvedHomepageSection[] {
  const platform = options.platform || loadPlatformConfig();
  const catalog = options.catalog || getLiveCatalog();
  const result = resolveHomepageSections(platform, catalog);
  const liveCourses = options.catalog ? [] : getAllCourses();

  return result.sections.map((section) => {
    if (section.type === "course-list" || section.type === "continue-learning") {
      const ids = new Set(
        ((section.data.courses as Array<{ id?: string; slug?: string }>) || []).map(
          (c) => c.id || c.slug
        )
      );
      const hydrated: Course[] = liveCourses.filter(
        (c) => ids.has(c.id) || ids.has(c.slug)
      );
      if (hydrated.length > 0) {
        return {
          ...section,
          data: { ...section.data, courses: hydrated, empty: hydrated.length === 0 },
        };
      }
    }
    return section;
  });
}
