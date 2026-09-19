# Cloudflare

## 1. What this system does

The site can run on Cloudflare Workers via OpenNext. Content is **compiled into the Worker** at build time. The Worker does not read `content/` from disk.

## 2. When I need it

Local works, Cloudflare logs show missing files, or you are deploying with Wrangler / Workers Builds.

## 3. The error this repo used to throw

```
[config] Platform config not found: /bundle/content/config/platform.json
```

**Root cause:** old code did `path.join(process.cwd(), "content/config/platform.json")`. On Workers, `process.cwd()` is `/bundle`. That directory does not contain the git source tree.

**Fix (do not regress):**

- `lib/config.ts` statically imports `content/config/platform.json`.
- Markdown and JSON under `content/` are embedded by `scripts/generate-content-data.js` into `lib/content-data.generated.ts`.
- `lib/content-runtime.ts` uses that catalog in production. Disk overlay is **development only**. It never probes `/bundle`.

## 4. Files involved

| File | Role |
| --- | --- |
| `scripts/generate-content-data.js` | Embeds `content/**/*.md,json` and writes the published `/learn` slug allow-list. Called from `next.config.ts` on purpose (OpenNext skips npm prebuild). |
| `lib/lesson-publish.js` | Canonical public-lesson predicate (gray-matter). Only `content/lessons/*.md`. |
| `lib/content-data.generated.ts` | Generated. Gitignored. Created before every Next compile |
| `lib/published-lesson-slugs.generated.ts` | Generated allow-list for middleware 404s |
| `middleware.ts` | Rewrites unknown `/learn/[slug]` to `/missing-lesson` with HTTP 404 |
| `lib/config.ts` | Static JSON import |
| `lib/content-runtime.ts` | Catalog + dev overlay |
| `open-next.config.ts` | `buildCommand: "node scripts/generate-content-data.js && npx next build"` |
| `wrangler.jsonc` | Worker name, `nodejs_compat`, assets |
| `scripts/check-worker-bundle.js` | Fails the CF build if brand/content are missing from the Worker |

## 5. Commands

```bash
npm run validate
npm run cf:build
npm run cf:preview
npm run cf:deploy
```

`prebuild` / `precf:build` must run. Never skip lifecycle scripts.

## 6. How to validate

- `npm run validate` - includes a worker-bundle check when `.open-next` exists.
- After `cf:build`, the artifact must contain `The AI Rishi` and `EMBEDDED_CONTENT`.
- Refresh `/` several times. No recurring `[config] Platform config not found`.
- `/learn`, `/learn/day-01`, `/guides`, `/projects`, `/topics/ai` still render.
- `/learn/day-04` and `/youtube` still 404 while unpublished / coming-soon.
- Unpublished days 404 because `middleware.ts` rewrites unknown `/learn/[slug]` to `/missing-lesson` with HTTP 404. The allow-list is `lib/published-lesson-slugs.generated.ts`, regenerated before every Next compile. `app/learn/[slug]/not-found.tsx` is not the unpublished-day mechanism.
- Do not set `dynamicParams = false` on `/learn/[slug]`. OpenNext then 404s every published day even when the HTML was prerendered.

## 7. What NOT to change

- Do not add `fs.readFileSync` for `platform.json`.
- Do not commit `lib/content-data.generated.ts` as a hand-edit.
- Do not set `buildCommand` back to `npm run build` (that re-enters `postbuild` → `cf:build` and loops).

## 8. Vercel vs Cloudflare

| | Vercel | Cloudflare |
| --- | --- | --- |
| Build | `next build` | `opennextjs-cloudflare build` |
| Content | Static import + embedded catalog | Same catalog inside the Worker |
| Disk | Not used in production | Not used |

Portable by design. No vendor-only content loader.

## 9. Common errors

| Symptom | Cause | Fix |
| --- | --- | --- |
| Platform config not found `/bundle/...` | Old Worker still deployed | Redeploy this branch |
| Missing module `content-data.generated` | generate step skipped | Run `npm run content:generate` before the OpenNext build |
| Empty lessons on CF, full locally | Disk overlay in dev, empty catalog in Worker | Confirm `prebuild` ran |
