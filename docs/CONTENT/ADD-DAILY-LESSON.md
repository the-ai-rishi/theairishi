# Add a daily lesson

This is the normal publishing job. Tomorrow you add Day 4 by creating one markdown file.

## 1. Confirm the day already exists on the map

Open `content/config/programs.json`. Find the day object. Example for Day 4:

- `day`: 4
- `phaseId`: `phase-01`
- `slug`: `day-04`
- `title` / `summary`: already copied from the 120-day execution plan

If the day is missing, stop. Add it to `programs.json` from the mastery repo first. Do not invent a title.

## 2. Create the file

Exact path:

```
content/lessons/day-04.md
```

Filename format: `day-NN.md` with two digits. Copy `templates/lesson-template.md`.

Do **not** put daily lessons (or any public lesson) under `content/courses/`. That folder is not a `/learn` source. Course grouping lives in `content/config/courses.json`.

## 3. Required frontmatter

| Field | Allowed values | Required |
| --- | --- | --- |
| `title` | Same idea as `programs.json` `days[].title` | yes |
| `description` | One short paragraph for listings and search | yes |
| `course` | `devops-engineer-mastery` | yes |
| `courseTitle` | `DevOps Engineer Mastery` | yes |
| `courseOrder` | `1` | recommended |
| `stage` | The phase name, e.g. `Foundations` | yes |
| `stageOrder` | Phase number, e.g. `1` | yes |
| `lesson` | Same number as `day` for this program | yes |
| `day` | Number `1`–`120` | yes |
| `phase` | An existing `phases[].id` such as `phase-01` | yes |
| `program` | `devops-engineer-mastery` | yes |
| `topic` | `devops` | yes |
| `status` | `published` (or `draft` to keep it off the site) | yes |
| `tags` | List of strings, include `day-04` | optional |
| `enabled` | `true` / `false` | optional, default true |

Optional: `duration` (e.g. `25 min`).

## 4. Exact example (Day 4)

```yaml
---
title: "Day 4 - Permissions as an incident"
description: "namei -l, uid/gid, file 640 vs directory 755. Why chmod 777 is not a fix."
course: "devops-engineer-mastery"
courseTitle: "DevOps Engineer Mastery"
courseOrder: 1
stage: "Foundations"
stageOrder: 1
lesson: 4
day: 4
phase: "phase-01"
program: "devops-engineer-mastery"
topic: "devops"
status: "published"
tags: ["linux", "permissions", "foundations", "day-04"]
---
```

Use the real Day 4 title from `programs.json`, not this sample, if they differ.

## 5. Body

Write a real lesson the learner can finish here: words, practice, production constraint, the lie to reject, the interview kill.

Do **not** tell them to open files in the private authoring repository (`daily-learning/...`, `docs/current-skills-gap.md`, `roadmap/...`). This website is the front door. See [LEARNER-MAPPING.md](./LEARNER-MAPPING.md).

Do **not** link that repository. Learners finish the day here.

## 6. Where it appears

After the next build:

- `/learn/day-04` - the lesson
- `/learn` - under Published days and under Phase 01
- Homepage program/phases counts go up by one
- Search for `day 4` or `permissions`
- Sitemap

Unpublished days (5–120 until you add files) stay titles without links.

## 7. Preview and validate

```bash
npm run validate
npm run dev
```

Open `/learn/day-04`. Search for `day 4`. Confirm `/learn/day-05` is still not a page.

To keep a file off the site while drafting: `status: "draft"` or `enabled: false`.

## 8. Deploy

```bash
npm run lint
npm run build
```

Then push the branch. Vercel and Cloudflare both rebuild from the generated catalog. You do not copy files onto the server.

## 9. Common mistakes

| What went wrong | Fix |
| --- | --- |
| `ERROR: Lesson "day-04" references phase "phase-99"` | Set `phase` to `phase-01` (or the phase listed for that day in `programs.json`) |
| `ERROR: Two lessons both claim day 4` | Only one published file may have `day: 4` |
| `ERROR: Lesson is day 4 but course is "devops"` | Set `course` to `devops-engineer-mastery` |
| Validate wants 120 days | Do not delete day objects from `programs.json` just because they have no lesson file yet |
| I edited a React component | Put the file back. Daily publishing is markdown only |
| I invented Day 13 | Copy the title from `programs.json` / the mastery repo |

## 10. What you do not edit

- `app/`
- `components/`
- `lib/content-data.generated.ts`
- `main` (work on `feature/new-upgrade` until you choose to merge)


## Draft, hidden, omitted status

| Frontmatter | What happens |
| --- | --- |
| `status: published` | Public `/learn/day-NN` if the other required fields are present |
| `status: draft` (or `coming-soon`) | File can exist. Not a public page, not search, not sitemap |
| `enabled: false` | Hidden even if status is published |
| **omit `status`** | Not public. Publishing requires an explicit status |

`title`, `stage`, `course`, `lesson`, and `status` are the publication fields. `day` / `phase` / `program` bind it to the 120-day map.

After saving: `npm run validate`, then open `/learn/day-NN`. Search for `day N`. The homepage published count includes it. Unpublished days stay titles on `/learn`.
