# THE AI RISHI — design system

The system in the interface now.

## Tokens

| Token | Value | Role |
|---|---|---|
| Paper | `#efe8dc` | The field. Pages, bar, reading |
| Ink | `#1a1714` | Type, open days, primary action |
| Brass | `#8a5a2b` | Active phase metadata, reading rule |
| Signal | `#0e5c62` | Retrieval only |
| Hairline | `rgba(26,23,20,0.14)` | Rules between items |

`--color-ink` and `--color-cream` are swapped so existing utilities land on paper. Do not add a second palette.

## Typography

- Instrument Serif: phase name, essay title, day title
- Geist: summaries and lesson prose
- Geist Mono: numbers, states, metadata

The phase name is the largest type on home and learn. It is not a caption under a graphic.

## Geometry

- A line is a relationship or a threshold
- A rectangle is a unit, a document, or a station
- A closed frame is design and defence
- Brass marks the active part of a structure
- Signal marks a citation

No rings. No petals as scenery. The eight-petal mark is only the logo.

## Surfaces

- Paper is the default
- Search is the inverse: ink field, paper type
- Code blocks stay ink with paper type
- There is no glass, no blur, no glow

## Motion

- The delivery artifact and the reliability signal move only when motion is allowed
- Phase changes replace the drawing on the next frame
- Reduced motion: one static draw, instant scroll
- The canvas loop stops when the document is hidden

## Navigation

- Laptop: system bar. Primary items from config. The rest under Explore, also from config.
- Phone: every enabled main item in the bottom bar. The hamburger is hidden there so it does not compete.
- Lessons do not put a second bar over the reading. The phone bar is present; the page pads for it.

## States

- Published day: ink fill, opens
- Planned day: outline, not a link
- Complete on this device: brass fill
- Current day: labelled Now

## Responsive

- At 861px and above: measure plus stage
- At 860px and below: no phase rail. Previous and next phase. Days are rows with titles. Learn phases snap one screen at a time.
- Targets are at least 44px on the phone controls.
