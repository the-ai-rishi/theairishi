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
