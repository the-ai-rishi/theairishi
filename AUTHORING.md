# The AI Rishi — Authoring & Content Guide

This document provides the complete, authoritative reference for adding lessons, courses, articles, projects, YouTube videos, and Instagram visual notes to **The AI Rishi** platform.

The application architecture is **100% data-driven**. Adding new content requires creating or updating Markdown or JSON files under the `content/` directory. **You do NOT need to modify React or TypeScript code to add content.**

---

## 1. Adding a New Lesson

### File Location
Save your lesson Markdown file in either of these locations:
- **Course-nested (Recommended):** `content/courses/<course-id>/<lesson-slug>.md`
- **Flat directory:** `content/lessons/<lesson-slug>.md`

*Example:* `content/courses/ai/llm-fundamentals-09.md`

### Canonical Frontmatter Example
```yaml
---
title: "Self-Attention Mathematics"
description: "Deep dive into Query, Key, and Value matrix transformations."
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "LLM Fundamentals"
stageOrder: 2
lesson: 9
tags: ["Transformer", "Self-Attention", "Linear Algebra"]
duration: "20 min"
---

# Self-Attention Mathematics

Every transformer layer computes self-attention using three vector projections...

> [!NOTE]
> Query, Key, and Value matrices project input embeddings into dedicated vector spaces.

## Query, Key, and Value Projections
...
```

### Frontmatter Fields Reference
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | Lesson display title. |
| `description` | `string` | **Yes** | Short summary used for SEO, cards, and search previews. |
| `course` | `string` | **Yes** | Unique course ID slug (e.g. `ai`, `devops`, `kubernetes`). |
| `courseTitle` | `string` | Optional | Human-readable course title (defaults to `course`). |
| `courseOrder` | `number` | Optional | Integer controlling order of courses on `/learn` (1 = first). |
| `stage` | `string` | **Yes** | Stage/module grouping name (e.g. `LLM Fundamentals`). |
| `stageOrder` | `number` | Optional | Integer controlling order of stages within the course. |
| `lesson` | `number` | **Yes** | Sequential integer position of the lesson within its stage. |
| `tags` | `string[]` | Optional | Array of topic keywords. |
| `duration` | `string` | Optional | Estimated reading time. |

---

## 2. How the Platform Auto-Discovers Content

1. **Course Discovery:** `lib/lessons.ts` scans `content/courses/` and `content/lessons/` recursively. Courses are grouped automatically by `course` ID.
2. **Course Cards on `/learn`:** Course cards, total lesson counts, and categories render dynamically based on discovered frontmatter.
3. **Stage & Sidebar Syllabus:** Lessons are grouped under their `stage` and ordered by `stageOrder` and `lesson`.
4. **Previous / Next Navigation:** Computed automatically across lessons within the same course.
5. **Search Index:** `lib/search.ts` indexes all lessons dynamically for `⌘K` search.
6. **Sitemap Generation:** `app/sitemap.ts` includes every lesson route in `/sitemap.xml`.
7. **SEO Metadata:** `generateMetadata` in `app/learn/[slug]/page.tsx` auto-populates OpenGraph, Twitter cards, and page titles.
8. **Progress Tracking:** Local browser `localStorage` updates lesson progress without needing backend API calls.

---

## 3. How to Add a New Course
Simply create your first lesson file under a new course directory:
`content/courses/kubernetes/kubernetes-01.md`
```yaml
---
title: "Kubernetes Core Concepts"
course: "kubernetes"
courseTitle: "Kubernetes & Cloud Native"
courseOrder: 3
stage: "Kubernetes Basics"
stageOrder: 1
lesson: 1
description: "Understand Pods, Deployments, and Services."
---
```
The course `Kubernetes & Cloud Native` will immediately appear on `/learn` with 1 lesson.

---

## 4. How to Add a Technical Guide / Article
Create a Markdown file in `content/guides/<slug>.md`:
```yaml
---
title: "Building Resilient Microservices"
description: "Circuit breakers, retry strategies, and rate limiting."
slug: "building-resilient-microservices"
date: "2026-08-16"
category: "DevOps"
tags: ["Microservices", "Resilience"]
readTime: 7
author: "The AI Rishi"
featured: true
---

# Building Resilient Microservices
...
```
The guide automatically routes to `/guides/building-resilient-microservices` and appears on `/guides`.

---

## 5. How to Add an Open Source Project / Lab
Create a Markdown file in `content/projects/<slug>.md`:
```yaml
---
title: "Kubernetes Operator in Go"
description: "A custom controller for managing PostgreSQL databases."
slug: "kubernetes-operator-go"
date: "2026-08-16"
category: "DevOps"
technologies: ["Go", "Kubernetes", "Docker"]
difficulty: "Advanced"
githubUrl: "https://github.com"
status: "Completed"
---

# Kubernetes Operator in Go
...
```
The project automatically routes to `/projects/kubernetes-operator-go` and appears on `/projects`.

---

## 6. How to Add YouTube & Instagram Media
- **YouTube:** Append entries to `content/media/youtube.json`
- **Instagram:** Append entries to `content/media/instagram.json`

---

## 7. Local Testing & Verification
Before pushing changes:
```bash
# 1. Run local dev server
npm run dev

# 2. Verify production build
npm run build
```
`npm run build` will prerender all static routes and report any frontmatter validation errors.
