# YouTube and Instagram

Both channels exist in platform.json social[] and as contentTypes with status coming-soon. media JSON files are empty arrays. Direct /youtube and /instagram 404. They are not in nav, homepage, search, or sitemap.

After the first real YouTube video: add a real object to content/media/youtube.json with id, title, publishedAt, and url. Set social id youtube status to active. Set contentTypes id youtube status to active. Optionally add a channel-grid section or a nav source.kind channel item. Then validate, lint, and build.

Only then does getRouteChannels emit /youtube. Instagram is the same pattern with instagram.json.

Do not invent videos or posts. JSON snippets live in OPERATIONS.md.
