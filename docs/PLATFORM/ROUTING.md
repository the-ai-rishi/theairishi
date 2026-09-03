# ROUTING

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


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

/learn, /guides, /projects (and their /SLUG pages) still exist as files, but the page calls notFound() unless the matching content type is enabled and active. generateStaticParams emits no slugs when the type is hidden. Nav and sitemap already hide them.

Helper: contentTypeRouteState / isContentTypeRoutable.

## Sitemap and robots


app/sitemap.ts uses getSitemapInputs. Core paths, public topics, public channels, then lesson/guide/project slugs when those types are sitemap-visible.

app/robots.ts allows /, disallows /api/, points at /sitemap.xml.

Coming-soon is not noindex because it is not a URL. It 404s.

Search API is /api/search and is disallowed in robots.

## COMPLETE EXAMPLE


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

/learn, /guides, /projects (and their /SLUG pages) still exist as files, but the page calls notFound() unless the matching content type is enabled and active. generateStaticParams emits no slugs when the type is hidden. Nav and sitemap already hide them.

Helper: contentTypeRouteState / isContentTypeRoutable.

## Sitemap and robots


app/sitemap.ts uses getSitemapInputs. Core paths, public topics, public channels, then lesson/guide/project slugs when those types are sitemap-visible.

app/robots.ts allows /, disallows /api/, points at /sitemap.xml.

Coming-soon is not noindex because it is not a URL. It 404s.

Search API is /api/search and is disallowed in robots.

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
