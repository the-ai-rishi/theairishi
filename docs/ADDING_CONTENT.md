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
