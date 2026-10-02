# THE AI RISHI — design system

The system in the interface now.

## Lockup

Visible name: THE AI RISHI, from `brand-language.json` `displayName`.

No slogan. Do not put a tagline back in the hero, footer, metadata, or bar.

Mark: `components/brand/BrandMark.tsx`, the stable eight-petal drawing from `main`. Gold via `currentColor`. It has to read at header size. Do not replace it with a column, a beam, or a new geometric symbol. Do not put a spinning ring around it.

## Colour

Dark graphite stays the surround. Lessons and the desk are already built for it.

| Token | Value | Role |
|---|---|---|
| Surround | `#12110e` | Page, bar, footer |
| Sheet | `#f3eee4` | Homepage phase drawing and day panel |
| Ink on the sheet | `#1c1915` | Structure on ivory |
| Path | `#8a6230` | Relationships on the sheet |
| Signal | `#0f5f68` | A measured line on the sheet; the retrieval rule on Learn |
| Gold on graphite | `#d4b46a` / `#f0d090` | Actions and metadata |
| Cream on graphite | `#f3eee4` | Text on the dark field |

Purple is not a surface. Do not wash sections with it. Do not use it as a glow.

## Typography

- Serif: programme title, phase name, essay titles, about headings
- Mono: phase numbers, day numbers, status, metadata
- Sans: summaries and lesson prose

Type stays readable. It is not a decoration that replaces the content.

## Surfaces

- Bar: solid `#12110e`, 1px hairline, square corners. No blur, no gradient ring.
- Homepage sheet: ivory, 1px edge, phase drawing
- Day rows: hairline separators, not cards
- Search: a top sheet, solid field, no purple veil
- Learn: phase list plus the selected phase. Not a second copy of the same map underneath
- Guides and labs: a ruled index that uses the width of the screen
- About: index column and the essay
- Lesson: the prose column stops at about 68ch

## Motion

- Reduced motion collapses animation and transition duration in `globals.css`
- Homepage phase scroll is instant when reduced motion is on
- No looping particles. No camera. No autoplay sound
- The pointer mark is a small gold square. It does not replace the cursor. It is hidden for coarse pointers

## States

- Published day: a link
- Planned day: title plus “Planned”. Not an empty page
- Progress: “claimed on this device”. Local only
- Instruments: labelled teaching fixtures
- Focus: gold outline
- Empty writing: “Essays are being written.”
- Empty labs: “Labs are currently in development.”
- Missing page: “Page not found”
- Missing day: “This day is not published yet”

## Responsive

- Homepage at 960px and above: rail, sheet, panel, colophon. Below: horizontal phase numbers, day list behind a toggle
- Learn at 1100px and above: sticky phase column, day ledger beside it. Below: horizontal phase tabs
- Guides and about at 800px and above: sticky title or index. Below: stacked
- The section dock sits at the bottom on every route except home. Pages pad the footer so it does not cover the last line
