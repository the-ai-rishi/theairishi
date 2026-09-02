# The AI Rishi — Content Authoring Guide

This guide explains how to author new content across all formats on **The AI Rishi** platform.

---

## 1. Adding a New Course Lesson

Create a Markdown file in `content/lessons/` or `content/courses/<course-id>/`:

**Example:** `content/lessons/devops-kubernetes-01.md`

```markdown
---
title: "Kubernetes Architecture from First Principles"
description: "Understand the control plane, kube-apiserver, etcd, kubelet, and CRI container runtime."
course: "devops"
stage: "Container Orchestration"
lesson: 1
duration: "15 min"
tags: ["Kubernetes", "DevOps", "Containers"]
enabled: true
status: "published"
---

# Kubernetes Architecture from First Principles

Your lesson content in Markdown...
```

### Frontmatter Fields:
- `course`: Matches the `id` in `content/config/courses.json` (e.g. `ai`, `devops`, `cloud`).
- `stage`: Name of the stage within the course.
- `lesson`: Integer lesson number within the stage.
- `status`: `"published"` or `"draft"`.

---

## 2. Adding a Technical Guide / Architecture Article

Create a Markdown file in `content/articles/` or `content/guides/`:

**Example:** `content/articles/rag-architecture-deep-dive.md`

```markdown
---
title: "Production RAG Architecture: Vector DBs, Hybrid Search & Reranking"
description: "A comprehensive guide to building resilient retrieval-augmented generation pipelines."
category: "Artificial Intelligence"
date: "2026-08-20"
readTime: 8
tags: ["RAG", "Vector DB", "LLM", "Python"]
published: true
---

# Production RAG Architecture

Guide content goes here...
```

---

## 3. Adding an Open-Source Project / Lab

Create a Markdown file in `content/projects/`:

**Example:** `content/projects/multi-agent-orchestrator.md`

```markdown
---
title: "Autonomous Multi-Agent Task Orchestrator"
description: "An open-source Python framework for multi-agent collaboration with tool calling."
category: "AI & Agents"
status: "Production Ready"
technologies: ["Python", "OpenAI API", "Docker", "FastAPI"]
githubUrl: "https://github.com/theairishi/multi-agent-orchestrator"
demoUrl: "https://theairishi.com"
featured: true
---

# Project Architecture & Setup

Detailed documentation...
```

---

## 4. Adding YouTube Videos

Edit `content/media/youtube.json`:

```json
[
  {
    "id": "intro-to-llms",
    "title": "LLM Architecture Explained Simply",
    "description": "How transformer attention mechanisms work underneath.",
    "publishedAt": "Aug 2026",
    "duration": "18:42",
    "youtubeUrl": "https://youtube.com/watch?v=example",
    "tags": ["AI", "Transformers", "Architecture"],
    "featured": true
  }
]
```

---

## 5. Adding Instagram Visual Notes

Edit `content/media/instagram.json`:

```json
[
  {
    "id": "k8s-pod-lifecycle",
    "title": "Kubernetes Pod Lifecycle Visualized",
    "caption": "From Pending to Running: What happens under the hood.",
    "publishedAt": "Aug 2026",
    "type": "Carousel",
    "instagramUrl": "https://instagram.com/p/example",
    "likes": 420,
    "featured": true
  }
]
```
