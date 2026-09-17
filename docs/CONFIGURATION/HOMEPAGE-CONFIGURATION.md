# Homepage configuration

## Purpose

The homepage is `content/config/platform.json` → `homepage.sections`. Code switches on TYPE. JSON chooses order, titles, and which blocks are on.

You do not edit React to hide a section. Set `"enabled": false`.

## Live story (this branch)

A visitor should understand, in about ten seconds:

- this is a public engineering learning journey
- the current program is DevOps Engineer Mastery
- start at Day 1
- AI comes later

## Types the code understands

| Type | What it renders | Empty behaviour |
| --- | --- | --- |
| `hero` | Brand, mission, Start Day 1 | Always shown |
| `continue-learning` | Resume banner when the visitor has progress | Hidden when empty (`showWhenEmpty: false`) |
| `prose` | A titled paragraph from `story.*` via `bodyKey` | Always shown if enabled |
| `program` | DevOps Engineer Mastery summary + current phase | Always shown if enabled |
| `journey` | The 11 phases | Always shown if enabled |
| `method` | What a day actually looks like | Always shown if enabled |
| `path` | DevOps → AI → Agentic AI | Always shown if enabled |
| `cta` | Closing start button | Always shown if enabled |
| `topic-grid` | Public topics with content | Hidden when empty. **Disabled** on the live homepage |
| `course-list` | Featured courses | Hidden when empty. **Disabled** live |
| `content-list` | Guides / labs / recent | Hidden when empty. **Disabled** live |
| `channel-grid` | YouTube / Instagram | Hidden when empty. Not on the live homepage |

Unknown type is skipped. `npm run validate` errors.

`bodyKey` for `prose`: `what` | `why` | `method` | `path` | `community` — mapped to `story.whatBody` etc.

## Live order

1. hero
2. continue-learning (only if the visitor has progress)
3. prose `what` — What this is
4. program — DevOps Engineer Mastery
5. prose `why` — Why DevOps before AI
6. journey — 120 days / eleven phases
7. method — What a day looks like
8. path — Where this is going
9. prose `community`
10. cta — Start at Day 1

Disabled (kept in JSON so you can turn them on later): topic-grid, recent, guides, projects-list, courses.

## How to change copy

Edit `content/config/platform.json`:

- Hero strings: `copy.heroBadge`, `copy.heroTitle`, `copy.heroDescription`, `copy.heroPrimaryCta`, `copy.heroPrimaryCtaHref`
- Supporting brand line: `brand.tagline` (currently `DevOps first. Then AI.`)
- Story paragraphs: `story.whatBody`, `story.whyBody`, `story.methodBody`, `story.pathBody`, `story.communityBody`
- Later stages: `futurePath`
- Header button: `copy.headerCta`, `copy.headerCtaHref` (Start Day 1 → `/learn/day-01`)

Leave `copy.heroTagline` empty. Do not stack slogans. Do not restore “Ancient patience. Modern systems.”

## How to reorder

Change `homepage.sections[].order`. Lower number is higher on the page.

## How to hide a block

`"enabled": false` on that section. It disappears from the homepage. It does not 404 the underlying route.

## Adding a new kind of block

Adding another prose block: another `prose` instance with a new `bodyKey` and a matching `story.*` field.

Adding a pricing table or a testimonial wall: that is a new TYPE. It needs a developer (component + `SECTION_TYPES` + validate). Do not add fake testimonials.

## Validation

```bash
npm run validate
```

Then open `/` and confirm Start Day 1 still goes to `/learn/day-01`.
