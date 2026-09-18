# Future operations

These jobs should not need a React rewrite. Code is expected only when the site gains a **new kind** of UI.

| I want to | Edit this | Notes |
| --- | --- | --- |
| Publish Day 4 / Day N | `content/lessons/day-NN.md` | The day title must already exist in `programs.json`. See [ADD-DAILY-LESSON.md](../CONTENT/ADD-DAILY-LESSON.md). |
| Keep Day 5 as a title only | nothing, or add the day object if the plan grew | No markdown → no `/learn/day-05` page. It stays on the map. |
| Add Phase 12 | `content/config/programs.json` phases + days | Copy titles from the mastery repo. Update `mapTitle` if the `/learn` heading should change. |
| Add an AI program | `programs.json` `programs[]` | Start `planned` / `enabled: false`. Do not invent lessons. See [ADD-PROGRAM.md](../CONTENT/ADD-PROGRAM.md). |
| Add Agentic AI | same | Same as AI. `futurePath` can already label it as later. |
| Add a nav tab | `platform.json` `navigation.main` | `placement: "primary"` or `"explore"`. `enabled: false` until the destination is real. |
| Remove a nav tab | that item `enabled: false` | Dead links are dropped. |
| Reorder homepage | `homepage.sections[].order` | Hide with `enabled: false`. |
| Add a homepage **type** | `lib/visibility-core.js` `SECTION_TYPES` + a component | Only when the UI is genuinely new. |
| Change the featured program | `programs.json` `featuredProgramId` | `/learn` follows this. |
| Disable a non-featured program | that program `enabled: false` | Featured current program cannot be disabled. |
| Add Instagram | already live as an external URL | [INSTAGRAM.md](../FEATURES/INSTAGRAM.md) |
| Change Instagram later | `social[]` id `instagram` `url` | One field. |
| Enable Telegram | `social[]` id `telegram` `url` + `enabled` + `status` | [TELEGRAM.md](../FEATURES/TELEGRAM.md). Do not invent a URL. |
| Enable YouTube | `content/media/youtube.json` + social + contentType | Real items only. [YOUTUBE.md](../FEATURES/YOUTUBE.md) |
| Add another social channel | `social[]` | Text link appears. Icon optional (code once). |
| Add a Guide | `content/guides/*.md` | [ADD-GUIDE.md](../CONTENT/ADD-GUIDE.md) |
| Hide a Guide listing | `contentTypes` id `guides` `enabled: false` or unpublish the file | Nav item with `source.kind: contentType` disappears when empty/disabled. |

After every change:

```bash
npm run validate
```

Preview the route. Then commit. Do not merge this branch yourself if you are not the owner.

The scenario suite includes these 14 operations (`scripts/future-operations-test.js`).
