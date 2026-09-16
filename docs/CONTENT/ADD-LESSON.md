# Add a lesson

## 1. What this system does

Adds one published lesson to a learning path. The lesson appears on `/learn`, inside its path, in search, and in the sitemap after the next build.

## 2. When I need it

You have a real lesson ready to publish. Do not add placeholder lessons.

## 3. Exact file to create

`content/lessons/YOUR-SLUG.md`

For a course that already uses a nested folder (DevOps):

`content/courses/devops/YOUR-SLUG.md`

Copy `templates/lesson-template.md`.

## 4. Fields to set

| Field | Allowed values | Required |
| --- | --- | --- |
| `title` | Plain text | yes |
| `course` | An `id` from `content/config/courses.json` (`ai`, `devops`, …) | yes |
| `courseTitle` | Display name of the path | yes |
| `courseOrder` | Number, path order | recommended |
| `stage` | Stage title | yes |
| `stageOrder` | Number | yes |
| `lesson` | Number inside the stage | yes |
| `topic` | A `topics[].id` in `platform.json` (`ai`, `devops`) | yes |
| `status` | `published` / `draft` / `archived` | yes |
| `description` | One short paragraph | yes |
| `enabled` | `true` / `false` | optional, default true |
| `tags` | List of strings | optional |
| `duration` | e.g. `12 min` | optional |

## 5. Example

```yaml
---
title: "What is Artificial Intelligence?"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "AI Fundamentals"
stageOrder: 1
lesson: 1
topic: "ai"
status: "published"
description: "Understand what artificial intelligence actually means."
---
```

## 6. What NOT to change

- Do not edit `lib/` or `app/` to add a lesson.
- Do not reuse an existing slug.
- Do not set `topic` to a planned topic (`cloud`, `career`, …) unless that topic is `active` and you intend it to go public.

## 7. Commands

```bash
npm run validate
npm run dev
```

## 8. How to validate

Open `/learn/YOUR-SLUG`. Confirm the lesson is in the path sidebar and that search finds the title.

## 9. Expected result

The lesson is on the path, in search, and in `/sitemap.xml`.

## 10. Common errors

| Error | Fix |
| --- | --- |
| Validate: missing course | `course` must match `courses.json` `id` |
| Validate: missing topic | `topic` must match `platform.json` topics[].id |
| Duplicate slug | Rename the file and the slug |
| Lesson missing from site | `status` is not `published`, or `enabled: false` |

## 11. Troubleshooting

If local shows it but production does not, you skipped `npm run validate` / `npm run build`, or the generated catalog did not run (`prebuild` must run `content:generate`).
