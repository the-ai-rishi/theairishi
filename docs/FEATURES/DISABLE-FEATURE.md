# Disable a feature

## 1. What this system does

Removes a surface from the public site without deleting files.

## 2. When I need it

You want Learn, Read, Build, a topic, YouTube, or Instagram to disappear from nav, homepage, search, sitemap, and routes.

## 3. Exact file

`content/config/platform.json`

## 4. Fields

Pick **one**:

| Goal | Field | Value |
| --- | --- | --- |
| Hide everywhere, keep files | `enabled` | `false` |
| Hide everywhere, mark as not launched | `status` | `planned` / `coming-soon` / `disabled` / `archived` |
| Hide from header only | `showInNavigation` | `false` |
| Hide from homepage only | `showOnHomepage` | `false` |

For a single lesson/guide/lab, set that file’s `enabled: false` or `status: draft` instead of disabling the whole type.

## 5. Example - hide Build

In `contentTypes` id `projects` and `navigation` items that source `projects`:

```json
"enabled": false
```

Or keep the type but unpublished labs: set each lab `enabled: false`.

## 6. What NOT to change

- Do not delete `app/projects` to hide Build. Config is enough.
- Do not leave `status: "active"` with zero items.

## 7. Commands

```bash
npm run validate
```

## 8. Expected result

The feature is gone from:

- header and footer
- homepage
- search
- sitemap
- public URL (404)

## 9. Troubleshooting

If it still appears, you flipped `showOnHomepage` but left `status: "active"` with content - it can still be in nav/search/sitemap. Use `enabled: false` or a non-active status for a full hide.
