# Start here

The AI Rishi is a technology learning and teaching platform.

Right now the work is **DevOps Engineer Mastery**: 120 days, starting at the shell. AI and Agentic AI come later, after the engineering foundation. They stay off the homepage and the primary navigation until there is real material.

This is not a guru course, not a marketplace, and not an AI-first landing page.

Primary navigation today:

- **Start** — Day 1 (`/learn/day-01`)
- **120 Days** — the plan (`/learn`)
- **About** — why this exists (`/about`)
- **Explore** — Guides and Projects when those files exist

The homepage is for the learner (what to learn, where to start). The About page is the personal story.

Do not describe this product as a “public learning journey” or “learning in public.” Do not restore “Ancient patience. Modern systems.”

This is the only documentation entry point. There is no `START_HERE.md`.

## What a visitor should understand in ten seconds

This is a structured 120-day DevOps program. Start at Day 1. AI is later. There is no guru pitch.

## Domain model

DevOps Engineer Mastery is a **program**. That is its canonical meaning.

| Concept | What it is | Source | Public role |
| --- | --- | --- | --- |
| **Program** | The 120-day curriculum map (phases + day titles) | `content/config/programs.json` | `/learn`, homepage, Start Day 1 |
| **Course** | A lesson grouping for the syllabus UI. The featured course is a pointer to the program, not a second map. Archive courses group older notes. | `content/config/courses.json` | Not primary nav. AI course is not featured. |
| **Lesson** | A published markdown page | `content/lessons/*.md` only | `/learn/[slug]` only when `lib/lesson-publish.js` says it is public |
| **Topic** | Subject-area tag for visibility | `platform.json` `topics[]` | Homepage/nav/search/sitemap flags |
| **Content type** | A route family (`learn`, `guides`, `projects`) | `platform.json` `contentTypes[]` | URLs and Explore |
| **Series** | Reserved multi-format grouping | `content/config/series.json` | Unused. Keep `enabled: false`. |
| **Feature / channel** | External profiles (Instagram, Telegram, GitHub) or on-site media (YouTube) | `platform.json` `social[]` | External links when enabled+active with a real https URL. On-site listings still need real items |

Example: Day 1 is a **lesson** in the **program** `devops-engineer-mastery`, tagged with **topic** `devops`, served by **content type** `learn`.

## Source of truth

| What do I want to change? | Edit this |
| --- | --- |
| Brand, homepage, nav, About, future path | `content/config/platform.json` |
| 120-day roadmap titles | `content/config/programs.json` `programs[]` (copy from the mastery repo; this file does **not** auto-sync). Featured program is `featuredProgramId`. |
| Daily lesson | `content/lessons/day-NN.md` |
| Archive / older notes | `content/lessons/<slug>.md` (same `/learn/<slug>` URL). Not `content/courses/`. |
| Guides / writing | `content/guides/*.md` |
| Projects / labs | `content/projects/*.md` |
| Learning-path grouping | `content/config/courses.json` |
| Series (do not enable) | `content/config/series.json` |
| Search matching | `lib/search.ts` |
| Visibility rules | `lib/visibility-core.js` |
| Canonical URLs | `lib/urls.ts` |

Conceptual source of truth for Day titles: [devops-engineer-mastery](https://github.com/the-ai-rishi/devops-engineer-mastery) `roadmap/120-day-execution.md`.

Operational source of truth for this website: `content/config/programs.json`. Changing the other repo does **not** change the site.

Sync procedure:

1. Update the mastery repo first (`roadmap/120-day-execution.md`).
2. Copy the changed phase/day **titles and summaries** into `content/config/programs.json`. Short headlines are fine; do not invent a different Day 13.
3. If the day is ready to publish, add `content/lessons/day-NN.md`.
4. Run `npm run validate` (this regenerates the published-slug catalog).
5. Preview the route, then commit.

## Visibility matrix

| State | Route | Nav | Search | Sitemap |
| --- | --- | --- | --- | --- |
| Published, current program | Yes | Start / 120 Days | Yes | Yes |
| Published AI notes (`includeInSearch`/`includeInSitemap` false) | Yes (URL kept) | No | No | No |
| Guides / projects with files | Yes | Explore | Yes, unless their topic opts out | Yes, unless topic opts out |
| Draft / planned / coming-soon / disabled | No | No | No | No |

The current AI guide and lab keep their URLs and stay in **Explore**. They are tagged `topic: ai`, so they follow the AI search/sitemap opt-out. Do not delete the files.

**Decision:** existing AI notes stay at their URLs. They are excluded from search and the sitemap so a first-time visitor is not sent to an AI course. Each AI-topic page carries `discoveryNote`. Do not delete the files.

## Homepage section types

Allowed `homepage.sections[].type` values (unknown types fail validation):

`hero` `program` `phases` `why` `today` `method` `path` `prose` `cta` `continue-learning` `destinations` `topic-grid` `course-list` `content-list` `channel-grid`

## Before every publish

```bash
npm run validate
npm run lint
npm run build
```

Then confirm the route in preview. Then commit.

If validate fails, do not deploy. Read the `ERROR:` / `Fix:` block. It names the file and the field.

## Common jobs

| I want to… | Open this |
| --- | --- |
| Add tomorrow’s DevOps day | [CONTENT/ADD-DAILY-LESSON.md](./CONTENT/ADD-DAILY-LESSON.md) |
| Understand the 120-day program | [DEVOPS-ENGINEER-MASTERY.md](./DEVOPS-ENGINEER-MASTERY.md) |
| Add a non-daily lesson | [CONTENT/ADD-LESSON.md](./CONTENT/ADD-LESSON.md) |
| Add an essay | [CONTENT/ADD-GUIDE.md](./CONTENT/ADD-GUIDE.md) |
| Add a lab | [CONTENT/ADD-PROJECT.md](./CONTENT/ADD-PROJECT.md) |
| Add a topic | [CONTENT/ADD-TOPIC.md](./CONTENT/ADD-TOPIC.md) |
| Enable YouTube | [FEATURES/YOUTUBE.md](./FEATURES/YOUTUBE.md) |
| Instagram (live external profile) | [FEATURES/INSTAGRAM.md](./FEATURES/INSTAGRAM.md) |
| Telegram (reserved, empty URL) | [FEATURES/TELEGRAM.md](./FEATURES/TELEGRAM.md) |
| Social configuration | [CONFIGURATION/SOCIAL-CONFIGURATION.md](./CONFIGURATION/SOCIAL-CONFIGURATION.md) |
| Add a future program | [CONTENT/ADD-PROGRAM.md](./CONTENT/ADD-PROGRAM.md) |
| Future operations (Day N, Phase 12, tabs) | [OPERATIONS/FUTURE-OPERATIONS.md](./OPERATIONS/FUTURE-OPERATIONS.md) |
| Enable any feature | [FEATURES/ENABLE-FEATURE.md](./FEATURES/ENABLE-FEATURE.md) |
| Disable a feature | [FEATURES/DISABLE-FEATURE.md](./FEATURES/DISABLE-FEATURE.md) |
| Change homepage order | [CONFIGURATION/HOMEPAGE-CONFIGURATION.md](./CONFIGURATION/HOMEPAGE-CONFIGURATION.md) |
| Change navigation labels | `content/config/platform.json` → `navigation.main` |
| Change brand copy | `content/config/platform.json` → `brand` and `copy` |
| Run locally | [OPERATIONS/LOCAL-DEVELOPMENT.md](./OPERATIONS/LOCAL-DEVELOPMENT.md) |
| Validate | [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md) |
| Deploy | [OPERATIONS/DEPLOYMENT.md](./OPERATIONS/DEPLOYMENT.md) |
| Cloudflare errors | [deployment/CLOUDFLARE.md](./deployment/CLOUDFLARE.md) |
| Search | [PLATFORM/SEARCH.md](./PLATFORM/SEARCH.md) |
| Visibility rules | [VISIBILITY_AND_LIFECYCLE.md](./VISIBILITY_AND_LIFECYCLE.md) |
| Documentation map | [DOCUMENTATION-MAP.md](./DOCUMENTATION-MAP.md) |

## Rules that protect the product

1. Do not invent lessons, videos, student counts, salaries, or job guarantees.
2. Day titles come from `content/config/programs.json`, copied from the locked plan. Do not invent a Day 13 title.
3. A day becomes a page only when `content/lessons/day-NN.md` is published. Unpublished days stay titles on `/learn`.
4. Display **Day 1**. Keep **day-01** only as the URL/filename.
5. Do not restore the phrase “Ancient patience. Modern systems.” Validation fails if it comes back.
6. Do not set a planned topic to `active` unless published content exists.
7. Do not crop or replace brand images in `public/brand/` unless you intend a brand change.
8. Do not change URLs of existing lessons, guides, or projects.
9. Do not edit `lib/content-data.generated.ts`. It is generated.
10. Project frontmatter `status` is a badge (`Completed` / `In Progress` / `Planned`). Hide a lab with `enabled: false`.
11. Content on this site is free. Do not add pricing pages.
12. Do not add `brand.tagline` unless you intend a real slogan. An empty tagline field is rejected. Same for `copy.heroTitle` and `copy.heroTagline` — omit them; the hero uses the program title.
13. `brand.lineage` must not exist.
14. `defaults.authorName` is the public Person in structured data. It is currently **The AI Rishi** — the brand as Person, set on purpose. Change the config if you want a different public name indexed. Do not infer a private legal name.
15. Never edit generated catalogs. `lib/content-data.generated.ts` and `lib/published-lesson-slugs.generated.ts` are written before every Next compile. They are rewritten only when content actually changes, so the Next watcher does not loop.
16. `lib/lesson-publish.js` is the only “is this a public /learn page?” rule. Generator, runtime, and validate all use it. Markdown under `content/courses/` is never a `/learn` route.
17. Instagram is an external profile (`social[]`), not an `/instagram` page. Telegram is enabled with a documented placeholder, not a real `t.me` group; it is not in `sameAs`. GitHub is configured but hidden. Do not invent Instagram posts. A public lesson needs an explicit `status` (`published`).
18. `programs.json` is a catalog with `featuredProgramId`. Adding AI later is a new object in `programs[]`, not a homepage rewrite.

## Generated catalogs (do not let them go stale)

`scripts/generate-content-data.js` writes:

- `lib/content-data.generated.ts` — markdown/JSON embed
- `lib/published-lesson-slugs.generated.ts` — published `/learn/[slug]` allow-list (from `content/lessons/*.md` via `lib/lesson-publish.js`) plus static `app/learn/<name>/page.*` folders

`next.config.ts` calls `generateContentData()` at module load. That is an **intentional build contract**: OpenNext runs `npx next build`, which skips npm `prebuild`. Do not duplicate that generation in other config files. Do not remove it.

It also runs from:

1. `next.config.ts` on every `next dev` / `next build`
2. npm `predev` / `prebuild` / `prevalidate` / `precf:build`
3. OpenNext `buildCommand`

Adding `content/lessons/day-04.md` with complete published frontmatter and running a production build regenerates the allow-list. Middleware will then let Day 4 through.

A directory under `app/learn` is an allowed `/learn/<name>` only when it contains a Next.js `page.*` file (today: `ai-fundamentals`, a redirect). A utility folder without a page is ignored.

Unpublished `/learn/day-N` 404s via middleware rewrite to `/missing-lesson` with HTTP 404. That is the mechanism on Cloudflare Workers. `app/learn/[slug]/not-found.tsx` is only a fallback if a listed slug is missing at runtime.

The `what` homepage section stays disabled. `story.whatTitle` / `story.whatBody` are reserved copy for that section — not live homepage text.

## Compatibility docs

Root files such as `ARCHITECTURE.md`, `AUTHORING.md`, `PLATFORM_MANUAL.md`, `CONFIGURATION_GUIDE.md`, `CONTENT_GUIDE.md`, and `PRODUCTION_GUIDE.md` are **one-line redirects**. They are not canonical. Start at [docs/START-HERE.md](./START-HERE.md) or [docs/DOCUMENTATION-MAP.md](./DOCUMENTATION-MAP.md).

`lib/program-schema.js` is the only program validator. Runtime and `scripts/validate.js` both use it. `lib/course-href.js` is the only course-card href rule. `lib/lesson-publish.js` is the only public-lesson predicate.
