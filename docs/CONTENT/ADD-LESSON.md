# Add a lesson

If you are adding the next DevOps Engineer Mastery day, stop. Use [ADD-DAILY-LESSON.md](./ADD-DAILY-LESSON.md) instead.

Use this page only for a lesson that is **not** one of the 120 program days (for example an older note you are keeping at a stable URL).

## 1. Exact file to create

`content/lessons/YOUR-SLUG.md`

That is the only public lesson folder. Course grouping lives in `content/config/courses.json`. Do not put lessons under `content/courses/` - those files are not `/learn` routes.

Copy `templates/lesson-template.md` only if you are adding a daily day. For a non-daily note, you may omit `day` / `phase` / `program`.

## 2. Fields to set

| Field | Allowed values | Required |
| --- | --- | --- |
| `title` | Plain text | yes |
| `course` | An `id` from `content/config/courses.json` | yes |
| `courseTitle` | Display name of the path | yes |
| `courseOrder` | Number | recommended |
| `stage` | Stage title | yes |
| `stageOrder` | Number | yes |
| `lesson` | Number inside the stage | yes |
| `topic` | A `topics[].id` in `platform.json` | yes |
| `status` | `published` / `draft` / `archived` | yes - omitting it does **not** publish |
| `description` | One short paragraph | yes |
| `enabled` | `true` / `false` | optional, default true |
| `tags` | List of strings | optional |
| `day` | Number `1`–`120` | only for program days |
| `phase` | `phase-01` … `phase-11` | only for program days |
| `program` | `devops-engineer-mastery` | only for program days |

## 3. What NOT to change

- Do not edit `lib/` or `app/` to add a lesson.
- Do not reuse an existing slug. Existing AI URLs stay as they are.
- Do not set `topic` to a planned topic unless that topic is `active` and you intend it to go public.
- Do not feature AI notes on the homepage. Leave `courses.json` `showOnHomepage: false` for `ai`.

## 4. Commands

```bash
npm run validate
npm run dev
```

Open `/learn/YOUR-SLUG`. Search for the title.
