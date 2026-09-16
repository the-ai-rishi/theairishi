# Enable Instagram

Same kernel as YouTube. Today Instagram is `coming-soon` with `content/media/instagram.json` = `[]`. `/instagram` 404s.

## Files

| File | Change |
| --- | --- |
| `content/media/instagram.json` | Real posts |
| `platform.json` `social` id `instagram` | `status: "active"` only after items exist |
| `platform.json` `contentTypes` id `instagram` | same |

## Item shape

```json
{
  "id": "attention-carousel",
  "title": "Attention in one carousel",
  "caption": "What attention actually computes.",
  "publishedAt": "2026-09-01",
  "url": "https://www.instagram.com/p/REAL_ID/",
  "featured": false,
  "tags": ["ai"]
}
```

Do not use `https://instagram.com` with no path. Validate will fail.

Do not invent posts. Follow [ENABLE-FEATURE.md](./ENABLE-FEATURE.md) and [YOUTUBE.md](./YOUTUBE.md).
