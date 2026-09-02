import fs from "fs";
import path from "path";
import * as vis from "./visibility-core";
import type { LifecycleStatus, PlatformCatalog, Surface } from "./visibility-core";

const configDir = path.join(process.cwd(), "content", "config");

export type ContentStatus =
  | "published"
  | "draft"
  | "coming-soon"
  | "archived"
  | "active"
  | "disabled"
  | "planned"
  | "paused";

export type PlatformStatus = LifecycleStatus;

export interface BrandConfig {
  name: string;
  shortName?: string;
  logo: string;
  logoAlt: string;
  logoMark: string;
  ogImage: string;
  faviconUrl: string;
  appleTouchIcon: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
}

export interface CopyConfig {
  heroBadge: string;
  heroTitle: string;
  heroTagline: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCta: string;
  heroSecondaryCtaHref: string;
  headerCta: string;
  headerCtaHref: string;
  footerCopyright: string;
}

export interface DefaultsConfig {
  topicSlug: string;
  authorName: string;
  contentDate: string;
}

export interface TopicConfig {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  badge: string;
  category: string;
  color: string;
  order: number;
  enabled: boolean;
  featured: boolean;
  showOnHomepage: boolean;
  showInNavigation: boolean;
  status: PlatformStatus;
}

export type NavSource =
  | { kind: "topic"; topicId: string; id?: string }
  | { kind: "contentType"; id: string }
  | { kind: "channel"; channelId?: string; id?: string };

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
  status?: PlatformStatus;
  source?: NavSource;
  showInNavigation?: boolean;
}

export type HomepageSectionType =
  | "hero"
  | "topic-grid"
  | "course-list"
  | "content-list"
  | "channel-grid"
  | "continue-learning"
  | "cta";

export type ContentSource =
  | { kind: "recent" }
  | { kind: "topic"; topicId: string }
  | { kind: "format"; format: string }
  | { kind: "channel"; channelId?: string; id?: string };

export interface HomepageSection {
  id: string;
  type: HomepageSectionType | string;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  source?: ContentSource;
  maxItems?: number;
  showWhenEmpty?: boolean;
  /** @deprecated Use source.kind = topic. Kept so old JSON does not explode the parser. */
  topicId?: string;
}

export interface SocialPlatform {
  id: string;
  label: string;
  href: string;
  externalUrl?: string;
  enabled: boolean;
  status: PlatformStatus;
  order: number;
  displayName?: string;
  description?: string;
  badge?: string;
  showOnHomepage?: boolean;
  showInNavigation?: boolean;
}

export type ContentTypeCategory = string;
export type ContentTypeStatus = PlatformStatus;

export interface ContentTypeConfig {
  id: string;
  title: string;
  description: string;
  badge: string;
  url?: string;
  topicSlug?: string;
  iconName: string;
  category: ContentTypeCategory;
  enabled: boolean;
  status: ContentTypeStatus;
  showOnHomepage: boolean;
  showInNavigation?: boolean;
  order: number;
}

export interface CourseConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: string;
  category: string;
  order: number;
  enabled: boolean;
  status: ContentStatus;
  featured: boolean;
  showOnHomepage: boolean;
  badge?: string;
  upcomingTopics?: string[];
  lessonCount?: number;
}

export interface SeriesConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: string;
  category: string;
  order: number;
  enabled: boolean;
  featured: boolean;
  badge?: string;
  status?: PlatformStatus;
}

export interface PlatformConfig {
  brand: BrandConfig;
  copy: CopyConfig;
  defaults: DefaultsConfig;
  topics: TopicConfig[];
  contentTypes: ContentTypeConfig[];
  navigation: {
    main: NavItem[];
    footer: NavItem[];
  };
  homepage: {
    sections: HomepageSection[];
  };
  social: SocialPlatform[];
}

function validatePlatformConfig(raw: unknown, filePath: string): PlatformConfig {
  if (!raw || typeof raw !== "object") {
    throw new Error(`[config] ${filePath}: must be a JSON object`);
  }
  const cfg = raw as Record<string, unknown>;

  if (!cfg.brand || typeof cfg.brand !== "object") {
    throw new Error(`[config] ${filePath}: "brand" section is required`);
  }
  const brand = cfg.brand as Record<string, unknown>;
  if (!brand.name || !brand.logo || !brand.tagline) {
    throw new Error(`[config] ${filePath}: brand requires name, logo, and tagline`);
  }

  if (!Array.isArray(cfg.topics)) {
    throw new Error(`[config] ${filePath}: "topics" must be an array`);
  }

  const topicIds = new Set<string>();
  const topicSlugs = new Set<string>();
  for (const t of cfg.topics as TopicConfig[]) {
    if (!t.id || !t.slug || !t.name) {
      throw new Error(
        `[config] Topic missing required fields (id, slug, name): ${JSON.stringify(t)}`
      );
    }
    if (topicIds.has(t.id)) {
      throw new Error(`[config] Duplicate topic id: "${t.id}"`);
    }
    if (topicSlugs.has(t.slug)) {
      throw new Error(`[config] Duplicate topic slug: "${t.slug}"`);
    }
    topicIds.add(t.id);
    topicSlugs.add(t.slug);
    if (t.status && !vis.isValidLifecycle(t.status)) {
      throw new Error(`[config] Topic "${t.id}" has invalid status: "${t.status}"`);
    }
  }

  const nav = cfg.navigation as PlatformConfig["navigation"];
  if (!nav?.main || !Array.isArray(nav.main)) {
    throw new Error(`[config] ${filePath}: "navigation.main" must be an array`);
  }

  const homepage = cfg.homepage as PlatformConfig["homepage"];
  if (!homepage?.sections || !Array.isArray(homepage.sections)) {
    throw new Error(`[config] ${filePath}: "homepage.sections" must be an array`);
  }
  const sectionIds = new Set<string>();
  for (const s of homepage.sections as HomepageSection[]) {
    if (!s.id) throw new Error(`[config] Homepage section missing id`);
    if (sectionIds.has(s.id)) {
      throw new Error(`[config] Duplicate homepage section id: "${s.id}"`);
    }
    sectionIds.add(s.id);
  }

  return raw as PlatformConfig;
}

function validateCoursesConfig(raw: unknown, filePath: string): CourseConfig[] {
  if (!Array.isArray(raw)) {
    throw new Error(`[config] ${filePath}: must be a JSON array`);
  }
  const ids = new Set<string>();
  for (const c of raw as CourseConfig[]) {
    if (!c.id || !c.slug || !c.title) {
      throw new Error(
        `[config] Course missing required fields (id, slug, title): ${JSON.stringify(c)}`
      );
    }
    if (ids.has(c.id)) {
      throw new Error(`[config] Duplicate course id: "${c.id}"`);
    }
    ids.add(c.id);
  }
  return raw as CourseConfig[];
}

function validateSeriesConfig(raw: unknown): SeriesConfig[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const ids = new Set<string>();
  for (const s of raw as SeriesConfig[]) {
    if (!s.id || !s.slug || !s.title) {
      throw new Error(
        `[config] Series missing required fields (id, slug, title): ${JSON.stringify(s)}`
      );
    }
    if (ids.has(s.id)) {
      throw new Error(`[config] Duplicate series id: "${s.id}"`);
    }
    ids.add(s.id);
  }
  return raw as SeriesConfig[];
}

let _platformConfig: PlatformConfig | null = null;
let _coursesConfig: CourseConfig[] | null = null;
let _seriesConfig: SeriesConfig[] | null = null;

export function loadPlatformConfig(): PlatformConfig {
  if (_platformConfig) return _platformConfig;
  const filePath = path.join(configDir, "platform.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[config] Platform config not found: ${filePath}. Create content/config/platform.json`
    );
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    _platformConfig = validatePlatformConfig(raw, filePath);
    return _platformConfig;
  } catch (err) {
    throw new Error(
      `[config] Failed to load platform.json: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

function loadCoursesConfig(): CourseConfig[] {
  if (_coursesConfig) return _coursesConfig;
  const filePath = path.join(configDir, "courses.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[config] Courses config not found: ${filePath}. Create content/config/courses.json`
    );
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    _coursesConfig = validateCoursesConfig(raw, filePath);
    return _coursesConfig;
  } catch (err) {
    throw new Error(
      `[config] Failed to load courses.json: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

function loadSeriesConfig(): SeriesConfig[] {
  if (_seriesConfig) return _seriesConfig;
  const filePath = path.join(configDir, "series.json");
  if (!fs.existsSync(filePath)) {
    _seriesConfig = [];
    return _seriesConfig;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    _seriesConfig = validateSeriesConfig(raw);
    return _seriesConfig;
  } catch (err) {
    console.warn(`[config] Warning loading series.json:`, err);
    _seriesConfig = [];
    return _seriesConfig;
  }
}

export function resetConfigCache(): void {
  _platformConfig = null;
  _coursesConfig = null;
  _seriesConfig = null;
  try {
    // Lazy require avoids a config <-> catalog import cycle at module load.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const catalog = require("./catalog") as { resetCatalogCache: () => void };
    catalog.resetCatalogCache();
  } catch {
    // catalog may not be loaded yet
  }
}

function liveCatalog(): PlatformCatalog {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const catalog = require("./catalog") as { getLiveCatalog: () => PlatformCatalog };
    return catalog.getLiveCatalog();
  } catch {
    return vis.emptyCatalog();
  }
}

export function getPlatformConfig(): PlatformConfig {
  return loadPlatformConfig();
}

export function getBrandConfig(): BrandConfig {
  return loadPlatformConfig().brand;
}

export function getPlatformCopy(): CopyConfig {
  return loadPlatformConfig().copy;
}

export function getDefaultsConfig(): DefaultsConfig {
  const cfg = loadPlatformConfig();
  const brand = cfg.brand;
  return (
    cfg.defaults ?? {
      topicSlug: "",
      authorName: brand?.name || "",
      contentDate: "",
    }
  );
}

/**
 * Authoring default only. Never use this as a silent UI fallback that
 * resurrects a missing topic. Returns null if the configured default is
 * not itself a public (route-visible) topic.
 */
export function getDefaultTopicSlug(): string | null {
  const configured = getDefaultsConfig().topicSlug;
  if (!configured) return null;
  const topic = getTopicRecord(configured);
  if (!topic) return null;
  const state = vis.topicRouteState(loadPlatformConfig(), configured, liveCatalog());
  if (state.state === "not-found") return null;
  if (vis.normalizeStatus(topic.status) !== "active") return null;
  return topic.slug;
}

export function getDefaultAuthorName(): string {
  return getDefaultsConfig().authorName || getBrandConfig().name;
}

export function getConfiguredTopics(): TopicConfig[] {
  return loadPlatformConfig().topics.slice().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getTopicRecord(key: string): TopicConfig | null {
  return vis.findTopic(loadPlatformConfig(), key) as unknown as TopicConfig | null;
}

export function isTopicPublicOn(topic: TopicConfig | null | undefined, surface: Surface): boolean {
  if (!topic) return false;
  return vis.isTopicVisible(loadPlatformConfig(), topic, surface, liveCatalog());
}

/** Route-visible topics (active + coming-soon). */
export function getAllTopics(): TopicConfig[] {
  return vis.getRouteTopics(loadPlatformConfig(), liveCatalog()) as unknown as TopicConfig[];
}

export function getHomepageTopics(): TopicConfig[] {
  return vis.publicTopics(loadPlatformConfig(), liveCatalog(), "homepage") as unknown as TopicConfig[];
}

export function getNavigationTopics(): TopicConfig[] {
  return vis.publicTopics(loadPlatformConfig(), liveCatalog(), "navigation") as unknown as TopicConfig[];
}

export function getSearchTopics(): TopicConfig[] {
  return vis.publicTopics(loadPlatformConfig(), liveCatalog(), "search") as unknown as TopicConfig[];
}

export function getSitemapTopics(): TopicConfig[] {
  return vis.publicTopics(loadPlatformConfig(), liveCatalog(), "sitemap") as unknown as TopicConfig[];
}

/**
 * Look up a topic by id/slug. Returns the record if it has a public route
 * (active or coming-soon). Disabled/planned topics return null.
 */
export function getTopicBySlug(slug: string): TopicConfig | null {
  const state = vis.topicRouteState(loadPlatformConfig(), slug, liveCatalog());
  if (state.state === "not-found") return null;
  return state.topic as unknown as TopicConfig;
}

export function getContentTypeRecord(id: string): ContentTypeConfig | null {
  return vis.findContentType(loadPlatformConfig(), id) as unknown as ContentTypeConfig | null;
}

export function getAllContentTypes(): ContentTypeConfig[] {
  const platform = loadPlatformConfig();
  return vis.publicContentTypes(platform, liveCatalog(), "homepage").map((ct) => {
    const typed = ct as unknown as ContentTypeConfig;
    const href = vis.deriveContentTypeHref(platform, ct);
    return href ? { ...typed, url: typed.url || href } : typed;
  });
}

export function getMainNavigation(): NavItem[] {
  return vis.resolveNavItems(loadPlatformConfig(), liveCatalog(), "main") as unknown as NavItem[];
}

export function getFooterNavigation(): NavItem[] {
  return vis.resolveNavItems(loadPlatformConfig(), liveCatalog(), "footer") as unknown as NavItem[];
}

export function getHomepageSections(): HomepageSection[] {
  return vis
    .resolveHomepageSections(loadPlatformConfig(), liveCatalog())
    .sections.map((s) => ({
      id: s.id,
      type: s.type,
      enabled: s.enabled,
      order: s.order ?? 99,
      title: s.title,
      subtitle: s.subtitle,
      ctaLabel: s.ctaLabel,
      ctaHref: s.ctaHref,
      source: s.source as ContentSource | undefined,
      maxItems: s.maxItems,
      showWhenEmpty: s.showWhenEmpty,
    }));
}

export function getSocialPlatforms(): SocialPlatform[] {
  return vis.publicChannels(loadPlatformConfig(), liveCatalog(), "route") as unknown as SocialPlatform[];
}

export function getSocialPlatform(id: string): SocialPlatform | null {
  const state = vis.channelRouteState(loadPlatformConfig(), id, liveCatalog());
  if (state.state === "not-found") return null;
  return state.channel as unknown as SocialPlatform;
}

export function getRawCourseConfigs(): CourseConfig[] {
  return loadCoursesConfig();
}

export function getAllCourseConfigs(): CourseConfig[] {
  const catalog = liveCatalog();
  const allowed = new Set(
    vis.publicCourses(loadPlatformConfig(), catalog, true).map((c) => String(c.id || ""))
  );
  return loadCoursesConfig().filter((c) => allowed.has(c.id));
}

export function getComingSoonCourses(): CourseConfig[] {
  return vis.comingSoonCourses(loadPlatformConfig(), liveCatalog()) as unknown as CourseConfig[];
}

export function getCourseConfig(id: string): CourseConfig | null {
  const found = loadCoursesConfig().find((c) => c.id === id || c.slug === id);
  return found ?? null;
}

export function getTopicSlugForCourse(courseId: string): string | null {
  const course = loadCoursesConfig().find((c) => c.id === courseId || c.slug === courseId);
  if (course?.topic) {
    const topic = getTopicRecord(course.topic);
    return topic?.slug ?? course.topic;
  }
  return null;
}

export function getAllSeriesConfigs(): SeriesConfig[] {
  return loadSeriesConfig()
    .filter((s) => s.enabled !== false)
    .filter((s) => vis.normalizeStatus(s.status || "active") === "active")
    .filter((s) => !s.topic || Boolean(getTopicBySlug(s.topic)))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getSeriesConfigBySlug(slug: string): SeriesConfig | null {
  const found = loadSeriesConfig().find((s) => s.slug === slug || s.id === slug);
  if (!found || found.enabled === false) return null;
  if (vis.normalizeStatus(found.status || "active") !== "active") return null;
  if (found.topic && !getTopicBySlug(found.topic)) return null;
  return found;
}

export { vis };
