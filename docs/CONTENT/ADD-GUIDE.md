# Add a guide / essay

## 1. What this system does

Publishes a stand-alone essay at `/guides/YOUR-SLUG`. Live essays appear on the homepage Writing section, in search, and in the sitemap.

## 2. When I need it

You have a finished essay. Do not publish an outline.

## 3. Exact file to create

`content/guides/YOUR-SLUG.md`

Copy `templates/guide-template.md`.

## 4. Fields to set

| Field | Allowed values | Required |
| --- | --- | --- |
| `title` | Plain text | yes |
| `description` | One or two sentences | yes |
| `slug` | URL slug, unique | yes |
| `date` | `YYYY-MM-DD` | yes |
| `category` | Short label, e.g. `Learning Strategies` | yes |
| `topic` | `ai` / `devops` / another live topic id | yes |
| `status` | `published` / `draft` / `archived` | yes |
| `author` | Defaults to The AI Rishi | optional |
| `readTime` | Number of minutes | optional |
| `featured` | `true` / `false` | optional |
| `tags` | List of strings | optional |
| `enabled` | `true` / `false` | optional |

## 5. Example

```yaml
---
title: "First-Principles AI Engineering: How to Learn Without Getting Overwhelmed"
description: "A mental framework for learning AI systems from the building blocks."
slug: "first-principles-ai-learning"
date: "2026-08-16"
category: "Learning Strategies"
tags: ["Mental Models", "AI Engineering"]
readTime: 6
author: "The AI Rishi"
topic: "ai"
status: "published"
featured: true
---
```

## 6. What NOT to change

- Do not invent a `/articles` or `/blog` folder. Essays live in `content/guides`.
- Do not change an existing slug after it has been public.

## 7. Commands

```bash
npm run validate
npm run dev
```

## 8. How to validate

Open `/guides/YOUR-SLUG` and `/guides`. Confirm the homepage Writing section shows it if `featured` or it is the latest published essay.

## 9. Expected result

Essay is public. Search finds the title. Sitemap includes `/guides/YOUR-SLUG`.

## 10. Common errors

| Error | Fix |
| --- | --- |
| 404 | `status` is not `published` or content type `guides` is not `active` |
| Missing from homepage | Homepage section `guides` is disabled, or `showWhenEmpty` logic filtered it |
