# Validation

## 1. What this system does

`npm run validate` is the safety net before a publish. It fails the build-prep when configuration or content is invalid.

## 2. When I need it

Before every deploy. After any JSON or markdown change.

## 3. Command

```bash
npm run validate
```

This runs `content:generate` first (`prevalidate`), then `scripts/validate.js`, which also runs the 13 visibility scenario tests.

## 4. What it checks

- `platform.json` parses and has brand, topics, nav, homepage
- `lib/config.ts` statically imports platform JSON (never `readFileSync`, never “Platform config not found”)
- `lib/content-runtime.ts` uses the embedded catalog and gates disk reads
- Generated catalog contains platform, courses, lessons, guides, projects
- Unique slugs
- Active topics/courses have content
- Coming-soon YouTube/Instagram do not leak into nav, search, sitemap, or routes
- Placeholder GitHub/Instagram/YouTube root URLs
- Brand files exist on disk
- Worker bundle (if `.open-next` exists) contains the brand and embedded lessons

## 5. Expected result

```
ALL CHECKS PASSED
```

If it prints `FAIL`, do not deploy. Read the message: it names the file and the field.

## 6. Common errors

| Message | Fix |
| --- | --- |
| active topic has zero content | Set the topic to `planned` or add published markdown |
| duplicate slug | Rename one file |
| obsolete platform config error | You reintroduced a filesystem loader. Use the static import. |
| placeholder URL | Remove the empty GitHub/YouTube/Instagram URL |
