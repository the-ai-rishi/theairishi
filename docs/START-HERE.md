# Start here

The AI Rishi is a technology learning and teaching platform.

Right now the work is **DevOps Engineer Mastery**: 120 days, starting at the shell. AI and Agentic AI come later, after the engineering foundation. They stay off the homepage and the primary navigation until there is real material.

This is not a guru course, not a marketplace, and not an AI-first landing page.

Public verbs today:

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
| **Lesson** | A published markdown page | `content/lessons/*.md` | `/learn/[slug]` only when the file exists |
| **Topic** | Subject-area tag for visibility | `platform.json` `topics[]` | Homepage/nav/search/sitemap flags |
| **Content type** | A route family (`learn`, `guides`, `projects`) | `platform.json` `contentTypes[]` | URLs and Explore |
| **Series** | Reserved multi-format grouping | `content/config/series.json` | Unused. Keep `enabled: false`. |
| **Feature / channel** | YouTube, Instagram, etc. | `platform.json` `social[]` | Hidden until active **and** real items exist |

Example: Day 1 is a **lesson** in the **program** `devops-engineer-mastery`, tagged with **topic** `devops`, served by **content type** `learn`.

## Source of truth

| What do I want to change? | Edit this |
| --- | --- |
| Brand, homepage, nav, About, future path | `content/config/platform.json` |
| 120-day roadmap titles | `content/config/programs.json` (copy from the mastery repo; this file does **not** auto-sync) |
| Daily lesson | `content/lessons/day-NN.md` |
| Archive / older notes | `content/lessons/*.md`, `content/courses/devops/*.md` |
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

1. Update the mastery repo first.
2. Copy the changed phase/day metadata into `content/config/programs.json`. Do not invent titles.
3. If the day is ready to publish, add `content/lessons/day-NN.md`.
4. Run the verify loop below.

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

`hero` `program` `phases` `why` `today` `method` `path` `prose` `cta` `continue-learning` `topic-grid` `course-list` `content-list` `channel-grid`

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
| Enable Instagram | [FEATURES/INSTAGRAM.md](./FEATURES/INSTAGRAM.md) |
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
12. `brand.tagline` is optional. Do not invent a slogan because the field exists.
13. `brand.lineage` must not exist.
