# Learner mapping

The mastery GitHub repository is the **authoring** source of truth. This website is the **learner's front door**.

A visitor should complete Day N here. They should not have to clone a repo, find `daily-learning/`, or open the author's personal files.

## Where things live

| What | Where |
| --- | --- |
| Source curriculum (titles, packs, labs) | `https://github.com/the-ai-rishi/devops-engineer-mastery` |
| Learner-facing days | `content/lessons/day-NN.md` |
| 120-day map copy | `content/config/programs.json` |
| Path → learner concept table | `content/config/learner-surface.json` |
| Validation | `lib/learner-surface.js`, run by `npm run validate` |

## Source file → learner concept

| In the mastery repo | On this website |
| --- | --- |
| `START-HERE.md` | Start Here → `/learn/day-01` |
| `docs/current-skills-gap.md` | **Your Starting Assessment** (on-site exercise). Author-only. Never publish the file. |
| `roadmap/120-day-execution.md` | 120-Day Roadmap → `/learn` |
| `daily-learning/day-NN/...` | Day N Lesson → `/learn/day-NN` |
| `labs/` | Practice Labs (write the lab into the lesson; do not send people to the folder) |
| `break-fix/` | Debugging Challenges (same) |
| `interview-preparation/` | Interview Practice (same) |
| `templates/` | Templates & Resources (on-site copy/download, not a repo path) |

## How to add Day N

1. Confirm the day title exists in `content/config/programs.json` (copied from the locked plan).
2. Create `content/lessons/day-NN.md` from `templates/lesson-template.md`.
3. Write the lesson as something a person can finish in the browser and their own terminal.
4. Do **not** tell them to open `docs/current-skills-gap.md`, `daily-learning/...`, or `roadmap/...`.
5. If they may want the source repo, the site already offers it as an optional note: "Want the full source repository?"
6. `npm run validate`
7. Preview `/learn/day-NN`

Full publishing steps: [ADD-DAILY-LESSON.md](./ADD-DAILY-LESSON.md).

## How to reference a practice exercise

Put the exercise on the page (steps, a template, or an on-site component). Day 1 uses:

```yaml
exercise: starting-assessment
```

That renders **Your Starting Assessment**. Scores stay in the browser (`localStorage`). No accounts. No database.

Future authenticated progress can read the same exercise id without rewriting the curriculum.

## How to expose an optional GitHub resource

Point at the **repository root**, as optional copy, never as the way to finish the day:

> Want the full source repository? View the DevOps Engineer Mastery repository. Optional. Not required to finish the day.

Do not link `blob/main/daily-learning/...` or `docs/current-skills-gap.md` from public lessons.

## How to avoid author-only / personal files

`docs/current-skills-gap.md` in the mastery repo is the author's personal baseline. It must not appear in:

- public lesson/guide/project markdown
- JSON-LD
- search
- sitemap
- navigation

Validate fails if it leaks.

## How to validate before deployment

```bash
npm run validate
```

Expected: `ALL CHECKS PASSED`.

If you see `surfaces author-only path` or `mentions internal repository path`, rewrite that sentence into a learner-facing step or drop it.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Validate mentions `docs/current-skills-gap.md` | Public markdown told learners to open the author's file | Use Your Starting Assessment |
| Validate mentions `daily-learning/` | Lesson still links the teaching pack path | Teach on the page; optional GitHub is the repo root |
| Learner asks "where is this file?" | Internal path leaked into copy | Map it using the table above |
| Scores vanished | Different browser/device; localStorage only | Copy or download the template |
