---
title: "Day 2 - Git recovery"
description: "Worktree, index, commit, HEAD. Then reset --hard, reflog, revert a middle commit, and restore a deleted branch."
course: "devops-engineer-mastery"
courseTitle: "DevOps Engineer Mastery"
courseOrder: 1
stage: "Foundations"
stageOrder: 1
lesson: 2
day: 2
phase: "phase-01"
program: "devops-engineer-mastery"
topic: "devops"
status: "published"
tags: ["git", "foundations", "day-02"]
---

# Day 2 - Git recovery

Coverage is locked in Phase 01 of [DevOps Engineer Mastery](https://github.com/the-ai-rishi/devops-engineer-mastery). Practise on a throwaway repo. Do not force-push course `main`. Do not practise destructive Git on a work remote.

## Happy path first

Worktree = files you edit. Index/staging = the next snapshot. Commit = snapshot + parent + SHA. The repo holds objects and names.

```text
worktree -git add→ index -git commit→ commit ← branch name
                                              ↑
                                            HEAD
```

Do this before any recovery:

1. Create a file
2. `git status`
3. `git add`
4. `git commit`
5. Change the file
6. `git log`
7. Make a branch
8. Look at HEAD
9. Draw reachable vs unreachable

If you cannot draw that, stop. Recovery will just be muscle memory.

## Three different undos

They are not synonyms.

- **reset** moves the branch name / HEAD. `--hard` also wipes the worktree. Throwaway only.
- **revert** makes a *new* commit that reverses an old one. This is what you do on shared `main`.
- **restore** puts file bytes back. It does **not** undelete a branch name.
- **reflog** is this clone’s “where HEAD was.” It is local.

Fetch vs pull: pulling is fetch plus integrate. A local revert is not “the team has it” until it is pushed.

## Locked practice

On a throwaway repo:

1. Happy path above.
2. `reset --hard` on a private branch. Predict HEAD *before* you run it. Then check.
3. Revert a middle commit (two good commits on top of a bad one). Push the revert, not a force.
4. Delete a branch name. Restore it from reflog. Notice that restore-the-file is a different verb.

## Production

No destructive Git on shared or work remotes. Never `reset --hard origin/main && push --force` as a first answer on shared main.

## AI review (reject this)

`reset --hard origin/main && push --force` as the opening move when twelve people already pulled `main`.

## Interview kill

Two good commits **on top of** the bad one. “I reverted so the team is fixed” is false until they have the revert commit.

## Definition of done

You can explain reset vs revert vs restore. You predicted HEAD before a reset. You recovered a deleted branch from reflog. You did not force-push `main`.

Full pack: [Day 2 learning pack](https://github.com/the-ai-rishi/devops-engineer-mastery/blob/main/daily-learning/day-02/DAY-02-LEARNING-PACK.md).
