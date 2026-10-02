# THE AI RISHI — experience spec

Status: adopted for `feature/immersive-visual-upgrade`. This is the contract for the homepage universe. It is an original synthesis. It is not a clone of Active Theory, Lando Norris, Apple, Lusion, or Unseen.

Evidence sits in [immersive-web-research.json](./immersive-web-research.json) and [immersive-web-research.md](./immersive-web-research.md).

## The sentence

A person opens the site and is already inside a knowledge system. One object — the Rishi core — wakes, answers the pointer, and changes state as they scroll from wisdom to signal. Their real lesson progress decides how much of that system is lit. The curriculum underneath stays readable, searchable, and free.

## What this is not

- Not a nicer editorial page with a canvas in the corner.
- Not a game, a driveable CV, or a radial menu.
- Not a temple, a guru, a saffron gradient, or an AI brain.
- Not a stack of GSAP, Lenis, Rive, bloom, and postprocessing.
- Not a loading gate.

## Tier A — signature (this branch)

1. **One persistent core.** Lotus, inner wire, rings, circuit loops, particles, and an 11-node knowledge net in one WebGL scene. The scene is the viewport, not a side panel.
2. **Scroll is the morph.** Wisdom → Foundations → Engineering → Intelligence → Signal, over a tall track. The lotus folds. The net forms. The copy rides the same object.
3. **Progress is physical.** `sceneBus.mastery` is completed days / 120, from the existing local progress store. Zero is dormant: dim nodes. Progress lights nodes and raises the core's light. Scroll can still reveal the path to a new visitor. We do not invent progress.
4. **Awakening, not a spinner.** A short, non-blocking sequence (dormant → 120-day path → signal). Pointer events pass through. It does not replay in the same session. Reduced motion skips it.
5. **The path is a constellation.** Eleven phases, day-dots, gold / now / quiet, driven by `useLessonProgress()`. The phase list remains for scanning.
6. **One continuous page.** Method rail and the ownership balance continue the same geometry. The footer returns to the seed.

## Tier B — adopted in a small form

- Pointer halo with link, CTA, node, and object states. Magnetic CTAs. Tilt on the shift card and method steps. No custom cursor. Off on touch.
- Page atmosphere by route (`data-tone`) so learn, guides, projects, and about are not the homepage scene and not a blank template.
- Kinetic title tracking tied to scroll (`--awakening`). The words stay in the HTML heading.

## Tier C — already present, not the focus

Search motion, button sheen, lesson meter, logo orbit.

## Explicitly rejected

| Idea | Where it is brilliant | Why it is wrong here |
| --- | --- | --- |
| Smooth-scroll hijack (Lenis, Locomotive) | darkroom, Locomotive, Pangram | Breaks anchor jumps, find-in-page, and reduced motion. Native scroll stays. |
| GSAP + SplitText + Rive | Lando Norris | We already have one frame loop and CSS. A second timeline system is weight, not identity. |
| Bloom / DOF / postprocessing | Lusion, Active Theory | Mobile GPU and the Cloudflare bundle. Fake glow with an additive sphere instead. |
| WebGPU | IVRESS | Two renderers to maintain. WebGL 2 is enough. |
| Drivable world | Bruno Simon | Wrong genre. A course is not a physics toy. |
| Radial or hidden navigation | Orano, some exhibition sites | 120 days must be findable. The command bar stays. |
| Autoplay sound | Mammut, Spectral Field, Cartier | Never. If sound ever exists it is opt-in and off by default. |
| Page-transition library that owns history | Taxi.js, Barba, Highway | Back, forward, refresh, and direct URLs are part of the product. |
| Mascot path | Duolingo | Generic the moment it ships. |
| Fluid "AI" walls | Refik Anadol clones | The look of 2023 keynote slides. |
| Sanskrit, temples, saffron, lotus clip-art | — | Geometry can be radial and calm. Costume cannot. |
| Fake live data | Flightradar, Listening to Wikipedia | We have lesson progress and a catalog. Nothing else. |

## Scroll story

| Scroll | Beat | Object |
| --- | --- | --- |
| 0 | Wisdom | Core closed, particles waking, copy present immediately |
| ~0.25 | Foundations | Rings spread, circuit loops readable |
| ~0.5 | Engineering | Lotus flattens, light cools toward cyan |
| ~0.75 | Intelligence | 11-node net is the subject |
| 1 | Signal | Net holds, particles gather, the constellation section takes the page |

The HTML (title, today's shift, phase list, lesson links) is the accessible interface. The canvas is `aria-hidden`.

## Progress rule

- Source: existing `useLessonProgress()` / local store. No new account system.
- Before hydration: mastery is 0, so server and client agree.
- `mastery = completedCount / catalog.totalDays`.
- Nodes `0 .. floor(mastery * 11) - 1` stay lit even at scroll 0.
- Scroll past the intelligence beat reveals the rest, so a new visitor still sees the system wake.
- The line "N of 120 days lit" is real text, not a canvas label.

## Stack

- `three` and `@react-three/fiber` only, dynamically imported, `ssr: false`.
- A mutable `sceneBus` so React does not render per frame.
- `frameloop="never"` when the stage is offscreen or the tab is hidden.
- DPR capped. Fewer particles on coarse pointers.
- Still SVG core when `prefers-reduced-motion: reduce` or the scene throws.

## Mobile

Same object, shorter stage, copy and the shift card in normal flow (not clipped inside `100svh`). Particles and DPR drop. No tilt-to-scroll hijack beyond a light orientation offset. The card and the header CTA remain tappable.

## Pages

- Home: the universe.
- Learn: the constellation plus the existing command center. Not a second WebGL world.
- Lesson: reading first. Halo and a quiet focus field. The meter is real progress.
- Guides, projects, about: shared atmosphere tones, same type, no competing scene.

## Success checks

1. The first screen is the system, not a document with a decoration.
2. Depth is obvious without a caption.
3. Scrolling changes the object, not just the page position.
4. The core keeps moving when idle.
5. Pointer and progress change the light.
6. A visitor with no progress sees a dormant system, not a lie.
7. Phone width does not overflow and does not trap the card.
8. Reduced motion still explains the program.
9. It is not a studio template and not an AI-gradient landing page.
10. The 120-day path, search, and lesson routes still work.

## Out of scope for this pass

A second WebGL scene on project pages, a view-transition framework, audio, and a rewrite of the command bar. Those failed the performance or usability test in the research.
