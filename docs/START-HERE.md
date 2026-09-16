# Start here

The AI Rishi is a **technology knowledge studio**, not a course marketplace.

Public verbs today:

- **Learn** — structured paths (`/learn`)
- **Read** — essays and guides (`/guides`)
- **Build** — public labs (`/projects`)
- **Explore** — topics that already have published work (`/topics/ai`, `/topics/devops`)

Hidden until you enable them **and** add real content:

- Watch (YouTube)
- Follow (Instagram)
- Cloud, engineering, interview, career, updates

A feature with code is not a public feature. Planned / coming-soon areas have **no public URL**.

## How the site is operated

You edit JSON and Markdown. The site rebuilds. You do not edit React to add a lesson.

| What | Where |
| --- | --- |
| Brand, copy, topics, nav, homepage, social | `content/config/platform.json` |
| Learning paths | `content/config/courses.json` |
| Lessons | `content/lessons/*.md` and `content/courses/**/*.md` |
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

If validate fails, do not deploy.

## Common jobs

| I want to… | Open this |
| --- | --- |
| Add a lesson | [CONTENT/ADD-LESSON.md](./CONTENT/ADD-LESSON.md) |
| Add an essay | [CONTENT/ADD-GUIDE.md](./CONTENT/ADD-GUIDE.md) |
| Add a lab | [CONTENT/ADD-PROJECT.md](./CONTENT/ADD-PROJECT.md) |
| Add a topic | [CONTENT/ADD-TOPIC.md](./CONTENT/ADD-TOPIC.md) |
| Enable YouTube | [FEATURES/YOUTUBE.md](./FEATURES/YOUTUBE.md) |
| Enable Instagram | [FEATURES/INSTAGRAM.md](./FEATURES/INSTAGRAM.md) |
| Enable any feature | [FEATURES/ENABLE-FEATURE.md](./FEATURES/ENABLE-FEATURE.md) |
| Disable a feature | [FEATURES/DISABLE-FEATURE.md](./FEATURES/DISABLE-FEATURE.md) |
| Change homepage order | [CONFIGURATION/HOMEPAGE-CONFIGURATION.md](./CONFIGURATION/HOMEPAGE-CONFIGURATION.md) |
| Change navigation labels | `content/config/platform.json` → `navigation.main` |
| Run locally | [OPERATIONS/LOCAL-DEVELOPMENT.md](./OPERATIONS/LOCAL-DEVELOPMENT.md) |
| Validate | [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md) |
| Deploy | [OPERATIONS/DEPLOYMENT.md](./OPERATIONS/DEPLOYMENT.md) |
| Cloudflare errors | [deployment/CLOUDFLARE.md](./deployment/CLOUDFLARE.md) |

## Rules that protect the product

1. Do not invent YouTube videos, Instagram posts, or career articles to fill space.
2. Do not set a planned topic to `active` unless published content exists.
3. Do not crop or replace brand images in `public/brand/` unless you intend a brand change.
4. Do not change URLs of existing lessons, guides, or projects.
5. Do not edit `lib/content-data.generated.ts`. It is generated.
6. Project frontmatter `status` is a badge (`Completed` / `In Progress` / `Planned`). Hide a lab with `enabled: false`, not by changing the badge.
