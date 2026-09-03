# Search

UI: components/search/SearchModal.tsx. API: app/api/search/route.ts. Index: lib/search.ts using getSearchIndexInputs.

Indexed when public: topics, courses, catalog items (lessons, guides, projects). Channel items are included when the channel is active with content, gated by the channel rather than a sibling contentType row.

SearchModal prints the type string from the API. It is not a frozen course-only union. lib/search.ts maps lesson, guide, project, topic, course, youtube, instagram onto Lesson, Guide, Project, Topic, Course, Video. Unknown types are title-cased.

Excluded: planned, paused, disabled, archived, coming-soon, draft, enabled false, items whose topic or content type is not search-visible.

Coming-soon YouTube is not searchable. Active YouTube with items is.

Shortcut: Cmd/Ctrl+K.
