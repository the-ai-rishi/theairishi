export interface KernelEntity {
  id?: string;
  slug?: string;
  name?: string;
  shortName?: string;
  description?: string;
  title?: string;
  label?: string;
  href?: string;
  url?: string;
  badge?: string;
  category?: string;
  status?: string;
  enabled?: boolean;
  displayName?: string;
  lessonCount?: number;
  type?: string;
  topicSlug?: string;
  tags?: string[];
  order?: number;
  showOnHomepage?: boolean;
  showInNavigation?: boolean;
  [key: string]: unknown;
}

export type Surface = "homepage" | "navigation" | "search" | "sitemap" | "route";
export type LifecycleStatus =
  | "planned"
  | "coming-soon"
  | "active"
  | "paused"
  | "disabled"
  | "archived";

export const LIFECYCLE_STATUSES: LifecycleStatus[];
export const SURFACES: Surface[];
export const SECTION_TYPES: string[];
export const FORMAT_TO_CONTENT_TYPE: Record<string, string>;
export const CONTENT_TYPE_TO_FORMAT: Record<string, string>;

export interface PlatformCatalog {
  topicContentCounts: Record<string, number>;
  formatContentCounts: Record<string, number>;
  channelItemCounts: Record<string, number>;
  courses: Array<Record<string, unknown> & {
    id: string;
    slug?: string;
    title?: string;
    description?: string;
    topic?: string;
    status?: string;
    enabled?: boolean;
    order?: number;
    lessonCount?: number;
    badge?: string;
    category?: string;
    showOnHomepage?: boolean;
  }>;
  items: KernelEntity[];
}

export interface ResolvedHomepageSection {
  id: string;
  type: string;
  enabled: boolean;
  order?: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  source?: { kind: string; topicId?: string; format?: string; channelId?: string; id?: string };
  maxItems?: number;
  showWhenEmpty?: boolean;
  data: {
    empty?: boolean;
    topics?: unknown[];
    courses?: unknown[];
    items?: unknown[];
    channels?: unknown[];
    focusTopic?: unknown;
    tone?: string;
    ctaHref?: string;
    missingSource?: boolean;
    [key: string]: unknown;
  };
}

export function normalizeKey(value: unknown): string;
export function normalizeStatus(status: unknown): string;
export function isValidLifecycle(status: unknown): boolean;
export function emptyCatalog(): PlatformCatalog;
export function findTopic(platform: unknown, key: string): Record<string, unknown> | null;
export function findContentType(platform: unknown, key: string): Record<string, unknown> | null;
export function findChannel(platform: unknown, key: string): Record<string, unknown> | null;
export function topicCount(catalog: PlatformCatalog | undefined, topic: unknown): number;
export function formatCount(catalog: PlatformCatalog | undefined, formatOrTypeId: string): number;
export function channelCount(catalog: PlatformCatalog | undefined, channel: unknown): number;
export function isVisibleOnSurface(
  entity: Record<string, unknown> | null | undefined,
  surface: Surface,
  options?: Record<string, unknown>
): boolean;
export function isTopicVisible(
  platform: unknown,
  topic: unknown,
  surface: Surface,
  catalog?: PlatformCatalog,
  extra?: Record<string, unknown>
): boolean;
export function isContentTypeVisible(
  platform: unknown,
  contentType: unknown,
  surface: Surface,
  catalog?: PlatformCatalog,
  extra?: Record<string, unknown>
): boolean;
export function isChannelVisible(
  platform: unknown,
  channel: unknown,
  surface: Surface,
  catalog?: PlatformCatalog,
  extra?: Record<string, unknown>
): boolean;
export function publicTopics(platform: unknown, catalog: PlatformCatalog | undefined, surface: Surface): KernelEntity[];
export function publicContentTypes(platform: unknown, catalog: PlatformCatalog | undefined, surface: Surface): KernelEntity[];
export function publicChannels(platform: unknown, catalog: PlatformCatalog | undefined, surface: Surface): KernelEntity[];
export function publicCourses(platform: unknown, catalog: PlatformCatalog | undefined, forHomepage?: boolean): KernelEntity[];
export function comingSoonCourses(platform: unknown, catalog: PlatformCatalog | undefined): KernelEntity[];
export function resolveHomepageSections(
  platform: unknown,
  catalog?: PlatformCatalog,
  options?: Record<string, unknown>
): { sections: ResolvedHomepageSection[]; unknownTypes: KernelEntity[]; skipped: KernelEntity[] };
export function resolveNavItems(
  platform: unknown,
  catalog: PlatformCatalog | undefined,
  listKind: "main" | "footer"
): Array<{ id: string; label: string; href: string; enabled: boolean; order: number; status?: string; source?: unknown }>;
export function getSearchIndexInputs(platform: unknown, catalog?: PlatformCatalog): {
  topics: KernelEntity[];
  channels: KernelEntity[];
  contentTypes: KernelEntity[];
  courses: KernelEntity[];
  items: KernelEntity[];
};
export function getSitemapInputs(platform: unknown, catalog?: PlatformCatalog): {
  topics: KernelEntity[];
  channels: KernelEntity[];
  contentTypes: KernelEntity[];
  courses: KernelEntity[];
  items: KernelEntity[];
  corePaths: string[];
  topicPaths: string[];
  channelPaths: string[];
};
export function getRouteTopics(platform: unknown, catalog?: PlatformCatalog): KernelEntity[];
export function getRouteChannels(platform: unknown, catalog?: PlatformCatalog): KernelEntity[];
export function topicRouteState(
  platform: unknown,
  key: string,
  catalog?: PlatformCatalog
): { state: "not-found" | "coming-soon" | "active"; topic: KernelEntity | null };
export function channelRouteState(
  platform: unknown,
  key: string,
  catalog?: PlatformCatalog
): { state: "not-found" | "coming-soon" | "active"; channel: KernelEntity | null };
export function deriveContentTypeHref(platform: unknown, contentType: unknown): string | null;
export function collectResolvedText(resolved: unknown): string;
