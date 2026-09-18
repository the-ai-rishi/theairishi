# Homepage configuration

## Purpose

The homepage is `content/config/platform.json` → `homepage.sections`. Code switches on TYPE. JSON chooses order, titles, and which blocks are on.

You do not edit React to hide a section. Set `"enabled": false`.

## Live story (this branch)

A visitor should understand, in about ten seconds:

- this is a technology learning platform
- the current program is DevOps Engineer Mastery
- it is 120 days / about four months
- start at Day 1
- AI comes later

The homepage is learner-first. Personal story lives on `/about`.

## Types the code understands

| Type | What it renders | Empty behaviour |
| --- | --- | --- |
| `hero` | Program name, 120 days, Start Day 1 | Always shown |
| `continue-learning` | Resume banner when the visitor has progress | Hidden when empty (`showWhenEmpty: false`) |
| `program` | Length / phases / current / ready facts | Always shown if enabled |
| `phases` | Compact 11-phase map | Always shown if enabled |
| `why` | Why DevOps before AI (generate vs still-need) | Always shown if enabled |
| `today` | Published days (1–3 today) | Component hides itself if none are published |
| `method` | How a day works | Always shown if enabled |
| `path` | DevOps → AI → Agentic AI | Always shown if enabled |
| `prose` | A titled paragraph from `story.*` via `bodyKey` | Always shown if enabled |
| `cta` | Closing start button | Always shown if enabled |
| `topic-grid` | Public topics with content | Hidden when empty. **Disabled** live |
| `course-list` | Featured courses | Hidden when empty. **Disabled** live |
| `content-list` | Guides / labs / recent | Hidden when empty. **Disabled** live |
| `channel-grid` | YouTube / Instagram | Hidden when empty. Not on the live homepage |

Unknown type is skipped. `npm run validate` errors.

`bodyKey` for `prose`: `what` | `why` | `method` | `path` | `community` — mapped to `story.whatBody` etc.

`why` also reads `story.whyGenerate` and `story.whyStillNeed`.
`method` also reads `story.methodSteps`.

## Live order

1. hero — DevOps Engineer Mastery, 120 days, Start Day 1
2. continue-learning (only if the visitor has progress)
3. program — facts strip
4. phases — what you will work through
5. why — Why DevOps before AI
6. today — published days
7. method — how a day works
8. path — after this program
9. prose `community`
10. cta — Start at Day 1

Disabled (kept in JSON so you can turn them on later): what, topic-grid, recent, guides, projects-list, courses.

## How to change copy

Edit `content/config/platform.json`:

- Hero strings: `copy.heroBadge`, `copy.heroDescription`, `copy.heroPrimaryCta`, `copy.heroPrimaryCtaHref`
- Program headline comes from `content/config/programs.json` `title` / `durationLabel`. Outcome stays on `/learn`, not the hero.
- Supporting site line: `brand.description`. Omit `brand.tagline` unless you intend a slogan. An empty tagline field is rejected.
- Story: `story.whyBody`, `story.whyGenerate`, `story.whyStillNeed`, `story.methodBody`, `story.methodSteps`, `story.pathBody`, `story.communityBody`
- About page: `about.title`, `about.intro`, `about.sections`
- Later stages: `futurePath`
- Header button: `copy.headerCta`, `copy.headerCtaHref` (Start Day 1 → `/learn/day-01`)

Leave `copy.heroTagline` empty. Do not stack slogans. Do not restore “Ancient patience. Modern systems.” Do not describe the product as a public journey or learning in public.

## How to reorder

Change `homepage.sections[].order`. Lower number is higher on the page.

## How to hide a block

`"enabled": false` on that section. It disappears from the homepage. It does not 404 the underlying route.

## Adding a new kind of block

Adding another prose block: another `prose` instance with a new `bodyKey` and a matching `story.*` field.

Adding a pricing table or a testimonial wall: that is a new TYPE. It needs a developer (component + `SECTION_TYPES` + validate). Do not add fake testimonials.

## Validation

`npm run validate` checks section types, including `why` and `today`.
