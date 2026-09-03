# INSTAGRAM

## PURPOSE


instagram.json is an empty array and the channel is coming-soon. /instagram 404s until active with real items.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# YouTube and Instagram


Both channels exist in platform.json social[] and as contentTypes with status coming-soon. media JSON files are empty arrays. Direct /youtube and /instagram 404. They are not in nav, homepage, search, or sitemap.

After the first real YouTube video: add a real object to content/media/youtube.json with id, title, publishedAt, and url. Set social id youtube status to active. Set contentTypes id youtube status to active. Optionally add a channel-grid section or a nav source.kind channel item. Then validate, lint, and build.

Only then does getRouteChannels emit /youtube. Instagram is the same pattern with instagram.json.

Do not invent videos or posts. JSON snippets live in OPERATIONS.md.

## COMPLETE EXAMPLE


# YouTube and Instagram


Both channels exist in platform.json social[] and as contentTypes with status coming-soon. media JSON files are empty arrays. Direct /youtube and /instagram 404. They are not in nav, homepage, search, or sitemap.

After the first real YouTube video: add a real object to content/media/youtube.json with id, title, publishedAt, and url. Set social id youtube status to active. Set contentTypes id youtube status to active. Optionally add a channel-grid section or a nav source.kind channel item. Then validate, lint, and build.

Only then does getRouteChannels emit /youtube. Instagram is the same pattern with instagram.json.

Do not invent videos or posts. JSON snippets live in OPERATIONS.md.

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
