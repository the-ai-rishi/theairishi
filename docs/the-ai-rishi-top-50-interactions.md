# Fifty interactions for THE RISHI INTERFACE

Each one is a decision, not a decoration. “Shipped” means this pass. “Held” means considered and not built, with the reason. References are sites in [immersive-web-research-v2.json](immersive-web-research-v2.json).

## 1. The first viewport is the instrument

- Concept: no title column, no paragraph, no continue card. The geometry is centered. The name sits in the lower third.
- Reference: Apple iPhone product films; Things, where the object is the sentence.
- Why it works: a card beside a render is a landing page even if the render is WebGL.
- Implementation: `ProductHero` is an overlay. `CurrentWorkCard` moved to `.world-lock`.
- Relevance: this was the review’s actual complaint.
- Performance: none. It removes a component from the sticky layer.
- Accessibility: the `h1` stays HTML and is visible before JavaScript.
- Mobile: same composition, not a stacked miniature of the desktop grid.
- Status: shipped.

## 2. Seven-state world

- Concept: void, awaken, wisdom, foundation, engineering, intelligence, signal. One index drives the label, the header, and CSS.
- Reference: Rive’s state machines, without the runtime. Carbon’s split of expressive vs productive motion.
- Why it works: a single scroll float that only rotates rings is not a narrative.
- Implementation: `worldIndex()` in `scene-bus.ts`. `documentElement.dataset.world`.
- Relevance: the homepage’s score.
- Performance: a class on `<html>`, not a React render per frame.
- Accessibility: the readout is `aria-hidden`. The heading does not depend on the state to exist.
- Mobile: the same index, on a shorter track.
- Status: shipped.

## 3. Authored camera

- Concept: far seed, dolly in, yaw through the middle, pull back when the net is the subject. Idle drift. Small pointer offset.
- Reference: Porsche and Apple camera arcs, scaled down to one procedural object.
- Why it works: the camera is the verb. Scale-on-scroll is not.
- Implementation: `CameraRig` in `RishiScene.tsx`. Look-at is near the origin, not `y = 0.78`.
- Relevance: the old look-at parked the lotus in the card.
- Performance: one lerp per frame inside the existing loop.
- Accessibility: reduced motion never starts the loop.
- Mobile: same path, lower DPR.
- Status: shipped.

## 4. Subject change, lotus to net

- Concept: the lotus folds as scroll passes engineering. The eleven-node net becomes what you are looking at.
- Reference: Apple chapters of one object. Not a page of unrelated sections.
- Why it works: the curriculum has a shape. The shape should take over.
- Implementation: fold on the lotus group, reveal on `KnowledgeNet` from scroll 0.42, or from mastery if that is higher.
- Relevance: 11 phases, not a generic sphere.
- Performance: same meshes, different uniforms and scales.
- Accessibility: the constellation below is the readable version of the same eleven.
- Mobile: fewer particles, same handoff.
- Status: shipped.

## 5. Seed shader

- Concept: the core breathes with boot and mastery. Fresnel, not a bloom pass.
- Reference: Shadertoy as a warning (fullscreen shaders melt phones) and as a material idea.
- Why it works: a static glam mesh reads as a sticker.
- Implementation: one `ShaderMaterial` on the seed sphere.
- Relevance: life without postprocessing.
- Performance: one small fragment shader. No fullscreen pass.
- Accessibility: decorative. Canvas is hidden from assistive tech.
- Mobile: the shader is cheaper than bloom.
- Status: shipped.

## 6. Word-level kinetic type

- Concept: the title splits into words. Worlds change tracking and odd/even baseline.
- Reference: Codrops kinetic type, deliberately not copied at character level. Practical Typography: type must then sit still.
- Why it works: type joins the state machine without leaving HTML.
- Implementation: word spans inside the `h1`. CSS on `html[data-world]`.
- Relevance: the name is material, not a headline block.
- Performance: CSS transitions, not per-frame DOM writes.
- Accessibility: the words are the accessible name. Not `aria-hidden`. Not per-character.
- Mobile: the same words, smaller clamp.
- Status: shipped.

## 7. Non-blocking boot

- Concept: Dormant, 120-day path, Signal. About 2.6 seconds. Pointer or key dismisses. Session remembers.
- Reference: Arc’s long tour is the warning. Emil Kowalski on interruption.
- Why it works: a ritual, not a spinner, and never a gate.
- Implementation: existing `.awaken` veil.
- Relevance: entry without a loading screen.
- Performance: a few lines of CSS.
- Accessibility: `aria-hidden`, skipped entirely for reduced motion.
- Mobile: same, and it does not block the menu.
- Status: shipped.

## 8. Header as instrumentation

- Concept: the command bar names the world you are in.
- Reference: Raycast’s palette as a feeling, not as a second UI. Stripe’s nav as the thing we keep.
- Why it works: navigation participates without becoming a radial menu.
- Implementation: `#world-readout`, text written from the scroll measure. Cleared on unmount.
- Relevance: the bar was a normal navbar floating over a scene.
- Performance: textContent on state change, not per frame.
- Accessibility: `aria-hidden`. Links, search, and the Smart CTA stay.
- Mobile: readout hidden. The on-scene beat label remains. The menu stays a menu.
- Status: shipped.

## 9. Scroll rule

- Concept: one line at the bottom of the instrument fills with track progress.
- Reference: the scrollbar as table of contents, from Snow Fall, made explicit.
- Why it works: you can see that scrolling is doing something before you understand the geometry.
- Implementation: `.universe-sticky::before` width from `--awakening`.
- Relevance: replaces a fake page progress widget.
- Performance: one CSS variable per scroll event.
- Accessibility: decorative.
- Mobile: same line.
- Status: shipped.

## 10. World lock

- Concept: after the sticky world lets go, the continue card and the programme description appear.
- Reference: Nike, where the film never blocks the shop. GOV.UK, where the task is labeled.
- Why it works: spectacle ends. The task begins. Both are on the page.
- Implementation: `.world-lock` after `UniverseStage`. Description comes from `copy.heroDescription`.
- Relevance: the card was the hero. It is now the payoff.
- Performance: ordinary React.
- Accessibility: real heading, real button, the existing continue logic including the waiting state.
- Mobile: one column. Card full width.
- Status: shipped.

## 11. Constellation as the next room

- Concept: eleven phase buttons, day dots colored by real progress, larger on the homepage.
- Reference: roadmap.sh’s ticking nodes, Duolingo’s path scaled up to phases, GitHub’s contribution squares for honesty of state.
- Why it works: the 120 days are the product. A card list hides that.
- Implementation: existing `JourneyMap`, given more height via `.constellation-world`.
- Relevance: already the best part of the previous pass. It needed the room.
- Performance: SVG, no second canvas.
- Accessibility: phase buttons and day links. Not 120 tab stops inside the SVG.
- Mobile: the map shrinks. Dots keep their hit area.
- Status: shipped, enlarged.

## 12. Mastery lights the world

- Concept: completed / total, after hydration, raises the key light, lights net nodes, and feeds the seed shader.
- Reference: The Pudding (the data is the visual). Khan’s mastery color. Ink & Switch local-first.
- Why it works: otherwise the scene is a screensaver.
- Implementation: `ProgressSignal` writes `sceneBus.mastery`. No fake seed data.
- Relevance: “real progress influences the visual.”
- Performance: one number, read in the frame loop.
- Accessibility: polite live region, already there.
- Mobile: same number, cheaper scene.
- Status: shipped earlier, still wired. The shader now uses it too.

## 13. Pointer halo, not a cursor replacement

- Concept: a ring that changes near links, nodes, and the scene. OS cursor stays.
- Reference: Cuberto is the rejection. Rauno Freiberg is the scale of detail we want.
- Why it works: you feel proximity without losing the browser’s affordances.
- Implementation: existing `PointerHalo`. Touch ignored.
- Relevance: the brief’s pointer section.
- Performance: one element, transform on pointermove.
- Accessibility: keyboard focus styles stay on the controls. No `cursor: none`.
- Mobile: off.
- Status: shipped earlier. Not replaced with a particle cursor.

## 14. Magnetic enter link

- Concept: “Enter the path” eases toward the pointer and jumps to `#path`.
- Reference: Fitts’s law (Laws of UX). The link is a real target, 44px tall.
- Why it works: one invitation, not three CTAs.
- Implementation: `data-magnetic` on the anchor. Header Smart CTA remains the lesson shortcut.
- Relevance: the hero no longer contains the continue card, so the path needs a door.
- Performance: existing magnet code.
- Accessibility: it is an anchor. Keyboard activates it.
- Mobile: no magnet. The link is still there.
- Status: shipped.

## 15. Tilt on the continue card

- Concept: the lock tilts slightly with the pointer.
- Reference: Rauno-scale, not a 3D card gimmick.
- Why it works: the card is now a physical object in the lock, not the page’s purpose.
- Implementation: existing `data-tilt` on `CurrentWorkCard`.
- Relevance: kept because the card survived, relocated.
- Performance: inline transform.
- Accessibility: reduced motion kills the transition.
- Mobile: off with the pointer code.
- Status: already present, still on the moved card.

## 16. Offscreen pause

- Concept: the frame loop stops when the track leaves the viewport or the tab hides.
- Reference: OpenProcessing’s autoplay canvases are the failure. Lighthouse is the metric.
- Why it works: a scene that runs during a lesson is a bug.
- Implementation: `frameloop` from `UniverseStage`.
- Relevance: performance is part of the design.
- Performance: the main one.
- Accessibility: irrelevant, except that it stops motion you did not ask for.
- Mobile: more important here.
- Status: shipped earlier, kept.

## 17. Still core

- Concept: reduced motion and WebGL failure get an SVG, not an empty black box.
- Reference: WAI, Apple accessibility, Bruno Simon’s non-drive fallback.
- Why it works: the programme is still explained.
- Implementation: `StillCore` and `SceneBoundary`.
- Relevance: the world is an enhancement.
- Performance: no loop.
- Accessibility: this is the accessible scene.
- Mobile: also the failure fallback.
- Status: shipped earlier, kept.

## 18. Native scroll

- Concept: track progress is `scrolled / (height - viewport)` on the real scroll position.
- Reference: Lenis and Locomotive are the rejections. Remix’s platform lesson.
- Why it works: sticky math and find-in-page and the scrollbar stay honest.
- Implementation: one passive scroll listener.
- Relevance: the state machine must use the real position.
- Performance: cheaper than a smooth-scroll library fighting sticky.
- Accessibility: no scroll hijack.
- Mobile: iOS momentum stays the platform’s.
- Status: shipped. Re-affirmed. Lenis not added.

## 19. No history-owning transitions

- Concept: Home → Learn is a normal navigation.
- Reference: Taxi.js on Lando Norris. Barba. The View Transitions API, held because support is uneven.
- Why it works: back, forward, refresh, and pasted URLs are the product.
- Implementation: nothing. Next.js routing left alone.
- Relevance: the brief allows continuity and forbids hijacking.
- Performance: no transition JS.
- Accessibility: focus and URL stay predictable.
- Mobile: same.
- Status: held, on purpose.

## 20. Islands, not a canvas app

- Concept: the scene is one dynamic import. Copy, lock, map, and header are DOM.
- Reference: Astro’s islands idea, implemented in Next. Igloo’s DOM-over-WebGL.
- Why it works: the meaningful text is crawlable and selectable.
- Implementation: `next/dynamic` `ssr: false`.
- Relevance: SEO and the lesson pages.
- Performance: three.js is not on lesson routes’ first paint more than a shared bundle allows. The import is still deferred.
- Accessibility: canvas `aria-hidden`.
- Mobile: the island can fail to StillCore.
- Status: shipped.

## 21. Boot interval, then stop

- Concept: while the seed opens, a 120ms timer publishes the world so Void becomes Awaken without a scroll.
- Reference: Notion’s blank page must not be the final hero.
- Why it works: the first state is visible, then it leaves on its own.
- Implementation: `setInterval` cleared once `boot` is 1 and the world has left Void.
- Relevance: otherwise Void only exists for one frame.
- Performance: at most a couple of seconds of timers.
- Accessibility: does not move focus.
- Mobile: same.
- Status: shipped.

## 22. Pointer moves light

- Concept: the key light follows the pointer a little.
- Reference: gallery lighting, not a game flashlight.
- Why it works: the object feels lit by you.
- Implementation: point light position in `CameraRig`.
- Relevance: interaction changes the environment.
- Performance: one uniform-level change, already in the loop.
- Accessibility: not required to understand the page.
- Mobile: deviceorientation supplies a small parallax, no permission prompt.
- Status: shipped.

## 23. Engineering speeds the lattice

- Concept: in the engineering band, rings tilt and the lotus turns faster, then calm down as the net arrives.
- Reference: IBM’s expressive motion, used once, not on every section.
- Why it works: the middle of the scroll has a different tempo.
- Implementation: `smoothstep` bands in `OrbitRings` and `LotusCore`.
- Relevance: “one scroll value should not simply rotate rings.”
- Performance: math in the existing loop.
- Accessibility: decorative.
- Mobile: same bands, cheaper meshes (fewer ring segments already).
- Status: shipped.

## 24. Phase buttons

- Concept: each phase in the constellation is a button that scrolls to or selects that phase.
- Reference: Odin Project’s explicit path. Khan’s subject map.
- Why it works: the picture is also the control.
- Implementation: existing `JourneyMap`.
- Relevance: the journey is explorable.
- Performance: DOM.
- Accessibility: buttons with names.
- Mobile: tap targets.
- Status: already shipped, kept.

## 25. Day dots with real state

- Concept: complete, current, published, planned. Planned is not a broken link.
- Reference: OverTheWire’s honesty about levels. Bandit. Advent of Code’s calendar, not copied as ASCII.
- Why it works: you can see the size of the programme without being dumped into 120 pages.
- Implementation: `DayDots`.
- Relevance: the product’s truth.
- Performance: a list of spans.
- Accessibility: published days are links with labels. Planned days are named and not links.
- Mobile: min 32px targets.
- Status: already shipped, kept.

## 26. Search stays a dialog

- Concept: find a lesson by words.
- Reference: ProPublica, Our World in Data, Inclusive Components.
- Why it works: spatial navigation is a bad search box.
- Implementation: existing `SearchModal`. Not restyled into the scene.
- Relevance: immersion must not remove findability.
- Performance: opened on demand.
- Accessibility: dialog pattern, escape to close.
- Mobile: full use.
- Status: kept. Not reinvented.

## 27. Smart CTA

- Concept: the header always offers the real next lesson.
- Reference: GOV.UK start buttons. Baymard’s one primary action. Khan’s next exercise.
- Why it works: you can skip the film.
- Implementation: existing `SmartCta`, `resolveContinue`.
- Relevance: the world does not hide the product.
- Performance: client island, already there.
- Accessibility: a link with a text label.
- Mobile: visible.
- Status: kept.

## 28. Waiting state

- Concept: if the next day is not published, the card says so. It does not invent a lesson.
- Reference: Bandit’s locked levels, handled more politely.
- Why it works: trust.
- Implementation: `CurrentWorkCard` and `resolveContinue`.
- Relevance: “never fake progress” includes never faking a published day.
- Performance: none.
- Accessibility: the text says waiting.
- Mobile: same card.
- Status: kept.

## 29. Lesson quiet

- Concept: lesson routes do not mount the scene.
- Reference: MDN, fast.ai, Full Stack Open, Distill’s figures-in-articles.
- Why it works: contrast. Home is the door. The lesson is the room you read in.
- Implementation: no `UniverseStage` on lesson pages. Pointer halo only, from the previous pass.
- Relevance: route modes in the experience doc.
- Performance: the important split.
- Accessibility: a document.
- Mobile: a document.
- Status: held as a non-change, on purpose. Not “forgotten.”

## 30. Learn stays a catalogue

- Concept: constellation plus titles.
- Reference: Frontend Masters, The Odin Project, Stripe Docs’ table of contents.
- Why it works: a map you cannot list is a poster.
- Implementation: `JourneyMap` with `showTitles` on the learn page. Not rebuilt this pass.
- Relevance: the learn page was already closer to the product than the hero was.
- Performance: no second WebGL world.
- Accessibility: the list is the fallback and the primary reading order.
- Mobile: list.
- Status: kept.

## 31. Reduced-motion CSS kill switch

- Concept: animations and transitions collapse to 0.01ms globally.
- Reference: `prefers-reduced-motion`. iOS HIG motion chapter.
- Why it works: one rule, no forgotten component.
- Implementation: already in `globals.css`.
- Relevance: world CSS transitions are covered.
- Performance: none.
- Accessibility: the feature.
- Mobile: same media query.
- Status: kept.

## 32. Error boundary on the canvas

- Concept: a thrown WebGL error becomes the still core, not a blank site.
- Reference: Chrome Experiments, many of which just die.
- Why it works: the content site underneath is the product.
- Implementation: `SceneBoundary`.
- Relevance: progressive enhancement.
- Performance: none until it fails.
- Accessibility: the fallback is HTML/SVG.
- Mobile: more likely to be the path on old GPUs.
- Status: kept.

## 33. Deterministic layout

- Concept: particles and constellation coordinates come from a hash, not `Math.random`.
- Reference: Obsidian’s force graph is the rejection. Hydration mismatches were a real bug here.
- Why it works: server and client draw the same picture.
- Implementation: `unit()` and rounded constellation coordinates.
- Relevance: a stable instrument, not a reshuffling one.
- Performance: no layout simulation.
- Accessibility: none.
- Mobile: same picture.
- Status: kept.

## 34. DPR and antialias cuts

- Concept: phones get fewer pixels and no antialias.
- Reference: web.dev, Lighthouse mobile throttling.
- Why it works: fill-rate is the usual mobile death.
- Implementation: Canvas `dpr` and `gl.antialias`.
- Relevance: premium mobile does not mean the desktop shader at 3x.
- Performance: the mobile budget.
- Accessibility: none.
- Mobile: the point.
- Status: kept. Particle counts stay lower on `sceneBus.mobile`.

## 35. No OrbitControls

- Concept: the user does not free-orbit the scene.
- Reference: Drei’s OrbitControls fighting page scroll. Mapbox and Cesium, same bug class.
- Why it works: the camera is authored. The page scroll is the input.
- Implementation: not installed.
- Relevance: “do not add a library to sound advanced.”
- Performance: one less system.
- Accessibility: no hidden drag mode.
- Mobile: page scroll remains page scroll.
- Status: held. Drei not added.

## 36. No GSAP this pass

- Concept: the camera story fits in the frame loop. A second clock does not move the card.
- Reference: GSAP.com, Theatre.js, Unseen’s real use of ScrollTrigger on Illoca.
- Why it works: Illoca needs a timeline because it is a launch film of many beats in DOM. We have one scene and seven thresholds.
- Implementation: not installed.
- Relevance: the brief said re-evaluate, not refuse on principle. Re-evaluated. Refused for this pass.
- Performance: less JS.
- Accessibility: fewer ways to desync from reduced motion.
- Mobile: one less pinning bug.
- Status: held.

## 37. No fullscreen bloom

- Concept: postprocessing bloom would make the lotus look like every other award site.
- Reference: pmndrs postprocessing. Shadertoy’s mobile cost.
- Why it works: identity is geometry and state, not glow.
- Implementation: not installed. The seed shader is the light.
- Relevance: “do not add another gradient.”
- Performance: a fullscreen pass is the expensive pretty.
- Accessibility: glow reduces contrast if it spills on type. Type is DOM, but the scene gets muddy.
- Mobile: first thing we would have disabled.
- Status: held.

## 38. No autoplay sound

- Concept: silence.
- Reference: half of award films. 8th Wall’s permission prompts are the cousin (do not ask for the microphone or the camera either).
- Why it works: sound that starts itself is hostile, and a course is often opened in public.
- Implementation: no audio nodes.
- Relevance: explicit in the earlier brief and still binding.
- Performance: none.
- Accessibility: no unexpected audio.
- Mobile: same.
- Status: held.

## 39. No mascot

- Concept: no owl, no monk, no face, no guru.
- Reference: Duolingo, MasterClass, DeepLearning.AI, Pokémon collaborations.
- Why it works: a face becomes the brand and the cliché.
- Implementation: geometry only.
- Relevance: the identity section of the brief.
- Performance: none.
- Accessibility: no unlabeled character.
- Mobile: none.
- Status: held.

## 40. No AR and no VR

- Concept: do not ask for the camera. Do not put the curriculum in a headset.
- Reference: 8th Wall, Zapworks, A-Frame, NASA Eyes.
- Why it works: permissions and a different product.
- Implementation: not started. Device tilt is optional and tiny.
- Relevance: mobile should feel designed, not like a tech demo.
- Performance: those runtimes are large.
- Accessibility: camera UIs are opaque.
- Mobile: the page remains a page.
- Status: held.

## 41. Footer seed

- Concept: the page ends on a small geometric mark, not a second hero.
- Reference: the lotus folding back toward a seed in the signal state.
- Why it works: the instrument closes.
- Implementation: existing `FooterSeed`. Not re-tuned this pass beyond what already shipped.
- Relevance: an ending.
- Performance: SVG.
- Accessibility: decorative.
- Mobile: must not cover the links. Previously adjusted.
- Status: kept.

## 42. Method as a rail

- Concept: the method is a connected sequence, not four equal cards.
- Reference: the previous pass. Svelte’s “do the thing” rather than “read four cards.”
- Why it works: a practice has an order.
- Implementation: existing `MethodPath`.
- Relevance: still the right pattern. Not the thing that made the homepage feel editorial. The hero was.
- Performance: DOM.
- Accessibility: a list.
- Mobile: the rail stacks.
- Status: kept.

## 43. Ownership split

- Concept: “why” is a balance you can feel, not two paragraphs.
- Reference: previous pass.
- Why it works: the section answers a tension.
- Implementation: existing `OwnershipSplit`.
- Relevance: kept. Not the first-viewport problem.
- Performance: DOM.
- Accessibility: both sides are text.
- Mobile: stacks.
- Status: kept.

## 44. Page tones

- Concept: home, learn, editorial, engineering, brand share tokens and differ in atmosphere.
- Reference: BMW’s flagship versus its catalogue. Epic’s store versus a trailer.
- Why it works: one universe, different rooms, without a second WebGL scene.
- Implementation: `data-tone` on `PageShell`.
- Relevance: route map.
- Performance: CSS.
- Accessibility: color is not the only signal.
- Mobile: same tones.
- Status: kept. Projects and About were not restaged this pass. The homepage was the failure.

## 45. Enter-the-path as the only hero action

- Concept: one text link in the instrument.
- Reference: Baymard. Hick’s law. Shopify’s multi-CTA hero is the anti-pattern.
- Why it works: the header already has the lesson CTA. The instrument should not compete with it.
- Implementation: anchor to `#path`.
- Relevance: the old hero had a paragraph and a full card of actions.
- Performance: none.
- Accessibility: one extra tab stop, named.
- Mobile: 44px.
- Status: shipped.

## 46. Description survives, relocated

- Concept: `heroDescription` still renders, under the world, not in it.
- Reference: Snow Fall returning to the column after a chapter break. Butterick on measure.
- Why it works: the sentence is content. It is not the poster.
- Implementation: world lock paragraph.
- Relevance: editors still change it in platform copy. SEO still sees it.
- Performance: none.
- Accessibility: normal paragraph, readable measure.
- Mobile: above the card.
- Status: shipped.

## 47. Visible before JavaScript

- Concept: no `data-world` means the title is already the readable size. JS may change tracking. It may not set `opacity: 0`.
- Reference: Core Web Vitals, CLS. The previous plan to hide the `h1` until boot was rejected in the experience doc.
- Why it works: slow JS does not produce an empty first screen.
- Implementation: default `.system-title` rules. World rules only adjust tracking and baseline.
- Relevance: a cinematic that depends on hydration is a broken cinematic.
- Performance: first paint is HTML and CSS.
- Accessibility: the name is there immediately.
- Mobile: same.
- Status: shipped.

## 48. Sticky full viewport on small screens

- Concept: the phone also gets a 100svh instrument and a short track (`168vh`), not a 62svh video slot with copy overlapping it.
- Reference: Apple recomposing rather than shrinking. Nike’s shop under the film.
- Why it works: shrinking the desktop two-column hero was the old mobile. That hero is gone.
- Implementation: sticky rules moved out of the desktop-only media query. Desktop track is `280vh`.
- Relevance: “responsive is a composition.”
- Performance: shorter scroll work on phones.
- Accessibility: you are not trapped. The track ends and the lock is in normal flow.
- Mobile: the point.
- Status: shipped.

## 49. Negative margin under the header

- Concept: the scene runs full-bleed under the command bar. The bar is an overlay, not a website masthead pushing the picture down.
- Reference: Igloo, and any film that is not letterboxed by its own nav.
- Why it works: a 60px stack of “site, then picture” reads as a website.
- Implementation: `.universe-track { margin-top: -4.5rem }`.
- Relevance: composition.
- Performance: none.
- Accessibility: the bar remains in the tab order and is not transparent to the point of unreadability. It keeps its pill.
- Mobile: same overlap. Title padding clears the bar.
- Status: shipped.

## 50. Refuse the gallery

- Concept: do not collect effects (mesh gradient, Lottie icons, blob backgrounds, particle cursors, template staggers).
- Reference: Framer gallery, Haikei, Lordicon, Coolors, Codrops cursor demos, Salesforce Lightning’s cards.
- Why it works: a gallery of effects is how the previous research and the previous homepage both failed.
- Implementation: this list, and the decision not to install them.
- Relevance: “how many moments feel impossible on a normal website,” not “how many animations.”
- Performance: every refused library is a win.
- Accessibility: fewer custom behaviors to repair.
- Mobile: fewer desktop-only toys.
- Status: held, as the editorial policy for the next pass.

## What this pass did not pretend to finish

Projects are not yet blueprint artifacts. About is not yet an essay in a new layout. Route changes are not visually bridged by a shared element transition. Those are real gaps. They are smaller than the homepage still being a landing card, which is the gap this pass closes.
