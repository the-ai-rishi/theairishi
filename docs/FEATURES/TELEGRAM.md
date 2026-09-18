# Telegram

Telegram is a community destination. It is **enabled now** with a documented temporary URL. That URL is **not** a real group. Do not invent a `t.me` community.

## Live config

`content/config/platform.json` → `social[]` id `telegram`:

```json
{
  "id": "telegram",
  "label": "Telegram",
  "url": "https://example.com/the-ai-rishi-telegram",
  "kind": "external",
  "enabled": true,
  "status": "active",
  "showInFooter": true,
  "showOnHomepage": true,
  "showOnAbout": true,
  "includeInSameAs": false,
  "ctaLabel": "Discussion"
}
```

The URL `https://example.com/the-ai-rishi-telegram` is the only allowed stand-in. Visitors can see Telegram in Footer, About, and the homepage destinations block. The link is marked as a placeholder. It is **not** added to JSON-LD `sameAs`.

## Replace with the real community (one URL field)

When the real group exists:

1. Open `content/config/platform.json`
2. Find `social` id `telegram`
3. Replace `url` with the real `https://t.me/...` community
4. Keep `enabled: true` and `status: "active"`
5. Set `includeInSameAs: true` only when you want that profile in structured data
6. Run `npm run validate`
7. Preview Footer / About / destinations
8. Deploy

No React/TSX edit. `https://t.me/your-real-community` is rejected. An empty URL while enabled is rejected. The placeholder cannot be listed in `sameAs`.
