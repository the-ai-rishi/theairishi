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
