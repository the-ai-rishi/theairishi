# Quick start

## PURPOSE

Run this Next.js 16 (React 19) site locally and confirm the live public surfaces before you edit JSON or markdown.

## WHEN TO USE

First clone, first day on the repo, or any time you need to prove the local app matches `content/config/platform.json`.

## PREREQUISITES

- This repository cloned.
- Node.js and npm on your PATH (`package.json` scripts: `dev`, `validate`, `test:platform`, `content:index`, `lint`, `build`, `start`).
- Commands run from the repository root (the directory that contains `package.json`).

## WHERE

- Scripts: `package.json`
- Hero copy: `content/config/platform.json` fields `copy.heroBadge`, `copy.heroTitle`, `copy.heroTagline`, `copy.heroDescription`, `copy.heroPrimaryCta`, `copy.heroPrimaryCtaHref`, `copy.heroSecondaryCta`, `copy.heroSecondaryCtaHref`
- Header CTA: `content/config/platform.json` fields `copy.headerCta`, `copy.headerCtaHref`
- The field (topic-grid): `content/config/platform.json` `homepage.sections` id `topics`, `topics[]`
- Listings: content types `learn` (/learn), `guides` (/guides), `projects` (/projects)
- Hidden channels: `content/media/youtube.json`, `content/media/instagram.json` (empty arrays); `social[]` and `contentTypes[]` ids `youtube`, `instagram` status `coming-soon`
- Kernel: `lib/visibility-core.js`
- Local-dev detail: [OPERATIONS/LOCAL-DEVELOPMENT.md](./OPERATIONS/LOCAL-DEVELOPMENT.md)
- Commands: [REFERENCE/COMMAND-REFERENCE.md](./REFERENCE/COMMAND-REFERENCE.md)

## STEP-BY-STEP

1. From the repository root: npm install
2. npm run dev (runs `next dev`)
3. Open http://localhost:3000
4. Confirm the hero. Those strings are `copy.hero*` in `content/config/platform.json`, not hardcoded React:
   - Badge: Knowledge · Systems · Building (`copy.heroBadge`)
   - Title: The AI Rishi (`copy.heroTitle`)
   - Tagline: Learn. Build. Stay Ahead. (`copy.heroTagline`)
   - Description: A long-term technology and knowledge platform. Today you can learn AI and DevOps from first principles, read essays, and study a public lab. (`copy.heroDescription`)
   - Primary button: **Start learning** -> /learn (`copy.heroPrimaryCta` / `copy.heroPrimaryCtaHref`)
   - Secondary button: **Read a guide** -> /guides (`copy.heroSecondaryCta` / `copy.heroSecondaryCtaHref`)
5. Header: Home, Learn, Guides, Projects, About. CTA label **Explore**, href `/#explore`. Overflow disclosure is **More**, cap 5.
6. Scroll to **The field** (`homepage.sections` id `topics`, type `topic-grid`). Live public topics with content are **AI / LLM** (`topics` id `ai`) and **DevOps** (`topics` id `devops`). Planned rows (cloud, software-engineering, interview, updates, career, projects) must not appear.
7. Open http://localhost:3000/youtube — must 404. `content/media/youtube.json` is `[]` and the channel is `coming-soon`.
8. Open http://localhost:3000/instagram — must 404 for the same reason.
9. Click Learn, Guides, Projects, About, /topics/ai, and /topics/devops to confirm those listings load.
10. Stop the server with Ctrl+C in the npm run dev terminal.
11. From the repository root: npm run validate, then npm run lint, then npm run build. npm run validate must exit 0.

## COMPLETE EXAMPLE

```bash
npm install
npm run dev
```

Browser:

- http://localhost:3000 — hero CTAs **Start learning** and **Read a guide**
- Start learning -> http://localhost:3000/learn (15 AI lessons in `content/lessons`, 2 DevOps lessons in `content/courses/devops`)
- Read a guide -> http://localhost:3000/guides (one file: `content/guides/first-principles-ai-learning.md`)
- The field shows AI / LLM and DevOps only
- http://localhost:3000/youtube — not found
- http://localhost:3000/instagram — not found
- http://localhost:3000/projects — one lab: `content/projects/autonomous-research-agent.md`

Second terminal (server can keep running):

```bash
npm run validate
npm run lint
npm run build
```

Do not edit a React file to change hero copy. Edit `content/config/platform.json` `copy.hero*`.

## VALIDATION

```bash
npm run validate
```

Must print `ALL CHECKS PASSED` and exit 0. Then npm run lint and npm run build. Open /, /learn, /guides, /projects, /youtube (404). See [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md).

## COMMON MISTAKES

- Changing hero copy in a component instead of `content/config/platform.json` `copy.hero*`
- Expecting /youtube or /instagram to show a public coming-soon page (they 404)
- Inventing YouTube or Instagram items so a route appears
- Cropping or regenerating brand PNG/JPG under `public/brand`
- Treating planned topics as public cards
- Running npm scripts from a subdirectory instead of the repo root

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| `command not found` for the Node toolchain | Node/npm not on PATH | Install Node.js, retry from the repo root |
| Browser not on port 3000 / `EADDRINUSE` | Port 3000 already in use | Read the `Local:` URL in the npm run dev terminal, stop the other process, or run `npx next dev -p 3001` |
| Hero still shows old strings | Dev server did not reload `platform.json` | Stop with Ctrl+C and run npm run dev again |
| The field shows extra topics | A `topics[]` row is `active` with content and `showOnHomepage` true | Restore `content/config/platform.json` `topics[]` |
| /youtube is a real page | Channel was set `active` or `youtube.json` was filled | Keep status `coming-soon` and `content/media/youtube.json` as `[]` |
| npm run validate fails | Platform or content invariant | Read the error; do not force-push; see [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md) |

## HOW TO UNDO

Stop the server with Ctrl+C. Discard local edits with `git restore` on the files you changed, or `git revert` the commit. Do not force-push.
