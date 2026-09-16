# Start here

The AI Rishi is a **technology knowledge and media platform**, not only a course site.

Public verbs today:

- **Learn** — structured paths (`/learn`)
- **Read** — guides and essays (`/guides`)
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

- Add a lesson → [content/ADD-LESSON.md](./content/ADD-LESSON.md)
- Add a topic → [content/ADD-TOPIC.md](./content/ADD-TOPIC.md)
- Enable YouTube → [features/YOUTUBE.md](./features/YOUTUBE.md)
- Disable a feature → [features/DISABLE-FEATURE.md](./features/DISABLE-FEATURE.md)
- Change homepage order → edit `homepage.sections` in `platform.json`, then read [architecture/SECTION-ENGINE.md](./architecture/SECTION-ENGINE.md)
- Deploy → [operations/DEPLOYMENT.md](./operations/DEPLOYMENT.md)
- Local works, Cloudflare does not → [operations/CLOUDFLARE.md](./operations/CLOUDFLARE.md)

## Rules that protect the product

1. Do not invent YouTube videos, Instagram posts, or career articles to fill space.
2. Do not set a planned topic to `active` unless published content exists.
3. Do not crop or replace brand images in `public/brand/`.
4. Do not change URLs of existing lessons, guides, or projects.
5. Do not edit `lib/content-data.generated.ts`. It is generated.
