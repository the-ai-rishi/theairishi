# Quick start

## Purpose

Run the site locally and confirm the live public surfaces before you edit JSON or markdown.

## Steps

1. From the repository root: `npm install`
2. `npm run dev`
3. Open the Local URL Next prints (usually http://localhost:3000)
4. Confirm the hero:
   - Kicker: Current program (`copy.heroBadge`) — not the brand name (that is already in the header)
   - Headline: DevOps Engineer Mastery (`programs.json` `title`)
   - Duration: 120 days · about 4 months
   - One short description (`copy.heroDescription`)
   - Primary button: **Start Day 1** → `/learn/day-01`
   - Secondary: **Explore the 120-day plan** → `/learn`
   - No brand tagline in the hero. `brand.tagline` may be empty.
5. Header: Start, 120 Days, About. Explore contains Guides and Projects. CTA **Start Day 1**.
6. Scroll: facts strip → eleven phases → Why DevOps before AI → available days → how a day works → where this goes next → community → Start at Day 1.
7. Open `/youtube` and `/instagram` — both must 404.
8. Open `/learn/day-01`, `/learn`, `/about`. About is first person. Homepage is not a diary.
9. Stop the server. Run `npm run validate`, then `npm run lint`, then `npm run build`.

## Adding Day 4 tomorrow

Follow [CONTENT/ADD-DAILY-LESSON.md](./CONTENT/ADD-DAILY-LESSON.md). You create `content/lessons/day-04.md`. You do not edit React.
