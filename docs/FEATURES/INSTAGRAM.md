# Instagram

Instagram is a **real external profile**, not a page on this site.

Live URL: [https://www.instagram.com/theairishi/](https://www.instagram.com/theairishi/)

Configured once in `content/config/platform.json` → `social[]` id `instagram`.

## What this is

- Visitors can follow daily posts from Footer, About, and a compact homepage destinations block.
- Person JSON-LD `sameAs` includes the profile.
- There is **no** `/instagram` listing. That route 404s on purpose.
- `content/media/instagram.json` stays `[]`. Do not invent posts, carousels, or follower counts.

## Fields

```json
{
  "id": "instagram",
  "label": "Instagram",
  "url": "https://www.instagram.com/theairishi/",
  "kind": "external",
  "enabled": true,
  "status": "active",
  "showInFooter": true,
  "showOnHomepage": true,
  "showOnAbout": true,
  "includeInSameAs": true,
  "ctaLabel": "Daily posts"
}
```

Change the URL later by editing `url` only. Hide it with `enabled: false`.

On-site visual notes (`contentTypes` id `instagram`, url `/instagram`) stay `coming-soon`. That reserved listing is not the live profile.
