# Telegram

Telegram is a live production channel.

Official URL: [https://t.me/theairishi_official](https://t.me/theairishi_official)

Do not invent a different `t.me` username. Do not put the URL in React.

## Where the canonical URL lives

`content/config/platform.json` → `social[]` id `telegram` → `url`

```json
{
  "id": "telegram",
  "label": "Telegram",
  "url": "https://t.me/theairishi_official",
  "kind": "external",
  "enabled": true,
  "status": "active",
  "showInFooter": true,
  "showOnHomepage": true,
  "showOnAbout": true,
  "includeInSameAs": true,
  "ctaLabel": "Discussion"
}
```

Footer, About, and the homepage destinations block read this row. Person JSON-LD `sameAs` includes it because `includeInSameAs` is true.

The old stand-in `https://example.com/the-ai-rishi-telegram` is retired. Validation fails if it comes back.

## Enable or disable

Hide it:

```json
"enabled": false
```

Turn it back on: `enabled: true`, `status: "active"`, keep the official URL.

## Change the URL later

Edit `url` only. The live channel is pinned to `https://t.me/theairishi_official`. A different username is rejected. Then:

```bash
npm run validate
```

Preview Footer / About / destinations. Deploy. No React/TSX edit.

## How deployment consumes this

`scripts/generate-content-data.js` embeds `content/config/platform.json` into `lib/content-data.generated.ts` before every Next compile. Vercel and Cloudflare Workers both read the embedded catalog. They do not read `platform.json` from disk at runtime.

## What NOT to do

- Do not hardcode `t.me` into a component
- Do not add `externalUrl`
- Do not invent a second social list
- Do not reintroduce the example.com placeholder
