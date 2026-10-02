# THE AI RISHI — immersive web research

Research date: 2026-10-02.

- Dataset (machine-readable, one source per site): [immersive-web-research.json](./immersive-web-research.json)
- Patterns: [interaction-patterns.json](./interaction-patterns.json)
- Spec that follows from this: [the-ai-rishi-experience-spec.md](./the-ai-rishi-experience-spec.md)

## What was actually fetched

This is not a claim that every homepage was screenshotted in one sitting. Every dataset row has a `source`.

Read on 2026-10-02:

- [Exhibita — every Site of the Year](https://exhibita.design/canon.html). Thirty-one annual winners. The essay’s point: about twenty-five are tagged 3D, WebGL, or Three.js. The yearly prize goes to sites that render. Studios win it with their own sites (Lusion, Active Theory, Noomo, Synchronized). Pangram Pangram is the counterexample: a type foundry, no 3D, still in the canon.
- [Awwwards Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/). Thirty entries, 2017–2025, with studios.
- [Annual Awards 2025](https://www.awwwards.com/annual-awards-2025). Site of the Year: Lando Norris. Developer: Messenger (abeto). E-commerce: Scout Motors. Agency: Immersive Garden. Studio: Malvah. Independent: Louis Paquet.
- [School of Motion — animation sites, 2026](https://schoolofmotion.com/blog/websites-with-great-animation-2026). Ten sites, ten different ideas: Epic (type), BDSN (cursor experiments), Dropbox Brand (motion that teaches), Eszter Bial (restraint), Apple (scroll films, performance), Unseen (navigation as craft), Rive (the product animates itself), Lusion (3D that stays smooth), Uncommon (stagger and rhythm), Active Theory (WebGL pacing and theatrical project reveals).
- [Colorlib — 25 animated sites, 1 Oct 2026](https://colorlib.com/wp/animation-websites/). Stacks taken from the code. Lando Norris: Webflow, GSAP, ScrollTrigger, SplitText, three.js, Rive, Lenis, Taxi.js. Active Theory: custom WebGL, Theatre.js, and a real fallback when WebGL cannot run. Graza: a pause control on the first keystroke. darkroom.engineering (Lenis) stays under a megabyte. Bruno Simon: a game you drive.
- [Hontran, juror, 27 Jun 2026](https://www.hontran.dev/blog/best-award-winning-websites-2026). Three gates: a point of view, directed motion, ~60fps on a mid-range phone. Miss one and the score sits in the mid-7s. Named: By-Kin, Iventions, Mat Voyce, Uncommon Studio, Minh Pham, plus Active Theory, Lusion, Resn, Obys, Unseen as ceilings.
- [Utsubo — 8 Three.js sites, 2026](https://www.utsubo.com/blog/best-threejs-websites-2026). One hard idea each (inertial product, WebGPU+WebGL, a branded micro-game, scroll-sequenced release, B2B monolith, illustrated scroll, landscape flythrough, museum alcoves). WebGPU went mainstream in their picks. Stacking effects is how sites miss.
- [Godly — WebGL](https://godly.website/websites/webgl). Sixty-one sites. Sampled: Lusion, Opal, Stripe Sessions, OFFICE, EPIC, Unseen, Basement.
- [FWA hall of fame](https://thefwa.com/about/hall-of-fame/). Merci Michel and Immersive Garden inducted in 2026. Active Theory and Resn earlier. Bruno Simon won both FWA of the Year 2025 prizes — the first solo project to do that.
- [Lineage on CSS Design Awards](https://www.cssdesignawards.com/sites/lineage/47975/) and [Spectral Field](https://www.awwwards.com/sites/spectral-field). Light as a material. Audio as a deterministic drawing. We do not autoplay.
- [Where Worlds Take Shape](https://www.awwwards.com/sites/where-worlds-take-shape), SOTD 3 May 2026. Creativity 7.74, usability 6.81. A playable world loses the usability third of the score. That trade is rejected.
- `https://activetheory.net/work` was requested. The fetch returned no project HTML, so Active Theory is cited from School of Motion, Colorlib, and the FWA, not from a scraped case list.

Everything else in the JSON is canonical work in the spread the brief asked for: brands, products, NFB documentaries, learning systems, generative artists, installations, and tools we considered and mostly did not install. Duplicate URLs were removed. Where a live URL was not on the fetched page, the award case URL is the record.

## Distribution

Primary category is exclusive. Tags overlap, which the brief allowed. A WebGL story filed under storytelling still carries `webgl-3d`.

| Category | Primary | Tagged | Minimum |
| --- | ---: | ---: | ---: |
| creative / experimental | 37 | 48 | 40 |
| premium brands | 35 | 35 | 30 |
| WebGL / 3D | 17 | 79 | 30 |
| portfolios / studios | 57 | 57 | 25 |
| product | 70 | 70 | 20 |
| storytelling / editorial | 43 | 43 | 20 |
| experimental / generative | 26 | 30 | 15 |
| education / knowledge | 64 | 64 | 10 |
| sports / entertainment | 26 | 26 | 10 |

Unique rows: see `meta.uniqueSites` in the JSON (300+). Tagged counts clear every minimum. Primary `webgl-3d` is lower because Lusion, Igloo, Iventions, and the SOTY cases are also studios, products, or stories.

## Field notes, 2026

1. The work that wins the year is a world with one mechanic. A planet and a driver. A scene that is the menu. A scroll that changes the picture every step. A car you drive. Not a document with transitions.
2. The work that stays usable keeps sentences in HTML. Stripe, Apple, Aesop, the NYT, Iventions (a CMS under the WebGL). Playable portfolios give that up and the usability score shows it.
3. Juries are grading frame rate. A mid-range phone is part of the brief. Colorlib names libraries because the stack is now part of the critique.
4. GSAP + Lenis + Rive + a smooth-scroll hijack is the monoculture. Shipping that stack makes a competent clone. It does not make this platform.
5. The best knowledge products barely move. Khan, Distill, Nicky Case, MDN, The Odin Project, freeCodeCamp. If our canvas does not carry a real state (phase, day, progress), it is decoration.
6. Visuals people love about themselves (Wrapped, Strava, a contribution graph) are loved because the data is real. A dormant core for a new learner is more honest than a fake live network. Do Not Track is the cautionary personalized documentary: do not surveil, do not invent.

## What The AI Rishi takes

- One core. Scroll morphs it through five beats. Copy stays in the DOM.
- Lesson progress, from the existing local store, lights nodes and the key light. Scroll can still wake the system if progress is zero.
- The 120 days are a constellation of phase buttons plus day dots. The scannable list stays on `/learn`.
- A boot sequence that cannot block a click, does not replay in the session, and does not run for reduced motion.
- Pointer-driven light. Magnetic primary actions. The system cursor stays. The halo is off for touch.
- Lessons stay reading environments. No second WebGL world per route.

## What it refuses

Lenis or Locomotive owning the scroll. GSAP, Rive, drei, postprocessing, WebGPU. A drivable page. Radial global navigation. Autoplay sound. A mascot path. Purple AI mesh and glass. Fluid “data sculpture” walls. Temples, saffron, Sanskrit as costume. Fake concurrent-user counters. Headings drawn only in the canvas. View-transition libraries that break the back button.

The 100 patterns, each with the eight required notes, are in [interaction-patterns.json](./interaction-patterns.json). The decisions above are the synthesis. The spec is the build contract.
