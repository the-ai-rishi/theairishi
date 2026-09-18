import type { PlatformCatalog } from "./visibility-core";
import { emptyCatalog } from "./visibility-core";
import { getPlatformConfig, getRawCourseConfigs } from "./config";
import { getPublishedContent } from "./content";
import { getAllCourses } from "./lessons";
import { getChannelItems } from "./media";
import { getProgram } from "./programs";

let _catalog: PlatformCatalog | null = null;

export function resetCatalogCache(): void {
  _catalog = null;
}

export function getLiveCatalog(): PlatformCatalog {
  if (_catalog) return _catalog;
  _catalog = emptyCatalog();
  _catalog = buildLiveCatalog();
  return _catalog;
}

function hrefForCourse(
  course: { id: string; slug?: string },
  live: ReturnType<typeof getAllCourses>[number] | undefined,
  program: ReturnType<typeof getProgram>
): string {
  if (course.id === program.id || course.slug === program.slug) {
    return program.startHref || "/learn";
  }
  if (!live || live.id !== course.id) return "/learn";
  const first = live.stages?.[0]?.lessons?.[0];
  const courseKeys = new Set([course.id, course.slug].filter(Boolean));
  if (!first || !courseKeys.has(first.metadata.course)) return "/learn";
  return `/learn/${first.slug}`;
}

export function buildLiveCatalog(): PlatformCatalog {
  const platform = getPlatformConfig();
  const program = getProgram();
  const published = getPublishedContent();
  const topicContentCounts: Record<string, number> = {};
  const formatContentCounts: Record<string, number> = {};

  for (const item of published) {
    if (item.topicSlug) {
      topicContentCounts[item.topicSlug] = (topicContentCounts[item.topicSlug] || 0) + 1;
    }
    if (item.type) {
      formatContentCounts[item.type] = (formatContentCounts[item.type] || 0) + 1;
    }
  }

  for (const topic of platform.topics || []) {
    const n = Math.max(
      topicContentCounts[topic.id] || 0,
      topicContentCounts[topic.slug] || 0
    );
    topicContentCounts[topic.id] = n;
    topicContentCounts[topic.slug] = n;
  }

  const liveCourses = getAllCourses();
  const courses = getRawCourseConfigs().map((course) => {
    const live = liveCourses.find((item) => item.id === course.id);
    return {
      ...course,
      lessonCount: live?.totalLessons ?? 0,
      href: hrefForCourse(course, live, program),
    };
  });

  const channelItemCounts: Record<string, number> = {};
  for (const channel of platform.social || []) {
    channelItemCounts[channel.id] = getChannelItems(channel.id).length;
  }

  return {
    topicContentCounts,
    formatContentCounts,
    channelItemCounts,
    courses,
    items: published as unknown as PlatformCatalog["items"],
  };
}

export function catalogOrEmpty(catalog?: PlatformCatalog | null): PlatformCatalog {
  return catalog || emptyCatalog();
}
