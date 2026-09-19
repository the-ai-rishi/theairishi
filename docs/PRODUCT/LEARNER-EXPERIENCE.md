# Learner experience specification

Source of truth for public learner UX on theairishi.com.

Companion research: [LEARNING-PLATFORM-UX-RESEARCH.md](./LEARNING-PLATFORM-UX-RESEARCH.md).

This is an internal product spec. It is not a public page, not a CMS rewrite, and not a curriculum rewrite.

**Privacy:** The website is the learner front door. Private authoring repositories, author-only files, and internal paths are never learner destinations.

---

## 1. Product learning philosophy

The AI Rishi is a technology learning platform. The current public program is **DevOps Engineer Mastery**: 120 days of practical engineering.

The learner loop is:

Discover → understand the path → start a day → learn → predict → try → break safely → capture evidence → fix → verify → AI review → day gate → complete → continue.

Social destinations (Instagram, Telegram) are secondary. GitHub is hidden. YouTube stays coming-soon until real items exist.

We teach on this website. We do not send people to an authoring repository.

Anti-goals: personal blog, generic docs dump, marketplace, guru site, diary, “learning in public,” streak product, course catalog.

The learner should always be able to answer:

- Where am I?
- What do I do today?
- Why does it matter?
- How do I practice?
- How do I know I am done?
- What is next?

---

## 2. First visit

No account. No quiz wall. No catalog of other programs.

Homepage shows the current program (DevOps Engineer Mastery), a short description, and **Start Day 1**. Secondary: explore the 120-day plan (`/learn`).

`/learn` is the program command center even on a first visit: 0 / 120, Phase 1, Day 1 as the next action, full map with Available vs Planned.

Day 1 opens with a lesson contract (outcomes, time, why), then the Starting Assessment, then the day’s work.

Module 0 lives *inside Day 1* (what today is for + assessment). We do not add an extra empty “orientation” route.

---

## 3. Returning learner

If local progress exists, primary CTAs become **Continue Day N**.

Continue is computed, never guessed (see §18).

Homepage shows a continue strip when there is started or completed work. `/learn` always shows live counts after hydration.

---

## 4. Homepage learner flow

The homepage is a product surface (`ProductHome`), not a long editorial landing.

1. Brand + current program title.
2. Duration, phase count, available vs planned — live from the catalog.
3. Primary CTA: Start Day 1 or Continue Day N (client island; SSR defaults to Start Day 1).
4. Current-work card in the first viewport (day, phase, outcomes, progress).
5. 120-day journey map (complete / now / available / planned).
6. How a day works, why this path, later/community — supporting, not first.
7. Destinations (Instagram, Telegram) stay **below** the program. They are not the first viewport.

Header CTA follows the same Start / Continue rule.

Visual decisions: [UX-DESIGN-DECISIONS.md](./UX-DESIGN-DECISIONS.md).


---

## 5. `/learn` dashboard (command center)

`/learn` is the strongest functional page after the homepage.

It must show, from live program data (never hardcoded fake numbers):

- Program title
- Duration label (120 days · practical engineering)
- Progress: `completed / 120` where 120 is `program.days.length`
- Current phase name (from continue target, else config `currentPhaseId` if no progress)
- Current / next lesson title
- Primary CTA: Start Day 1 | Continue Day N | wait state
- Phase list with `completed / phase.days.length`
- Available published days
- Full map: planned days remain titles, not empty articles

Featured program lives at `/learn`. Other public programs would live at `/programs/{slug}`. Alias: `/programs/devops` redirects to `/learn` while DevOps is featured.

---

## 6. Day 1

Day 1 must answer: where, what, why, outcomes, time, what to do, what happens next.

Header (example structure, not frozen copy):

- DAY 01
- Title from content
- PHASE 01 · FOUNDATIONS
- Why / description
- You should be able to (3–5 outcomes from frontmatter)
- Estimated time
- Start Day 1 (jump to assessment / first section)
- Already know this? Skip to practice

Then: Starting Assessment, then the lesson body, then the day gate.

---

## 7. Day N

Same chrome as Day 1, minus the starting assessment unless `exercise` says otherwise.

Adjacent navigation is **program-published days**, not “all markdown in the course including archive notes.”

If the next program day is unpublished, do not pretend the course is finished. Show a wait state.

Direct URL to any published day is allowed (peeking ahead is allowed; see research). Completing Day 3 before Day 1 does not make Day 1 complete.

---

## 8. Lesson structure

Authors keep writing markdown. The renderer maps existing H2s to semantic kinds.

| Kind | Typical H2 | Nav group |
| --- | --- | --- |
| why | What today is for | Overview |
| learn | Words, Happy path first, Three different undos | Learn |
| predict | Predict (if present) | Learn |
| try | Practise, Locked practice | Practice |
| break | Break (if present) | Practice |
| evidence | Evidence (if present) | Evidence |
| fix | Fix (if present) | Practice |
| verify | Production, Production constraint | Evidence |
| ai-review | AI review | Review |
| interview | Interview kill | Review |
| gate | Definition of done | Gate |

Do **not** invent sections the markdown does not have. Day 3 has no “What today is for”; that is fine.

Kickers number the sections that exist, in document order.

The article H1 is visually suppressed when the lesson hero already shows the title.

---

## 9. Learning outcomes

Program days (frontmatter `day` set) require `outcomes`: 3–5 concrete strings, derived from that day’s copy. Do not fabricate tools the day does not teach.

Optional: `estimatedMinutes` (number). Display as “About N minutes.”

Archive lessons without `day` may omit outcomes.

---

## 10. Exercises

Day 1 uses the on-site Starting Assessment (`exercise: starting-assessment`).

Other days use the markdown practise section. Visual language (P1): the practise H2 reads as TRY, production as VERIFY, definition of done as GATE.

We do not add an in-browser terminal in this version.

---

## 11. Prediction

If a heading matches predict, tag it. Day 2 already asks the learner to predict HEAD before `reset --hard`. That copy stays in markdown; the renderer only labels it if the heading exists.

---

## 12. Evidence

Evidence is what the learner writes down or sees in their terminal. Chat is not evidence. We do not upload files. The day gate text names the evidence.

---

## 13. Break / fix

Only tagged when headings exist. Production constraints stay in markdown.

---

## 14. Day gate

“Definition of done” is the gate. Reading the page is not done. The completion control is adjacent to this idea and requires an explicit click.

---

## 15. Completion

Completion requires an explicit learner action. Visiting is not completing. Scrolling is not completing.

After complete:

- Recap: Day NN complete
- Outcomes listed as now-expected abilities
- Continue to next published day, or wait if unpublished
- Review this day (stay / uncomplete)

Learners may uncomplete. That is honest, not a streak punishment.

---

## 16. Next-day flow

| Situation | CTA |
| --- | --- |
| No progress | Start Day 1 |
| Last visited published and not complete | Continue that day |
| Last visited complete, earlier day incomplete | Continue the first incomplete published day |
| Day 1 complete, Day 2 published | Continue Day 2 |
| All published days complete, later day planned | Wait: next planned title, no broken link |
| Last visited invalid / unpublished / removed | Ignore it; first incomplete published |
| Completing later before earlier | Counts; continue still first incomplete |

---

## 17. Phase navigation

Phase names, day ranges, and counts come from `programs.json`. Current phase for a learner is the phase of the continue target. Operator `currentPhaseId` is the editorial “now” for the published frontier, used when the learner has no progress.

Planned phases show 0 / N. They are not fake-locked with a paywall; they are simply unpublished.

---

## 18. Progress model

Program-scoped, local-first.

- **started:** opened a day (last visit or explicit start)
- **completed:** explicit mark
- **lastVisited:** last opened slug
- **count:** completed slugs that belong to the program, over `program.days.length` (120)
- Archive AI lessons may still be marked complete for themselves; they do **not** change  n / 120

No auto-complete. No streaks. No points.

---

## 19. localStorage schema

Key: `theairishi_learner_progress_v1`

```json
{
  "v": 1,
  "completed": ["day-01"],
  "started": ["day-01", "day-02"],
  "lastVisited": "day-02",
  "completedAt": { "day-01": "2026-09-20T10:00:00.000Z" }
}
```

Legacy keys (migrated on first read, still dual-written so old readers do not explode):

- `theairishi_completed_lessons` — JSON string array
- `theairishi_last_visited_lesson` — raw slug

Starting assessment remains `theairishi_starting_assessment` (separate document).

---

## 20. localStorage failure behavior

| Failure | Behavior |
| --- | --- |
| No window / SSR | Empty state. CTAs say Start Day 1. |
| Storage disabled / quota / private mode | In-memory only for the tab. Warn in console. Do not crash. |
| Corrupt JSON | Treat as empty. Do not throw. |
| Unknown `v` | Read known fields if present; otherwise empty. |
| Lesson removed | Slug ignored by continue; dropped from counts against the catalog |
| Lesson count changes (Day 4 publishes) | Denominator is always current `program.days.length`; numerator is intersection with catalog slugs |

---

## 21. Assessment

Day 1 only, unless a future day sets `exercise`. Device-local. Honest scores. No-AI rule. Operated vs authored. Not a placement test that forks the curriculum.

---

## 22. Beginner flow

Start at the hero, read why, then words, then practise. Assessment on Day 1 is required by the definition of done, not by a code lock.

---

## 23. Experienced learner flow

Same path. “Already know this? Jump to practice” scrolls to the first try heading. Peeking at later days is allowed. Completing Day 3 does not skip the obligation of Day 1 if they want a truthful  n / 120 — continue will still offer Day 1.

---

## 24. Mobile behavior

Test 360, 390, 768, 1024, 1440+.

- No horizontal page scroll
- Code blocks scroll internally
- Touch targets ≥ 44px for primary controls
- Sticky lesson nav is compact; respect `safe-area-inset-bottom`
- Labs are terminal work: the page is readable on a phone; we do not fake a cluster on a 390px screen
- Header CTA is available in the mobile menu

---

## 25. Accessibility

- Skip link to `#main-content`
- Semantic headings (one visual H1 in the hero)
- Buttons are buttons; links are links
- Focus visible (gold outline)
- `prefers-reduced-motion` honored
- Progress uses `role="progressbar"` with now/min/max
- Completion control names the state
- Form labels on the assessment
- Sticky nav does not trap focus
- Keyboard: existing `[` `]` for adjacent published days

---

## 26. Keyboard behavior

- `[` previous published program day
- `]` next published program day
- `Escape` closes search and mobile menus
- Skip to practice is a same-page hash link

---

## 27. Empty states

- No published days: “No daily lessons are published on this site yet.”
- No progress: Start Day 1, 0 / 120
- Search no hits: existing empty search copy

---

## 28. Error states

- Unknown slug: existing missing-lesson / 404
- Progress parse error: empty progress, site still works
- Next day unpublished: wait copy, no dead button to `/learn/day-04`

---

## 29. Disabled / future content

`enabled: false` or non-active status: not a public lesson. Continue ignores it.

Future AI / Agentic AI programs stay dormant until enabled with real content. Do not render empty program switchers.

---

## 30. Unpublished content

Planned rows on the map. Not stub articles. Continue wait-state names the next planned title from `programs.json`.

---

## 31. Direct navigation to days

Allowed for any published slug. Sets lastVisited and started. Does not complete. Does not rewrite history of earlier days.

---

## 32. Search behavior

Existing metadata search. Improvement: a program day is labelled **Day N**, not generic “Lesson.” Queries like `day 1` and `day-01` already normalize.

Must not index private repository paths, author-only files, or internal authoring directories.

Full-text body search is P2.

---

## 33. Privacy boundary

Public output must never contain:

- the private mastery authoring repository URL (any host or protocol)
- blob / tree / raw / issues links to that repository
- author-only file names as learner destinations
- internal authoring directories (`daily-learning/`, `roadmap/`, `break-fix/`, …)

Validation: `lib/learner-surface.js` + `npm run validate`.

If a UX idea needs the private repo, the idea is wrong. Redesign the UX.

---

## 34. Social / community role

Instagram: `https://www.instagram.com/theairishi/`
Telegram: `https://t.me/theairishi_official`
GitHub: hidden
YouTube: coming-soon

They must not appear above the program on the homepage. They are not the learner loop.

---

## 35. Future AI program integration

Architecture: `/learn` is the featured program. `/programs/{slug}` for others. `getLearnerCatalog(programId)` is parameterized.

Do not expose an AI program until it is enabled and has real lessons.

---

## 36. Future Agentic AI integration

Same as §35. Dormant.

---

## 37. Anti-gamification principles

No streaks, hearts, leagues, XP, points, leaderboards, confetti, fake learner counts, testimonials, partner logos, certificates-as-the-product.

Progress is a count of days the learner marked complete. That is enough.

---

## 38. Performance principles

- Server-render the lesson body
- Client islands only for progress-aware chrome
- No Redux / Zustand for this
- Do not add dependencies
- Keep dual Vercel + Cloudflare embed path; no runtime `fs` in production
- Sticky nav must not cause layout jump (reserved height)

---

## 39. Acceptance criteria

A demanding reviewer should be able to:

1. Land on `/`, know this is DevOps Engineer Mastery, start Day 1.
2. Open `/learn`, see 0 / 120, Phase 1, Start Day 1, the map.
3. Open Day 1, see outcomes, time, assessment, practise, gate.
4. Mark Day 1 complete, get Continue Day 2, see 1 / 120.
5. Leave Day 3 halfway, return via homepage Continue Day 3.
6. Complete Day 3 first; continue still offers Day 1.
7. See a wait state after completing all published days.
8. Use the site at 390px without horizontal scroll.
9. Tab through controls; focus is visible.
10. Find “Day 1” in search without seeing authoring paths.
11. Never see the private authoring repository.
12. Keep Telegram and Instagram as secondary destinations.

---

## Implementation map

| Concern | Module |
| --- | --- |
| Progress v1 | `lib/learner-progress.js` |
| Continue algorithm | `lib/continue-learning.js` |
| Heading kinds | `lib/lesson-rhythm.js` |
| Catalog for client | `getLearnerCatalog()` in `lib/programs.ts` |
| Tests | `scripts/learner-progress-test.js` (invoked from validate) |
| `/learn` | `ProgramCommandCenter` |
| Lesson header | `LessonHeader` |
| Completion | `DayCompletion` |
| Sticky nav | `LessonStickyNav` |
| Homepage / header CTA | `SmartCta` |

P0 is the loop. P1 is rhythm, sticky nav, mobile, skip, search labels, `/programs/devops`. P2 stays out of this branch.
