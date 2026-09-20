# Daily content management

## PURPOSE

A one-day operator loop for **the next DevOps Engineer Mastery lesson**. The 120-day map already exists. Tomorrow’s job is one markdown file.

## WHEN TO USE

Any morning you publish the next program day, hide a draft, or edit a live day.

## PREREQUISITES

- Repository cloned on the branch you are allowed to use.
- Day title already present in `content/config/programs.json` (Days 1–120 are listed).
- Do not invent curriculum. Do not link the private authoring repository. Do not fill YouTube/Instagram with fake items.

## WHERE

| Job | File |
| --- | --- |
| Next program day | `content/lessons/day-NN.md` |
| Day titles on the map | `content/config/programs.json` |
| Lesson heading aliases (Why/Practice/Gate) | `content/config/lesson-rhythm.json` |
| Scaffold | `npm run new-day -- N` |
| Template | `templates/lesson-template.md` |
| Full steps | [CONTENT/ADD-DAILY-LESSON.md](./CONTENT/ADD-DAILY-LESSON.md) |

Archive AI notes, guides, and projects are **not** the daily loop. See [COMMON-TASKS.md](./COMMON-TASKS.md).

## STEP-BY-STEP

1. `npm run new-day -- N` (example: `4`). This writes a **draft** from the programs.json title. It will not overwrite.
2. Write the lesson. Keep the template H2s (`What today is for`, `Words`, `Practise`, `Production constraint`, `AI review`, `Interview kill`, `Definition of done`).
3. Fill 3–5 `outcomes`. Set `status: published`.
4. `npm run validate` (must exit 0).
5. Preview `/learn/day-NN`. Confirm the following unpublished day is still not a page. Search matches **title / summary / tags**, not the whole body.
6. Commit and push. Vercel + Cloudflare rebuild. No server copy.

You do not edit `app/`, `components/`, or `lib/` to publish a day.

## COMPLETE EXAMPLE

Publish Day 4 (title already in programs.json: “Permissions as an incident”):

```bash
npm run new-day -- 4
# edit content/lessons/day-04.md — outcomes + body, status: published
npm run validate
```

Open `/learn/day-04`. `/learn/day-05` stays 404 until that file exists.

## VALIDATION

`npm run validate` must exit 0. Public program days need 3–5 outcomes. Two files cannot claim the same `day`.

## COMMON MISTAKES

- Inventing a Day 13 title instead of copying `programs.json`
- Editing React because the workbench did not appear — fix the H2s or `lesson-rhythm.json`
- Linking the private mastery repo
- Searching for a sentence that exists only in the body
- Setting `exercise` on any day except Day 1

## TROUBLESHOOTING

| Symptom | Cause | Fix |
| --- | --- | --- |
| New day missing on /learn | `status` not `published`, or validate not run | Publish; `npm run validate` |
| `/learn/day-NN` 404 after adding the file | Dev server started before generate | Re-run `npm run dev` / validate |
| Workbench not wrapping | H2 text not in `lesson-rhythm.json` | Use the template headings or add a `match` |
| Search miss | Query is body-only | Search the title, tag (`day-04`), or an outcome |

## HOW TO UNDO

Set `status: draft` or `git restore` the markdown. Do not force-push.
