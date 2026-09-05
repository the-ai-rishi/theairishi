# Daily content management

## PURPOSE

A one-day operator loop for the live catalog: 15 AI/LLM lessons, 2 DevOps lessons, 1 guide, 1 project. YouTube and Instagram stay empty and coming-soon.

## WHEN TO USE

Any day you add, edit, hide, or ship markdown/JSON on this site.

## PREREQUISITES

- Repository cloned on branch you are allowed to use.
- Local app: see [QUICK-START.md](./QUICK-START.md) and [OPERATIONS/LOCAL-DEVELOPMENT.md](./OPERATIONS/LOCAL-DEVELOPMENT.md).
- Do not invent YouTube or Instagram items. Do not crop brand PNG/JPG. There is no Python content.

## WHERE

- AI lessons: `content/lessons/ai-fundamentals-01.md` through `ai-fundamentals-07.md`, `llm-fundamentals-01.md` through `llm-fundamentals-08.md`
- DevOps lessons: `content/courses/devops/devops-fundamentals-01.md`, `content/courses/devops/devops-fundamentals-02.md`
- Guide: `content/guides/first-principles-ai-learning.md`
- Project: `content/projects/autonomous-research-agent.md`
- New lesson template: `templates/lesson-template.md` (next AI lesson number in that template is 16)
- New guide template: `templates/guide-template.md`
- New project template: `templates/project-template.md`
- New path template: `templates/learning-path-template.json` into `content/config/courses.json`
- Platform: `content/config/platform.json`
- Courses: `content/config/courses.json`
- Series (all planned / enabled false): `content/config/series.json`
- YouTube: `content/media/youtube.json` (live: `[]`)
- Instagram: `content/media/instagram.json` (live: `[]`)
- Cheat sheet: [COMMON-TASKS.md](./COMMON-TASKS.md)

## STEP-BY-STEP

1. Decide the job: edit existing copy, add a lesson/guide/path/project, hide a topic, or change hero/nav. Use [COMMON-TASKS.md](./COMMON-TASKS.md).
2. Edit only the real path for that job (table in WHERE). Do not add Python lessons. Do not fill `youtube.json` or `instagram.json` unless a real item exists.
3. If you added a learning path, also edit `content/config/courses.json`. Keep `status` `coming-soon` until real lessons exist. Active courses must have lessons.
4. npm run validate from the repo root. It must exit 0.
5. npm run dev and open the route plus search (header search uses /api/search). Confirm The field still shows only AI / LLM and DevOps unless you intentionally published another topic with real content.
6. npm run lint and npm run build before publish. Deploy is Vercel at theairishi.vercel.app; the PR branch is not auto-main. See [OPERATIONS/PRE-PUBLISH-CHECKLIST.md](./OPERATIONS/PRE-PUBLISH-CHECKLIST.md) and [OPERATIONS/DEPLOYMENT.md](./OPERATIONS/DEPLOYMENT.md).

## COMPLETE EXAMPLE

Edit the live guide, then check it:

1. Open `content/guides/first-principles-ai-learning.md`
2. Change body copy; keep frontmatter `slug: first-principles-ai-learning`
3. npm run validate
4. npm run dev -> http://localhost:3000/guides/first-principles-ai-learning
5. Search for a distinctive phrase from the edit
6. npm run lint && npm run build

Add a second guide: copy `templates/guide-template.md` to `content/guides/SLUG.md`. No React change. Full steps: [CONTENT/ADD-GUIDE.md](./CONTENT/ADD-GUIDE.md).

## VALIDATION

npm run validate must exit 0. Open the edited route. If the item is public, it should appear in search. See [OPERATIONS/VALIDATION.md](./OPERATIONS/VALIDATION.md).

## COMMON MISTAKES

- Enabling YouTube or Instagram while the JSON file is still `[]`
- Flipping a course to `active` with zero lessons
- Inventing Python (or any) lesson text
- Cropping brand PNG/JPG
- Leaking planned / coming-soon / disabled areas in the public UI

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| New lesson missing on /learn | `status` not published, `enabled` false, or `course` / `topic` mismatch | Match `courses.json` `id` and `topics[]` `id` |
| Guide 404 | content type guides hidden, or slug mismatch | Keep contentTypes id guides enabled+active; slug must match filename or frontmatter |
| validate fails | active course with 0 lessons, placeholder URLs, missing brand file | coming-soon or add lessons; omit github.com roots; restore brand files |
| Search misses the edit | type not public or file draft | Publish the type; set lesson/guide status published |

## HOW TO UNDO

`git restore` the markdown or JSON you edited, or `git revert` the commit. Do not force-push. See [OPERATIONS/BACKUP-AND-RECOVERY.md](./OPERATIONS/BACKUP-AND-RECOVERY.md).
