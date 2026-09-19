# Learner mapping

The mastery GitHub repository is a **private authoring** source. This website is the **learner's front door**.

A visitor should complete Day N here. They should not clone a repo, find `daily-learning/`, or open the author's personal files. They must never be given a public link to the authoring repository.

## Where things live

| What | Where |
| --- | --- |
| Private authoring curriculum (titles, packs, labs) | Operator-only. Never a public learner destination. See [DEVOPS-ENGINEER-MASTERY.md](../DEVOPS-ENGINEER-MASTERY.md) |
| Learner-facing days | `content/lessons/day-NN.md` |
| 120-day map copy | `content/config/programs.json` |
| Path → learner concept table | `content/config/learner-surface.json` |
| Validation | `lib/learner-surface.js`, run by `npm run validate` |

## Source file → learner concept

These are conceptual mappings. They resolve to website pages, on-site exercises, or copy/download templates. They must **not** resolve to GitHub URLs.

| In the private authoring repo | On this website |
| --- | --- |
| `START-HERE.md` | Start Here → `/learn/day-01` |
| `docs/current-skills-gap.md` | **Your Starting Assessment** (on-site exercise). Author-only. Never publish the file. |
| `roadmap/120-day-execution.md` | 120-Day Roadmap → `/learn` |
| `daily-learning/day-NN/...` | Day N Lesson → `/learn/day-NN` |
| `labs/` | Practice Labs (write the lab into the lesson) |
| `break-fix/` | Debugging Challenges (same) |
| `interview-preparation/` | Interview Practice (same) |
| `templates/` | Templates & Resources (on-site copy/download) |

## How to add Day N

1. Confirm the day title exists in `content/config/programs.json` (copied from the locked plan).
2. Create `content/lessons/day-NN.md` from `templates/lesson-template.md`.
3. Write the lesson as something a person can finish in the browser and their own terminal.
4. Do **not** tell them to open `docs/current-skills-gap.md`, `daily-learning/...`, or `roadmap/...`.
5. Do **not** link the private authoring repository. Not the root. Not a pack file. Not "optional GitHub".
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

## The authoring repository is not public

There is no public GitHub CTA for the mastery repo. Do not add `repoUrl` to `programs.json`. Do not add an OptionalSourceNote. Do not put that repository in `social[]`, JSON-LD `sameAs`, footer, About, navigation, or sitemap.

Validate fails if public content contains `the-ai-rishi/devops-engineer-mastery` (root, blob, tree, raw, or any other path).

## How to avoid author-only / personal files

`docs/current-skills-gap.md` in the authoring repo is the author's personal baseline. It must not appear in:

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

If you see `surfaces author-only path`, `mentions internal repository path`, or `private mastery authoring repository`, rewrite that sentence into a learner-facing step or drop it.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Validate mentions `docs/current-skills-gap.md` | Public markdown told learners to open the author's file | Use Your Starting Assessment |
| Validate mentions `daily-learning/` | Lesson still links the teaching pack path | Teach on the page |
| Validate mentions `devops-engineer-mastery` as a GitHub URL | Public content linked the private authoring repo | Delete the link. There is no public GitHub destination for that repo |
| Learner asks "where is this file?" | Internal path leaked into copy | Map it using the table above |
| Scores vanished | Different browser/device; localStorage only | Copy or download the template |
