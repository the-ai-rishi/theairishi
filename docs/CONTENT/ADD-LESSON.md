# ADD LESSON

## PURPOSE


Add a published lesson markdown file that the live catalog will count.

## WHEN TO USE


Use this when changing this area of The AI Rishi.

## PREREQUISITES


Repo cloned.

## WHERE


Kernel: lib/visibility-core.js. Config: content/config/platform.json. Content: content/lessons, content/courses, content/guides, content/projects, content/media.

## STEP-BY-STEP


# Adding content


YAML frontmatter between triple dashes.

## Lesson (content/lessons or content/courses/COURSE_ID)


title: What is Python
course: python
courseTitle: Python
courseOrder: 1
stage: Basics
stageOrder: 1
lesson: 1
topic: python
status: published
description: One short paragraph.

Optional: tags, duration, enabled.

## Guide (content/guides)


title: First-principles debugging
description: A short stand-alone essay.
slug: first-principles-debugging
date: 2026-09-01
category: Engineering
tags: [Debugging]
readTime: 6
author: The AI Rishi
featured: true
topic: ai
status: published

## Project (content/projects)


title: Research agent
description: A lab write-up.
slug: research-agent
date: 2026-09-01
category: Artificial Intelligence
technologies: [TypeScript, LLMs]
difficulty: Intermediate
status: Completed
featured: true
topic: ai
enabled: true

Do not use placeholder github.com or instagram.com site-root URLs. Hide with enabled false, not the Completed badge.

## Future media item (content/media/youtube.json)


[ { "id": "yt-1", "title": "Attention from scratch", "publishedAt": "2026-09-01", "url": "https://www.youtube.com/watch?v=REAL_ID", "duration": "12:04" } ]

Empty array means the channel must stay coming-soon. See YOUTUBE_AND_INSTAGRAM.md.

## COMPLETE EXAMPLE

---
title: "What is this lesson about?"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "AI Fundamentals"
stageOrder: 1
lesson: 16
topic: "ai"
status: "published"
description: "One short paragraph that appears in listings and search."
---

# What is this lesson about?

Write the lesson body in GitHub-flavored markdown. The H1 can match `title`.

## Why this matters

Explain the idea from first principles.

## Practice

<details class="practice-card">
<summary>A question the reader should be able to answer</summary>
<div class="practice-body">

The answer, with the reasoning.

</div>
</details>

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
