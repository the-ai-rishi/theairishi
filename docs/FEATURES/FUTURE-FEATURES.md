# FUTURE FEATURES

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Future content types


## Config can do (no React)


- New topic in topics[].
- New course row in courses.json plus lessons.
- New guide or project markdown.
- New homepage content-list instance (recent, topic, format, or channel).
- New social channel object with id, href like /tiktok, and content/media/tiktok.json. The generic channel page picks it up once active with items.
- Reorder homepage.sections, change copy, brand paths, nav labels.
- Enable, disable, pause, or archive any existing entity.

## Needs a developer


- A homepage section type other than hero, topic-grid, course-list, content-list, channel-grid, continue-learning, cta.
- A new route shape that is not /learn, /guides, /projects, /topics/SLUG, or /CHANNEL.
- New visibility semantics.

Search labels for unknown formats are title-cased from the item type. Video is already mapped for youtube/instagram in lib/search.ts.

The site is not fully config-driven for every UI idea. The type registry is code.

## COMPLETE EXAMPLE


# Future content types


## Config can do (no React)


- New topic in topics[].
- New course row in courses.json plus lessons.
- New guide or project markdown.
- New homepage content-list instance (recent, topic, format, or channel).
- New social channel object with id, href like /tiktok, and content/media/tiktok.json. The generic channel page picks it up once active with items.
- Reorder homepage.sections, change copy, brand paths, nav labels.
- Enable, disable, pause, or archive any existing entity.

## Needs a developer


- A homepage section type other than hero, topic-grid, course-list, content-list, channel-grid, continue-learning, cta.
- A new route shape that is not /learn, /guides, /projects, /topics/SLUG, or /CHANNEL.
- New visibility semantics.

Search labels for unknown formats are title-cased from the item type. Video is already mapped for youtube/instagram in lib/search.ts.

The site is not fully config-driven for every UI idea. The type registry is code.

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
