# The AI Rishi — Platform Architecture & Operations Manual

Welcome to **The AI Rishi** platform manual.

This guide explains how the entire platform is structured, how configuration controls every piece of UI and content, and how you can add, modify, reorder, or disable topics, courses, lessons, guides, sections, and branding without writing any code.

---

## 1. Core Architectural Principle

> **TypeScript and React code defines HOW the platform functions.**
> **JSON configuration and Markdown content defines WHAT the platform contains.**

No category, topic, course, social network, or brand text is hardcoded into the platform's components. Everything is driven from configuration files located in `content/config/`.

---

## 2. Configuration Files Overview

All configuration files reside in `content/config/`:

| File | Purpose |
|---|---|
| `content/config/platform.json` | Single source of truth for **Branding**, **UI Copy**, **Topics**, **Content Formats**, **Navigation**, **Homepage Sections**, and **Social Media**. |
| `content/config/courses.json` | Catalog of all active and upcoming learning courses, stages, categories, and badges. |
| `content/config/series.json` | Multi-format learning series connecting courses, articles, projects, and videos. |

---

## 3. How to Manage Platform Branding

Open `content/config/platform.json` and edit the `"brand"` block:

```json
"brand": {
  "name": "The AI Rishi",
  "logo": "/brand/logo-horizontal.png",
  "logoAlt": "The AI Rishi",
  "logoMark": "/brand/logo.png",
  "ogImage": "/brand/logo.png",
  "faviconUrl": "/icon.png",
  "appleTouchIcon": "/apple-icon.png",
  "tagline": "Learn. Build. Stay Ahead.",
  "description": "AI, technology, engineering, and career knowledge — explained simply and practically.",
  "url": "https://theairishi.com",
  "email": "contact@theairishi.com"
}
```

- Changing `"logo"` automatically updates the Header, Footer, and not-found pages.
- Changing `"tagline"` automatically updates the Root Layout metadata, OpenGraph tags, Hero title, and Footer.
- Changing `"name"` updates all metadata and copyright notices.

---

## 4. How to Manage Topics / Domains

In `content/config/platform.json`, find the `"topics"` array:

```json
{
  "id": "ai",
  "slug": "ai",
  "name": "Artificial Intelligence & LLMs",
  "shortName": "AI / LLM",
  "description": "Deep neural networks, attention mechanisms, vector databases...",
  "badge": "AI / LLM",
  "category": "AI & Data",
  "color": "purple",
  "order": 1,
  "enabled": true,
  "featured": true,
  "showOnHomepage": true,
  "showInNavigation": false,
  "status": "active"
}
```

### Common Actions:

- **Add a new topic**: Add an object with unique `id` and `slug`. It will instantly generate a new route at `/topics/<slug>`, appear in search, sitemap, and the explore grid.
- **Rename a topic**: Change `"name"` or `"slug"`. All dynamic links automatically update.
- **Disable a topic**: Set `"enabled": false`. The topic is removed from navigation, sitemap, homepage, and search without breaking any code.
- **Reorder topics**: Change the `"order"` numbers (e.g. `1, 2, 3...`).

---

## 5. How to Manage Homepage Sections

In `content/config/platform.json`, the `"homepage.sections"` array controls which sections appear on the homepage and in what order:

```json
"homepage": {
  "sections": [
    { "id": "hero", "enabled": true, "order": 1 },
    { "id": "topics", "enabled": true, "order": 2, "title": "Explore The AI Rishi", "subtitle": "Platform Domains", "ctaLabel": "View All Courses", "ctaHref": "/learn" },
    { "id": "content-types", "enabled": true, "order": 3, "title": "What You'll Find Here", "subtitle": "Format Diversity" },
    { "id": "continue-learning", "enabled": true, "order": 4 },
    { "id": "latest-content", "enabled": true, "order": 5, "title": "Latest Content & Articles", "subtitle": "Platform Stream" },
    { "id": "technology-updates", "enabled": true, "order": 6, "title": "Technology Radar & Updates", "subtitle": "Tech Radar", "ctaLabel": "View All Radar Updates", "ctaHref": "/topics/updates" },
    { "id": "interviews", "enabled": true, "order": 7, "title": "Interview & Career Prep", "subtitle": "Career Track", "ctaLabel": "View All Prep Content", "ctaHref": "/topics/interview" },
    { "id": "guides", "enabled": true, "order": 8, "title": "Featured Guides", "subtitle": "Technical Guides" },
    { "id": "projects", "enabled": true, "order": 9, "title": "Projects & Labs", "subtitle": "Build in Public" },
    { "id": "series", "enabled": true, "order": 10, "title": "Featured Content Series", "subtitle": "Multi-Format Tracks" },
    { "id": "social", "enabled": true, "order": 11 },
    { "id": "cta", "enabled": true, "order": 12 }
  ]
}
```

- **Reorder sections**: Change the `"order"` numbers.
- **Hide a section**: Set `"enabled": false`.
- **Change section title/subtitle/CTA**: Edit `"title"`, `"subtitle"`, `"ctaLabel"`, or `"ctaHref"`.

---

## 6. How to Manage Social Platforms & Channels

In `content/config/platform.json`, find the `"social"` array:

```json
{
  "id": "youtube",
  "label": "YouTube",
  "href": "/youtube",
  "externalUrl": "https://youtube.com/@theairishi",
  "enabled": true,
  "status": "coming-soon",
  "order": 1,
  "displayName": "YouTube Media Library",
  "description": "In-depth video tutorials, architectural walk-throughs...",
  "badge": "Video Teardowns"
}
```

- When `"status": "coming-soon"`, the `/youtube` page displays a high-conversion waiting list / subscribe card.
- When `"status": "active"`, it renders all videos from `content/media/youtube.json`.

---

## 7. How to Validate Platform Health

Run the automated validator anytime you update configuration files:

```bash
npm run validate
```

Then build the project to verify full static generation:

```bash
npm run build
```
