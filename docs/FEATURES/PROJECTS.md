# PROJECTS

## PURPOSE


Operator guide for this repository, not a generic CMS.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Projects


Projects are lab write-ups. Folder: content/projects/*.md. Loader: lib/projects.ts. Route: /projects and /projects/SLUG. Content type id: projects, url /projects, status active.

Homepage instance id projects-list is a content-list with format project. Title Labs. Presentation lab. Anchor id build.

There is a separate topics[] row id projects that is planned and hidden. The live Labs block uses the projects content type, not that topic row.

Do not put placeholder github.com or instagram.com roots in githubUrl or demoUrl. validate.js fails those.

Live file: autonomous-research-agent.md. Add more markdown to grow Labs. Disable the content type to hide the whole format.

## COMPLETE EXAMPLE

---
title: "A public lab write-up"
description: "What was built and why it is on the site."
slug: "a-public-lab-write-up"
date: "2026-09-03"
category: "Artificial Intelligence"
technologies: ["TypeScript", "LLMs"]
difficulty: "Intermediate"
status: "Completed"
featured: false
topic: "ai"
enabled: true
---

# A public lab write-up

Projects are lab write-ups, not a project tracker. status here is the lab badge (Completed, In Progress, or Planned). Hide a lab with enabled: false, not by changing the badge.

Do not set githubUrl or demoUrl to a site root such as https://github.com. Omit those fields until you have a real repository or demo URL.

## VALIDATION


See OPERATIONS/VALIDATION.md. Run the validate script, open the route, search if public.

## COMMON MISTAKES


Do not invent YouTube or Instagram items. Do not crop brand PNG or JPG. Do not reintroduce switch(section.id). Do not leak coming-soon in the public UI. There is no Python content.

## TROUBLESHOOTING


| Symptom | Cause | Fix |
| --- | --- | --- |
| Route 404 | type or topic not enabled+active with content | keep it hidden or add real content |
| Missing homepage block | showWhenEmpty false and empty | add content or leave hidden |
| validate fails | active course with 0 lessons | set status coming-soon or add lessons |

## HOW TO UNDO


Restore the JSON or markdown files with git restore, or git revert the commit. Do not force-push.
