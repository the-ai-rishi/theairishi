# DevOps Engineer Mastery

## Purpose

This site publishes the 120-day DevOps Engineer Mastery plan. The source of truth for the plan is the GitHub repository, not this website:

https://github.com/the-ai-rishi/devops-engineer-mastery

Do not invent curriculum here. Copy titles and phase names from that repo’s locked execution plan (`roadmap/120-day-execution.md`). Website titles are short headlines of those days, not a rewritten plan.

`lib/program-schema.js` is the only validator for `programs.json`. Runtime uses the same file.

## What lives where

| Piece | In the mastery repo | On this website |
| --- | --- | --- |
| Authority chain | `START-HERE.md` → execution plan → phase file → daily pack → evidence | Learner front door is `/learn`. See [LEARNER-MAPPING.md](./CONTENT/LEARNER-MAPPING.md) |
| 11 phases + 120 day titles | `roadmap/120-day-execution.md` | `content/config/programs.json` |
| Teaching pack for a day | `daily-learning/day-NN/DAY-NN-LEARNING-PACK.md` | Teach on `/learn/day-NN`. Do not send learners into that folder |
| Personal baseline | `docs/current-skills-gap.md` | **Your Starting Assessment** on Day 1. Never publish the author file |
| Public lesson | - | `content/lessons/day-NN.md` |
| Unpublished days | Planned titles | Titles on `/learn`, **no page**, **no link** |
| Salary / LPA / job claims | Internal career notes | **Never** on this site |

## Current public state

- Program id: `devops-engineer-mastery`
- Current phase: `phase-01` (Foundations, days 1–12)
- Published on this site: Days 1–3
- Start URL: `/learn/day-01`
- Hub URL: `/learn`

Days 4–120 are roadmap titles only until you add a markdown file.

## How a day becomes public

1. Confirm the day already exists in `content/config/programs.json` (it should: all 120 titles are already there).
2. Create `content/lessons/day-NN.md` from `templates/lesson-template.md`.
3. Set `day`, `phase`, `program`, `course`, `topic` to match the program map.
4. Write a real lesson. Link the GitHub pack. Do not paste the 35KB pack into the site.
5. Run `npm run validate`, then preview `/learn/day-NN`.

Full steps: [CONTENT/ADD-DAILY-LESSON.md](./CONTENT/ADD-DAILY-LESSON.md).

## Phases (locked)

| Phase | Days | Name |
| --- | --- | --- |
| 01 | 1–12 | Foundations |
| 02 | 13–18 | Azure networking + identity |
| 03 | 19–26 | Write CI |
| 04 | 27–28 | First Terraform |
| 05 | 29–36 | Containers + app |
| 06 | 37–62 | Kubernetes |
| 07 | 63–76 | AKS |
| 08 | 77–88 | Terraform + Helm |
| 09 | 89–96 | Operate |
| 10 | 97–108 | Design + resume |
| 11 | 109–120 | War room |

If a phase name in `programs.json` disagrees with the mastery repo, the repo wins. Edit JSON. Do not “improve” the names.

## What learners actually do

A day is not a video.

1. Understand - read the words, predict before you run.
2. Do - attempt the core task. On write days, no AI for v1.
3. Break - break one thing safely, write what you saw.
4. Prove - evidence in a file. Chat is not evidence.
5. Defend - what fails, how you troubleshoot it, the trade-offs, how it lands on the capstone.

## Future tracks

The platform order is DevOps → AI → Agentic AI. Those later stages are `futurePath` in `platform.json`. They render as later/dark until you give them real content and set `status: "active"` with an `href`.

Do not add empty AI course cards because the brand contains “AI”.
