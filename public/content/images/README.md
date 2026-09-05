# Content Images

This directory holds images referenced in lessons, guides, and other Markdown content.

## Structure

```
public/content/images/
  ai/          — AI, ML, LLM content images
  devops/      — DevOps, Kubernetes, CI/CD images
  cloud/       — Cloud, Azure, AWS images
  software-engineering/ — Programming, system design images
  career/      — Career, interview, growth images
  general/     — Platform-wide or uncategorized images
```

## Usage in Markdown

Reference images using the public path:

```markdown
![Transformer Architecture](/content/images/ai/transformer-architecture.png)

![Pipeline Overview](/content/images/devops/pipeline-overview.png)
```

## Image Guidelines

- Use PNG or WebP format
- Keep images under 500KB where possible
- Use descriptive filenames: `kubernetes-pod-lifecycle.png` not `image1.png`
- Use lowercase with hyphens
- Provide meaningful alt text in Markdown
