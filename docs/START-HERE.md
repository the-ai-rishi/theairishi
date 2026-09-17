# Start here

The AI Rishi is a public technology learning journey.

Right now the work is **DevOps Engineer Mastery**: 120 days, starting at the shell. AI and Agentic AI come later, after the engineering foundation. They stay off the homepage and the navigation until there is real material.

This is not a guru course, not a marketplace, and not an AI-first landing page.

Public verbs today:

- **Start** — Day 1 (`/learn/day-01`)
- **Journey** — the 120-day map (`/learn`)
- **About** — why this exists (`/about`)

Hidden until you enable them **and** add real content:

- YouTube, Instagram
- Cloud, career, interview, updates as standalone areas
- An AI course as the main experience (existing AI notes stay at their URLs; they are not featured)

A feature with code is not a public feature. Planned / coming-soon areas have **no public URL**.

## How the site is operated

You edit JSON and Markdown. The site rebuilds. You do not edit React to add Day 4.

| What | Where |
| --- | --- |
| Brand, copy, topics, nav, homepage, social | `content/config/platform.json` |
| 120-day program map (phases + day titles) | `content/config/programs.json` |
| Learning paths | `content/config/courses.json` |
| Daily lessons | `content/lessons/day-NN.md` |
| Older notes (kept for URLs) | `content/lessons/*.md`, `content/courses/devops/*.md` |
| Guides / writing | `content/guides/*.md` |
| Projects / labs | `content/projects/*.md` |
| YouTube items | `content/media/youtube.json` |
| Instagram items | `content/media/instagram.json` |

## Before every publish

```bash
npm run validate
npm run lint
npm run build
```

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

## Rules that protect the product

1. Do not invent lessons, videos, student counts, salaries, or job guarantees.
2. Day titles come from `content/config/programs.json`, which copies the locked plan in [devops-engineer-mastery](https://github.com/the-ai-rishi/devops-engineer-mastery). Do not invent a Day 13 title.
3. A day becomes a page only when `content/lessons/day-NN.md` is published. Unpublished days stay titles on `/learn`.
4. Do not restore the phrase “Ancient patience. Modern systems.” Validation fails if it comes back.
5. Do not set a planned topic to `active` unless published content exists.
6. Do not crop or replace brand images in `public/brand/` unless you intend a brand change.
7. Do not change URLs of existing lessons, guides, or projects.
8. Do not edit `lib/content-data.generated.ts`. It is generated.
9. Project frontmatter `status` is a badge (`Completed` / `In Progress` / `Planned`). Hide a lab with `enabled: false`, not by changing the badge.
10. Content on this site is free. Do not add pricing pages.

## What a visitor should understand in ten seconds

This person is learning production-shaped DevOps in public. The current program is 120 days. Start at Day 1. AI comes later. There is no guru pitch.
