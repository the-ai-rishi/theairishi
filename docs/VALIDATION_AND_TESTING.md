# Validation and testing

Scripts: validate (scripts/validate.js plus scenarios), test:platform, content:index, lint, build, dev, start.

validate checks platform.json, courses, brand files on disk, unknown homepage types, dead nav sources, empty active topics/courses, placeholder URLs, and frozen ids in app/components/lib.

Scenario tests are in-memory and do not mutate platform.json.

1. Only one active topic with content
2. Disable a topic that had content
3. Remove a topic object (must not throw)
4. Rename topic name and slug
5. Add python as active with content
6. Disable YouTube
7. Enable YouTube as active with items (route /youtube appears)
8. Disable guides content type
9. Planned empty area is not a large homepage section
10. Planned/coming-soon YouTube is not a channelPath
11. Nav split: 8 items => 5 primary + 3 Explore
12. Active YouTube with zero items is not-found
13. Listing file routes 404 when the content type is disabled, coming-soon, or enabled false

splitPrimaryNav is exported from visibility-core. Header cap is 5. Overflow label is More.
