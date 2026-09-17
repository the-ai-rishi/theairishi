# The AI Rishi

A public technology learning journey. Right now that means **DevOps Engineer Mastery**: 120 days, starting at the shell. AI and Agentic AI come later.

This is not a guru course and not an AI-first landing page.

Start: `/learn/day-01`. Journey: `/learn`. About: `/about`.

The locked plan lives in [devops-engineer-mastery](https://github.com/the-ai-rishi/devops-engineer-mastery). This site publishes the days that are ready.

## Operator start

- [docs/START-HERE.md](docs/START-HERE.md) — the index
- [docs/CONTENT/ADD-DAILY-LESSON.md](docs/CONTENT/ADD-DAILY-LESSON.md) — add Day N
- [docs/DEVOPS-ENGINEER-MASTERY.md](docs/DEVOPS-ENGINEER-MASTERY.md) — the 120-day map

## Commands

```bash
npm install
npm run dev
npm run validate
npm run lint
npm run build
```

JSON and Markdown drive the public UI. Adding Day 4 is a markdown file. A new homepage **type** still needs a developer.

## Runtime

Content is compiled at build time (`scripts/generate-content-data.js`). Production on Vercel and Cloudflare Workers never reads `content/` from disk. That is what makes `/bundle/content/config/platform.json` a non-issue on this branch.
