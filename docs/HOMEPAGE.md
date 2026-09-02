# Homepage

The homepage is resolved from platform.json homepage.sections. Code never switches on frozen ids like technology-updates. It switches on TYPE.

## Types (code, developed once)
hero: brand copy. If exactly one public topic with content, focused CTA. If many, discovery tone. Orbit only uses public topics that have content.
topic-grid: cards for public topics with contentCount greater than 0.
course-list: public active courses that have lessons.
content-list: generic list. source.kind recent, or topic plus topicId, or format plus guide|project|lesson.
channel-grid: loop of public channels. No hardcoded YouTube/Instagram trees.
continue-learning: hidden when there are no public courses.
cta: brand call to action from copy config.

## Empty behavior
showWhenEmpty defaults to false. Empty sections are dropped. coming-soon is not a large homepage section. planned is never public. Unknown type is skipped and the validator errors.

## Instance vs type
Adding Updates later: another content-list instance in JSON with source kind topic and topicId updates. Do not add a React component named TechnologyUpdates.
Adding a new TYPE (for example a pricing table) needs a developer to register it in the type registry.

## Default homepage today
hero, continue-learning, course-list, topic-grid (AI + DevOps), content-list recent, content-list guides, content-list projects, cta. Social, series, updates, and interviews are not enabled.

## Example content-list instance
id: unique-instance-id. type: content-list. enabled: true. order: 5. title and subtitle are headings. ctaLabel and ctaHref are optional; if ctaHref is omitted it is derived from source. source kind can be recent, or topic with topicId, or format with format guide. maxItems: 6. showWhenEmpty: false.
