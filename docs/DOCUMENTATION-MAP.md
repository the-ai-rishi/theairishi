# Documentation map

## PURPOSE

Find the operator doc and the exact files for a job in this repository. Not a generic CMS map.

## WHEN TO USE

When you know the job (add a guide, change hero, enable YouTube) and need the file plus the long-form doc.

## PREREQUISITES

Read [START-HERE.md](./START-HERE.md) first. Then this map. Then [COMMON-TASKS.md](./COMMON-TASKS.md).

Root `ARCHITECTURE.md`, `AUTHORING.md`, `PLATFORM_MANUAL.md`, `CONFIGURATION_GUIDE.md`, `CONTENT_GUIDE.md`, and `PRODUCTION_GUIDE.md` are compatibility redirects into `docs/`. They are not a second manual.

## WHERE

Honesty: new topic / lesson / guide / project / program / nav tab / social destination = JSON + markdown, no React. New homepage section TYPE, new route shape, new visibility semantics = developer. There is no Python content. Instagram is a live external profile. Telegram stays disabled with an empty URL. YouTube stays empty and coming-soon until REAL items exist. Active internal channel + zero content = no public route.

Kernel: `lib/visibility-core.js`. Config: `content/config/platform.json`, `content/config/courses.json`. Content: `content/lessons`, `content/courses`, `content/guides`, `content/projects`, `content/media`.

## STEP-BY-STEP

Use the I want to table, then the What file do I edit table.

| I want to | Read | Files involved |
| --- | --- | --- |
| Add an article (this repo: a guide) | CONTENT/ADD-ARTICLE.md | content/guides/*.md, templates/guide-template.md |
| Add a guide / essay | CONTENT/ADD-GUIDE.md | content/guides/*.md, lib/guides.ts, app/guides |
| Add a lesson | CONTENT/ADD-LESSON.md | content/lessons/*.md, templates/lesson-template.md |
| Add tomorrow’s DevOps day | CONTENT/ADD-DAILY-LESSON.md | content/lessons/day-NN.md, content/config/programs.json |
| Add a learning path | CONTENT/ADD-LEARNING-PATH.md | content/config/courses.json, lesson markdown |
| Add a project / lab | FEATURES/PROJECTS.md | content/projects, templates/project-template.md |
| Edit published copy | CONTENT/EDIT-CONTENT.md | the markdown file, then validate |
| Unpublish or delete | CONTENT/DELETE-OR-UNPUBLISH-CONTENT.md | enabled false or status draft, or delete file |
| Change content order | CONTENT/CONTENT-ORDERING.md | lesson number, stageOrder, homepage.sections order, courses.json order |
| Change frontmatter | CONTENT/CONTENT-METADATA.md | the YAML block in the markdown file |
| Replace images | CONTENT/CONTENT-IMAGES.md | public/brand, public/content; do not crop brand marks |
| Enable or disable YouTube | FEATURES/YOUTUBE.md | content/media/youtube.json, platform.json social id youtube, contentTypes id youtube |
| Instagram (external profile) | FEATURES/INSTAGRAM.md | platform.json social id instagram |
| Telegram (reserved) | FEATURES/TELEGRAM.md | platform.json social id telegram, url empty |
| Social configuration | CONFIGURATION/SOCIAL-CONFIGURATION.md | platform.json social[] |
| Add a program | CONTENT/ADD-PROGRAM.md | content/config/programs.json |
| Future operations | OPERATIONS/FUTURE-OPERATIONS.md | JSON/markdown jobs without a rewrite |
| Enable or disable a feature / type | CONFIGURATION/FEATURE-FLAGS.md | contentTypes[].enabled and status |
| Enable or disable a topic | PLATFORM/DOMAIN-SYSTEM.md | topics[].enabled, status, showOnHomepage, showInNavigation |
| Change homepage title / hero | CONFIGURATION/HOMEPAGE-CONFIGURATION.md | platform.json copy.hero* and brand.description |
| Change navigation | CONFIGURATION/NAVIGATION-CONFIGURATION.md | navigation.main / footer, copy.headerCta /learn/day-01, cap 3, overflow Explore |
| Change SEO | CONFIGURATION/SEO-CONFIGURATION.md | app/layout.tsx metadata, generateMetadata, brand.description |
| Add a domain / topic | ADVANCED/ADDING-A-NEW-DOMAIN.md | topics[] JSON. Planned python topic is OK. Do not invent Python lessons. |
| Add a new homepage TYPE | ADVANCED/ADDING-A-NEW-FEATURE.md | visibility-core SECTION_TYPES plus React. Developer required. |
| Validate | OPERATIONS/VALIDATION.md | scripts/validate.js, scenario-test.js 1-18 + future operations A-N |
| Deploy | OPERATIONS/DEPLOYMENT.md | Vercel, theairishi.vercel.app. PR branch is not auto-main. |
| Fix a missing route or block | OPERATIONS/TROUBLESHOOTING.md | visibility-core 404-until-active-plus-content |
| Revert a mistake | OPERATIONS/BACKUP-AND-RECOVERY.md | git restore, git revert. No force-push. |

### What file do I edit?

| Job | File | Field / what to change |
| --- | --- | --- |
| Homepage title | `content/config/programs.json` | `title` (live: DevOps Engineer Mastery). Omit `copy.heroTitle` / `copy.heroTagline`. `copy.heroBadge` is the kicker. |
| Hero description | `content/config/platform.json` | `copy.heroDescription` (and `brand.description` if the site description should match) |
| Enable YouTube | `content/media/youtube.json` plus `content/config/platform.json` | Real items in youtube.json first. Then `social[]` id `youtube` and `contentTypes[]` id `youtube` `status` `active`. Do not invent items. Live files are empty and coming-soon. |
| Add guide | `content/guides/*.md` | New markdown from `templates/guide-template.md`. Loader `lib/guides.ts`, route /guides |
| Add domain | `content/config/platform.json` | `topics[]` object. Start `planned`, `showOnHomepage` false, `showInNavigation` false. Planned python topic is OK. Do not invent Python lessons. |
| SEO | `content/config/platform.json` `brand.description`, `brand.url`, `defaults.authorName`; `app/layout.tsx` `metadata` | layout reads `siteConfig` from `lib/site.ts`. Per-page `generateMetadata`. Sitemap `app/sitemap.ts`, robots `app/robots.ts`. `brand.tagline` is omitted unless there is a real slogan. |
| Header CTA | `content/config/platform.json` | `copy.headerCta` (live: Start Day 1), `copy.headerCtaHref` (live: /learn/day-01). Overflow label Explore is code, cap 3 |

## COMPLETE EXAMPLE

Change the visible homepage title by editing `content/config/programs.json` `title` (live: DevOps Engineer Mastery). Omit `copy.heroTitle`. Then `npm run validate` and refresh the preview.

Enable YouTube: only after a real video exists. Put an object with `id`, `title`, `publishedAt`, `url` in `content/media/youtube.json`. Set `social` id youtube and `contentTypes` id youtube to `status` `active`. Until then /youtube 404s. Full doc: [FEATURES/YOUTUBE.md](./FEATURES/YOUTUBE.md).

## VALIDATION

npm run validate. See [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md).

## COMMON MISTAKES

- Editing React for copy that lives in `copy.hero*` or `copy.headerCta`
- Enabling YouTube with an empty `youtube.json`
- Inventing Python lessons when adding a domain
- Cropping brand PNG/JPG

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| Cannot find which file to edit | Job is copy vs content vs type | Use What file do I edit? then the I want to row |
| Hero did not change | Edited the wrong field or a component | `programs.json` title, or `copy.heroDescription` in platform.json |
| /youtube still 404 | coming-soon or empty JSON | Expected until real items + status active |

## HOW TO UNDO

`git restore` the JSON or markdown, or `git revert`. Do not force-push. See [OPERATIONS/BACKUP-AND-RECOVERY.md](./OPERATIONS/BACKUP-AND-RECOVERY.md).
