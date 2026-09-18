# Add a program

The current program is DevOps Engineer Mastery. AI and Agentic AI stay off the homepage until they have real material.

Programs live in `content/config/programs.json`.

```json
{
  "featuredProgramId": "devops-engineer-mastery",
  "programs": [ { "...current program..." } ]
}
```

Homepage, `/learn`, and Start Day 1 always use the **featured** program. Other active programs can have a page at `/programs/<slug>` and a nav tab. Featured `/programs/<slug>` redirects to `/learn`.

## Add a planned program (AI later)

Add an object. Do **not** invent curriculum.

```json
{
  "id": "ai-foundations",
  "slug": "ai-foundations",
  "title": "AI Foundations",
  "status": "planned",
  "enabled": false,
  "featured": false
}
```

Validation allows planned programs without phases or days. They do not appear on the homepage.

## Make it a real program

1. Copy real phases and day titles from the source of truth. Do not invent Day titles.
2. Set `enabled: true`, `status: "active"`, `startHref`, `description`, `durationLabel`.
3. Add lessons under `content/lessons/` when a day is ready.
4. Add a nav item in `platform.json` `navigation.main` if it should be reachable (`placement: "explore"` unless it should replace a primary verb).
5. Leave `featuredProgramId` on DevOps until you intend the homepage to change.
6. `npm run validate`, preview, deploy.

## Change the featured program

Set `featuredProgramId` to the other program id. Set `featured: true` on that program and `featured: false` on the previous one. `/learn` will show the new featured map. This is a product decision, not a visual redesign.

## Disable / restore

Non-featured: `enabled: false` or `status: "disabled"`. Restore with `enabled: true` and `status: "active"`. The featured current program cannot be disabled (validation fails).
