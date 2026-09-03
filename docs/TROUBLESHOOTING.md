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
