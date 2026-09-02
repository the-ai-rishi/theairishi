import fs from "fs";
import path from "path";

const configDir = path.join(process.cwd(), "content", "config");

// ─── Status Types ─────────────────────────────────────────────────────────────

export type ContentStatus = "published" | "draft" | "coming-soon" | "archived" | "active" | "disabled";
export type PlatformStatus = "active" | "coming-soon" | "disabled";

// ─── Brand & Copy Interfaces ──────────────────────────────────────────────────

export interface BrandConfig {
  name: string;
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

// ─── Topic Interface ──────────────────────────────────────────────────────────

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

// ─── Navigation Interface ─────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
  status?: PlatformStatus;
}

// ─── Homepage Section Interface ───────────────────────────────────────────────

export interface HomepageSection {
  id: string;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Bind this section to a topic id/slug. Hidden automatically if that topic is removed or disabled. */
  topicId?: string;
  maxItems?: number;
}

// ─── Social Platform Interface ────────────────────────────────────────────────

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
}

// ─── Content Type Interface ───────────────────────────────────────────────────

export type ContentTypeCategory = "Learning" | "Reference" | "Updates" | "Media" | "Career";
export type ContentTypeStatus = "active" | "coming-soon" | "disabled";

export interface ContentTypeConfig {
  id: string;
  title: string;
  description: string;
  badge: string;
  /** Direct URL override — if set, link goes here */
  url?: string;
  /** If set (and url not set), link goes to /topics/<topicSlug> */
  topicSlug?: string;
  iconName: string;
  category: ContentTypeCategory;
  enabled: boolean;
  status: ContentTypeStatus;
  showOnHomepage: boolean;
  order: number;
}

// ─── Course Interface ─────────────────────────────────────────────────────────

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
  /** Topics list for coming-soon courses */
  upcomingTopics?: string[];
}

// ─── Series Interface ─────────────────────────────────────────────────────────

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
}

// ─── Root Platform Config ─────────────────────────────────────────────────────

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

// ─── Config Validation ────────────────────────────────────────────────────────

function validatePlatformConfig(raw: unknown, filePath: string): PlatformConfig {
  if (!raw || typeof raw !== "object") {
    throw new Error(`[config] ${filePath}: must be a JSON object`);
  }
  const cfg = raw as Record<string, unknown>;

  // Validate brand
  if (!cfg.brand || typeof cfg.brand !== "object") {
    throw new Error(`[config] ${filePath}: "brand" section is required`);
  }
  const brand = cfg.brand as Record<string, unknown>;
  if (!brand.name || !brand.logo || !brand.tagline) {
    throw new Error(`[config] ${filePath}: brand requires name, logo, and tagline`);
  }

  // Validate topics
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
    if (t.status && !["active", "coming-soon", "disabled"].includes(t.status)) {
      throw new Error(`[config] Topic "${t.id}" has invalid status: "${t.status}"`);
    }
  }

  // Validate navigation
  const nav = cfg.navigation as PlatformConfig["navigation"];
  if (!nav?.main || !Array.isArray(nav.main)) {
    throw new Error(`[config] ${filePath}: "navigation.main" must be an array`);
  }

  // Validate homepage sections
  const homepage = cfg.homepage as PlatformConfig["homepage"];
  if (!homepage?.sections || !Array.isArray(homepage.sections)) {
    throw new Error(`[config] ${filePath}: "homepage.sections" must be an array`);
  }
  const sectionIds = new Set<string>();
  for (const s of homepage.sections as HomepageSection[]) {
    if (!s.id) throw new Error(`[config] Homepage section missing id`);
    if (sectionIds.has(s.id))
      throw new Error(`[config] Duplicate homepage section id: "${s.id}"`);
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

function validateSeriesConfig(raw: unknown, _filePath: string): SeriesConfig[] {
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

// ─── Loaders (cached at module level for build-time performance) ──────────────

let _platformConfig: PlatformConfig | null = null;
let _coursesConfig: CourseConfig[] | null = null;
let _seriesConfig: SeriesConfig[] | null = null;

function loadPlatformConfig(): PlatformConfig {
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

/** Clear in-memory config (used by lifecycle tests). */
export function resetConfigCache(): void {
  _platformConfig = null;
  _coursesConfig = null;
  _seriesConfig = null;
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
    _seriesConfig = validateSeriesConfig(raw, filePath);
    return _seriesConfig;
  } catch (err) {
    console.warn(`[config] Warning loading series.json:`, err);
    _seriesConfig = [];
    return _seriesConfig;
  }
}

// ─── Visibility helpers ───────────────────────────────────────────────────────

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

/** A topic is public unless it is enabled:false or status:"disabled". coming-soon remains visible. */
export function isTopicPublic(topic: TopicConfig | null | undefined): boolean {
  if (!topic) return false;
  if (topic.enabled === false) return false;
  if (topic.status === "disabled") return false;
  return true;
}

function findTopicRecord(key: string): TopicConfig | undefined {
  const needle = normalizeKey(key);
  return loadPlatformConfig().topics.find((t) => {
    return (
      normalizeKey(t.id) === needle ||
      normalizeKey(t.slug) === needle ||
      normalizeKey(t.shortName) === needle
    );
  });
}

function topicSlugFromHref(href: string): string | null {
  const match = href.match(/^\/topics\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function socialIdFromHref(href: string): string | null {
  const match = href.match(/^\/(youtube|instagram)\/?$/);
  return match ? match[1] : null;
}

function isNavItemPublic(item: NavItem): boolean {
  if (item.enabled === false || item.status === "disabled") return false;
  const topicSlug = topicSlugFromHref(item.href);
  if (topicSlug && !isTopicPublic(findTopicRecord(topicSlug))) return false;
  const socialId = socialIdFromHref(item.href);
  if (socialId) {
    const platform = loadPlatformConfig().social.find((s) => s.id === socialId);
    if (!platform || platform.enabled === false || platform.status === "disabled") {
      return false;
    }
  }
  return true;
}

function mergeTopicNavigation(items: NavItem[]): NavItem[] {
  const existing = items.filter(isNavItemPublic);
  const hrefs = new Set(existing.map((item) => item.href));
  const maxOrder = existing.reduce((max, item) => Math.max(max, item.order ?? 0), 0);
  let extraOrder = maxOrder;
  for (const topic of getNavigationTopics()) {
    const href = `/topics/${topic.slug}`;
    if (hrefs.has(href)) continue;
    extraOrder += 1;
    existing.push({
      id: `topic-${topic.id}`,
      label: topic.shortName || topic.name,
      href,
      enabled: true,
      order: extraOrder,
      status: topic.status,
    });
  }
  return existing.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

// ─── Public API — Brand & Copy ────────────────────────────────────────────────

/** Brand configuration (logo, name, tagline, OG image, etc.). */
export function getBrandConfig(): BrandConfig {
  const cfg = loadPlatformConfig();
  return cfg.brand;
}

/** UI copy configuration (CTA text, hero text, footer text, etc.). */
export function getPlatformCopy(): CopyConfig {
  const cfg = loadPlatformConfig();
  return cfg.copy;
}

/** Platform defaults (default topic, author name, etc.). */
export function getDefaultsConfig(): DefaultsConfig {
  const cfg = loadPlatformConfig();
  return cfg.defaults ?? { topicSlug: "ai", authorName: "The AI Rishi", contentDate: "2026-08-20" };
}

/** Get the default topic slug (used when a content item has no explicit topic). */
export function getDefaultTopicSlug(): string {
  const configured = getDefaultsConfig().topicSlug;
  if (isTopicPublic(findTopicRecord(configured))) return findTopicRecord(configured)!.slug;
  const first = getAllTopics()[0];
  return first?.slug ?? configured;
}

/** Get the default author name (used when a content item has no explicit author). */
export function getDefaultAuthorName(): string {
  return getDefaultsConfig().authorName;
}

// ─── Public API — Topics ──────────────────────────────────────────────────────

/** All public topics, sorted by order. Disabled / enabled:false topics are omitted. */
export function getAllTopics(): TopicConfig[] {
  return loadPlatformConfig()
    .topics.filter((t) => isTopicPublic(t))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Topics shown on the homepage (public + showOnHomepage). */
export function getHomepageTopics(): TopicConfig[] {
  return getAllTopics().filter((t) => t.showOnHomepage !== false);
}

/** Topics shown in the main navigation (public + showInNavigation). */
export function getNavigationTopics(): TopicConfig[] {
  return getAllTopics().filter((t) => t.showInNavigation === true);
}

/** Look up a public topic by id, slug, or shortName. Returns null if missing or disabled. */
export function getTopicBySlug(slug: string): TopicConfig | null {
  const found = findTopicRecord(slug);
  return isTopicPublic(found) ? found! : null;
}

// ─── Public API — Content Types ───────────────────────────────────────────────

/**
 * All enabled content types configured to show on homepage, sorted by order.
 * Types bound to a missing/disabled topic are omitted. URLs follow the live topic slug.
 */
export function getAllContentTypes(): ContentTypeConfig[] {
  const cfg = loadPlatformConfig();
  const contentTypes = cfg.contentTypes ?? [];

  return contentTypes
    .filter((ct) => ct.enabled !== false && ct.status !== "disabled" && ct.showOnHomepage !== false)
    .map((ct) => {
      if (ct.topicSlug) {
        const topic = getTopicBySlug(ct.topicSlug);
        if (!topic) return null;
        return { ...ct, url: ct.url || `/topics/${topic.slug}` };
      }
      return ct;
    })
    .filter((ct): ct is ContentTypeConfig => ct !== null)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

// ─── Public API — Navigation ──────────────────────────────────────────────────

/** Main navigation: configured items minus dead topic/social links, plus showInNavigation topics. */
export function getMainNavigation(): NavItem[] {
  return mergeTopicNavigation(loadPlatformConfig().navigation.main);
}

/** Footer navigation items, with dead topic/social links removed. */
export function getFooterNavigation(): NavItem[] {
  return loadPlatformConfig()
    .navigation.footer.filter(isNavItemPublic)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

// ─── Public API — Homepage ────────────────────────────────────────────────────

/** Homepage sections that are enabled and whose bound topic (if any) is still public. */
export function getHomepageSections(): HomepageSection[] {
  return loadPlatformConfig()
    .homepage.sections.filter((s) => s.enabled !== false)
    .filter((s) => !s.topicId || Boolean(getTopicBySlug(s.topicId)))
    .map((s) => {
      if (!s.topicId) return s;
      const topic = getTopicBySlug(s.topicId);
      if (!topic) return s;
      return {
        ...s,
        ctaHref: `/topics/${topic.slug}`,
      };
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

// ─── Public API — Social Platforms ───────────────────────────────────────────

/** Enabled social platforms (including coming-soon). Disabled platforms are omitted. */
export function getSocialPlatforms(): SocialPlatform[] {
  return loadPlatformConfig()
    .social.filter((s) => s.enabled !== false && s.status !== "disabled")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** A specific social platform by id. Returns null if not found or disabled. */
export function getSocialPlatform(id: string): SocialPlatform | null {
  const found = loadPlatformConfig().social.find((s) => s.id === id);
  if (!found || found.enabled === false || found.status === "disabled") return null;
  return found;
}

// ─── Public API — Courses ─────────────────────────────────────────────────────

function isCoursePublic(course: CourseConfig): boolean {
  if (course.enabled === false) return false;
  if (course.status === "disabled" || course.status === "archived" || course.status === "draft") {
    return false;
  }
  if (course.topic && !getTopicBySlug(course.topic)) return false;
  return true;
}

/** All enabled courses, sorted by order (excludes coming-soon by default). */
export function getAllCourseConfigs(): CourseConfig[] {
  return loadCoursesConfig()
    .filter((c) => isCoursePublic(c) && c.status !== "coming-soon")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** All coming-soon courses (for roadmap display). */
export function getComingSoonCourses(): CourseConfig[] {
  return loadCoursesConfig()
    .filter((c) => isCoursePublic(c) && c.status === "coming-soon")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Look up course config by id. Unknown ids return a non-public placeholder so UI can still render. */
export function getCourseConfig(id: string): CourseConfig {
  const found = loadCoursesConfig().find((c) => c.id === id || c.slug === id);
  if (found) return found;
  return {
    id,
    slug: id,
    title: id.charAt(0).toUpperCase() + id.slice(1),
    description: `Learning curriculum for ${id}.`,
    topic: id,
    category: "Technology",
    order: 99,
    enabled: false,
    status: "coming-soon",
    featured: false,
    showOnHomepage: false,
  };
}

/** Resolve a topic slug from course ID. */
export function getTopicSlugForCourse(courseId: string): string {
  const course = loadCoursesConfig().find((c) => c.id === courseId || c.slug === courseId);
  if (course?.topic) {
    const topic = getTopicBySlug(course.topic);
    return topic?.slug ?? course.topic;
  }
  return courseId;
}

// ─── Public API — Series ──────────────────────────────────────────────────────

/** All enabled content series, sorted by order. */
export function getAllSeriesConfigs(): SeriesConfig[] {
  return loadSeriesConfig()
    .filter((s) => s.enabled !== false)
    .filter((s) => !s.topic || Boolean(getTopicBySlug(s.topic)))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Get a series by id or slug. */
export function getSeriesConfigBySlug(slug: string): SeriesConfig | null {
  const found = loadSeriesConfig().find((s) => s.slug === slug || s.id === slug);
  if (!found || found.enabled === false) return null;
  if (found.topic && !getTopicBySlug(found.topic)) return null;
  return found;
}
