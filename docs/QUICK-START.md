# Quick start

## Purpose

Run the site locally and confirm the live public surfaces before you edit JSON or markdown.

## Steps

1. From the repository root: `npm install`
2. `npm run dev`
3. Open the Local URL Next prints (usually http://localhost:3000)
4. Confirm the hero. Those strings are `copy.hero*` in `content/config/platform.json`:
   - Badge: Public learning journey · currently DevOps
   - Title: The AI Rishi
   - No second slogan under the title (`copy.heroTagline` is empty)
   - Primary button: **Start Day 1** → `/learn/day-01`
   - Secondary: **See the 120-day journey** → `/learn`
   - Supporting line: `brand.tagline` = DevOps first. Then AI.
5. Header: Start, Journey, About. CTA **Start Day 1**.
6. Scroll: What this is → DevOps Engineer Mastery → Why DevOps before AI → 120 days → What a day looks like → Where this is going → community → Start at Day 1.
7. Open `/youtube` and `/instagram` — both must 404.
8. Open `/learn/day-01`, `/learn`, `/about`.
9. Stop the server. Run `npm run validate`, then `npm run lint`, then `npm run build`.

## Adding Day 4 tomorrow

Follow [CONTENT/ADD-DAILY-LESSON.md](./CONTENT/ADD-DAILY-LESSON.md). You create `content/lessons/day-04.md`. You do not edit React.
