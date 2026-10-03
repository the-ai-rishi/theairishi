---
title: "Day 1 - Contract, repo, honesty"
description: "A small repository, the first commit, and the difference between a claim and evidence."
course: "devops-engineer-mastery"
courseTitle: "FORGE-120"
courseOrder: 1
stage: "Foundations"
stageOrder: 1
lesson: 1
day: 1
phase: "phase-01"
program: "devops-engineer-mastery"
topic: "devops"
status: "published"
exercise: "starting-assessment"
estimatedMinutes: 50
outcomes:
  - explain working tree, staging area, and commit
  - separate a claim from evidence you can show
  - make an inspectable first commit
  - record one honest gap
tags: ["git", "evidence", "foundations", "day-01"]
---

# Day 1 - Contract, repo, honesty

This is Day 1 of FORGE-120. The capstone thread starts here: a small repository, a first commit, and one thing you cannot yet prove.

Today is not Kubernetes, and it is not a model. Today is the contract: what you ran, where you are, and whether the claim matches the evidence.

## What today is for

- Create or use `projects/forge-api/` and make one small text file.
- Inspect where you are, stage the file, commit it, and read the history.
- Write one gap you cannot demonstrate. A tracker tick is not proof.
- Label the result operated, generated, simulated, or blocked. Do not upgrade a claim into evidence.

## Words

**Terminal** is a window. **Shell** is the program that reads commands. **Command** is a name plus arguments. A **program** sits on disk; a **process** is that program while it is running (Day 5).

`pwd` answers "where am I?" That directory is the current working directory. `/abs` is absolute. `rel` is relative to here.

`ls` answers "which names are here?" File vs directory is a real distinction. You will need it on Day 4.

**PATH** is a search list. `command -v foo` answers "which file runs when I type foo?"

stdin / stdout / stderr:

- `>` replaces a file
- `>>` appends
- `2>` is stderr
- `<` reads stdin from a file
- `|` pipes stdout of one command into stdin of the next

`$?` is the last exit code. **0 means success by convention**, not because Bash is magic.

Quoting:

- unquoted - the shell splits and expands
- `'exact'` - literal
- `"$VAR"` - the value of VAR, still one word if you keep the quotes

Glob: `*` `?` `[ab]`.

`NAME=x` exists in this shell. `export NAME=x` is visible to children. Check with `env` and `printenv`.

## Practise

1. Inventory: `pwd`, `ls`, `command -v bash`, `echo $PATH`, `echo $?` after a command that works and one that does not.
2. Start a child shell, `export` one variable and do **not** export another. In the child, print both. Only the exported one should appear. Write down what you saw.
3. Fill Your Starting Assessment. Do not inflate scores because you have used a cloud portal at work.
4. Write the no-AI rule in that assessment. One paragraph. Yours.

## Production constraint

No tokens, company PATH dumps, or internal hostnames in anything you publish.

## AI review (reject this)

"You know Kubernetes because you have used AKS."

Using a portal is not authorship.

## Interview kill

Show a file **you** wrote with no AI. Then say, out loud, what you have operated versus what you have authored.

## Definition of done

Reading this page is not done. The day is done when your starting assessment is saved, the no-AI paragraph is in it, the child-shell export experiment has evidence, and you can explain PATH, `$?`, and quoting without notes.
