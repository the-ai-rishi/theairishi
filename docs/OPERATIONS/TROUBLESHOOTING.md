# TROUBLESHOOTING

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Troubleshooting


A topic is missing from the homepage: status not active, showOnHomepage false, or contentCount is 0.

A topic URL 404s: planned, coming-soon, paused, disabled, archived, or active with zero content. That is the production 404-until-active-plus-content rule.

/youtube 404s: the channel is still coming-soon or the media JSON is empty. That is expected.

Nav is missing a link: resolveNavItems dropped it because the source is not public, or the item is beyond the first 5 and sits in Explore.

Search misses a guide: contentTypes guides is not public, or the file is draft/enabled false.

Homepage section missing: enabled false, unknown type, empty with showWhenEmpty false, or missing source.

validate fails on an active course with zero lessons: mark it coming-soon or add lessons.

Renamed a topic but old URL remains: keep id stable and change slug; old /topics/old-slug will 404.

Site looks like a card LMS: do not revert the Rishi Field visual system. Polish copy/nav only.

## COMPLETE EXAMPLE


# Troubleshooting


A topic is missing from the homepage: status not active, showOnHomepage false, or contentCount is 0.

A topic URL 404s: planned, coming-soon, paused, disabled, archived, or active with zero content. That is the production 404-until-active-plus-content rule.

/youtube 404s: the channel is still coming-soon or the media JSON is empty. That is expected.

Nav is missing a link: resolveNavItems dropped it because the source is not public, or the item is beyond the first 5 and sits in Explore.

Search misses a guide: contentTypes guides is not public, or the file is draft/enabled false.

Homepage section missing: enabled false, unknown type, empty with showWhenEmpty false, or missing source.

validate fails on an active course with zero lessons: mark it coming-soon or add lessons.

Renamed a topic but old URL remains: keep id stable and change slug; old /topics/old-slug will 404.

Site looks like a card LMS: do not revert the Rishi Field visual system. Polish copy/nav only.

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
