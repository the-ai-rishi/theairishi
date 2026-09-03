# COMMAND REFERENCE

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Validation and testing


Scripts: validate (scripts/validate.js plus scenarios), test:platform, content:index, lint, build, dev, start.

validate checks platform.json, courses, brand files on disk, unknown homepage types, dead nav sources, empty active topics/courses, placeholder URLs, and frozen ids in app/components/lib.

Scenario tests are in-memory and do not mutate platform.json.

1. Only one active topic with content
2. Disable a topic that had content
3. Remove a topic object (must not throw)
4. Rename topic name and slug
5. Add python as active with content
6. Disable YouTube
7. Enable YouTube as active with items (route /youtube appears)
8. Disable guides content type
9. Planned empty area is not a large homepage section
10. Planned/coming-soon YouTube is not a channelPath
11. Nav split: 8 items => 5 primary + 3 Explore
12. Active YouTube with zero items is not-found
13. Listing file routes 404 when the content type is disabled, coming-soon, or enabled false

splitPrimaryNav is exported from visibility-core. Header cap is 5. Overflow label is More.

## COMPLETE EXAMPLE


# Validation and testing


Scripts: validate (scripts/validate.js plus scenarios), test:platform, content:index, lint, build, dev, start.

validate checks platform.json, courses, brand files on disk, unknown homepage types, dead nav sources, empty active topics/courses, placeholder URLs, and frozen ids in app/components/lib.

Scenario tests are in-memory and do not mutate platform.json.

1. Only one active topic with content
2. Disable a topic that had content
3. Remove a topic object (must not throw)
4. Rename topic name and slug
5. Add python as active with content
6. Disable YouTube
7. Enable YouTube as active with items (route /youtube appears)
8. Disable guides content type
9. Planned empty area is not a large homepage section
10. Planned/coming-soon YouTube is not a channelPath
11. Nav split: 8 items => 5 primary + 3 Explore
12. Active YouTube with zero items is not-found
13. Listing file routes 404 when the content type is disabled, coming-soon, or enabled false

splitPrimaryNav is exported from visibility-core. Header cap is 5. Overflow label is More.

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
