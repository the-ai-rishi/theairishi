# The AI Rishi

A first-principles knowledge studio for AI systems and the infrastructure that runs them.

Learn. Build. Stay Ahead.

Today that means real AI and DevOps lessons, one essay, and one public lab. Watch, Follow, Cloud, Career, and other future surfaces stay hidden until they are enabled and have real content.

## Operator start

- [docs/START-HERE.md](docs/START-HERE.md)
- [docs/README.md](docs/README.md)

## Commands

```bash
npm install
npm run dev
npm run validate
npm run lint
npm run build
```

JSON and Markdown drive the public UI. A new homepage **type** still needs a developer.

## Runtime

Content is compiled at build time (`scripts/generate-content-data.js`). Production on Vercel and Cloudflare Workers never reads `content/` from disk. That is what makes `/bundle/content/config/platform.json` a non-issue on this branch.
