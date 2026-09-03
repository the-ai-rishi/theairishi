# Routing and SEO

## Routes that exist as Next files

- / homepage
- /learn and /learn/SLUG
- /guides and /guides/SLUG
- /projects and /projects/SLUG
- /about
- /topics/SLUG via app/topics/[topic]
- /CHANNEL via app/[channel] with dynamicParams false

## Which of those are public

Topic and channel generateStaticParams use getRouteTopics / getRouteChannels. Only active plus contentCount > 0 is emitted. Visiting /youtube while coming-soon is notFound().

/learn, /guides, /projects always exist as files. Nav and sitemap hide them when the content type is not public.

## Sitemap and robots

app/sitemap.ts uses getSitemapInputs. Core paths, public topics, public channels, then lesson/guide/project slugs when those types are sitemap-visible.

app/robots.ts allows /, disallows /api/, points at /sitemap.xml.

Coming-soon is not noindex because it is not a URL. It 404s.

Search API is /api/search and is disallowed in robots.
