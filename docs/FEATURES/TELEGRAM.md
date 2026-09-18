# Telegram

Telegram is reserved for a real learning community. There is no URL yet. Do not invent one.

## Live config

`content/config/platform.json` → `social[]` id `telegram`:

```json
{
  "id": "telegram",
  "label": "Telegram",
  "url": "",
  "kind": "external",
  "enabled": false,
  "status": "planned",
  "showInFooter": true,
  "showOnHomepage": true,
  "includeInSameAs": true,
  "ctaLabel": "Discussion"
}
```

While `enabled` is false and `url` is empty:

- it does not appear in Footer, About, homepage, or nav
- it is not added to JSON-LD `sameAs`
- validation passes

## When the community exists

1. Paste the real `https://t.me/...` URL into `url`.
2. Set `enabled: true`.
3. Set `status: "active"`.
4. Run `npm run validate`.
5. Preview. Deploy.

No React/TSX edit. Placeholders such as `https://t.me/your-real-community` are rejected.
