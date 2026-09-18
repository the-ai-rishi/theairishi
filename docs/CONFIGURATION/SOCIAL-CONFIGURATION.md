# Social configuration

One list: `content/config/platform.json` → `social[]`.

Header, Footer, About, the homepage destinations block, and Person JSON-LD `sameAs` all read this list. Do not paste Instagram or Telegram URLs into React.

## Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable id (`instagram`, `telegram`, `github`, `youtube`) |
| `label` | Visible name |
| `kind` | `external` (outbound profile) or `internal` (on-site listing such as `/youtube`) |
| `url` | https destination. Empty string is allowed while the channel is disabled |
| `href` | Site path. Only for `kind: "internal"` |
| `enabled` | `false` hides it everywhere |
| `status` | `planned` / `coming-soon` / `active` / `paused` / `disabled` / `archived` |
| `order` | Sort key |
| `showInFooter` | Default true for public external destinations |
| `showOnHomepage` | Homepage destinations block |
| `showOnAbout` | About page |
| `includeInSameAs` | Person JSON-LD. Disabled/empty channels are never added |
| `ctaLabel` | Short phrase next to the name (`Daily posts`) |
| `role` | `discovery` / `community` / `media` / `code` — documentation only |

## Live today

| Channel | State | What visitors see |
| --- | --- | --- |
| Instagram | `kind: external`, `enabled: true`, `status: active`, `url: https://www.instagram.com/theairishi/` | Footer, About, homepage destinations, `sameAs` |
| Telegram | `enabled: false`, `url: ""` | Nothing. Do not invent a `t.me` URL |
| GitHub | external, active, `https://github.com/the-ai-rishi` | Footer, About, `sameAs` |
| YouTube | internal `/youtube`, `coming-soon`, no videos | 404 until real items exist |

The site does **not** import Instagram posts, follower counts, or reels. `content/media/instagram.json` stays `[]`.

## Change the Instagram URL later

Edit one field:

```json
"id": "instagram",
"url": "https://www.instagram.com/theairishi/"
```

Then `npm run validate`.

## Enable Telegram later

1. Create the real community.
2. Set `url` to `https://t.me/your-actual-community` (not a placeholder).
3. Set `enabled: true` and `status: "active"`.
4. `npm run validate`
5. Preview, then deploy.

No React edit. Empty URL + `enabled: true` fails validation. `https://t.me/your-real-community` fails validation.

## Enable YouTube later

See [FEATURES/YOUTUBE.md](../FEATURES/YOUTUBE.md). That is an on-site listing. It needs real items in `content/media/youtube.json`. It is not a Header profile link until you also add an external `url` and `includeInSameAs`.

## Add another social channel

Add an object to `social[]`. A text link appears automatically. A custom glyph is a one-time UI change only if you want an icon.
