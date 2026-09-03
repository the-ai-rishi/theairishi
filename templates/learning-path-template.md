# Learning path template notes

JSON cannot hold comments. Copy templates/learning-path-template.json into content/config/courses.json as one extra object.

Required fields: id, slug, title, description, topic, category, order, enabled, status, featured, showOnHomepage.
Optional: badge, upcomingTopics.

Keep status as coming-soon until real lessons exist. validate.js fails an active course with zero lessons. Lesson frontmatter course must match id. topic must match topics[].id in platform.json.
