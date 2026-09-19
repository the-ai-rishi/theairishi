# Enable a feature

## 1. What this system does

Turns a hidden area into a public one. Public means: navigation (if you want it), homepage (if you want it), search, sitemap, and a real URL.

## 2. When I need it

The feature has **real content**. Examples: YouTube videos in `content/media/youtube.json`, a new topic with published lessons.

## 3. Exact files

Always:

- `content/config/platform.json`

Plus the content store for that feature:

| Feature | Content |
| --- | --- |
| Learn | `content/config/courses.json` + lesson markdown |
| Read | `content/guides/*.md` |
| Build | `content/projects/*.md` |
| YouTube | `content/media/youtube.json` and `contentTypes` + `social` id `youtube` |
| Instagram | `content/media/instagram.json` and `contentTypes` + `social` id `instagram` |
| Topic | `topics[]` + markdown tagged with that topic |

## 4. Fields to change

On the matching `contentTypes[]` (and `social[]` / `topics[]` if they exist):

```json
"enabled": true,
"status": "active",
"showOnHomepage": true,
"showInNavigation": true
```

`coming-soon` and `planned` **never** get a public URL, even if `enabled` is true.

## 5. Example - YouTube

1. Add real items to `content/media/youtube.json`.
2. In `platform.json` `social` id `youtube` and `contentTypes` id `youtube`: set `status` to `active`.
3. Optionally `showInNavigation: true` if it should appear in the header.

## 6. What NOT to change

- Do not set `status: "active"` with an empty JSON array.
- Do not add a React page for YouTube. `app/[channel]/page.tsx` already handles it.

## 7. Commands

```bash
npm run validate
npm run build
```

## 8. How to validate

- The URL returns 200, not 404.
- It appears in search only after it is active with items.
- `/sitemap.xml` includes it.
- Disabled siblings (Instagram, career, …) still 404.

## 9. Common errors

Validate fails “active with zero content” - add items first, then flip status.
