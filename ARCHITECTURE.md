# The AI Rishi — Complete System Architecture & Future User Platform Design

## 1. System Philosophy

> **TypeScript and React code defines HOW the platform works.**
> **JSON configuration and Markdown content defines WHAT the platform contains.**

The AI Rishi is an integrated technology knowledge, educational, media, and creator platform. It unites interactive structured courses, architectural deep-dives, hands-on lab projects, technology radar updates, system design frameworks, visual Instagram carousels, and long-form YouTube teardowns.

---

## 2. Platform Architecture Layers

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   Next.js 16 App Router • React 19 • Server Components │
│   Header • Hero • Topic Hubs • Lesson View • Search    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                  Platform Data Layer                   │
│   content/config/platform.json (Brand, Copy, Topics)   │
│   content/config/courses.json  (Curriculums & Stages)  │
│   content/config/series.json   (Multi-Format Tracks)   │
│   lib/config.ts  •  lib/lessons.ts  •  lib/content.ts  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                    User Data Layer                     │
│            (Decoupled from Platform Data)              │
│   lib/progress-repository.ts (IUserProgressRepository)  │
│   Current: LocalProgressRepository (localStorage)      │
│   Future:  AuthenticatedProgressRepository (DB / API)  │
│   lib/user-types.ts (Profiles, Bookmarks, Streaks)     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Platform Data vs. User Data Separation

To allow future authentication, login, cloud sync, bookmarks, and community features without rebuilding the platform, we strictly decouple **Platform Data** from **User Data**:

| Data Type | Scope | Storage Location | Examples |
|---|---|---|---|
| **Platform Data** | Global / Read-Only | `content/config/*.json`, `content/**/*.md` | Topics, Courses, Lessons, Guides, Projects, Series, Brand, UI Copy |
| **User Data** | Per-User / Dynamic | Handled via `IUserProgressRepository` | Completed lessons, last visited lesson, bookmarks, followed topics, streaks |

### Repository Abstraction (`lib/progress-repository.ts`):
```typescript
export interface IUserProgressRepository {
  getCompletedLessons(): readonly string[];
  isLessonCompleted(slug: string): boolean;
  markLessonCompleted(slug: string): void;
  toggleLessonCompleted(slug: string): boolean;
  getLastVisitedLesson(): string | null;
  setLastVisitedLesson(slug: string): void;
  getBookmarks(): readonly string[];
  isBookmarked(contentId: string): boolean;
  toggleBookmark(contentId: string): boolean;
  getFollowedTopics(): readonly string[];
  isTopicFollowed(topicSlug: string): boolean;
  toggleFollowTopic(topicSlug: string): boolean;
  subscribe(callback: () => void): () => void;
}
```

---

## 4. Content Lifecycle & Filtering Rules

All content items (Lessons, Guides, Projects, Updates, Series) support lifecycle states:

| Status | `enabled` | Publicly Visible? | Search Indexed? | In Sitemap? | Usage |
|---|---|---|---|---|---|
| `published` | `true` | ✅ Yes | ✅ Yes | ✅ Yes | Live, production content |
| `draft` | `true`/`false` | ❌ No | ❌ No | ❌ No | Work in progress |
| `coming-soon` | `true` | ✅ Yes (as roadmap card) | ❌ No | ❌ No | Future scheduled items |
| `archived` | `true`/`false` | ❌ No | ❌ No | ❌ No | Deprecated content |
| Any | `false` | ❌ No | ❌ No | ❌ No | Globally turned off |

Coming-soon social platforms (`status: coming-soon` in platform.json `social`) remain routable so a Coming Soon page can exist, but they are not added to sitemap or search results.


---

## 5. Markdown & Media Conventions

- **Images in Markdown**: Put image files in `public/content/images/` or `public/images/`. Reference them in Markdown:
  ```markdown
  ![RAG Architecture Overview](/content/images/rag-architecture.png)
  *Figure 1: Production Retrieval-Augmented Generation pipeline.*
  ```
- **Automatic Post-Processing (`lib/markdown.ts`)**:
  - Automatically wraps images in `<figure>` with responsive borders, lazy loading, and `<figcaption>`.
  - Automatically wraps tables in horizontal-scroll containers.
  - Automatically turns GitHub-style alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`) into styled callouts.
  - Automatically assigns anchor links and scroll margins to `<h2>` and `<h3>` headings.
