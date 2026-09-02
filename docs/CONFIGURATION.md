# Configuration

File: content/config/platform.json (plus courses.json and series.json). Rebuild required after edits. Disabled means hidden. Removed means the object is gone; prefer disable unless you are sure.

## Lifecycle status
planned: config only, nowhere public. coming-soon: optional small route if allowed; not search; not sitemap; not large homepage. active: public if enabled and (for homepage) has content. paused, disabled, archived: not public. enabled false: nowhere.

## Topic fields
id (stable), slug (URL), name, shortName, description, badge, category, color, order, enabled, featured, showOnHomepage, showInNavigation, status. showOnHomepage false hides from topic-grid even if active.

## Navigation
Items can use a static href (/about) or a source: kind topic with topicId, kind contentType with id, or kind channel. Href and label for source-bound items come from the live entity. Items whose source is not visible on the navigation surface are dropped.

## Brand and copy
brand.name, logo, logoAlt, logoMark (/brand/logo-mark.png), ogImage (/brand/og-image.jpg), favicon, tagline, description, url, email. copy.heroBadge, heroTitle, heroTagline, heroDescription, heroPrimaryCta, heroPrimaryCtaHref, heroSecondaryCta, headerCta, footerCopyright. Keywords come from public topic names, not a frozen list.

## defaults.topicSlug
Authoring default for new markdown only. If that topic is missing or not public, it is ignored. It is not a silent UI fallback that resurrects a removed topic.
