# Platform overview

The AI Rishi is a living field for understanding technology: learn from first principles, build with it, and follow what is changing. It is not a card LMS and not a course catalog that pretends other products exist.

## Live today

- Topics: AI / LLM (active, 15 lessons) and DevOps (active, 2 lessons).
- Courses: the same two paths in content/config/courses.json.
- Guides: 1 published markdown file in content/guides.
- Projects: 1 published lab in content/projects.
- Navigation: Home, Learn, Guides, Projects, About (5 items, so no Explore overflow).
- Homepage order: hero, continue-learning, topic-grid (The field), recent (From the desk), guides (Writing), projects (Labs), course-list (Learning paths), cta.
- Search indexes topics, courses, lessons, guides, and projects that are public.

## Planned / coming-soon (hidden)

- Topics: cloud, software-engineering, interview, updates, career, projects (topic row). All planned, homepage and nav off.
- Content types: updates, interview, career (planned); youtube, instagram (coming-soon).
- Social channels: youtube and instagram coming-soon with empty JSON arrays. Direct /youtube and /instagram are 404 until active with at least one item.
- Several coming-soon course rows exist in courses.json; they may appear as coming-soon on /learn, not as fake homepage theater.

## Product rule

We do not advertise unlaunched products via a public URL. Empty areas stay in config so they can be turned on later. They do not get routes, nav, search, or sitemap.

See START_HERE.md, VISIBILITY_AND_LIFECYCLE.md, and OPERATIONS.md.
