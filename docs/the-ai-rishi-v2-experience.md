# THE RISHI INTERFACE

Experience definition for the immersive rebuild on `feature/immersive-visual-upgrade`. Written before the layout change it describes. This is the source of truth for that change.

## Honest audit

### What the branch actually is

Through `9565ac4`, the homepage is still a document with a WebGL decoration.

The sticky desktop hero (`app/universe.css`, the `min-width: 960px` block) is a two-column landing composition: a serif title, a stat line, and a paragraph on the left; `CurrentWorkCard` on the right; a gradient scrim so the type reads. The lotus, rings, particles, and eleven-node net sit behind that card. `CameraRig` looks at `y = 0.78`, which parks the object in the lower half, inside the card. Scroll mostly scales and fades the same meshes. The beat label changes words. That is not a state machine. The page below the hero is still a kicker, a heading, a paragraph, then a widget, then numbered `SectionFrame`s.

The constellation, method rail, ownership split, pointer halo, footer seed, and progress-driven light are real. They are not enough. A visitor still reads “website, and also a 3D object.”

Named failures:

- **Static.** Header, method, why, destinations, and the closing CTA do not share a world state with the scene.
- **Linear.** Sections stack. Nothing bridges them except a one-pixel rule.
- **Card-based.** The shift ticket is the visual hero. Destinations and the path/community block are still panels.
- **Template-like.** Kicker + serif heading + muted paragraph is the section grammar.
- **Predictable.** One scroll number rotates rings and opens petals. There is no change of subject.
- **Disconnected.** `/learn`, lessons, projects, and about share a tone attribute and an ambient field. They do not feel like rooms of one instrument.
- **Interaction-light.** The halo and magnetic CTA are the pointer language. Touch correctly does nothing custom, and desktop does not do much more.
- **Generic.** Gold lotus on black is closer to a premium template than to a system you entered.

### What the previous research actually was

`docs/immersive-web-research.json` has 375 rows and a few real fetches (Awwwards SOTY canon, School of Motion 2026, Colorlib stacks, FWA, CSSDA, Godly). Most technique fields are category playbooks. Lando Norris’s `heroTechnique` is “A hero film or a live object,” the sports template, while the only specific observation is parked in `standoutFeature`. Tag counts were inflated by matching the word “3d” inside those templates, then retagged. `docs/interaction-patterns.json` explains patterns with “it shows up in {refs} because…”. Row count was not research. v2 replaces that file’s role. v1 stays in the repo as the record of the mistake.

## Experience thesis

THE AI RISHI is an instrument you enter, not a brochure that contains one.

Ancient influence is geometry, symmetry, proportion, and calm. Modern influence is a network that changes state when you scroll, point, or complete a day. There is no monk, no temple, no Sanskrit ornament, no brain, no purple AI fog, no cyberpunk grid.

The homepage is one persistent world. Scroll does not reveal the next card. Scroll changes which layer of the same world is the subject: seed, structure, engineering lattice, knowledge net, then the curriculum constellation. Real lesson progress lights that world. It never invents progress.

## Emotional journey

1. **What am I looking at?** A dark field. A small geometric seed. Almost no interface.
2. **Something woke.** The seed opens. Type arrives as material, not as a headline block.
3. **This is reacting.** Pointer drift and scroll move the camera and the type together.
4. **This is a path.** The net becomes eleven phases. The next room is the 120-day constellation.
5. **I can study here.** The continue lock, then `/learn` and the lesson, get quieter on purpose.

## First 30 seconds

| Moment | What is on screen | What it is not |
| --- | --- | --- |
| 0.0s | Full-viewport field. Seed at the optical center. Program name in the lower third only. No shift card. No paragraph. | Logo + title + paragraph + CTA + lotus beside text |
| 0–2.6s | Non-blocking boot line (Dormant → 120-day path → Signal). Pointer or key dismisses it. Session remembers. Reduced motion skips it. | A blocking loader |
| ~0.5s | World leaves Void for Awaken without a click. Header readout matches. | A spinner |
| Scroll | Camera approaches, orbits, then pulls back as the eleven-node net replaces the lotus as the subject. Words shear with the state. | A background that rotates while the layout stays put |
| Release | Sticky world lets go. The continue card is the lock after the sentence, not the sentence. | The card glued to the first viewport |

The header Smart CTA and the lock both still open the real next lesson. The product is not hidden to look artistic.

## Motion language

Motion is a change of state, not a fade-up.

- **Authored camera path** keyed to scroll, plus a very small idle drift and a smaller pointer offset.
- **Subject change.** Lotus is the subject early. The knowledge net is the subject later. They are the same scene.
- **Type tracks and baseline** change with the world. Default type is visible before JavaScript. `data-world` never hides the heading.
- **One rule** at the bottom of the instrument fills with scroll. That is the only “progress bar,” and it is the world’s, not a marketing meter.
- Micro-motion (magnetic link, tilt on the lock, halo) stays secondary.

Rejected as a primary language: fade in, translate 14px, stagger 100ms. Those may exist inside the product card. They are not the homepage.

## Visual language

Ink `#08080b`, cream `#f3eee4`, gold `#d4b46a` / `#f0d090`, circuit `#8b7cff`, signal `#67e8f9`. Serif for the name. Mono for instrumentation.

The first viewport is center-weighted and empty on purpose. Density arrives in the constellation, where density is the product. No corner HUD, no fake terminal, no scanlines.

## 3D language

One Canvas, one frame loop, no postprocessing stack.

Layers:

- **Seed / lotus** — foreground subject while the world is young. Folds away as the net takes over. Not a character.
- **Rings and circuit loops** — midground structure. Spread and tilt by world, not by a single rotation speed.
- **Particles** — depth. Tight while dormant, wider in engineering, slightly gathered when the net is the subject.
- **Eleven-node net** — the curriculum’s geometry. Reveal is `max(scroll, mastery)`. Nodes light from completed days, not from a fake counter.
- **Light** — one key that brightens with boot, scroll, and mastery.

A small shader on the seed breathes with boot and mastery so the core is not a static glam mesh. No extra library.

## Typography language

The `h1` is the program title, split into word spans that are the text (not a duplicate, not `aria-hidden`). JavaScript does not rewrite the heading every frame.

Per world, CSS changes tracking and the odd/even baseline. Semantic text stays put for search and screen readers.

The long `heroDescription` moves out of the instrument into the lock, so the sentence still exists and is still editable from platform copy. It is no longer the first thing you read.

## Interaction language

- Pointer moves the camera and the light a little. It does not hide the OS cursor.
- Touch does not drive the pointer. Device tilt may, and only by a small amount, with no permission prompt.
- Magnetic pull on the “Enter the path” link and on the continue CTA.
- Phase nodes in the constellation stay buttons. Day dots stay links. We do not turn 120 days into 120 keyboard traps inside the SVG.
- Hover on a phase isolates it the way `JourneyMap` already does. The home treatment gives that map the room.

## Navigation model

The command bar stays visible: logo, primary links, Explore, search, Smart CTA, mobile sheet. Discoverability is not sacrificed to a radial menu.

On the homepage only, a readout (`#world-readout`) names the current world. It is DOM text written from the scroll measure, not React state per frame. Other routes clear it. Keyboard and the mobile sheet are unchanged.

## 120-day journey model

After the instrument releases, the next room is the constellation: eleven phase structures, day nodes colored by real progress (complete, current, published, planned). The home map is compact; `/learn` keeps titles because a catalogue must be readable.

Phases are not five color themes. On the homepage they are successive subjects of one scene (Wisdom through Signal). In the constellation they are nodes you can open.

## Progress visualization

`useLessonProgress()` → `sceneBus.mastery = completed / total` after hydration, else 0. That number:

- raises key-light intensity
- lights net nodes
- raises particle presence
- is announced in the existing polite live region (“N of total days lit”)

No seeded demo progress. No live “students online” counter.

## Route experience map

| Route | Mode | WebGL |
| --- | --- | --- |
| `/` | Spectacle. The instrument. | Full viewport, paused offscreen |
| `/learn` | Exploration. Constellation plus the title list. | No second scene |
| Lesson | Deep focus. Readable measure. | None. Pointer halo only. |
| `/projects` | Engineering artifacts. Existing tone. | None this pass |
| `/about` | Philosophy. Existing tone. | None this pass |

A second WebGL world on every route would burn the phone and make lessons loud. Continuity is the shared type, color, halo, and the fact that the homepage’s net is the same eleven phases as `/learn`. Route changes stay native. No view-transition library owns history. Back, forward, refresh, and direct URLs keep working.

## Mobile experience

Same instrument, shorter score.

- The scene is the first viewport (`100svh`), not a 62svh video slot with copy overlapping it.
- The track is about `168vh`, so scroll still changes world, then lets go. Desktop is `280vh` because the camera story needs room.
- Particle count, DPR, and antialias stay on the existing mobile cuts.
- The continue card is in normal flow under the instrument, full width, not a squeezed second column.
- No custom cursor. Touch targets on day dots stay at least 32px.

## Accessibility model

- Reduced motion: no WebGL loop, `StillCore`, no boot veil, transitions already crushed to 0.01ms in `globals.css`. The heading, lock, and constellation remain.
- Canvas is `aria-hidden`. Meaning lives in HTML.
- Heading order stays `h1` then section `h2`s.
- Focusable controls: header, enter link, continue CTA, phase buttons, published day links, search.
- The world readout is visual instrumentation, `aria-hidden`, so it does not chatter on scroll.
- Contrast: cream on ink. Gold is for labels, not for body text.

## Performance model

- `three` and `@react-three/fiber` only. Re-evaluated and not added: GSAP, ScrollTrigger, Lenis, Rive, Theatre.js, Drei, postprocessing, WebGPU. Reason: the failure was composition and state, which a frame loop and CSS already express. A timeline library would not move the card out of the hero. Cost of those runtimes is a second animation clock and more JS for a difference the visitor would not be able to point at.
- Dynamic import, `ssr: false`. Error boundary falls back to `StillCore`.
- `frameloop="never"` when the track is offscreen or the tab is hidden.
- No `setState` in the frame loop. Scroll writes `sceneBus` and `dataset.world`.
- DPR capped. Antialias off on coarse pointers.
- Boot interval stops once `boot` has reached 1 and the world has left Void.

## Technical architecture

```
sceneBus  { scroll, px, py, boot, mastery, world, visible, mobile }
UniverseStage  scroll + boot interval → sceneBus.world, documentElement.dataset.world, #world-readout text
RishiScene     useFrame reads the bus. Camera path, subject mix, seed shader.
ProductHero    instrument overlay only
ProductHome    world-lock (description + CurrentWorkCard) after the stage, then constellation
```

`dataset.world` is `void | awaken | wisdom | foundation | engineering | intelligence | signal`.

World thresholds on track progress, after boot has opened:

| World | Progress |
| --- | --- |
| void | boot < 0.25 and progress < 0.02 |
| awaken | progress < 0.08 |
| wisdom | < 0.22 |
| foundation | < 0.40 |
| engineering | < 0.58 |
| intelligence | < 0.78 |
| signal | else |

## Rejected ideas

- **Keep the shift card in the first viewport and animate it more.** That is the landing page the review rejected.
- **Hide the heading until WebGL boots.** Flash of invisible content, and a blank first paint if JS is slow.
- **Per-character SplitText.** Hydration risk and a noisy screen-reader experience. Words are enough.
- **120 clickable SVG day nodes.** Tab order and hit targets get worse; day links already exist under each phase on `/learn` and as dots.
- **Lenis or a page-transition router.** Native scroll and native history are the product’s reliability.
- **Radial nav.** It hides Learn.
- **`cursor: none`.** Touch and accessibility lose.
- **GSAP this pass.** See performance model.
- **A second full scene on lessons.** Spectacle where focus belongs.
- **Mascot, brain mesh, Sanskrit, temple, Matrix rain, neon city.** Identity collisions called out in the brief.
- **Fake progress, fake student counts, autoplay sound.**

## Signature moments

1. The first viewport has no card and no paragraph. The seed is the subject.
2. Boot is a three-line ritual you can skip, and it never blocks the header.
3. Leaving Void for Awaken happens by itself, and the header names it.
4. Scroll dollies in. The camera is the sentence.
5. Foundation shears alternate words. Type is in the state machine.
6. Engineering speeds the lattice. The subject gets sharper, not just bigger.
7. Intelligence pulls back. The eleven-node net replaces the lotus as what you are looking at.
8. Signal releases the sticky world into the continue lock.
9. The lock uses the real continue target, including the waiting state when nothing new is published.
10. The constellation is the next room, lit by real completions.
11. Completing days (local) brightens the core even if you have not scrolled.
12. Pointer drift is felt and the OS cursor stays.
13. Reduced motion still explains the program, the path, and the next lesson.
14. Mobile is the same centered instrument, not a shrunken two-column hero.
15. `/learn` is quieter than home and still the same eleven structures.

## Libraries, restated

Not added. The visible bar is whether the first viewport stops looking like a landing page. That is a layout and state problem. The frame loop is the motion runtime.
