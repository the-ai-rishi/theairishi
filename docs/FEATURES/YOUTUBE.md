# Enable YouTube

## 1. What this system does

YouTube is a **channel**. It is wired, but public only when it is `active` **and** `content/media/youtube.json` has real items.

Today it is `coming-soon` with an empty array. `/youtube` 404s. It is not in nav, homepage, search, or sitemap.

## 2. When I need it

You have real videos to list. Do not invent items.

## 3. Files

| File | What to change |
| --- | --- |
| `content/media/youtube.json` | Array of video objects |
| `content/config/platform.json` → `social` id `youtube` | `status`, `showInNavigation`, `showOnHomepage`, `externalUrl` |
| `content/config/platform.json` → `contentTypes` id `youtube` | same `status` |

## 4. Item fields

```json
{
  "id": "intro-transformers",
  "title": "Transformers from first principles",
  "description": "A walk-through of attention.",
  "publishedAt": "2026-09-01",
  "url": "https://www.youtube.com/watch?v=REAL_ID",
  "featured": true,
  "tags": ["ai"]
}
```

`url` must be a real video URL, not `https://youtube.com`.

## 5. Enable

1. Add at least one real item to `youtube.json`.
2. Set both `social` and `contentTypes` youtube entries:

```json
"enabled": true,
"status": "active",
"showOnHomepage": false,
"showInNavigation": true
```

3. Keep `showOnHomepage` false unless you add a `channel-grid` homepage section.

## 6. What NOT to change

- Do not add `app/youtube/page.tsx`. `app/[channel]/page.tsx` is the route.
- Do not set `active` with `[]`.

## 7. Commands

```bash
npm run validate
npm run build
```

## 8. Expected result

`/youtube` returns 200. Search can find the titles. Sitemap includes `/youtube`. Instagram stays hidden.

## 9. Common errors

Validate: placeholder URL or active-with-zero-content.
