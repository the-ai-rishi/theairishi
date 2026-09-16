# Add a project / lab

## 1. What this system does

Publishes a lab write-up at `/projects/YOUR-SLUG`. Live labs appear under **Build**, on the homepage Labs section, in search, and in the sitemap.

## 2. When I need it

You have a real lab to show. Do not add an empty “coming soon” project page.

## 3. Exact file to create

`content/projects/YOUR-SLUG.md`

Copy `templates/project-template.md`.

## 4. Fields to set

| Field | Allowed values | Required |
| --- | --- | --- |
| `title` | Plain text | yes |
| `description` | One or two sentences | yes |
| `slug` | URL slug, unique | yes |
| `date` | `YYYY-MM-DD` | yes |
| `category` | Short label | yes |
| `technologies` | List of strings | yes |
| `difficulty` | `Beginner` / `Intermediate` / `Advanced` | optional |
| `status` | **Badge only:** `Completed` / `In Progress` / `Planned` | yes |
| `topic` | Live topic id (`ai`, `devops`) | yes |
| `enabled` | `true` / `false` | hide with `false` |
| `featured` | `true` / `false` | optional |
| `githubUrl` | Full URL to a real repo, not `https://github.com` | optional |
| `demoUrl` | Full URL | optional |
| `visibility` | Lifecycle override: `published` / `draft` / `archived` | optional |

## 5. Example

```yaml
---
title: "Autonomous Multi-Source Research Agent"
description: "A self-directed research agent using ReAct loops and grounded search."
slug: "autonomous-research-agent"
date: "2026-08-16"
category: "Artificial Intelligence"
technologies: ["TypeScript", "LLMs"]
difficulty: "Intermediate"
status: "Completed"
topic: "ai"
enabled: true
featured: true
---
```

## 6. What NOT to change

- **`status` is not the publish switch.** `Completed` is a badge. The lab is still public.
- To hide a lab, set `enabled: false` (or `visibility: draft`).
- Do not use placeholder `https://github.com` or `https://instagram.com` root URLs. Validate will fail.

## 7. Commands

```bash
npm run validate
npm run dev
```

## 8. How to validate

Open `/projects/YOUR-SLUG`. Confirm it appears on `/projects`, the homepage Labs section, and search.

## 9. Expected result

The lab is a public Build item. Search and sitemap include it.

## 10. Common errors

| Error | Fix |
| --- | --- |
| Lab on `/projects` but missing from search | Old bug: badge `Completed` was treated as unpublished. Current code maps badges to published. Re-run validate. |
| Validate placeholder URL | Remove `githubUrl` or point it at a real repository path |
