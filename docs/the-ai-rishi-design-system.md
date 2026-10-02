# THE AI RISHI — design system

The system in the interface now. Not a kit for a different site.

## Theme decision

Dark graphite is kept as the surround because the mark, gold, and long-form pages are already built for it, and a full invert would fight the logo and the lesson type. It is no longer flat black.

The curriculum itself sits on ivory. That split is the point: the desk is dark, the work is a sheet.

| Token | Value | Role |
|---|---|---|
| Surround | `#12110e` | Page, bar, colophon |
| Sheet | `#f3eee4` | Phase drawing and day panel |
| Ink on the sheet | `#1c1915` | Structure |
| Path | `#8a6230` | Relationships, active phase, links on the sheet |
| Signal | `#0f5f68` | A measured line or a boundary, on the sheet |
| Gold on graphite | `#d4b46a` / `#f0d090` | Actions and metadata on the dark field |
| Cream on graphite | `#f3eee4` | Text on the dark field |

Purple (`#8b7cff`) is not a surface. Do not wash sections with it.

## Typography

- Serif (Instrument Serif): programme title, phase name, section titles
- Mono: phase numbers, tagline, metadata, day numbers
- Sans: summaries and lesson prose

The tagline is set in mono with `text-transform: none`, so the official capitals and the middle dot are the string itself.

## Spacing

- Desk inset from the bar: about 4.7rem
- Colophon height reserved: about 8.6rem on desktop, stacked on small screens
- Rail width: 15.6rem
- Panel width: 21.5rem
- Section padding below the desk: the existing page rhythm, not a new scale

## Surfaces

- Graphite surround, no glass blur
- Ivory sheet with a 1px light edge
- Day rows separated by a hairline, not cards
- Search is a top sheet, not a floating card in the middle of the page

## Borders, shadow, glow

- Borders are 1px. No drop shadows on the desk.
- No glow on the phase readout.
- Gold is a line or a type color, not a bloom.

## Geometry

- Structure: straight lines and rectangles
- Path: a connection or an arrow
- Signal: a line against a threshold
- Boundary: a closed rectangle
- The brand mark is a column, a beam, and a small square. Not a flower. Not a ring.

## Motion

- Phase change: opacity 640ms, ease-out, only when motion is allowed
- Scroll to a phase: smooth, unless reduced motion, then instant
- No looping particles. No camera dolly.
- Pointer parallax on the sheet is at most 10px, desktop, motion allowed. It is off for touch and reduced motion.

## Interaction states

- Rail: current phase is ivory on a faint fill, `aria-current`
- Day: published is a link. Planned is text plus “Planned”
- Instruments: selected step uses the existing gold outline
- Focus: the global gold outline remains

## Responsive

- At 960px and above: rail, sheet, panel, colophon
- Below: sheet on top, phase numbers in a horizontal rail, day list behind a toggle, colophon stacked
- The header phase name ellipsizes so long names do not break the bar

## Reduced motion

The same sheet, the same rail, the same panel. No opacity transition, no parallax, no smooth scroll. Globals already collapse animation duration.
