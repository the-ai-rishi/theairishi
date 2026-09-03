# COMMAND REFERENCE

## PURPOSE

Exact npm scripts in this repository `package.json`. Not a generic CMS.

## WHEN TO USE

Before running a command, or when validate / lint / build / dev / start is mentioned in another operator doc.

## PREREQUISITES

- Repository cloned.
- npm install already succeeded (`node_modules` present) except when you are installing.
- Run from the repository root.

## WHERE

- Script names: `package.json` `scripts`
- `validate`: `scripts/validate.js` (also runs scenario tests)
- `test:platform`: `scripts/scenario-test.js`
- `content:index`: `scripts/content-index.js`
- Config and content those scripts read: `content/config/platform.json`, `content/config/courses.json`, `content/lessons`, `content/courses`, `content/guides`, `content/projects`, `content/media`, `public/brand`
- Kernel: `lib/visibility-core.js`

## STEP-BY-STEP

Use this table. Do not invent extra scripts.

| Command | package.json script | What it does |
| --- | --- | --- |
| npm run dev | `next dev` | Local Next.js server, default http://localhost:3000 |
| npm run validate | `node scripts/validate.js` | Checks platform.json, courses, brand files on disk, unknown homepage types, dead nav sources, empty active topics/courses, placeholder URLs, frozen ids, then scenario tests 1-13. Must exit 0. |
| npm run test:platform | `node scripts/scenario-test.js` | In-memory visibility scenarios; does not mutate platform.json |
| npm run content:index | `node scripts/content-index.js` | Prints a file index for config, lessons, courses, guides, projects, media, docs |
| npm run lint | `eslint` | Lint the app |
| npm run build | `next build` | Production build |
| npm start | `next start` | Serve the production build (run build first) |

npm run validate already invokes the scenario tests. npm run test:platform runs them alone.

validate checks platform.json, courses, brand files on disk, unknown homepage types, dead nav sources, empty active topics/courses, placeholder URLs, and frozen ids in app/components/lib.

Scenario tests (in-memory):

1. Only one active topic with content
2. Disable a topic that had content
3. Remove a topic object (must not throw)
4. Rename topic name and slug
5. Add python as active with content
6. Disable YouTube
7. Enable YouTube as active with items (route /youtube appears)
8. Disable guides content type
9. Planned empty area is not a large homepage section
10. Planned/coming-soon YouTube is not a channelPath
11. Nav split: 8 items => 5 primary + 3 Explore
12. Active YouTube with zero items is not-found
13. Listing file routes 404 when the content type is disabled, coming-soon, or enabled false

## COMPLETE EXAMPLE

Pre-publish sequence from the repo root:

```bash
npm run validate
npm run test:platform
npm run content:index
npm run lint
npm run build
```

Local loop:

```bash
npm run dev
```

After npm run build, npm start serves the production output on port 3000.

## VALIDATION

npm run validate must print `ALL CHECKS PASSED` and exit 0. See [../OPERATIONS/VALIDATION.md](../OPERATIONS/VALIDATION.md).

## COMMON MISTAKES

- Running npm start before npm run build
- Assuming npm run validate mutates `platform.json` (it does not; scenario tests are in-memory)
- Cropping brand PNG/JPG because validate checks those files exist, not that you should rewrite them
- Inventing YouTube or Instagram items to make scenario 7 pass against the live files (live files stay empty)

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| validate fails on an active course with 0 lessons | Course `status` is `active` without markdown | Set `status` `coming-soon` or add real lessons |
| validate fails on brand asset | Path in `brand.logo` / `logoMark` / `ogImage` missing on disk | Restore the file; do not crop or regenerate PNG/JPG |
| lint errors | ESLint findings in app/components/lib | Fix code; do not skip lint |
| build fails | Type or Next error | Read the build log; JSON/markdown mistakes often show up in validate first |
| npm start 404s / errors | No `.next` output | npm run build then npm start |

## HOW TO UNDO

These commands do not write content. Stop npm run dev / npm start with Ctrl+C. Delete `.next` if you need a clean rebuild. Restore JSON or markdown with `git restore` or `git revert`. Do not force-push.
