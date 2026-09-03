# DOMAIN SYSTEM

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Topics and areas


Topics are objects in platform.json topics[]. They are not markdown.

Required: id (stable), slug (URL), name, shortName, description, badge, category, color, order, enabled, featured, showOnHomepage, showInNavigation, status.

## Add


Push a new object. Start planned, showOnHomepage false, showInNavigation false. Add real markdown with topic: that id. Then status active. showOnHomepage true puts it in topic-grid. showInNavigation true plus a nav source, or the kernel auto-appends public navigation topics.

Do not invent Python (or any) lesson text. The topic can exist as planned with zero files.

## Rename


Change name, shortName, slug on the same id. Nav and homepage that bind to the id pick up the new slug.

## Disable / re-enable


Hide everywhere: enabled false, or status disabled / paused / archived. Put back: enabled true, status active, with real content if it should have a route or homepage card.

## Hide from homepage only


Keep status active. Set showOnHomepage false. The topic page can still exist if contentCount > 0.

## Remove


Delete the object. Source-bound nav drops. The resolver must not throw (scenario test 3). Prefer disable unless you are sure.

See OPERATIONS.md for JSON snippets.

## COMPLETE EXAMPLE


# Topics and areas


Topics are objects in platform.json topics[]. They are not markdown.

Required: id (stable), slug (URL), name, shortName, description, badge, category, color, order, enabled, featured, showOnHomepage, showInNavigation, status.

## Add


Push a new object. Start planned, showOnHomepage false, showInNavigation false. Add real markdown with topic: that id. Then status active. showOnHomepage true puts it in topic-grid. showInNavigation true plus a nav source, or the kernel auto-appends public navigation topics.

Do not invent Python (or any) lesson text. The topic can exist as planned with zero files.

## Rename


Change name, shortName, slug on the same id. Nav and homepage that bind to the id pick up the new slug.

## Disable / re-enable


Hide everywhere: enabled false, or status disabled / paused / archived. Put back: enabled true, status active, with real content if it should have a route or homepage card.

## Hide from homepage only


Keep status active. Set showOnHomepage false. The topic page can still exist if contentCount > 0.

## Remove


Delete the object. Source-bound nav drops. The resolver must not throw (scenario test 3). Prefer disable unless you are sure.

See OPERATIONS.md for JSON snippets.

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
