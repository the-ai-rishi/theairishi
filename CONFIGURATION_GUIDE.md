# The AI Rishi — Configuration Schema Reference Guide

This document is the technical schema reference for all configuration files in `content/config/`.

---

## 1. `content/config/platform.json` Schema

### 1.1 Brand Configuration (`brand`)

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Platform name (e.g. `"The AI Rishi"`) |
| `logo` | string | Yes | Path to horizontal logo (e.g. `"/brand/logo-horizontal.png"`) |
| `logoAlt` | string | Yes | Alt text for logo |
| `logoMark` | string | Yes | Path to square mark / icon logo |
| `ogImage` | string | Yes | Path to 1200x630 OpenGraph social preview image |
| `faviconUrl` | string | No | Path to favicon |
| `appleTouchIcon` | string | No | Path to Apple touch icon |
| `tagline` | string | Yes | Primary brand tagline (e.g. `"Learn. Build. Stay Ahead."`) |
| `description` | string | Yes | SEO and default site description |
| `url` | string | Yes | Canonical platform URL (e.g. `"https://theairishi.com"`) |
| `email` | string | No | Contact email |

### 1.2 UI Copy (`copy`)

| Field | Type | Description |
|---|---|---|
| `heroBadge` | string | Pill badge above hero title |
| `heroTitle` | string | Primary hero headline |
| `heroTagline` | string | Highlighted gradient text under hero title |
| `heroDescription` | string | Supporting paragraph under hero title |
| `heroPrimaryCta` | string | Label for primary hero CTA button |
| `heroPrimaryCtaHref` | string | Destination URL for primary CTA |
| `heroSecondaryCta` | string | Label for secondary hero CTA button |
| `heroSecondaryCtaHref` | string | Destination URL for secondary CTA |
| `headerCta` | string | Label for CTA button in navigation bar |
| `headerCtaHref` | string | Destination URL for header CTA |
| `footerCopyright` | string | Copyright entity text in footer |

### 1.3 Topics (`topics[]`)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique internal ID |
| `slug` | string | Yes | URL slug (e.g. `"ai"` -> `/topics/ai`) |
| `name` | string | Yes | Full display name |
| `shortName` | string | Yes | Compact label for chips/badges |
| `description` | string | Yes | Summary of the topic domain |
| `badge` | string | Yes | Badge text displayed on cards |
| `category` | string | Yes | Grouping category |
| `color` | string | Yes | Theme accent (e.g. `"purple"`, `"emerald"`) |
| `order` | number | Yes | Sort order (lower numbers come first) |
| `enabled` | boolean | Yes | Whether the topic is active on the platform |
| `featured` | boolean | Yes | Featured highlight status |
| `showOnHomepage` | boolean | Yes | Whether to show in Homepage Explore grid |
| `showInNavigation` | boolean | Yes | Whether to show in Main Navigation menu |
| `status` | string | Yes | `"active"` \| `"coming-soon"` \| `"disabled"` |

### 1.4 Homepage Sections (`homepage.sections[]`)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Section identifier (`hero`, `topics`, `content-types`, `latest-content`, etc.) |
| `enabled` | boolean | Yes | Toggle section on/off |
| `order` | number | Yes | Display position order |
| `title` | string | No | Section main heading override |
| `subtitle` | string | No | Section pill / eyebrow tag |
| `ctaLabel` | string | No | Header action link label |
| `ctaHref` | string | No | Header action link destination |
| `topicId` | string | No | Bind this section to a topic id/slug. Hidden automatically if that topic is removed or disabled. |

---

## 2. `content/config/courses.json` Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Course unique ID (matches lesson frontmatter `course: <id>`) |
| `slug` | string | Yes | URL slug |
| `title` | string | Yes | Full course title |
| `description` | string | Yes | Detailed course description |
| `topic` | string | Yes | Associated topic ID from `platform.json` |
| `category` | string | Yes | Grouping category |
| `order` | number | Yes | Display order |
| `enabled` | boolean | Yes | Active toggle |
| `status` | string | Yes | `"active"` \| `"coming-soon"` \| `"draft"` |
| `featured` | boolean | Yes | Featured on homepage |
| `showOnHomepage` | boolean | Yes | Show in course lists |
| `badge` | string | No | Tag badge (e.g. `"Core Path"`, `"Upcoming"`) |
| `upcomingTopics`| string[] | No | Array of technologies (for coming soon roadmap cards) |
