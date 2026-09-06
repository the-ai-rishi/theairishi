# Cloudflare Workers deployment

This Next.js site uses the OpenNext adapter for Cloudflare Workers.

## Workers Builds settings

In the Cloudflare Workers Builds settings, use:
- Build command (preferred): OpenNext build
- Deploy command (preferred): Wrangler deploy or the OpenNext deploy script

The recommended alternative deploy script runs the OpenNext build followed by the OpenNext deployment.

The OpenNext build must run before deployment. The old plain Next.js build did not produce the compiled OpenNext configuration, so Wrangler failed during deployment.
The smart build detects Cloudflare Workers Builds through the Cloudflare environment markers or `/opt/buildhome` and runs the OpenNext package build. Existing dashboard settings using the smart build should therefore start producing the required output automatically, while the explicit settings above remain preferred.

## Vercel

Vercel does not expose the Cloudflare build markers, so the smart build takes the local Next.js-only path there. This preserves the existing Vercel build. The prebuild lifecycle still generates the content catalog before either target-specific build path runs.
## Local checks and commands

Run validation and lint before a production deploy. The explicit Worker package command is the preferred Cloudflare build; use the Wrangler or OpenNext deploy command after it.

The deploy commands require an authenticated Cloudflare account. Rebuild after JSON or Markdown content changes so the generated catalog and Worker bundle include the latest content.
Use the following explicit settings:
Build command: cf:build
Deploy command: npx wrangler deploy or cf:deploy
