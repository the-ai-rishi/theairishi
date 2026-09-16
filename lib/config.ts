import platformJson from "../content/config/platform.json";
import coursesJson from "../content/config/courses.json";
import seriesJson from "../content/config/series.json";
import * as vis from "./visibility-core";
import type { LifecycleStatus, PlatformCatalog, Surface } from "./visibility-core";

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
  /** Editorial lockup under the name. Not a feature flag. */
  lineage?: string;
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
