# FEATURE SYSTEM

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Visibility and lifecycle


Statuses: planned, coming-soon, active, paused, disabled, archived.
Aliases: published/live become active. draft becomes planned. hidden/off become disabled.

Surfaces: homepage, navigation, search, sitemap, route.

planned, paused, disabled, archived: hidden on every surface.

coming-soon: not on homepage, search, sitemap, or route. Nav only if showInNavigation is true; bound channel nav still drops coming-soon.

active: public when enabled. Homepage needs content unless showWhenEmpty is true. Topic and channel routes need contentCount greater than 0. Listing types (/learn, /guides, /projects) need enabled + active; they 404 when the type is hidden.

Production decision: we do not advertise unlaunched products via a public URL. Direct /youtube while coming-soon calls notFound(). Only active AND contentCount greater than 0 produces a public channel or topic route.

Header: first 5 resolved main items stay in the bar; remainder go in a More disclosure. Footer lists every resolved footer item. copy.headerCta is Explore and copy.headerCtaHref is /#explore so the CTA still works off the homepage.

See OPERATIONS.md, ROUTING_AND_SEO.md, VALIDATION_AND_TESTING.md.

## COMPLETE EXAMPLE


# Visibility and lifecycle


Statuses: planned, coming-soon, active, paused, disabled, archived.
Aliases: published/live become active. draft becomes planned. hidden/off become disabled.

Surfaces: homepage, navigation, search, sitemap, route.

planned, paused, disabled, archived: hidden on every surface.

coming-soon: not on homepage, search, sitemap, or route. Nav only if showInNavigation is true; bound channel nav still drops coming-soon.

active: public when enabled. Homepage needs content unless showWhenEmpty is true. Topic and channel routes need contentCount greater than 0. Listing types (/learn, /guides, /projects) need enabled + active; they 404 when the type is hidden.

Production decision: we do not advertise unlaunched products via a public URL. Direct /youtube while coming-soon calls notFound(). Only active AND contentCount greater than 0 produces a public channel or topic route.

Header: first 5 resolved main items stay in the bar; remainder go in a More disclosure. Footer lists every resolved footer item. copy.headerCta is Explore and copy.headerCtaHref is /#explore so the CTA still works off the homepage.

See OPERATIONS.md, ROUTING_AND_SEO.md, VALIDATION_AND_TESTING.md.

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
