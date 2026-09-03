# Future content types

## Config can do (no React)

- New topic in topics[].
- New course row in courses.json plus lessons.
- New guide or project markdown.
- New homepage content-list instance (recent, topic, format, or channel).
- New social channel object with id, href like /tiktok, and content/media/tiktok.json. The generic channel page picks it up once active with items.
- Reorder homepage.sections, change copy, brand paths, nav labels.
- Enable, disable, pause, or archive any existing entity.

## Needs a developer

- A homepage section type other than hero, topic-grid, course-list, content-list, channel-grid, continue-learning, cta.
- A new route shape that is not /learn, /guides, /projects, /topics/SLUG, or /CHANNEL.
- New visibility semantics.

Search labels for unknown formats are title-cased from the item type. Video is already mapped for youtube/instagram in lib/search.ts.

The site is not fully config-driven for every UI idea. The type registry is code.
