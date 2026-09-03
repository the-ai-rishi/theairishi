# ARCHITECTURE

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Architecture


Resolution pipeline:

config (content/config JSON + markdown + media JSON)
  -> catalog (lib/catalog.ts counts and lists published items)
  -> visibility-core (lib/visibility-core.js)
  -> UI (SectionRenderer, Header, Footer, search API, sitemap, channel and topic routes)

visibility-core is plain Node. validate.js and scenario-test.js require it directly. The Next app imports it through lib/visibility.ts.

## What the kernel resolves


- Homepage: resolveHomepageSections(platform, catalog) using homepage.sections types.
- Navigation: resolveNavItems(platform, catalog, main or footer). Header then splitPrimaryNav(items, 5).
- Search: getSearchIndexInputs.
- Sitemap: getSitemapInputs.
- Routes: getRouteTopics, getRouteChannels, topicRouteState, channelRouteState.

## Surfaces


homepage, navigation, search, sitemap, route.

For route, only status active AND contentCount greater than 0 is public. coming-soon, planned, paused, disabled, archived, and active-with-zero-content are not-found. Production decision: we do not advertise unlaunched products via a public URL.

## What is not hardcoded


SectionRenderer switches on type. It does not switch on ids like technology-updates or interviews.

A new topic or another content-list instance does not need a new React component. A new TYPE does.

See CONFIGURATION.md, HOMEPAGE_COMPOSITION.md, FUTURE_CONTENT_TYPES.md.

## COMPLETE EXAMPLE


# Architecture


Resolution pipeline:

config (content/config JSON + markdown + media JSON)
  -> catalog (lib/catalog.ts counts and lists published items)
  -> visibility-core (lib/visibility-core.js)
  -> UI (SectionRenderer, Header, Footer, search API, sitemap, channel and topic routes)

visibility-core is plain Node. validate.js and scenario-test.js require it directly. The Next app imports it through lib/visibility.ts.

## What the kernel resolves


- Homepage: resolveHomepageSections(platform, catalog) using homepage.sections types.
- Navigation: resolveNavItems(platform, catalog, main or footer). Header then splitPrimaryNav(items, 5).
- Search: getSearchIndexInputs.
- Sitemap: getSitemapInputs.
- Routes: getRouteTopics, getRouteChannels, topicRouteState, channelRouteState.

## Surfaces


homepage, navigation, search, sitemap, route.

For route, only status active AND contentCount greater than 0 is public. coming-soon, planned, paused, disabled, archived, and active-with-zero-content are not-found. Production decision: we do not advertise unlaunched products via a public URL.

## What is not hardcoded


SectionRenderer switches on type. It does not switch on ids like technology-updates or interviews.

A new topic or another content-list instance does not need a new React component. A new TYPE does.

See CONFIGURATION.md, HOMEPAGE_COMPOSITION.md, FUTURE_CONTENT_TYPES.md.

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
