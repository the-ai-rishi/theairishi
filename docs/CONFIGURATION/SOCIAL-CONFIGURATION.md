# Social configuration

One list: `content/config/platform.json` → `social[]`.

Header, Footer, About, the homepage destinations block, and Person JSON-LD `sameAs` all read this list. Do not paste Instagram, Telegram, GitHub, or YouTube URLs into React.

A new `social[]` row with a real https URL appears as a **text link** automatically. Adding a custom icon is optional and is the only code change.

There is no `externalUrl` field. The only outbound URL is `url`.

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
| `includeInSameAs` | Person JSON-LD. Disabled, empty, and temporary placeholder URLs are never added |
| `ctaLabel` | Short phrase next to the name (`Daily posts`) |
| `role` | `discovery` / `community` / `media` / `code` - documentation only |

## Live today

| Channel | State | What visitors see |
| --- | --- | --- |
| Instagram | `kind: external`, `enabled: true`, `status: active`, `url: https://www.instagram.com/theairishi/` | Footer, About, homepage destinations, `sameAs` |
| Telegram | external, enabled, documented placeholder `https://example.com/the-ai-rishi-telegram` | Footer, About, homepage destinations. **Not** `sameAs`. Label shows Placeholder |
| GitHub | external, `enabled: false`, `status: planned`, URL kept in config | Nothing public. Enable later from this row |
| YouTube | internal `/youtube`, `coming-soon`, no videos | 404 until real items exist. No on-site Instagram feed either |

The site does **not** import Instagram posts, follower counts, or reels. `content/media/instagram.json` stays `[]`. `/instagram` is not a public product page.

JSON-LD `sameAs` today: **Instagram only**.

## Change the Instagram URL later

Edit one field:

```json
"id": "instagram",
"url": "https://www.instagram.com/theairishi/"
```

Then `npm run validate`.

## Replace the Telegram placeholder

See [TELEGRAM.md](../FEATURES/TELEGRAM.md). Edit `url` to the real `https://t.me/...`. Set `includeInSameAs: true` only when the real community should appear in structured data.

## Enable GitHub later

The URL is already in config.

1. `social` id `github`: `enabled: true`, `status: "active"`
2. Set `showInFooter` / `showOnAbout` / `includeInSameAs` as you want
3. `npm run validate`

No React edit.

## Enable YouTube later

See [FEATURES/YOUTUBE.md](../FEATURES/YOUTUBE.md). That is an on-site listing. It needs real items in `content/media/youtube.json`.

## Add another social channel

Add an object to `social[]`. A text link appears automatically. A custom glyph is a one-time UI change only if you want an icon.
