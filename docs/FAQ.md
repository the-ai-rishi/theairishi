# FAQ

## I only want Python visible
Add a Python topic with real lessons. Set AI and DevOps to planned or enabled false (or showOnHomepage false and showInNavigation false). Do not invent Python content. When Python has content and status active, topic-grid shows it.

## Hide AI
Set the ai topic enabled false or status paused/disabled. It leaves nav, homepage, search, and sitemap. Lessons stay on disk.

## I accidentally removed a topic
Paste the object back into the topics array with the same id. If you only needed to hide it, prefer enabled false next time.

## YouTube only after the first video
Keep YouTube coming-soon until content/media/youtube.json has items. Then set status active. Add a channel-grid section if you want it on the homepage. Do not enable large theater while the list is empty.

## New tech on the homepage
Add the topic, add lessons, set status active and showOnHomepage true. topic-grid picks it up. Optional: a content-list instance bound to that topicId.

## Change button text
Edit copy.heroPrimaryCta, copy.headerCta, or a section ctaLabel in homepage.sections.

## Remove an entire area
Disable the topic or contentType (enabled false). Or set the homepage section enabled false. Removing the JSON object is permanent; disable is safer.
