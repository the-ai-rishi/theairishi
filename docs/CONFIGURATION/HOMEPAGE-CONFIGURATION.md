# HOMEPAGE CONFIGURATION

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Homepage composition


The homepage is platform.json homepage.sections. Code switches on TYPE. JSON chooses instances.

## Types (code, once)


- hero: brand copy. Focused CTA if exactly one public topic. Discovery otherwise. Modes only for formats that have content.
- topic-grid: public topics with content. Anchor id explore.
- course-list: active courses with lessons. Anchor id learn.
- content-list: source.kind recent, or topic plus topicId, or format, or channel. Presentations: journal, magazine, lab, timeline, conversation, media.
- channel-grid: public channels with content. Not on the live homepage.
- continue-learning: hidden without progress / public courses (showWhenEmpty false).
- cta: closing call from copy config.

Unknown type is skipped. validate.js errors.

## Instance vs type


Adding another Writing-like block: another content-list instance. Adding a pricing table: new TYPE, needs a developer.

## Live order


1 hero, 2 continue-learning, 3 topic-grid The field, 4 recent From the desk, 5 guides Writing, 6 projects Labs, 7 course-list Learning paths, 8 cta.

Do not add empty youtube, instagram, updates, or interview instances. showWhenEmpty defaults to false.

Header CTA: copy.headerCta Explore, copy.headerCtaHref /#explore (works from inner pages). Overflow disclosure is More, not Explore. Hero primary CTA stays Start with AI / /learn.

## COMPLETE EXAMPLE


# Homepage composition


The homepage is platform.json homepage.sections. Code switches on TYPE. JSON chooses instances.

## Types (code, once)


- hero: brand copy. Focused CTA if exactly one public topic. Discovery otherwise. Modes only for formats that have content.
- topic-grid: public topics with content. Anchor id explore.
- course-list: active courses with lessons. Anchor id learn.
- content-list: source.kind recent, or topic plus topicId, or format, or channel. Presentations: journal, magazine, lab, timeline, conversation, media.
- channel-grid: public channels with content. Not on the live homepage.
- continue-learning: hidden without progress / public courses (showWhenEmpty false).
- cta: closing call from copy config.

Unknown type is skipped. validate.js errors.

## Instance vs type


Adding another Writing-like block: another content-list instance. Adding a pricing table: new TYPE, needs a developer.

## Live order


1 hero, 2 continue-learning, 3 topic-grid The field, 4 recent From the desk, 5 guides Writing, 6 projects Labs, 7 course-list Learning paths, 8 cta.

Do not add empty youtube, instagram, updates, or interview instances. showWhenEmpty defaults to false.

Header CTA: copy.headerCta Explore, copy.headerCtaHref /#explore (works from inner pages). Overflow disclosure is More, not Explore. Hero primary CTA stays Start with AI / /learn.

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
