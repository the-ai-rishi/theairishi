# PR #26 — architecture and visual acceptance audit

Status: **not approved for merging solely by CI**. Preserve THE AI RISHI, the original eight-petal mark, canonical FORGE-120 day lengths, publication state and local-only progress.

## Repository review

| Surface | Relevant files | Important invariant |
|---|---|---|
| App Router, SEO and errors | `app/**` | Canonical metadata, correct 404/unpublished behavior |
| Global shell and navigation | `components/brand/**`, `components/layout/**` | Responsive dock, keyboard focus, brand |
| Home and phase atlas | `components/product/**`, `components/home/**`, `components/field/**` | Real 120-day counts; planned days are not clickable lessons |
| Learn, lessons and baseline | `components/learning/**` | Honest progress, readable document, local persistence |
| Guides/projects/topics/channels | `app/**`, `lib/**` | Distinct templates with accessible reading surfaces |
| Search | `app/api/search/**`, `components/search/**`, `lib/search.ts` | Only published content, keyboard and mobile command palette |
| Source content and visibility | `content/**`, `data/curriculum/**`, `lib/visibility-core.js` | Do not invent content or activity |
| Vercel and Cloudflare | `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc` | Build and Worker bundle parity |
| Automated verification | `.github/workflows/ci.yml`, `scripts/**`, `e2e/**` | Lint, types, validation, scenario, build, browser accessibility |

## Fixed in this revision

- Search keyboard shortcuts close cleanly, restore focus, and clear stale state. The modal preserves a previously held scroll lock and treats invalid API responses as failures.
- Baseline self-assessment only says "Saved on this device" when localStorage succeeds; it preserves memory-only work with an explicit warning and offers copy/download, including clipboard failure feedback.
- Progress snapshots now update when another tab changes stored completions or bookmarks; a Node regression covers the state and listener lifecycle.
- Day 1's assessment no longer sits inside a second generic paper panel; selection/focus styles and progress/readout are improved.
- Playwright adds interior-route narrow viewport checks, shortcut/focus and persistence assertions, and desktop/mobile production-build full-page screenshots as CI artifacts.

## Route-by-route visual approval matrix

| Template/state | Acceptance focus | Evidence |
|---|---|---|
| Home and every chapter | Hero, open/closed phase, lower-fold transition, CTA/footer | Desktop/mobile full-page captures |
| Learn and phase/day explorer | Phase/day identity, filter/jump/error and real published/planned states | Desktop/mobile captures; interaction tests |
| Lesson Day 1 and other lessons | Masthead, baseline, reading steps, evidence/gate, local feedback | Desktop/mobile captures; baseline E2E |
| Guides index and guide detail | Editorial visual, rows, readable article | Index captures; guide detail smoke |
| Projects index and project detail | Technical illustration, resource links and readable article | Index captures; project detail smoke |
| About and its chapters | Narrative hierarchy and section pacing | Desktop/mobile captures |
| Topics, channels and program pages | Correct route-specific surfaces, disabled/empty states | Further manual evidence needed |
| Search | Frosted overlay, keyboard commands, empty/error/results states | Open-state captures; E2E |
| Loading, not found and error | Distinct state hierarchy and accessibility | 404 smoke; manual inspection needed |
| Header, footer, mobile dock | Contrast, navigation, safe area and focus | Responsive tests; manual inspection needed |

## Design-system debt and approval boundary

`app/globals.css`, `app/field.css`, and `app/world.css` are three overlapping global cascade sources. This update intentionally does not add a fourth override layer. Consolidating the older paper rules with the newer glass/night compositions should be a separate, screenshot-guided pass using measured selector usage and verified production rendering, not blind deletion.

The CI screenshot attachments are **evidence to review**, not proof of human visual approval. This audit cannot substitute for opening the previews on real desktop and phone sizes. Do not mark this redesign approved without that check.
