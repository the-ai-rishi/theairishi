---
title: "Day 1 — Shell from zero"
description: "Terminal vs shell, PATH, I/O, exit codes, quoting, and the no-AI rule. Honest scores before any tool worship."
course: "devops-engineer-mastery"
courseTitle: "DevOps Engineer Mastery"
courseOrder: 1
stage: "Foundations"
stageOrder: 1
lesson: 1
day: 1
phase: "phase-01"
program: "devops-engineer-mastery"
topic: "devops"
status: "published"
tags: ["shell", "linux", "foundations", "day-01"]
---

# Day 1 — Shell from zero

This is Day 1 of DevOps Engineer Mastery. The locked plan is in the [devops-engineer-mastery](https://github.com/the-ai-rishi/devops-engineer-mastery) repo. The coverage contract is Phase 01. The full teaching pack lives at `daily-learning/day-01/DAY-01-LEARNING-PACK.md` in that repo.

Today is not Kubernetes. Today is: can you say what actually ran, where you are, and whether it succeeded.

## What today is for

- Write honest scores in `docs/current-skills-gap.md` in the repo (ladder: DISCUSSED → ATTEMPTED → WORKING → TROUBLESHOOTED → INDEPENDENT → DEFENDABLE). Chat is not WORKING.
- Install or confirm a toolchain you can actually use (terminal, Git, editor). Do not dump company PATH or PATs into GitHub.
- Write the no-AI rule in that same skills-gap file: on write days, your v1 is yours. AI may review later. AI does not author the first file.
- Interview line: what you have *operated* versus what you have *authored*.

## Words

**Terminal** is a window. **Shell** is the program that reads commands. **Command** is a name plus arguments. A **program** sits on disk; a **process** is that program while it is running (Day 5).

`pwd` answers “where am I?” That directory is the current working directory. `/abs` is absolute. `rel` is relative to here.

`ls` answers “which names are here?” File vs directory is a real distinction. You will need it on Day 4.

**PATH** is a search list. `command -v foo` answers “which file runs when I type foo?”

stdin / stdout / stderr:

- `>` replaces a file
- `>>` appends
- `2>` is stderr
- `<` reads stdin from a file
- `|` pipes stdout of one command into stdin of the next

`$?` is the last exit code. **0 means success by convention**, not because Bash is magic.

Quoting:

- unquoted — the shell splits and expands
- `'exact'` — literal
- `"$VAR"` — the value of VAR, still one word if you keep the quotes

Glob: `*` `?` `[ab]`.

`NAME=x` exists in this shell. `export NAME=x` is visible to children. Check with `env` and `printenv`.

## Practise

1. Inventory: `pwd`, `ls`, `command -v bash`, `echo $PATH`, `echo $?` after a command that works and one that does not.
2. Start a child shell, `export` one variable and do **not** export another. In the child, print both. Only the exported one should appear. Write down what you saw.
3. Fill the skills-gap file. Do not inflate scores because you have used Azure at work.
4. Write the no-AI rule in that file. One paragraph. Yours.

## Production constraint

No PATs, company PATH dumps, or internal hostnames in the repo.

## AI review (reject this)

“You know Kubernetes because you have used AKS.”

Using a portal is not authorship.

## Interview kill

Show a file **you** wrote with no AI. Then say, out loud, what you have operated versus what you have authored.

## Definition of done

Reading this page is not done. The day is done when the skills-gap file exists, the no-AI paragraph is in it, the child-shell export experiment has evidence, and you can explain PATH, `$?`, and quoting without notes.

Full pack (examples, broken output, expected output): [Day 1 learning pack](https://github.com/the-ai-rishi/devops-engineer-mastery/blob/main/daily-learning/day-01/DAY-01-LEARNING-PACK.md).
