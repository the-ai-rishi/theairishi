# LOCAL DEVELOPMENT

## PURPOSE

Install dependencies, run the Next.js 16 dev server, click the live public surfaces, stop the server, and recover from common port problems. This file is not the Only-AI / Add-DevOps operations playbook.

## WHEN TO USE

Whenever you need a local http://localhost:3000 session for The AI Rishi.

## PREREQUISITES

- Repository cloned.
- Node.js and npm on PATH.
- Work from the repository root (`package.json` lives there).

## WHERE

- App: `package.json` scripts `dev` (`next dev`), `start` (`next start`)
- Hero copy: `content/config/platform.json` `copy.hero*`
- Topics: `content/config/platform.json` `topics[]`
- Lessons: `content/lessons`, `content/courses/devops`
- Guides: `content/guides`
- Projects: `content/projects`
- Media: `content/media/youtube.json`, `content/media/instagram.json`
- Kernel: `lib/visibility-core.js`

## STEP-BY-STEP

1. cd to the repository root.
2. npm install
3. npm run dev
4. Wait until the terminal prints a Local URL. Default is http://localhost:3000
5. Open that URL.
6. What to click:
   - Hero **Start learning** goes to /learn (`copy.heroPrimaryCta` / `copy.heroPrimaryCtaHref`).
   - Hero **Read a guide** goes to /guides (`copy.heroSecondaryCta` / `copy.heroSecondaryCtaHref`).
   - Header links: Home /, Learn /learn, Guides /guides, Projects /projects, About /about.
   - Header CTA **Explore** goes to /#explore (`copy.headerCta` / `copy.headerCtaHref`), the topic-grid titled **The field**.
   - The field cards: **AI / LLM** -> /topics/ai and **DevOps** -> /topics/devops only.
   - /youtube and /instagram must 404.
7. After JSON or markdown edits, refresh. If copy does not update, stop and start npm run dev again. There is no runtime CMS.
8. How to stop: focus the npm run dev terminal and press Ctrl+C.
9. Production-style local serve (optional): npm run build then npm start. That also defaults to port 3000.

## COMPLETE EXAMPLE

```bash
npm install
npm run dev
```

Then open http://localhost:3000

- Confirm hero title The AI Rishi and CTAs Start learning + Read a guide.
- Click Start learning, then the browser back button, then Read a guide.
- Click Explore in the header; the page should land on The field.
- Visit http://localhost:3000/youtube and confirm not-found.
- Press Ctrl+C to stop.

Common port issues: if 3000 is taken, Next prints a different Local port. Use that URL, or stop the other process, or start with `npx next dev -p 3001`. Do not assume a silent fallback without reading the terminal.

## VALIDATION

With the dev server running or after stopping it:

```bash
npm run validate
```

Exit 0 required. See [OPERATIONS/VALIDATION.md](./VALIDATION.md) and [../QUICK-START.md](../QUICK-START.md).

## COMMON MISTAKES

- Running npm run dev from `docs/` or another subdirectory
- Treating /youtube 404 as a broken server
- Editing brand PNG/JPG under `public/brand`
- Inventing YouTube or Instagram rows so local /youtube stops 404ing
- Leaving a previous Next process on 3000 and clicking the wrong Local URL

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| Install fails | Missing Node/npm or network | Install Node.js; retry npm install from repo root |
| `EADDRINUSE 3000` | Another process holds 3000 | Ctrl+C the old npm run dev, or use `npx next dev -p 3001` |
| Page is a different port than 3000 | Next picked the next free port | Use the Local URL printed in the terminal |
| Changes to `platform.json` not visible | Dev server cache / process stale | Ctrl+C, then npm run dev |
| `next start` errors | No production build yet | Run npm run build first |
| Module not found | `node_modules` missing | npm install |

## HOW TO UNDO

Ctrl+C stops the server. `git restore` the files you edited. Delete `.next` if a stale build is in the way; it is generated. Do not force-push.
