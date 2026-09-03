# NAVIGATION

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Configuration


Files: content/config/platform.json, content/config/courses.json, content/config/series.json, content/media/*.json. Rebuild after edits.

## Lifecycle (every entity)


enabled (boolean): false hides everywhere.
status: planned | coming-soon | active | paused | disabled | archived.
showOnHomepage (boolean): homepage only.
showInNavigation (boolean): nav only.
order (number): sort key.

## brand


name, shortName, logo, logoAlt, logoMark, ogImage, faviconUrl, appleTouchIcon, tagline, description, url, email.

Example: logo /brand/logo-horizontal.png, logoMark /brand/logo-mark.png, ogImage /brand/og-image.jpg, faviconUrl /icon.png.

## copy


heroBadge, heroTitle, heroTagline, heroDescription, heroPrimaryCta, heroPrimaryCtaHref, heroSecondaryCta, heroSecondaryCtaHref, headerCta, headerCtaHref, footerCopyright.

Live: headerCta Explore, headerCtaHref /#explore, heroPrimaryCta Start with AI, heroPrimaryCtaHref /learn. Overflow disclosure is More.

## defaults


topicSlug (authoring default only, currently ai), authorName, contentDate. If the default topic is not public it is ignored. It is not a silent UI fallback.

## topics[]


id (stable), slug (URL /topics/SLUG), name, shortName, description, badge, category, color (purple|emerald|blue|amber|pink|violet|indigo|teal), order, enabled, featured, showOnHomepage, showInNavigation, status.

Example live AI row: id ai, slug ai, status active, showOnHomepage true, showInNavigation false.

## contentTypes[]


id, title, description, badge, url or topicSlug, iconName, category, enabled, status, showOnHomepage, showInNavigation, order.

Live ids: learn (/learn), guides (/guides), projects (/projects). Planned: updates, interview, career. coming-soon: youtube, instagram.

## navigation.main and navigation.footer


id, label, href (static) or source, enabled, order, status, optional showInNavigation.

source.kind: topic (topicId), contentType (id), channel (id or channelId).

Header shows at most 5 resolved main items. Remainder go in Explore. Footer lists all resolved footer items.

## homepage.sections[]


id (unique), type (hero|topic-grid|course-list|content-list|channel-grid|continue-learning|cta), enabled, order, title, subtitle, ctaLabel, ctaHref, source, maxItems, showWhenEmpty.

source.kind: recent | topic (topicId) | format (format: lesson|guide|project|...) | channel (channelId).

Unknown type: skipped, validator errors.

## social[]


id, label, href (e.g. /youtube), externalUrl, enabled, status, order, displayName, description, badge, showOnHomepage, showInNavigation.

Live: youtube and instagram coming-soon, href /youtube and /instagram, empty media JSON.

## courses.json array


id, slug, title, description, topic, category, order, enabled, status, featured, showOnHomepage, badge, upcomingTopics[].

Active courses must have lessons. coming-soon courses may list on /learn as upcoming, not as homepage theater.

## series.json array


id, slug, title, description, topic, category, order, enabled, featured, badge, status. All rows today are enabled false / planned.

## media JSON


content/media/CHANNEL_ID.json is an array of objects: id, title, publishedAt, url or youtubeUrl/instagramUrl, optional duration, description, caption, thumbnail, tags, featured, type.

Empty array: keep the channel coming-soon.

## COMPLETE EXAMPLE


# Configuration


Files: content/config/platform.json, content/config/courses.json, content/config/series.json, content/media/*.json. Rebuild after edits.

## Lifecycle (every entity)


enabled (boolean): false hides everywhere.
status: planned | coming-soon | active | paused | disabled | archived.
showOnHomepage (boolean): homepage only.
showInNavigation (boolean): nav only.
order (number): sort key.

## brand


name, shortName, logo, logoAlt, logoMark, ogImage, faviconUrl, appleTouchIcon, tagline, description, url, email.

Example: logo /brand/logo-horizontal.png, logoMark /brand/logo-mark.png, ogImage /brand/og-image.jpg, faviconUrl /icon.png.

## copy


heroBadge, heroTitle, heroTagline, heroDescription, heroPrimaryCta, heroPrimaryCtaHref, heroSecondaryCta, heroSecondaryCtaHref, headerCta, headerCtaHref, footerCopyright.

Live: headerCta Explore, headerCtaHref /#explore, heroPrimaryCta Start with AI, heroPrimaryCtaHref /learn. Overflow disclosure is More.

## defaults


topicSlug (authoring default only, currently ai), authorName, contentDate. If the default topic is not public it is ignored. It is not a silent UI fallback.

## topics[]


id (stable), slug (URL /topics/SLUG), name, shortName, description, badge, category, color (purple|emerald|blue|amber|pink|violet|indigo|teal), order, enabled, featured, showOnHomepage, showInNavigation, status.

Example live AI row: id ai, slug ai, status active, showOnHomepage true, showInNavigation false.

## contentTypes[]


id, title, description, badge, url or topicSlug, iconName, category, enabled, status, showOnHomepage, showInNavigation, order.

Live ids: learn (/learn), guides (/guides), projects (/projects). Planned: updates, interview, career. coming-soon: youtube, instagram.

## navigation.main and navigation.footer


id, label, href (static) or source, enabled, order, status, optional showInNavigation.

source.kind: topic (topicId), contentType (id), channel (id or channelId).

Header shows at most 5 resolved main items. Remainder go in Explore. Footer lists all resolved footer items.

## homepage.sections[]


id (unique), type (hero|topic-grid|course-list|content-list|channel-grid|continue-learning|cta), enabled, order, title, subtitle, ctaLabel, ctaHref, source, maxItems, showWhenEmpty.

source.kind: recent | topic (topicId) | format (format: lesson|guide|project|...) | channel (channelId).

Unknown type: skipped, validator errors.

## social[]


id, label, href (e.g. /youtube), externalUrl, enabled, status, order, displayName, description, badge, showOnHomepage, showInNavigation.

Live: youtube and instagram coming-soon, href /youtube and /instagram, empty media JSON.

## courses.json array


id, slug, title, description, topic, category, order, enabled, status, featured, showOnHomepage, badge, upcomingTopics[].

Active courses must have lessons. coming-soon courses may list on /learn as upcoming, not as homepage theater.

## series.json array


id, slug, title, description, topic, category, order, enabled, featured, badge, status. All rows today are enabled false / planned.

## media JSON


content/media/CHANNEL_ID.json is an array of objects: id, title, publishedAt, url or youtubeUrl/instagramUrl, optional duration, description, caption, thumbnail, tags, featured, type.

Empty array: keep the channel coming-soon.

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
