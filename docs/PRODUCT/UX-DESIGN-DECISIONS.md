# UX design decisions

Internal design log for the learner-experience redesign on `feature/learner-experience-v2`. Not a public page. Companion to [LEARNER-EXPERIENCE.md](./LEARNER-EXPERIENCE.md) and [LEARNING-PLATFORM-UX-RESEARCH.md](./LEARNING-PLATFORM-UX-RESEARCH.md).

Brand stays: ink / cream / gold, serif + sans + mono, Telegram and Instagram public, GitHub hidden. The previous UI is not protected.

---

## 1. Homepage is a product surface, not an editorial landing

**Current problem.** The homepage was a magazine cover: oversized serif title, a paragraph, two text links, then a long stack of “what / why / method / path / community” essays. A demanding designer would still call it a content site with a CTA.

**Research signal.** GitHub Skills and A Tour of Go put the next action in the first viewport. Linear’s home is a command surface, not a manifesto. Microsoft Learn’s resume card is the product. Apple / web.dev keep hierarchy calm after the action is obvious.

**Proposed solution.** `ProductHome` composes the first viewport as:

- program identity (title from `programs.json`, duration, live available/planned counts)
- one sentence from `copy.heroDescription`
- primary `SmartCta` (Start Day 1 / Continue Day N) and Explore
- `CurrentWorkCard` as the live product window (day, phase, outcomes, progress)

The 120-day map follows immediately. Method, why, later/community, destinations, and a compact close CTA sit below. Destinations are never first viewport.

**Why this solution.** The learner’s first question is “what do I do now?” not “what is this brand’s worldview?” The serif title remains so the brand is still The AI Rishi, not a SaaS template.

**Alternatives considered.**

- Keep `SectionRenderer` 1:1 with JSON sections. Rejected: it forced a long editorial stack.
- Replace the hero with only the current-work card. Rejected: first-time visitors need the program name.
- Copy a three-beat marketing slogan for the hero. Rejected: `validate.js` forbids diary/slogan framing.

**Accessibility.** One `h1` (program title). Current-work is an `<aside>` with a labelled heading. CTA is a real link, 44px min height. Progressbar has valuemin/valuemax/valuenow.

**Responsive.** Mobile 360–390 stacks identity → full-width Start → current-work card. Desktop splits identity | card. Counts wrap; they do not overflow.

**Architecture.** Homepage JSON types stay (hero, program, phases, why, today, method, path, destinations, cta) so scenario tests still see a learner-first homepage. `ProductHome` is allowed to skip rendering continue/program/phases/today as separate stacked sections because those facts now live in the hero + card + map.

---

## 2. `/learn` is an application dashboard

**Current problem.** `/learn` was a brochure: a large title, then phase cards, then lists. Progress existed but did not look like an application.

**Research signal.** Linear’s issue list, Microsoft Learn “My Learning,” roadmap.sh’s map-as-product, Things 3’s Today.

**Proposed solution.** `ProgramCommandCenter` is a dashboard:

- header with live `completed / 120` and percent
- stat line from catalog (duration, available, planned, current phase)
- current-work card + compact 120-day map
- published days as a dense list (Linear-like rows, not stacked marketing cards)
- full titled map distinguishing complete / now / available / planned

**Why this solution.** The map has to be memorable, and the next day has to be obvious, on the same page.

**Alternatives considered.**

- Keep phase `<details>` cards from the previous site. Rejected: they still read as a curriculum brochure.
- GitHub-contribution heatmap of 120 cells in one grid. Rejected: phases would collapse; 11 labelled bands are more honest.

**Accessibility.** List semantics for days. Planned rows are not links. Current published row is a link with a visible state.

**Responsive.** Counts sit under the title on 360px. Map dots wrap per phase. Published rows stack label / title / state.

**Architecture.** Client island receives a serializable `LearnerCatalog`. No filesystem imports in the client. Unpublished days have `href: null`.

---

## 3. Lesson page is a workspace, not an article

**Current problem.** Day pages were Markdown articles with extra metadata. Dual sticky bars, a floating syllabus button, and `mt-16` H2s made practice look like the next chapter of an essay.

**Research signal.** VS Code / terminal workspace chrome. KodeKloud / Killercoda practice-first panels. Brilliant’s progressive reveal. Stripe / MDN information scent. Exercism’s gate. Readwise resume.

**Proposed solution.**

- `LessonWorkspaceChrome`: one compact sticky bar (logo, day of 120, count, search, 120 Days) plus horizontal section chips with IntersectionObserver.
- `DayRail` on xl: published days with the same dot language.
- Compact contract header (outcomes, time, Start, Jump to practice).
- Markdown H2s that already match the rhythm are wrapped in `.lesson-block-*` panels (why / learn / predict / practice / break / evidence / fix / verify / AI review / interview / gate).
- `DayCompletion` is a gate panel, not “finished reading?”
- Archive AI lessons without rhythm kinds stay ordinary prose — wrapping is not forced.

**Why this solution.** Authors keep writing `## Practise`. The renderer supplies the product language. Practice is visually louder (gold rail + wash). Concepts stay quiet. The gate is the finish line.

**Alternatives considered.**

- Invent new Markdown directives or MDX card types. Rejected: authoring cost, and the spec forbids inventing sections.
- Left-border-only on H2s (PR #12 first pass). Rejected: too subtle to carry the interaction model.
- Keep LessonStickyNav + MobileLessonMenu + LessonSidebar. Rejected: three chrome systems on a 390px phone.

**Accessibility.** Section `aria-labelledby` on each block. First content `h1` is `aria-hidden` because the contract header already exposes the title. Chips use `aria-current="location"`. Focus rings stay gold. `prefers-reduced-motion` kills the now-dot pulse.

**Responsive.** 360–390: full-width Start / Jump / Mark complete; chips scroll horizontally without a visible scrollbar; code blocks scroll inside the panel; no second floating button.

**Architecture.** `wrapLessonSections(decorateHeadings(html))` in `lib/markdown.ts`. Pure functions, Node-tested. Heading IDs are preserved so skip links and the observer still work. `scroll-mt-28` clears the sticky chrome.

---

## 4. 120-day map as the memorable artifact

**Current problem.** The map was a list of phase cards. Learners could not see 120 at a glance, nor tell planned from available without reading.

**Research signal.** roadmap.sh (the map is the product). GitHub contribution dots. Microsoft Learn path modules. Honest “coming” nodes.

**Proposed solution.** Phase-banded day dots:

| State | Visual |
| --- | --- |
| Complete | gold fill |
| Now | cream square, pulse (honours reduced motion) |
| Available | gold outline |
| Planned | quiet square |

Current phase gets a gold spine. `/learn` also lists titles under each phase.

**Why this solution.** 120 cells without phase labels is a heatmap. 11 labelled bands is a program.

**Alternatives considered.** A vertical timeline of 120 rows (too long). A single SVG path (pretty, not operable). Circular “progress ring” as the hero (hides the path).

**Accessibility.** Each dot has an `aria-label` (“Day 4 — …, planned”). Published dots are links. Planned dots are not.

**Responsive.** Dots wrap. Hit area is 32×32 even when the square is 12px.

**Architecture.** Same catalog as continue-learning. No hardcoded 120 in the visual except labels that read `catalog.totalDays`.

---

## 5. Typography, density, and chrome

**Current problem.** Editorial display type was doing all the work. Product UI (counts, states, gates) was styled like captions on a magazine.

**Research signal.** Apple / web.dev calm hierarchy. Linear density. Stripe docs scent. VS Code chrome height.

**Proposed solution.** Three registers on purpose:

- Serif: program and day titles only
- Sans: body, outcomes, explanations
- Mono: kickers, counts, chips, day numbers

Site header is 48px (56px from `sm`). Lesson chrome is 48px + a chip row. Homepage hero sits on a `product-stage` field so the first viewport feels like an app shell, not a poster. Close CTA is a panel, not a 6xl centered sermon.

**Why this solution.** The brand is still recognisable. The product is newly operable.

**Alternatives considered.** Dropping the serif (would erase the brand). Keeping the 4.25rem header height (ate lesson viewport). Rainbow reading bar (`gold → circuit → signal`) — rejected as slop; progress is gold only.

**Accessibility.** Body contrast stays cream-on-ink. Muted text is secondary only. Tap targets ≥ 44px on primary actions.

**Responsive.** `.display` clamps; at 360px the program title is ~2rem, not a truncated 4rem poster.

**Architecture.** Tokens stay in `@theme`. New utilities: `.panel`, `.panel-hero`, `.product-stage`, `.btn-ghost`, `.btn-block`, `.stat-line`, `.lesson-block-*`, `.day-dot-*`.

---

## 6. Mobile is designed, not shrunk

**Current problem.** Desktop editorial layout scaled down: tiny secondary links, overflowing code, stacked sticky bars, 32px taps.

**Research signal.** Apple HIG touch. Microsoft Learn resume on a phone. Readwise’s compact resume. Baymard’s mobile learning failures (overflow, competing chrome).

**Proposed solution.**

- Primary CTA is full width below 640px (`btn-block`)
- Current work is a card under the title, not a side column squeezed to 280px
- Lesson chips are a single horizontal scroller
- No floating syllabus button
- Code blocks keep horizontal scroll inside the panel
- Header menu CTA is full width

**Why this solution.** A 390px-wide first viewport must still answer “what do I do now?”

**Alternatives considered.** Bottom tab bar (too much product chrome for three published days). Removing the map on mobile (the map is the product).

**Accessibility.** `min-h-11` on actions. Escape closes menus. Overlay click + focus return on the menu button.

**Responsive.** Explicit 360 / 390 rules for display size and block padding.

**Architecture.** No separate mobile site. CSS and flex-col stacking only.

---

## 7. Interaction

**Current problem.** Almost none, except hover underlines. Or, in the first PR #12 pass, too much chrome (dual sticky + observer nav + sidebar).

**Research signal.** Linear’s active row. Brilliant’s step reveal. Readwise resume. Superhuman keyboard (already present as `[` `]`).

**Proposed solution (tasteful, not decorative).**

- Chip tracking via IntersectionObserver
- Progress width transition 500ms
- Now-dot pulse, killed by `prefers-reduced-motion`
- Primary button `scale(0.98)` on press
- Completion is an explicit toggle, never scroll

**Rejected.** Confetti, mascots, auto-expanding every section, layout animations on the map.

---

## 8. What was removed or demoted

| Before | After | Why |
| --- | --- | --- |
| `HeroSection` as the homepage | `ProductHero` + `CurrentWorkCard` | First viewport is a product |
| `SectionRenderer` 1:1 on `/` | `ProductHome` composition | Editorial stack was the problem |
| Phase brochure cards as the map | Day-dot journey map | Map as product |
| LessonStickyNav + MobileLessonMenu + LessonSidebar on the day page | `LessonWorkspaceChrome` + `DayRail` | One chrome system |
| Article `mt-16` H2s | `.lesson-block` panels | Workspace, not essay |
| Rainbow scroll bar | 2px gold `read-progress` | Brand, not slop |
| Centered 6xl close CTA | Compact product panel | Hierarchy |
| Dual sticky lesson headers | One 48px bar + chips | Mobile viewport |

`HeroSection` and `SectionRenderer` remain in the repo for other compositions and for the JSON type switch; they are no longer the homepage.

---

## 10. Distinctive idea: today is a numbered shift on a 120-day spine

**Current problem (after the second pass).** The product surfaces existed, but they still read as dark SaaS: a side card, a panel of 120 dots, and every lesson H2 in a bordered box. A designer would not yet say the site is unlike Microsoft Learn or Linear.

**Research signal.** roadmap.sh is memorable because the map *is* the product. KodeKloud is memorable at the moment of doing. Exercism is memorable at the gate. We needed one idea, not a collage of those.

**The idea.** The AI Rishi is a 120-day spine. Today is one numbered shift on that spine. You do not leave the shift until you can prove it.

**Proposed solution.**

- Homepage first viewport: program identity (calm) then a full-width **shift ticket** (Today / Now / Waiting) with outcomes and the only primary CTA. An 11-tick spine under the ticket shows which phase you are in.
- The map is **11 phase stations**. Only the current phase shows day-dots. Other phases are progress bars. `/learn` opens the current phase with titles; others are `<details>`.
- `/learn` is Today → Up next → This phase → The spine. The old triple of card + 120-dot map + published list + titled map is gone.
- Lesson blocks have two registers: **understand** (why/learn/predict as quiet ticks, not cards) and **do** (practice/break/fix as a gold workbench). The gate is a checkpoint: “Can you prove Day N?” / “I can prove this.”
- Lesson chrome drops the extra “120 Days” button; the `n/120` count is the link back to the plan. Search is icon-only. Global nav no longer duplicates Start next to the Start CTA.

**Why this solution.** 120 identical dots are abstract. Eleven named stations are a path. Boxing every paragraph kills reading. Practice has to look like a bench, not a callout.

**Alternatives considered.**

- Keep the 120-dot grid as the signature. Rejected: technically true, cognitively weak.
- Paginate each day into Brilliant-style screens. Rejected: these days are 45-minute engineering notes.
- Rename the product around “shift” in every CTA. Rejected: beginners need Start / Continue.

**Accessibility.** Current phase labelled “you are here”. Planned rows are not links. Gate button has `aria-pressed`. Hidden program-day H1 remains `aria-hidden`; the contract header is the visible H1. Chips use `aria-current="location"`.

**Responsive.** Ticket is full width at 360px, CTA full width. Phase stations stack. Workbench code still scrolls inside `pre`, not the page.

**Architecture.** Same catalog, same `wrapLessonSections`, same local progress. Visual registers are CSS. Phase expand uses native `<details>`.

---

## 9. Privacy and invariants (unchanged on purpose)

- Private authoring repository is never a learner destination
- Progress is `localStorage` key `theairishi_learner_progress_v1`
- No accounts
- Telegram `https://t.me/theairishi_official`, Instagram `https://www.instagram.com/theairishi/`
- GitHub hidden, YouTube coming-soon
- Dual Vercel + Cloudflare, Cloudflare-compatible embedded content
- No invented curriculum, salaries, or social proof
