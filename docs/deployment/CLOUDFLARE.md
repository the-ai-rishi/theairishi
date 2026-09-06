# Worker deployment

This Next.js site uses the OpenNext adapter.

## Packaging

The config JSON is imported as modules. Markdown and media are embedded into a generated content catalog at build time. The runtime reads the repository filesystem for local development and Vercel, then uses the embedded catalog in Workers.

The Worker entry is .open-next/worker.js and static assets are .open-next/assets. The wrangler file enables nodejs_compat. Do not deploy the .next or out directories as a Pages worker.

## Troubleshooting

Run the validation, lint, and build commands before the adapter build. If the generated catalog is missing, run the content generator. If the /bundle/content/config/platform.json error returns, inspect that the generated catalog contains platform.json and rebuild the OpenNext output.

## Commands

Validation: validate
Lint: lint
Production build: build
Worker package: cf:build
Deployment: cf:deploy

The deploy command requires an authenticated account. The full deploy flow uses Wrangler through OpenNext; a dry run requires Node.js 22 or newer.
