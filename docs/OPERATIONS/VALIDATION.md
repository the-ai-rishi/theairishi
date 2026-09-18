# Validation

## 1. What this system does

`npm run validate` is the safety net before a publish. It fails when configuration or content is invalid.

## 2. When I need it

Before every deploy. After any JSON or markdown change.

## 3. Command

```bash
npm run validate
```

This runs `content:generate` first (`prevalidate`), then `scripts/validate.js`, which also runs the visibility scenario tests.

## 4. What it checks

- `platform.json` parses and has brand, topics, nav, homepage
- `programs.json` is a catalog with `featuredProgramId`; the featured program has contiguous phases and days
- Daily lessons with `day` / `phase` / `program` match `programs.json`
- Duplicate slugs and duplicate day numbers
- The phrase “Ancient patience. Modern systems.” is absent from config and UI code
- `lib/config.ts` and `lib/programs.ts` statically import JSON (never `readFileSync`)
- `lib/content-runtime.ts` uses the embedded catalog and gates disk reads
- Generated catalog contains platform, courses, programs, lessons, guides, projects
- Active topics/courses that are shown on the homepage have content
- Instagram is a public external destination; `/instagram` is not a site route
- Telegram may be disabled with an empty URL; enabled Telegram requires a real https://t.me/... URL
- Coming-soon YouTube does not leak into nav, search, sitemap, or routes
- Brand files exist on disk
- Worker bundle (if `.open-next` exists) contains the brand and embedded lessons

Errors look like this:

```
ERROR:
Lesson "day-07" references phase "phase-99".

Fix:
Edit content/lessons/day-07.md. Set FIELD phase to VALUE phase-01.
```

## 5. Expected result

```
ALL CHECKS PASSED
```

If it prints `Validation failed`, do not deploy.

## 6. Scenario tests

The validator also runs `scripts/scenario-test.js` (tests 1–18 plus future operations A–N in `scripts/future-operations-test.js`). Those tests clone `platform.json` and check that disabling a topic, a channel, or a content type actually removes it from homepage, nav, search, sitemap, and routes. They do **not** require the live homepage to show a topic grid. The live homepage is learner-first (hero / program / phases / why / today / method / path). Search and sitemap are independent surfaces (Test 14 mixed both ways, including catalog items). Test 16 is the course-href contract. Test 17 is the single publication predicate. Test 18 requires static `/learn` segments to be real `page.*` files.
