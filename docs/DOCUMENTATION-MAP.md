# Documentation map

Start at START_HERE.md. Then this map. Then COMMON-TASKS.md.

Honesty: new topic / lesson / guide / project / channel-with-existing-type = JSON + markdown, no React. New homepage section TYPE, new route shape, new visibility semantics = developer. There is no Python content. YouTube and Instagram stay empty and coming-soon until REAL items exist. Active + zero content = no public route. Coming-soon is not a public coming-soon URL.

| I want to | Read | Files involved |
| --- | --- | --- |
| Add an article (this repo: a guide) | CONTENT/ADD-ARTICLE.md | content/guides/*.md, templates/guide-template.md |
| Add a guide / essay | CONTENT/ADD-GUIDE.md | content/guides/*.md, lib/guides.ts, app/guides |
| Add a lesson | CONTENT/ADD-LESSON.md | content/lessons or content/courses/ID, templates/lesson-template.md |
| Add a learning path | CONTENT/ADD-LEARNING-PATH.md | content/config/courses.json, lesson markdown |
| Add a project / lab | FEATURES/PROJECTS.md | content/projects, templates/project-template.md |
| Edit published copy | CONTENT/EDIT-CONTENT.md | the markdown file, then validate |
| Unpublish or delete | CONTENT/DELETE-OR-UNPUBLISH-CONTENT.md | enabled false or status draft, or delete file |
| Change content order | CONTENT/CONTENT-ORDERING.md | lesson number, stageOrder, homepage.sections order, courses.json order |
| Change frontmatter | CONTENT/CONTENT-METADATA.md | the YAML block in the markdown file |
| Replace images | CONTENT/CONTENT-IMAGES.md | public/brand, public/content; do not crop brand marks |
| Enable or disable YouTube | FEATURES/YOUTUBE.md | content/media/youtube.json, platform.json social id youtube, contentTypes id youtube |
| Enable or disable Instagram | FEATURES/INSTAGRAM.md | content/media/instagram.json, social id instagram |
| Enable or disable a feature / type | CONFIGURATION/FEATURE-FLAGS.md | contentTypes[].enabled and status |
| Enable or disable a topic | PLATFORM/DOMAIN-SYSTEM.md | topics[].enabled, status, showOnHomepage, showInNavigation |
| Change homepage title / hero | CONFIGURATION/HOMEPAGE-CONFIGURATION.md | platform.json copy.hero* and brand.description |
| Change navigation | CONFIGURATION/NAVIGATION-CONFIGURATION.md | navigation.main / footer, copy.headerCta /#explore, cap 5, overflow More |
| Change SEO | CONFIGURATION/SEO-CONFIGURATION.md | app/layout.tsx metadata, generateMetadata, brand.description |
| Add a domain / topic | ADVANCED/ADDING-A-NEW-DOMAIN.md | topics[] JSON. Planned python topic is OK. Do not invent Python lessons. |
| Add a new homepage TYPE | ADVANCED/ADDING-A-NEW-FEATURE.md | visibility-core SECTION_TYPES plus React. Developer required. |
| Validate | OPERATIONS/VALIDATION.md | scripts/validate.js, scenario-test.js 1-13 |
| Deploy | OPERATIONS/DEPLOYMENT.md | Vercel, theairishi.vercel.app. PR branch is not auto-main. |
| Fix a missing route or block | OPERATIONS/TROUBLESHOOTING.md | visibility-core 404-until-active-plus-content |
| Revert a mistake | OPERATIONS/BACKUP-AND-RECOVERY.md | git restore, git revert. No force-push. |
