# Start here

This repository is the website for The AI Rishi. It is a Next.js 16 app (React 19) at theairishi.vercel.app. JSON and markdown decide what the public sees. React decides how each type of block looks.

On disk today: 15 AI/LLM lessons in content/lessons, 2 DevOps lessons in content/courses/devops, 1 guide in content/guides, 1 project in content/projects. There is no Python content. content/media/youtube.json and content/media/instagram.json are empty arrays. Both channels are coming-soon. Planned topics: cloud, software-engineering, interview, updates, career, projects. Unlaunched products have no public URL.

## Read next

1. This file.
2. [DOCUMENTATION-MAP.md](./DOCUMENTATION-MAP.md) when you know the job.
3. [COMMON-TASKS.md](./COMMON-TASKS.md) for copy-paste workflows.
4. [QUICK-START.md](./QUICK-START.md) to run the app.

## How config becomes the website

1. Edit content/config/platform.json, content/config/courses.json, content/config/series.json, and content/media/*.json.
2. Add markdown under content/lessons, content/courses, content/guides, content/projects.
3. lib/catalog.ts counts published items.
4. lib/visibility-core.js resolves homepage, nav, search, sitemap, and routes.
5. components/home/SectionRenderer.tsx switches on section.type, never on frozen section ids.

## What you can do without a developer

New topic, rename, hide, remove. New lesson, guide (article), or project. Enable or disable a homepage instance. Change copy or brand file paths. Enable a channel after it has real items. Reorder homepage.sections.

## What needs a developer

A new homepage section TYPE. A new route shape. New visibility semantics. A tools product (there is no tools content type yet).

## Honest rules

- Active + zero published content is not a public page.
- Coming-soon is not a public coming-soon URL. /youtube and /instagram 404 today.
- Do not invent YouTube or Instagram items.
- Do not crop or regenerate brand PNG/JPG.
- Do not reintroduce switch(section.id).
- Do not leak coming-soon, planned, or disabled areas in the public UI.

## Live product surfaces

- Header: Home, Learn, Guides, Projects, About. CTA label Explore, href /#explore. Overflow label More, cap 5.
- Homepage types: hero, continue-learning, topic-grid, content-list, course-list, channel-grid, cta. channel-grid is not on the live homepage.
- Listing routes /learn, /guides, /projects 404 via isContentTypeRoutable unless the type is enabled and active.
- Topic routes today: /topics/ai and /topics/devops only.
