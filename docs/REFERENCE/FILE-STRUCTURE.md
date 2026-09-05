# File structure

Labels:

- 🟢 SAFE FOR CONTENT EDITING
- 🟡 CONFIGURATION — FOLLOW DOCUMENTATION
- 🔴 CODE — DO NOT EDIT UNLESS ADVANCED

theairishi/
  app/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
    apple-icon.png
    favicon.ico
    globals.css
    icon.png
    layout.tsx
    not-found.tsx
    page.tsx
    robots.ts
    sitemap.ts
    [channel]/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      page.tsx
    about/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      page.tsx
    api/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      search/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
        route.ts
    guides/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      page.tsx
      [slug]/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
        page.tsx
    learn/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      page.tsx
      [slug]/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
        not-found.tsx
        page.tsx
      ai-fundamentals/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
        page.tsx
    projects/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      page.tsx
      [slug]/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
        page.tsx
    topics/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      [topic]/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
        page.tsx
  components/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
    brand/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      Logo.tsx
      PageShell.tsx
      SectionHeading.tsx
    channel/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
    home/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      CallToAction.tsx
      ChannelGrid.tsx
      ContentList.tsx
      ContinueLearning.tsx
      CourseListSection.tsx
      FeaturedPath.tsx
      HeroSection.tsx
      SectionRenderer.tsx
      TechnologyOrbit.tsx
      TopicGrid.tsx
    icons/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      AboutIcon.tsx
      GuidesIcon.tsx
      InstagramIcon.tsx
      LearnIcon.tsx
      ProjectsIcon.tsx
      YouTubeIcon.tsx
    layout/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      Footer.tsx
      Header.tsx
    learning/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      CourseCard.tsx
      LessonCompletionButton.tsx
      LessonContent.tsx
      LessonHeader.tsx
      LessonNavigation.tsx
      LessonSidebar.tsx
      MobileLessonMenu.tsx
      ResumeLearningBanner.tsx
      useLessonProgress.ts
    search/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      SearchModal.tsx
    ui/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
      button.tsx
  content/  🟢 SAFE FOR CONTENT EDITING
    config/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
      courses.json
      platform.json
      series.json
    courses/  🟢 SAFE FOR CONTENT EDITING
      devops/  🟢 SAFE FOR CONTENT EDITING
        devops-fundamentals-01.md
        devops-fundamentals-02.md
    guides/  🟢 SAFE FOR CONTENT EDITING
      first-principles-ai-learning.md
    lessons/  🟢 SAFE FOR CONTENT EDITING
      ai-fundamentals-01.md
      ai-fundamentals-02.md
      ai-fundamentals-03.md
      ai-fundamentals-04.md
      ai-fundamentals-05.md
      ai-fundamentals-06.md
      ai-fundamentals-07.md
      llm-fundamentals-01.md
      llm-fundamentals-02.md
      llm-fundamentals-03.md
      llm-fundamentals-04.md
      llm-fundamentals-05.md
      llm-fundamentals-06.md
      llm-fundamentals-07.md
      llm-fundamentals-08.md
    media/  🟢 SAFE FOR CONTENT EDITING
      instagram.json
      youtube.json
    projects/  🟢 SAFE FOR CONTENT EDITING
      autonomous-research-agent.md
  docs/  🟢 SAFE FOR CONTENT EDITING
    ADDING_CONTENT.md
    ARCHITECTURE.md
    AUTHORING.md
    BRANDING_AND_ASSETS.md
    COMMON-TASKS.md
    CONFIGURATION.md
    CONTENT_FILE_INDEX.md
    CONTENT_MODEL.md
    DAILY-CONTENT-MANAGEMENT.md
    DEPLOYMENT.md
    DOCUMENTATION-MAP.md
    FAQ.md
    FUTURE_CONTENT_TYPES.md
    GUIDES.md
    HOMEPAGE.md
    HOMEPAGE_COMPOSITION.md
    OPERATIONS.md
    PLATFORM_OVERVIEW.md
    PROJECTS.md
    QUICK-START.md
    README.md
    ROUTING_AND_SEO.md
    SEARCH.md
    START-HERE.md
    START_HERE.md
    TOPICS_AND_AREAS.md
    TROUBLESHOOTING.md
    VALIDATION_AND_TESTING.md
    VISIBILITY_AND_LIFECYCLE.md
    YOUTUBE_AND_INSTAGRAM.md
    ADVANCED/  🟢 SAFE FOR CONTENT EDITING
      ADDING-A-NEW-DOMAIN.md
      ADDING-A-NEW-FEATURE.md
      COMPONENT-ARCHITECTURE.md
      CONTENT-ARCHITECTURE.md
      EXTENDING-THE-DESIGN-SYSTEM.md
    CONFIGURATION/  🟢 SAFE FOR CONTENT EDITING
      FEATURE-FLAGS.md
      HOMEPAGE-CONFIGURATION.md
      NAVIGATION-CONFIGURATION.md
      SEO-CONFIGURATION.md
      SITE-CONFIGURATION.md
    CONTENT/  🟢 SAFE FOR CONTENT EDITING
      ADD-ARTICLE.md
      ADD-GUIDE.md
      ADD-LEARNING-PATH.md
      ADD-LESSON.md
      CONTENT-IMAGES.md
      CONTENT-METADATA.md
      CONTENT-ORDERING.md
      DELETE-OR-UNPUBLISH-CONTENT.md
      EDIT-CONTENT.md
    FEATURES/  🟢 SAFE FOR CONTENT EDITING
      ESSAYS.md
      FUTURE-FEATURES.md
      GUIDES.md
      INSTAGRAM.md
      LEARNING.md
      PROJECTS.md
      TOOLS.md
      YOUTUBE.md
    OPERATIONS/  🟢 SAFE FOR CONTENT EDITING
      BACKUP-AND-RECOVERY.md
      BUILD.md
      DEPLOYMENT.md
      LOCAL-DEVELOPMENT.md
      PRE-PUBLISH-CHECKLIST.md
      PREVIEW.md
      TROUBLESHOOTING.md
      VALIDATION.md
    PLATFORM/  🟢 SAFE FOR CONTENT EDITING
      ARCHITECTURE.md
      DOMAIN-SYSTEM.md
      FEATURE-SYSTEM.md
      NAVIGATION.md
      PLATFORM-OVERVIEW.md
      ROUTING.md
      SEARCH.md
    REFERENCE/  🟢 SAFE FOR CONTENT EDITING
      COMMAND-REFERENCE.md
      CONFIGURATION-REFERENCE.md
      FILE-STRUCTURE.md
      GLOSSARY.md
  lib/  🔴 CODE — DO NOT EDIT UNLESS ADVANCED
    brand.ts
    catalog.ts
    config.ts
    content-types.ts
    content.ts
    guides.ts
    homepage.ts
    lessons.ts
    markdown.ts
    media.ts
    palette.ts
    presentation.ts
    progress-repository.ts
    progress.ts
    projects.ts
    search.ts
    site.ts
    topics.ts
    user-types.ts
    utils.ts
    visibility-core.d.ts
    visibility-core.js
    visibility.ts
  public/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
    brand/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
      logo-horizontal.png
      logo-mark.png
      logo.png
      og-image.jpg
    content/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
      images/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
        README.md
        ai/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
        career/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
        cloud/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
        devops/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
        general/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
        software-engineering/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
  scripts/  🟡 CONFIGURATION — FOLLOW DOCUMENTATION
    content-index.js
    scenario-test.js
    validate.js
  templates/  🟢 SAFE FOR CONTENT EDITING
    guide-template.md
    learning-path-template.json
    learning-path-template.md
    lesson-template.md
    project-template.md
