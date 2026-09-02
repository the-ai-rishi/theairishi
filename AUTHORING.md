# The AI Rishi — Authoring Guide

You should not need to edit React or TypeScript to change normal platform content.

Source of truth:

- Branding, topics, navigation, homepage sections, social platforms: content/config/platform.json
- Courses: content/config/courses.json
- Series: content/config/series.json
- Lessons, guides, projects, topic articles: Markdown under content/

After changing JSON or Markdown, restart the dev server if it is already running. Production picks up changes on the next build.

## Branding

Open content/config/platform.json, then the brand object.

Logo files live in public/brand/:

- Horizontal logo: public/brand/logo-horizontal.png (brand.logo)
- Square mark: public/brand/logo.png (brand.logoMark)
- Social preview: brand.ogImage

## Add a topic

1. Open content/config/platform.json, then topics.
2. Copy an existing topic object.
3. Set a new id, slug, name, shortName, description, order.
4. Set enabled true and status active (or coming-soon).
5. Set showOnHomepage / showInNavigation as needed.

Optional: put Markdown in content/<slug>/*.md. Those files are discovered automatically.

## Rename a topic

Change name, shortName, and/or slug. Keep id stable so existing content still maps.

## Disable or remove a topic

Set enabled false, or status disabled, or delete the object from topics.

It then disappears from homepage topic grids, navigation, topic routes, search, sitemap, and any homepage section bound with topicId.

## Homepage sections

Open content/config/platform.json, then homepage.sections.

- enabled false hides a section.
- order controls sequence (lower first).
- title, subtitle, ctaLabel change copy.
- topicId binds a section to a topic. If that topic is removed or disabled, the section is hidden automatically.

## Courses and lessons

Courses: edit content/config/courses.json.

Lessons: add Markdown under content/courses/<course-id>/ or content/lessons/.

Required frontmatter: title, description, course, stage, lesson.

status draft or enabled false keeps it off the public site.

## Guides, projects, images

- Guides: content/guides/<slug>.md
- Projects: content/projects/<slug>.md
- Images: public/content/images/<topic-or-general>/file.png referenced as /content/images/...

## Instagram and YouTube

Open content/config/platform.json, then social.

- status coming-soon shows a Coming Soon page (no fake videos).
- status active uses content/media/youtube.json and content/media/instagram.json.
- status disabled removes it from nav, footer, and sitemap.
