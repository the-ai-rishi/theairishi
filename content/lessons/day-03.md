---
title: "Day 3 - Merge vs rebase"
description: "Diverged branches, fast-forward, merge commits, three-way conflicts, abort, and when rebase is forbidden."
course: "devops-engineer-mastery"
courseTitle: "DevOps Engineer Mastery"
courseOrder: 1
stage: "Foundations"
stageOrder: 1
lesson: 3
day: 3
phase: "phase-01"
program: "devops-engineer-mastery"
topic: "devops"
status: "published"
estimatedMinutes: 45
outcomes:
  - draw diverged branches and name the common ancestor
  - produce and abort a real merge conflict
  - abort a rebase on a private branch
  - say when rebase is forbidden on shared main
tags: ["git", "merge", "rebase", "foundations", "day-03"]
---

# Day 3 - Merge vs rebase

This is Day 3 of DevOps Engineer Mastery. Today: a real conflict, abort, and when rebase is forbidden. Private branch only for rebase practice.

## Words

A **branch** is a name on a commit. Branches **diverge** when each side adds commits after a **common ancestor**.

```text
main:    A---B
              \
feature:       C---D     ancestor = B
```

**Fast-forward** slides the name. **Merge commit** is a new commit with two parents. **Three-way** merge needs ours + theirs + ancestor - that is why conflicts exist.

Rebase replays as **new SHAs**:

```text
A---B---C'---D'
```

People who already pulled C and D still have the old IDs. That is why rebasing shared `main` is dangerous.

`merge --abort` / `rebase --abort` / `rebase --continue` (after `add`). Ours/theirs feel reversed on rebase - read the file, do not memorise a flag.

## Practise

1. Draw the graph first. If you cannot point at the ancestor, you are guessing.
2. Create a real conflict. Merge it. Abort a merge once so you know the command exists.
3. On a **private** branch only: rebase, hit a conflict, abort once, then continue correctly.
4. Write one sentence: when rebase is forbidden.

## Production

Do not rebase published default branches.

## AI review (reject this)

Unread `checkout --theirs .`

## Interview kill

Rebase `main` that twelve people already pulled.

## Definition of done

You can draw diverge / ancestor / fast-forward / merge commit / rebase-as-new-SHAs. You created and aborted a conflict. You can say when rebase is forbidden without hedging.
