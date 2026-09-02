# Operations
Edit platform.json for topics nav and homepage.

## Add a topic such as Python
1. Add a topic object in platform.json topics array.
2. Start with status planned, showOnHomepage false, showInNavigation false.
3. Add markdown with topic python in frontmatter, or files in content/python/.
4. When content exists set status active. Set showOnHomepage true to appear in topic-grid. Set showInNavigation true for a header link.
5. Run the validate script then build. No React changes for a normal new topic.

## Rename a topic
Change name, shortName, slug on the same object. Keep id stable. Nav and homepage that bind to the topic id will pick up the new slug and label automatically.

## Disable or re-enable
To hide everywhere: enabled false, or status disabled. To pause: status paused. To put back: enabled true and status active, with real content if it should appear on the homepage.

## Hide from homepage only
Keep status active. Set showOnHomepage false. The topic page can still exist. Topic-grid will omit it.

## Remove a topic
Delete the object from the topics array. Do not leave nav hrefs pointing at its old slug; source-bound nav drops automatically. The site must not throw.

## Add lessons, guides, projects, updates, a course
Lessons: markdown in content/lessons or content/courses/<course-id>/ with course and topic frontmatter. Add the course in courses.json if new. Status active only when it has lessons.
Guides: content/guides/*.md. Projects: content/projects/*.md. Updates: add markdown under content/updates/ after the updates topic exists, then set that topic active when files are published.
See AUTHORING.md for copy-paste frontmatter.

## Homepage order and sections
Edit homepage.sections. order is the sort key. enabled false hides the instance. showWhenEmpty false (default) drops the section when it has no data. Adding another content-list instance is JSON only. Adding a new TYPE needs a developer.

## Copy, logos, favicon
Brand and copy live under brand and copy in platform.json. Replace files in public/brand/ and keep logo, logoMark, ogImage paths in JSON. Favicon is app/icon.png (Next.js). Header uses the horizontal logo.

## YouTube, Instagram, future channels
Keep status coming-soon until content/media/<id>.json has real items. Then status active, and optionally showOnHomepage true plus a channel-grid section. Add a new channel object with id, href like /tiktok, and content/media/tiktok.json. The generic channel page at /[channel] picks it up. Do not show empty channels as large homepage theater.

## Copy-paste topic object
id and slug: python. name: Python. shortName: Python. status: planned (or active when content exists). enabled: true. showOnHomepage: false until it has lessons. showInNavigation: false unless you want a header link. order: a number after existing topics. color and category are display only.
