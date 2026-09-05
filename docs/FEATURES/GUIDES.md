# GUIDES

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Guides


Guides are stand-alone essays. Folder: content/guides/*.md. Loader: lib/guides.ts. Route: /guides and /guides/SLUG. Content type id: guides, url /guides, status active.

Homepage instance id guides is a content-list with source.kind format and format guide. Title Writing. Presentation magazine. Anchor id read.

Nav item id guides is source.kind contentType id guides. Disabling the content type drops nav, homepage list, search items, and /guides from the sitemap.

Frontmatter: ADDING_CONTENT.md. There is one live guide: first-principles-ai-learning.md.

To add a second guide, add a markdown file. No React change. To hide all writing, set contentTypes id guides to enabled false or status disabled.

## COMPLETE EXAMPLE


# Guides


Guides are stand-alone essays. Folder: content/guides/*.md. Loader: lib/guides.ts. Route: /guides and /guides/SLUG. Content type id: guides, url /guides, status active.

Homepage instance id guides is a content-list with source.kind format and format guide. Title Writing. Presentation magazine. Anchor id read.

Nav item id guides is source.kind contentType id guides. Disabling the content type drops nav, homepage list, search items, and /guides from the sitemap.

Frontmatter: ADDING_CONTENT.md. There is one live guide: first-principles-ai-learning.md.

To add a second guide, add a markdown file. No React change. To hide all writing, set contentTypes id guides to enabled false or status disabled.

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
