# Brand language audit

Date: 2026-10-02. Branch: `feature/immersive-visual-upgrade`.

Source of truth for approved wording: [content/config/brand-language.json](../content/config/brand-language.json).
`platform.json` `brand.tagline` and `copy.heroDescription` must match it. `scripts/check-brand-language.js` fails validation if they diverge, if a scanned production file reintroduces a forbidden phrase, or if phase names and key day titles drift from `data/curriculum/forge-120.json`.

Classifications:

- APPROVED — brand or platform wording we intend to keep
- SOURCE-DERIVED — taken from the programme record or the roadmap snapshot
- NEEDS-REVIEW — still in the product, acceptable for now, watch it
- REMOVE — was visible and has been taken out

The internal id `devops-engineer-mastery` is a key, not a public name. It stays in frontmatter, progress keys, and redirects. It is not a heading.

## Identity

| Phrase | Where | Class |
|---|---|---|
| THE AI RISHI | Homepage title block, from `displayName` | APPROVED |
| The AI Rishi | `platform.json` `brand.name`, footer, logo alt, copyright | APPROVED |
| ANCIENT WISDOM · MODERN INTELLIGENCE | `brand.tagline`, homepage kicker, footer | APPROVED |
| FORGE-120 | Programme title, homepage `h1` | SOURCE-DERIVED |
| A technology learning platform. The current program is FORGE-120… | `brand.description` | APPROVED |
| FORGE-120 is a 120-day hands-on path… The model is not the starting point. | `copy.heroDescription` | APPROVED |
| Day 120 is an independent-engineering checkpoint, not a claim of instant mastery. Mastery continues through repeated practice after the programme. | `programs.json` `outcome` | SOURCE-DERIVED |
| Start Day 1 | Primary CTA | APPROVED |
| Explore the 120-day plan | Secondary CTA | APPROVED |
| Learn, Guides, Projects, About | Navigation labels | APPROVED |
| Current program | Hero badge / world-lock kicker | APPROVED |

## Removed from the homepage

| Phrase | Was | Class |
|---|---|---|
| The path is open | World-lock kicker | REMOVE |
| Continue from the day this system is holding. | World-lock heading | REMOVE |
| Seed | First-viewport phase label | REMOVE |
| System | Beat prefix | REMOVE |
| Dormant / 120-day path / Signal | Boot veil | REMOVE |
| N of 120 days lit / days dormant | Progress line | REMOVE |
| Chapter watermark `02` | Journey section | REMOVE |
| Retrieval, then a boundary. The model is not trusted. | Control heading | REMOVE |
| Rishi Core, Rishi Engine, and the other “Rishi + noun” labels | Not present; listed as forbidden | REMOVE |

## Homepage that remains

| Phrase | Class | Note |
|---|---|---|
| Phase names, Foundations through Design and defence | SOURCE-DERIVED | Not renamed for the drawing |
| Days 1–12 … 106–120 | SOURCE-DERIVED | Phase ranges |
| N of 120 days complete | SOURCE-DERIVED | Real local progress after hydration. Before hydration: “Progress stays on this device” |
| N / 120 claimed | NEEDS-REVIEW | Existing completion verb on the current-day card and lesson completion. It means a local claim, not a certificate |
| You are in one phase at a time. Gold is complete… | APPROVED | Legend for the day map |
| Capstone: forge-api, one service: … | SOURCE-DERIVED | `programs.json` `capstone` |
| Reliability day titles and goals | SOURCE-DERIVED | Shown when a day is selected |
| RAG and controlled tool use, plus the phase summary | SOURCE-DERIVED | |
| Day 12 is M1 mock + LLM sampler. Day 59 is First LLM helper read-only. Day 105 is AI infrastructure awareness… | SOURCE-DERIVED | `forge-120.json` `touchpoints` |
| Teaching fixture. Not a live model. / not a live index. | APPROVED | Stops the fixtures being read as telemetry |
| Capability gate names and evidence lines | SOURCE-DERIVED | Nine gates |

Teaching-fixture sentences (chunk A/B/C, the health-endpoint eval, trusted instruction / untrusted content) are labelled as fixtures. They use curriculum words. They are not described as measured retrieval.

## Other surfaces

| Surface | Class | Note |
|---|---|---|
| About | SOURCE-DERIVED | Not rewritten in this pass. Founder voice stays in `platform.json` `about` |
| How a day works (Read, Try, Break, Debug, Practise, Review) | APPROVED | Existing method copy |
| Why foundations come first | APPROVED | Says days 97–105 are where retrieval, policy, evaluation, and a disable path are taught |
| Lesson days 1–3 | SOURCE-DERIVED | `courseTitle` is FORGE-120. Bodies were already reframed to the new day-1 contract |
| Project forge-api | SOURCE-DERIVED | “A learning project, not employer production experience.” |
| Search, empty states, header, footer | APPROVED | No new slogans added |
| Operator docs that still said the live title was DevOps Engineer Mastery | REMOVE | Updated to FORGE-120 where they instruct authors. Historical notes and test fixtures still name the old title on purpose |

## Forbidden, and checked

See `avoid` in `brand-language.json`. Includes the old public title, alternate taglines, hype lines, and “Rishi” used as a product subsystem name.

`scripts/check-brand-language.js` scans components, app routes, lessons, guides, projects, and `content/config`. It does not scan `docs/` or test fixtures, so a migration note can still say the old name.
