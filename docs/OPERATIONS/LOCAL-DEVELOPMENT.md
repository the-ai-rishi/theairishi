# Local development

## Purpose

Run the Next.js app, click the live public surfaces, and recover from common mistakes.

## Prerequisites

- Repository cloned.
- Node.js and npm on PATH.
- Work from the repository root (`package.json` lives there).

## Commands

```bash
npm install
npm run dev
```

Default in this repo is `next dev`. In the App Builder preview the process is bound to `0.0.0.0:8080` via `/workspace/startup.sh`. On your own machine, `npm run dev` is enough; Next prints the Local URL (usually http://localhost:3000).

## What to click

1. Homepage hero: **Start Day 1** → `/learn/day-01`. **See the 120-day journey** → `/learn`.
2. Header: **Start**, **Journey**, **About**. Header button **Start Day 1** → `/learn/day-01`.
3. Search: `day 1`, `shell`, `git`. You should not see YouTube or Instagram results.
4. `/learn` lists Days 1–3 as links. Days 4–120 are titles only.
5. `/about` is a first-person learning-in-public page.
6. `/youtube` and `/instagram` must 404.
7. Existing AI URLs still work (`/learn/ai-fundamentals-01`, `/guides/first-principles-ai-learning`, `/projects/autonomous-research-agent`) but they are not in the header.

## Where the strings live

- Hero / nav / story: `content/config/platform.json`
- 120-day map: `content/config/programs.json`
- Daily lessons: `content/lessons/day-01.md` …
- Kernel: `lib/visibility-core.js`

## Before you call it done

```bash
npm run validate
npm run lint
npm run build
```

## Common mistakes

- Editing a React file to change the hero. Change `copy.*` instead.
- Expecting Day 4 to have a page before `content/lessons/day-04.md` exists.
- Pointing `npm run dev` at a different port and wondering why the preview is blank.
