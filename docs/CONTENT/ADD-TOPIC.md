# Add a topic

## 1. What this system does

Topics are the field: AI, DevOps, and future areas. They are **not** markdown files. They live in `content/config/platform.json` → `topics[]`.

## 2. When I need it

You are ready to teach a new area **and** you already have published lessons, essays, or labs tagged with that topic.

## 3. Exact file to modify

`content/config/platform.json`

Field: `topics` (array).

## 4. Fields

| Field | Allowed values | Notes |
| --- | --- | --- |
| `id` | unique slug-like id | used in lesson `topic:` |
| `slug` | URL piece, `/topics/SLUG` | usually same as id |
| `name` | Long name | |
| `shortName` | Homepage lockup | |
| `description` | One sentence | |
| `badge` | Short label | |
| `category` | Grouping label | |
| `color` | `gold` / `purple` / `emerald` / `blue` … | mapped onto gold/circuit |
| `order` | number | |
| `enabled` | `true` / `false` | `false` hides everywhere |
| `featured` | `true` / `false` | |
| `showOnHomepage` | `true` / `false` | still needs content |
| `showInNavigation` | `true` / `false` | keep false unless you want a nav item |
| `status` | `planned` / `coming-soon` / `active` / `paused` / `disabled` / `archived` | |

## 5. Example — keep it hidden until content exists

```json
{
  "id": "cloud",
  "slug": "cloud",
  "name": "Cloud Computing & Azure",
  "shortName": "Cloud",
  "description": "Multi-cloud architecture, Azure, AWS, serverless.",
  "badge": "Cloud",
  "category": "Cloud & DevOps",
  "color": "blue",
  "order": 3,
  "enabled": true,
  "featured": false,
  "showOnHomepage": false,
  "showInNavigation": false,
  "status": "planned"
}
```

To launch: add published content with `topic: "cloud"`, then set `"status": "active"` and `"showOnHomepage": true`.

## 6. What NOT to change

- Do not set `status: "active"` on an empty topic. Validate will fail.
- Do not create `/topics/cloud` by adding a React page. The route already exists and 404s until the topic is active with content.

## 7. Commands

```bash
npm run validate
```

## 8. Expected result

Empty planned topics do **not** appear in nav, homepage, search, sitemap, or as URLs.

Active topics with content appear at `/topics/SLUG` and in The field.
