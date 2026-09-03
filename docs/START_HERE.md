# Start here

This repository is the website for The AI Rishi. It is a Next.js app. JSON and markdown decide what the public sees. React decides how each type of block looks.

On disk today: 15 AI/LLM lessons, 2 DevOps lessons, 1 guide, 1 project. There is no Python content. YouTube and Instagram JSON lists are empty and both channels are coming-soon. Cloud, Interview, Updates, Career, and Software Engineering stay in config as planned. Unlaunched products have no public URL.

## How config becomes the website

1. Edit platform.json, courses.json, series.json, and media JSON.
2. Add markdown under content/lessons, courses, guides, projects.
3. Catalog counts published items.
4. visibility-core resolves homepage, nav, search, sitemap, and routes.
5. SectionRenderer switches on section type, never frozen ids.

See ARCHITECTURE.md and VISIBILITY_AND_LIFECYCLE.md.

## Folders
Edit without a developer: docs, content/config, lessons, courses, guides, projects, media, public/brand.
Developer-only unless adding a new TYPE or route: app, components, lib, scripts.

Index: CONTENT_FILE_INDEX.md and the content:index script.

## Answers

What exists today? AI and DevOps paths, one guide, one project. See PLATFORM_OVERVIEW.md
Only AI visible? Disable other topics. See OPERATIONS.md section 1.
Add DevOps? Already live with 2 lessons. See OPERATIONS.md section 2.
Hide AI? enabled false or status disabled on topics id ai. See OPERATIONS.md section 3.
Pause vs disable vs archive vs planned? See VISIBILITY_AND_LIFECYCLE.md and OPERATIONS.md section 4.
Enable YouTube after first video? See YOUTUBE_AND_INSTAGRAM.md and OPERATIONS.md section 5.
Enable Instagram? Same pattern. See OPERATIONS.md section 6.
Add a Python topic? JSON plus real lessons. Do not invent Python content. See TOPICS_AND_AREAS.md and OPERATIONS.md section 7.
Add a new content type? Another content-list is JSON. A new TYPE needs React. See FUTURE_CONTENT_TYPES.md and OPERATIONS.md section 8.
Change homepage order or copy? homepage.sections and copy.* . Header CTA is Explore to /#explore. Overflow is More. Hero stays Start with AI / /learn. See HOMEPAGE_COMPOSITION.md
Will search find a guide or future video? When that format or channel is active with content. Labels: Lesson, Guide, Project, Topic, Course, Video. See SEARCH.md
Why does /youtube 404? We do not advertise unlaunched products via a public URL. See ROUTING_AND_SEO.md
Validate before deploy? validate, lint, build. See VALIDATION_AND_TESTING.md and DEPLOYMENT.md
Logos? public/brand plus app/icon.png. Header is typeset. Cinematic mark is the hero. contain, no crop. See BRANDING_AND_ASSETS.md
Something missing? See TROUBLESHOOTING.md

## No code vs needs a developer

No code: new topic, rename, hide, remove, new lesson/guide/project, enable or disable a homepage instance, change copy or logos, enable a channel after it has items, reorder homepage.sections.

Needs a developer: a new homepage section TYPE; new visibility rules; new route shapes.

## Honest rule

An active topic or channel with zero published content is not a public page. Coming-soon is not a public coming-soon URL.
