# Authoring

Markdown files start with a YAML frontmatter block between triple dashes.

## Lesson
Required: title, course, stage, lesson (number), topic, description. Optional: courseTitle, courseOrder, stageOrder, tags, duration, status (published or draft), enabled (true/false). Put files in content/lessons/ or content/courses/<course-id>/.

## Guide
Required: title, description, slug, date. Optional: category, tags, readTime, author, featured, topic, status, enabled. Folder: content/guides/.

## Project
Required: title, description, slug, date. Optional: category, technologies, difficulty, featured, topic. Do not use placeholder github.com or instagram.com site-root URLs. For draft/hide use enabled false or a draft/archived/disabled visibility status, not the Completed/In Progress project badge.

## Topic and course
Topics are JSON objects, not markdown. Courses are rows in content/config/courses.json: id, slug, title, description, topic, status, enabled, order. coming-soon courses may show on /learn as coming-soon cards, not as fake homepage theater. Active courses must have lessons.

## Media item
content/media/<channel-id>.json is an array of objects with id, title, publishedAt, and a real url field. Empty array means coming-soon.

## Draft, publish, hide
published or active: public. draft, archived, disabled, planned, paused: not public. enabled false: nowhere. coming-soon: small route optional, not search, not sitemap, not large homepage sections.

## Lesson frontmatter example
title: What is Python. course: python. stage: Basics. stageOrder: 1. lesson: 1. topic: python. status: published. description: One short paragraph.
