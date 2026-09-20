# Add a daily lesson

This is the normal publishing job. Tomorrow you add the next day by filling one markdown file. You do not edit React.

## 0. Fast path

Day titles already live in `content/config/programs.json` (all 120). Scaffold the draft, write the lesson, publish:

```bash
npm run new-day -- 4
```

That copies **only** the title and summary already in `programs.json`. It will not overwrite an existing file. Status starts as `draft`.

Then:

1. Write the body in `content/lessons/day-04.md` (keep the template H2s so the workbench/gate appear).
2. Fill 3–5 `outcomes`.
3. Set `status: published`.
4. `npm run validate` then preview `/learn/day-04`.

## 1. Confirm the day already exists on the map

Open `content/config/programs.json`. Find the day object. Example for Day 4:

- `day`: 4
- `phaseId`: `phase-01`
- `slug`: `day-04`
- `title` / `summary`: already copied from the 120-day execution plan

If the day is missing, stop. Add it to `programs.json` from the mastery repo first. Do not invent a title.

## 2. Create the file

Exact path:

```
content/lessons/day-04.md
```

Filename format: `day-NN.md` with two digits. Prefer `npm run new-day -- N`. Or copy `templates/lesson-template.md`.

Do **not** put daily lessons (or any public lesson) under `content/courses/`. That folder is not a `/learn` source. Course grouping lives in `content/config/courses.json`.

## 3. Required frontmatter

| Field | Allowed values | Required |
| --- | --- | --- |
| `title` | Same idea as `programs.json` `days[].title` | yes |
| `description` | One short paragraph for listings and search | yes |
| `course` | `devops-engineer-mastery` | yes |
| `courseTitle` | `DevOps Engineer Mastery` | yes |
| `courseOrder` | `1` | recommended |
| `stage` | The phase name, e.g. `Foundations` | yes |
| `stageOrder` | Phase number, e.g. `1` | yes |
| `lesson` | Same number as `day` for this program | yes |
| `day` | Number `1`–`120` | yes |
| `phase` | An existing `phases[].id` such as `phase-01` | yes |
| `program` | `devops-engineer-mastery` | yes |
| `topic` | `devops` | yes |
| `status` | `published` (or `draft` to keep it off the site) | yes |
| `outcomes` | 3–5 concrete abilities this day actually trains | yes for public program days |
| `estimatedMinutes` | Number, wall-clock for the whole day | recommended |
| `tags` | List of strings, include `day-04` | optional |
| `enabled` | `true` / `false` | optional, default true |

Do not set `exercise` unless you are Day 1 (`starting-assessment`). No other exercise widget exists.

Search indexes **title, description, tags, outcomes** - not the full markdown body.

## 4. Headings (so the workbench appears)

Use the template H2s. Mapping lives in `content/config/lesson-rhythm.json`, not in React.

Keep at least:

- `## What today is for`
- `## Words` (or another Learn heading already in the JSON)
- `## Practise`
- `## Production constraint`
- `## AI review (reject this)`
- `## Interview kill`
- `## Definition of done`

If a future day needs a new heading alias, add a `headingRules` row in `lesson-rhythm.json`. Do not edit `lib/` for a new day.

## 5. Body

Write a real lesson the learner can finish here.

Do **not** tell them to open files in the private authoring repository. Do **not** link that repository. Learners finish the day here.

## 6. Where it appears after the next build

- `/learn/day-NN` - the lesson
- `/learn` - This phase / the spine
- Homepage ticket and map counts
- Search for `day N` or a word from the title
- Sitemap

Unpublished later days stay titles without links.

## 7. Preview and validate

```bash
npm run validate
npm run dev
```

Open `/learn/day-NN`. Confirm the next unpublished day is still not a page.

To keep a file off the site while drafting: leave `status: "draft"`.

## 8. Deploy

```bash
npm run lint
npm run build
```

Then push the branch. Vercel and Cloudflare rebuild from the generated catalog.

## 9. Common mistakes

| What went wrong | Fix |
| --- | --- |
| `ERROR: Lesson "day-04" references phase "phase-99"` | Set `phase` to the id in `programs.json` |
| `ERROR: Two lessons both claim day 4` | Only one published file may have `day: 4` |
| Validate wants 120 days | Do not delete day objects from `programs.json` |
| I edited a React component | Put the file back. Daily publishing is markdown + JSON |
| I invented Day 13 | Copy the title from `programs.json` |
| Workbench missing | Use the template H2s or add an alias in `lesson-rhythm.json` |

## 10. What you do not edit

- `app/`
- `components/`
- `lib/content-data.generated.ts`
- `main`

Stay on the current feature branch until you choose to merge.

## Draft vs published

| Frontmatter | What happens |
| --- | --- |
| `status: published` | Public `/learn/day-NN` if the other required fields are present |
| `status: draft` | File can exist. Not a public page, not search, not sitemap |
| `enabled: false` | Hidden even if status is published |
| **omit `status`** | Not public |
