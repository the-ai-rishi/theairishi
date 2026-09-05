# CONTENT METADATA

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Content model


Lessons live in content/lessons and content/courses. Guides live in content/guides. Projects live in content/projects. Channel items live in content/media as JSON arrays.
Topics, courses, series, navigation, homepage, brand, and social are JSON in content/config.
Published or active markdown is public. draft, archived, disabled, planned, paused are not. enabled false hides a file.
Project Completed/In Progress badges are display only. Use enabled or visibilityStatus to hide.

## COMPLETE EXAMPLE


# Content model


Lessons live in content/lessons and content/courses. Guides live in content/guides. Projects live in content/projects. Channel items live in content/media as JSON arrays.
Topics, courses, series, navigation, homepage, brand, and social are JSON in content/config.
Published or active markdown is public. draft, archived, disabled, planned, paused are not. enabled false hides a file.
Project Completed/In Progress badges are display only. Use enabled or visibilityStatus to hide.

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
