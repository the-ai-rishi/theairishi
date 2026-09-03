# Common tasks

## PURPOSE

Copy-paste cheat sheet for this repository. Each task names the exact file and JSON. Link to the full doc at the end of the section.

## WHEN TO USE

When you already know the job and need the snippet. For theory and edge cases, follow the Full doc link.

## PREREQUISITES

- Repo cloned. Local npm run dev from [QUICK-START.md](./QUICK-START.md).
- Do not invent YouTube or Instagram items. Do not crop brand PNG/JPG. There is no Python content.
- npm run validate must stay 0 after the change.

## WHERE

- Config: `content/config/platform.json`, `content/config/courses.json`
- Lessons: `content/lessons`, `content/courses/devops`
- Guides: `content/guides`
- Projects: `content/projects`
- Media: `content/media/youtube.json`, `content/media/instagram.json`
- Templates: `templates/guide-template.md`, `templates/lesson-template.md`, `templates/project-template.md`, `templates/learning-path-template.json`
- Kernel: `lib/visibility-core.js`

## STEP-BY-STEP

### Add a guide

File: `content/guides/SLUG.md` copied from `templates/guide-template.md`. There is no `content/articles` folder.

Live today: `content/guides/first-principles-ai-learning.md`. Content type id `guides`, url /guides, status active.

```yaml
---
title: "A stand-alone essay title"
description: "One or two sentences. This is what listings and search show."
slug: "a-stand-alone-essay-title"
date: "2026-09-03"
category: "Learning Strategies"
tags: ["Mental Models"]
readTime: 6
author: "The AI Rishi"
featured: false
topic: "ai"
status: "published"
---
```

Full doc: [CONTENT/ADD-GUIDE.md](./CONTENT/ADD-GUIDE.md). Article alias: [CONTENT/ADD-ARTICLE.md](./CONTENT/ADD-ARTICLE.md).

### Add a lesson

AI path: new file under `content/lessons/`. DevOps path: new file under `content/courses/devops/`. Template: `templates/lesson-template.md`. `course` must match a `courses.json` id. `topic` must match a `topics[]` id. Live AI course id `ai`, DevOps course id `devops`. 15 AI lessons exist; the template uses lesson 16 for the next AI lesson.

```yaml
---
title: "What is this lesson about?"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "AI Fundamentals"
stageOrder: 1
lesson: 16
topic: "ai"
status: "published"
description: "One short paragraph that appears in listings and search."
---
```

Full doc: [CONTENT/ADD-LESSON.md](./CONTENT/ADD-LESSON.md).

### Add a path

Copy `templates/learning-path-template.json` into `content/config/courses.json` as one extra object. Keep `status` `coming-soon` until real lessons exist. `topic` must be a live `topics[]` id (use `ai` or `devops`; do not invent Python lessons).

```json
{
  "id": "example-path",
  "slug": "example-path",
  "title": "Example Path Title",
  "description": "One paragraph describing the curriculum. Do not publish this object until real lessons exist.",
  "topic": "ai",
  "category": "Artificial Intelligence",
  "order": 20,
  "enabled": true,
  "status": "coming-soon",
  "featured": false,
  "showOnHomepage": false,
  "badge": "Upcoming Course"
}
```

Full doc: [CONTENT/ADD-LEARNING-PATH.md](./CONTENT/ADD-LEARNING-PATH.md).

### Add a project

File: `content/projects/SLUG.md` from `templates/project-template.md`. Live file: `content/projects/autonomous-research-agent.md`. Content type id `projects`, url /projects. Hide a lab with `enabled: false`, not by changing the Completed badge. Omit `githubUrl` / `demoUrl` until you have a real URL (validate fails site-root placeholders).

```yaml
---
title: "A public lab write-up"
description: "What was built and why it is on the site."
slug: "a-public-lab-write-up"
date: "2026-09-03"
category: "Artificial Intelligence"
technologies: ["TypeScript", "LLMs"]
difficulty: "Intermediate"
status: "Completed"
featured: false
topic: "ai"
enabled: true
---
```

Full doc: [FEATURES/PROJECTS.md](./FEATURES/PROJECTS.md).

### Change hero

File: `content/config/platform.json` `copy`. Live values:

```json
{
  "heroBadge": "Knowledge · Systems · Building",
  "heroTitle": "The AI Rishi",
  "heroTagline": "Learn. Build. Stay Ahead.",
  "heroDescription": "A long-term technology and knowledge platform. Today you can learn AI and DevOps from first principles, read essays, and study a public lab.",
  "heroPrimaryCta": "Start learning",
  "heroPrimaryCtaHref": "/learn",
  "heroSecondaryCta": "Read a guide",
  "heroSecondaryCtaHref": "/guides"
}
```

Full doc: [CONFIGURATION/HOMEPAGE-CONFIGURATION.md](./CONFIGURATION/HOMEPAGE-CONFIGURATION.md).

### Hide a topic

File: `content/config/platform.json` `topics[]`. Lessons stay on disk.

Hide from homepage only (topic page can remain if contentCount > 0): keep `status` `active`, set `showOnHomepage` false. Example on DevOps:

```json
{
  "id": "devops",
  "slug": "devops",
  "status": "active",
  "enabled": true,
  "showOnHomepage": false,
  "showInNavigation": false
}
```

Hide everywhere: `enabled` false and/or `status` `disabled` / `paused` / `archived`. Pause DevOps:

```json
{
  "id": "devops",
  "status": "paused",
  "enabled": true
}
```

Full doc: [PLATFORM/DOMAIN-SYSTEM.md](./PLATFORM/DOMAIN-SYSTEM.md).

### Disable a feature

File: `content/config/platform.json` `contentTypes[]`. Disabling `guides` drops nav, homepage Writing list, search items, and /guides (the listing 404s). Same pattern for `learn` and `projects`.

```json
{
  "id": "guides",
  "enabled": false,
  "status": "disabled"
}
```

Or `status` `coming-soon` with `enabled` true: still not a public URL.

Full doc: [CONFIGURATION/FEATURE-FLAGS.md](./CONFIGURATION/FEATURE-FLAGS.md).

### Enable YouTube only with real items

Live: `content/media/youtube.json` is `[]`, `social` id `youtube` and `contentTypes` id `youtube` are `coming-soon`, /youtube 404s. Do not invent videos.

After a real video exists, replace the empty array:

```json
[
  {
    "id": "yt-1",
    "title": "Attention from scratch",
    "publishedAt": "2026-09-01",
    "url": "https://www.youtube.com/watch?v=REAL_ID",
    "duration": "12:04"
  }
]
```

Then in `platform.json` `social` id youtube and `contentTypes` id youtube:

```json
{
  "status": "active",
  "showOnHomepage": true,
  "showInNavigation": true
}
```

Optional: homepage.sections item type `channel-grid` enabled true. Optional nav `source.kind` `channel` id `youtube`. Then npm run validate, lint, build.

Full doc: [FEATURES/YOUTUBE.md](./FEATURES/YOUTUBE.md).

### Instagram

Same pattern as YouTube. Live: `content/media/instagram.json` is `[]`, ids `instagram`, href /instagram, /instagram 404s. Do not invent posts.

After a real post exists, add an object to instagram.json (`id`, `title`, `publishedAt`, `url` or `instagramUrl`), then set `social` id instagram and `contentTypes` id instagram to `status` `active`:

```json
{
  "id": "instagram",
  "href": "/instagram",
  "status": "active"
}
```

Full doc: [FEATURES/INSTAGRAM.md](./FEATURES/INSTAGRAM.md).

### Change nav

File: `content/config/platform.json` `navigation.main` and `navigation.footer`. Header cap 5; overflow disclosure is **More**. Header CTA is `copy.headerCta` Explore, `copy.headerCtaHref` /#explore (not a sixth nav item). Live main items:

```json
[
  { "id": "home", "label": "Home", "href": "/", "enabled": true, "order": 1, "status": "active" },
  { "id": "learn", "label": "Learn", "enabled": true, "order": 2, "status": "active", "source": { "kind": "contentType", "id": "learn" } },
  { "id": "guides", "label": "Guides", "enabled": true, "order": 3, "status": "active", "source": { "kind": "contentType", "id": "guides" } },
  { "id": "projects", "label": "Projects", "enabled": true, "order": 4, "status": "active", "source": { "kind": "contentType", "id": "projects" } },
  { "id": "about", "label": "About", "href": "/about", "enabled": true, "order": 5, "status": "active" }
]
```

To drop Learn from the bar: set that object `enabled` false (or hide contentTypes id learn). A sixth enabled main item goes into More, not a sixth header slot.

Full doc: [CONFIGURATION/NAVIGATION-CONFIGURATION.md](./CONFIGURATION/NAVIGATION-CONFIGURATION.md).

### Validate and publish

From the repo root:

```bash
npm run validate
npm run lint
npm run build
```

validate must exit 0. Deploy is Vercel at theairishi.vercel.app. The PR branch is not auto-main. Rebuild after JSON or markdown edits. Set `NEXT_PUBLIC_SITE_URL` if the canonical origin is not `brand.url` (https://theairishi.com).

Full docs: [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md), [OPERATIONS/PRE-PUBLISH-CHECKLIST.md](./OPERATIONS/PRE-PUBLISH-CHECKLIST.md), [OPERATIONS/DEPLOYMENT.md](./OPERATIONS/DEPLOYMENT.md).

### Revert

Uncommitted: `git restore -- path/to/file`. Committed: `git revert COMMIT`. Do not force-push.

Full doc: [OPERATIONS/BACKUP-AND-RECOVERY.md](./OPERATIONS/BACKUP-AND-RECOVERY.md).

## COMPLETE EXAMPLE

Add a second guide and ship it locally:

1. Copy `templates/guide-template.md` to `content/guides/a-stand-alone-essay-title.md`
2. Keep the YAML from the Add a guide section (slug must match the filename or the `slug` field)
3. Write the essay body. Do not invent YouTube or Instagram items from the template.
4. npm run validate
5. npm run dev and open http://localhost:3000/guides/a-stand-alone-essay-title
6. Confirm homepage Writing (`homepage.sections` id `guides`) lists it
7. npm run lint and npm run build

## VALIDATION

After every task: npm run validate (exit 0), open the route, search if public. See [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md).

## COMMON MISTAKES

- Inventing YouTube or Instagram items
- Cropping brand PNG or JPG
- Reintroducing switch(section.id)
- Leaking coming-soon in the public UI
- There is no Python content
- Active course with 0 lessons (validate fails)
- Placeholder github.com or instagram.com site-root URLs on a project

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| Route 404 | type or topic not enabled+active with content | keep it hidden or add real content |
| Missing homepage block | showWhenEmpty false and empty | add content or leave hidden |
| validate fails | active course with 0 lessons | set status coming-soon or add lessons |
| Nav item missing | source not public, or item is 6th+ in More | fix source enabled+active, or look in More |
| /youtube 404 | empty JSON or coming-soon | expected until real items + status active |

## HOW TO UNDO

Restore the JSON or markdown files with `git restore`, or `git revert` the commit. Do not force-push. See [OPERATIONS/BACKUP-AND-RECOVERY.md](./OPERATIONS/BACKUP-AND-RECOVERY.md).
