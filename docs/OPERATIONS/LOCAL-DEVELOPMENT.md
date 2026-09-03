# LOCAL DEVELOPMENT

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Operations


All paths below are real. File: content/config/platform.json unless noted.

## 1. Only AI


Leave topics id ai enabled true, status active, showOnHomepage true.

For every other topics[] row (devops, cloud, software-engineering, interview, updates, career, projects):

  "enabled": false,
  "status": "disabled",
  "showOnHomepage": false,
  "showInNavigation": false

Lessons stay on disk. DevOps leaves topic-grid, nav, search, and sitemap. See scenario test 1.

## 2. Add DevOps


DevOps is already live (topics id devops, courses.json id devops, two files in content/courses/devops/). To repeat the pattern for a new area:

1. Add a topics[] object (see section 7).
2. Add a courses.json row with topic pointing at that id, status coming-soon until lessons exist.
3. Add lesson markdown with course and topic set.
4. Set topic and course status active.

Current devops topic:

  "id": "devops",
  "slug": "devops",
  "status": "active",
  "enabled": true,
  "showOnHomepage": true,
  "showInNavigation": false

## 3. Disable AI


On topics[] id ai:

  "enabled": false,
  "status": "disabled"

Or status paused to mean temporarily hidden. 15 AI lessons stay on disk. The AI course in courses.json should also move off active if you do not want it on /learn (status coming-soon or enabled false).

## 4. Pause vs disable vs archive vs planned


Use status on the same object. enabled false is a hard hide.

- planned: config only. No route, nav, search, sitemap, homepage. Use for areas that are not launched (cloud, interview, updates today).
- coming-soon: same public silence for route (404). Not a public coming-soon URL.
- paused: hidden everywhere, intended as temporary.
- disabled: hidden everywhere, intended as off.
- archived: hidden everywhere, intended as retired.
- active: public where contentCount > 0.

Example pause DevOps:

  "id": "devops",
  "status": "paused",
  "enabled": true

## 5. Enable YouTube after the first video


content/media/youtube.json:

  [ { "id": "yt-1", "title": "Attention from scratch", "publishedAt": "2026-09-01", "url": "https://www.youtube.com/watch?v=REAL_ID", "duration": "12:04" } ]

platform.json social id youtube:

  "status": "active",
  "showOnHomepage": true,
  "showInNavigation": true

contentTypes id youtube: "status": "active"

Optional homepage.sections item: type channel-grid, enabled true. Optional nav source.kind channel id youtube.

Until those fields change, /youtube is not-found.

## 6. Enable Instagram


Same as YouTube using content/media/instagram.json and ids instagram.

  "id": "instagram",
  "href": "/instagram",
  "status": "active"

Do not invent posts.

## 7. Add a Python topic


Do not invent Python lessons. You may add the topic as planned:

  "id": "python",
  "slug": "python",
  "name": "Python",
  "shortName": "Python",
  "description": "Python from first principles.",
  "badge": "Python",
  "category": "Languages",
  "color": "amber",
  "order": 20,
  "enabled": true,
  "featured": false,
  "showOnHomepage": false,
  "showInNavigation": false,
  "status": "planned"

When real markdown exists with topic: python, flip status to active and showOnHomepage true. No React change.

## 8. Add a new content type


A new Writing-like block is another homepage.sections content-list instance (JSON). Example:

  "id": "python-notes",
  "type": "content-list",
  "enabled": true,
  "order": 9,
  "title": "Python notes",
  "source": { "kind": "topic", "topicId": "python" },
  "showWhenEmpty": false

A new TYPE (pricing table, live stream, map) needs a developer: SECTION_TYPES in visibility-core, a case in SectionRenderer, a React component. The site is not fully config-driven for every UI idea.

## COMPLETE EXAMPLE


# Operations


All paths below are real. File: content/config/platform.json unless noted.

## 1. Only AI


Leave topics id ai enabled true, status active, showOnHomepage true.

For every other topics[] row (devops, cloud, software-engineering, interview, updates, career, projects):

  "enabled": false,
  "status": "disabled",
  "showOnHomepage": false,
  "showInNavigation": false

Lessons stay on disk. DevOps leaves topic-grid, nav, search, and sitemap. See scenario test 1.

## 2. Add DevOps


DevOps is already live (topics id devops, courses.json id devops, two files in content/courses/devops/). To repeat the pattern for a new area:

1. Add a topics[] object (see section 7).
2. Add a courses.json row with topic pointing at that id, status coming-soon until lessons exist.
3. Add lesson markdown with course and topic set.
4. Set topic and course status active.

Current devops topic:

  "id": "devops",
  "slug": "devops",
  "status": "active",
  "enabled": true,
  "showOnHomepage": true,
  "showInNavigation": false

## 3. Disable AI


On topics[] id ai:

  "enabled": false,
  "status": "disabled"

Or status paused to mean temporarily hidden. 15 AI lessons stay on disk. The AI course in courses.json should also move off active if you do not want it on /learn (status coming-soon or enabled false).

## 4. Pause vs disable vs archive vs planned


Use status on the same object. enabled false is a hard hide.

- planned: config only. No route, nav, search, sitemap, homepage. Use for areas that are not launched (cloud, interview, updates today).
- coming-soon: same public silence for route (404). Not a public coming-soon URL.
- paused: hidden everywhere, intended as temporary.
- disabled: hidden everywhere, intended as off.
- archived: hidden everywhere, intended as retired.
- active: public where contentCount > 0.

Example pause DevOps:

  "id": "devops",
  "status": "paused",
  "enabled": true

## 5. Enable YouTube after the first video


content/media/youtube.json:

  [ { "id": "yt-1", "title": "Attention from scratch", "publishedAt": "2026-09-01", "url": "https://www.youtube.com/watch?v=REAL_ID", "duration": "12:04" } ]

platform.json social id youtube:

  "status": "active",
  "showOnHomepage": true,
  "showInNavigation": true

contentTypes id youtube: "status": "active"

Optional homepage.sections item: type channel-grid, enabled true. Optional nav source.kind channel id youtube.

Until those fields change, /youtube is not-found.

## 6. Enable Instagram


Same as YouTube using content/media/instagram.json and ids instagram.

  "id": "instagram",
  "href": "/instagram",
  "status": "active"

Do not invent posts.

## 7. Add a Python topic


Do not invent Python lessons. You may add the topic as planned:

  "id": "python",
  "slug": "python",
  "name": "Python",
  "shortName": "Python",
  "description": "Python from first principles.",
  "badge": "Python",
  "category": "Languages",
  "color": "amber",
  "order": 20,
  "enabled": true,
  "featured": false,
  "showOnHomepage": false,
  "showInNavigation": false,
  "status": "planned"

When real markdown exists with topic: python, flip status to active and showOnHomepage true. No React change.

## 8. Add a new content type


A new Writing-like block is another homepage.sections content-list instance (JSON). Example:

  "id": "python-notes",
  "type": "content-list",
  "enabled": true,
  "order": 9,
  "title": "Python notes",
  "source": { "kind": "topic", "topicId": "python" },
  "showWhenEmpty": false

A new TYPE (pricing table, live stream, map) needs a developer: SECTION_TYPES in visibility-core, a case in SectionRenderer, a React component. The site is not fully config-driven for every UI idea.

## VALIDATION


See OPERATIONS/VALIDATION.md. Run the validate script, open the route, search if public.

## COMMON MISTAKES


Do not invent YouTube or Instagram items. Do not crop brand PNG or JPG. Do not reintroduce switch(section.id). Do not leak coming-soon in the public UI. There is no Python content.

## TROUBLESHOOTING


| Symptom | Cause | Fix |
| --- | --- | --- |
| Route 404 | type or topic not enabled+active with content | keep it hidden or add real content |
| Missing homepage block | showWhenEmpty false and empty | add content or leave hidden |
| validate fails | active course with 0 lessons | set status coming-soon or add lessons |

## HOW TO UNDO


Restore the JSON or markdown files with git restore, or git revert the commit. Do not force-push.
