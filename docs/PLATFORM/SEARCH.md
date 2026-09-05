# SEARCH

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Search


UI: components/search/SearchModal.tsx. API: app/api/search/route.ts. Index: lib/search.ts using getSearchIndexInputs.

Indexed when public: topics, courses, catalog items (lessons, guides, projects). Channel items are included when the channel is active with content, gated by the channel rather than a sibling contentType row.

SearchModal prints the type string from the API. It is not a frozen course-only union. lib/search.ts maps lesson, guide, project, topic, course, youtube, instagram onto Lesson, Guide, Project, Topic, Course, Video. Unknown types are title-cased.

Excluded: planned, paused, disabled, archived, coming-soon, draft, enabled false, items whose topic or content type is not search-visible.

Coming-soon YouTube is not searchable. Active YouTube with items is.

Shortcut: Cmd/Ctrl+K.

## COMPLETE EXAMPLE


# Search


UI: components/search/SearchModal.tsx. API: app/api/search/route.ts. Index: lib/search.ts using getSearchIndexInputs.

Indexed when public: topics, courses, catalog items (lessons, guides, projects). Channel items are included when the channel is active with content, gated by the channel rather than a sibling contentType row.

SearchModal prints the type string from the API. It is not a frozen course-only union. lib/search.ts maps lesson, guide, project, topic, course, youtube, instagram onto Lesson, Guide, Project, Topic, Course, Video. Unknown types are title-cased.

Excluded: planned, paused, disabled, archived, coming-soon, draft, enabled false, items whose topic or content type is not search-visible.

Coming-soon YouTube is not searchable. Active YouTube with items is.

Shortcut: Cmd/Ctrl+K.

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
