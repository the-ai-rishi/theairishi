# DEPLOYMENT

## PURPOSE


This Next.js app deploys on Vercel at theairishi.vercel.app. The PR branch is not auto-main.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Deployment


This is a Next.js 16 app (React 19) intended for Vercel, with an OpenNext Cloudflare Workers deployment documented in [CLOUDFLARE.md](../deployment/CLOUDFLARE.md).

Before a production deploy run validate, then lint, then the smart build. It keeps Vercel on Next.js and selects OpenNext automatically in Cloudflare Workers Builds.

Set NEXT_PUBLIC_SITE_URL if the canonical origin is not brand.url (https://theairishi.com).

Rebuild after JSON or markdown edits. There is no runtime CMS.

Do not rewrite brand PNG or JPG bytes.

## COMPLETE EXAMPLE


# Deployment


This is a Next.js 16 app (React 19) intended for Vercel.

Before a production deploy run validate, then lint, then build.

Set NEXT_PUBLIC_SITE_URL if the canonical origin is not brand.url (https://theairishi.com).

Rebuild after JSON or markdown edits. There is no runtime CMS.

Do not rewrite brand PNG or JPG bytes.

## VALIDATION


See OPERATIONS/VALIDATION.md. Run the validate script, open the route, search if public.

## COMMON MISTAKES


Do not invent YouTube or Instagram items. Do not crop brand PNG or JPG. Do not reintroduce switch(section.id). Do not leak coming-soon in the public UI. There is no Python content.

## TROUBLESHOOTING


| Symptom | Cause | Fix |
| --- | --- | --- |
| Route 404 | type or topic not enabled+active with content | keep it hidden or add real content |
| Missing homepage block | showWhenEmpty false and empty | add content or leave hidden |
| validate fails | active course with 0 lessons | set status coming-soon or add lessons |

## HOW TO UNDO


Restore the JSON or markdown files with git restore, or git revert the commit. Do not force-push.

## Workers deployment

See the dedicated deployment guide at [CLOUDFLARE.md](../deployment/CLOUDFLARE.md) for OpenNext packaging, Wrangler commands, validation, and troubleshooting.
