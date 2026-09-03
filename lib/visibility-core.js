"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Unified visibility + homepage/nav resolution kernel.
 * Used by the Next.js app (via TypeScript wrappers) and by plain Node
 * scripts (validate.js, scenario-test.js). No React. No filesystem.
 *
 * Pass platform config + a catalog of content counts/items.
 */

const LIFECYCLE_STATUSES = [
  "planned",
  "coming-soon",
  "active",
  "paused",
  "disabled",
  "archived",
];

const SURFACES = ["homepage", "navigation", "search", "sitemap", "route"];

const SECTION_TYPES = [
  "hero",
  "topic-grid",
  "course-list",
  "content-list",
  "channel-grid",
  "continue-learning",
  "cta",
];

const STATUS_ALIASES = {
  published: "active",
  publish: "active",
  live: "active",
  draft: "planned",
  hidden: "disabled",
  off: "disabled",
};

const FORMAT_TO_CONTENT_TYPE = {
  lesson: "learn",
  guide: "guides",
  project: "projects",
  article: "articles",
  update: "updates",
  interview: "interview",
  career: "career",
  youtube: "youtube",
  instagram: "instagram",
};

const CONTENT_TYPE_TO_FORMAT = {
  learn: "lesson",
  guides: "guide",
  projects: "project",
  articles: "article",
  updates: "update",
  interview: "interview",
  career: "career",
  youtube: "youtube",
  instagram: "instagram",
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeStatus(status) {
  if (status == null || status === "") return "active";
  const raw = String(status).trim().toLowerCase();
  if (STATUS_ALIASES[raw]) return STATUS_ALIASES[raw];
  return raw;
}

function isValidLifecycle(status) {
  return LIFECYCLE_STATUSES.includes(normalizeStatus(status));
}

function emptyCatalog() {
  return {
    topicContentCounts: {},
    formatContentCounts: {},
    channelItemCounts: {},
    courses: [],
    items: [],
  };
}

function findInList(list, key) {
  if (!Array.isArray(list) || !key) return null;
  const needle = normalizeKey(key);
  return (
    list.find((item) => {
      if (!item) return false;
      return (
        normalizeKey(item.id) === needle ||
        normalizeKey(item.slug) === needle ||
        normalizeKey(item.shortName) === needle
      );
    }) || null
  );
}

function findTopic(platform, key) {
  return findInList((platform && platform.topics) || [], key);
}

function findContentType(platform, key) {
  return findInList((platform && platform.contentTypes) || [], key);
}

function findChannel(platform, key) {
  return findInList((platform && platform.social) || [], key);
}

function findCourse(catalog, key) {
  return findInList((catalog && catalog.courses) || [], key);
}

function topicCount(catalog, topic) {
  if (!topic) return 0;
  const counts = (catalog && catalog.topicContentCounts) || {};
  return Number(counts[topic.id] || counts[topic.slug] || 0) || 0;
}

function formatCount(catalog, formatOrTypeId) {
  const counts = (catalog && catalog.formatContentCounts) || {};
  const key = normalizeKey(formatOrTypeId);
  const mapped = CONTENT_TYPE_TO_FORMAT[key] || key;
  return (
    Number(counts[mapped] || counts[key] || counts[formatOrTypeId] || 0) || 0
  );
}

function channelCount(catalog, channel) {
  if (!channel) return 0;
  const counts = (catalog && catalog.channelItemCounts) || {};
  return Number(counts[channel.id] || counts[channel.slug] || 0) || 0;
}

function withCount(entity, count) {
  if (!entity) return entity;
  return Object.assign({}, entity, { contentCount: count });
}

/**
 * Core visibility rule. Used by every public surface.
 *
 * Production decision: we do not advertise unlaunched products via a public URL.
 * For the route surface, planned, coming-soon, paused, disabled, archived, and
 * active-with-zero-content are not-found. Only active AND contentCount > 0
 * produces a public route (sitemap/search/nav remain gated as before).
 *
 * @param {object} entity { enabled, status, showOnHomepage, showInNavigation, contentCount, showWhenEmpty }
 * @param {string} surface homepage | navigation | search | sitemap | route
 * @param {object} [options]
 */
function isVisibleOnSurface(entity, surface, options) {
  const opts = options || {};
  if (!entity) return false;
  if (entity.enabled === false) return false;

  const status = normalizeStatus(entity.status);

  if (
    status === "planned" ||
    status === "paused" ||
    status === "disabled" ||
    status === "archived"
  ) {
    return false;
  }

  const count =
    typeof entity.contentCount === "number" ? entity.contentCount : opts.contentCount;
  const hasContent = typeof count === "number" ? count > 0 : true;
  const showWhenEmpty = entity.showWhenEmpty === true || opts.showWhenEmpty === true;
  const requireContent = opts.requireContent === true;

  if (status === "coming-soon") {
    if (
      surface === "search" ||
      surface === "sitemap" ||
      surface === "homepage" ||
      surface === "route"
    ) {
      return false;
    }
    if (surface === "navigation") {
      return entity.showInNavigation === true;
    }
    return false;
  }

  // active
  if (surface === "homepage") {
    if (entity.showOnHomepage === false) return false;
    if (!hasContent && !showWhenEmpty) return false;
    return true;
  }

  if (surface === "navigation") {
    if (entity.showInNavigation !== true) return false;
    if (requireContent && !hasContent && !showWhenEmpty) return false;
    return true;
  }

  if (surface === "search" || surface === "sitemap") {
    if (requireContent && !hasContent && !showWhenEmpty) return false;
    return true;
  }

  if (surface === "route") {
    return hasContent;
  }

  return true;
}

function isTopicVisible(platform, topic, surface, catalog, extra) {
  if (!topic) return false;
  const counted = withCount(topic, topicCount(catalog, topic));
  const requireContent =
    surface === "homepage" ||
    surface === "search" ||
    surface === "sitemap" ||
    surface === "navigation" ||
    surface === "route";
  return isVisibleOnSurface(
    counted,
    surface,
    Object.assign({ requireContent }, extra || {})
  );
}

function isContentTypeVisible(platform, contentType, surface, catalog, extra) {
  if (!contentType) return false;
  const counted = withCount(contentType, formatCount(catalog, contentType.id));
  const requireContent =
    surface === "homepage" || surface === "search" || surface === "sitemap";
  return isVisibleOnSurface(
    counted,
    surface,
    Object.assign({ requireContent }, extra || {})
  );
}

function isChannelVisible(platform, channel, surface, catalog, extra) {
  if (!channel) return false;
  const counted = withCount(channel, channelCount(catalog, channel));
  const requireContent =
    surface === "homepage" ||
    surface === "search" ||
    surface === "sitemap" ||
    surface === "route";
  return isVisibleOnSurface(
    counted,
    surface,
    Object.assign({ requireContent }, extra || {})
  );
}

function publicTopics(platform, catalog, surface) {
  const list = (platform && platform.topics) || [];
  return list
    .filter((t) => isTopicVisible(platform, t, surface, catalog))
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

function publicContentTypes(platform, catalog, surface) {
  const list = (platform && platform.contentTypes) || [];
  return list
    .filter((ct) => isContentTypeVisible(platform, ct, surface, catalog))
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

function publicChannels(platform, catalog, surface) {
  const list = (platform && platform.social) || [];
  return list
    .filter((ch) => isChannelVisible(platform, ch, surface, catalog))
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

function isCoursePublic(course, platform, catalog, forHomepage) {
  if (!course || course.enabled === false) return false;
  const status = normalizeStatus(course.status);
  if (status === "disabled" || status === "archived" || status === "planned" || status === "paused") {
    return false;
  }
  if (forHomepage && status !== "active") return false;
  const lessonCount = Number(course.lessonCount || 0) || 0;
  if (forHomepage && lessonCount <= 0) return false;
  if (status === "active" && lessonCount <= 0 && forHomepage) return false;
  if (course.topic) {
    const topic = findTopic(platform, course.topic);
    if (!topic || topic.enabled === false) return false;
    const ts = normalizeStatus(topic.status);
    if (["planned", "paused", "disabled", "archived"].includes(ts)) return false;
  }
  return true;
}

function publicCourses(platform, catalog, forHomepage) {
  const list = (catalog && catalog.courses) || [];
  return list
    .filter((c) => isCoursePublic(c, platform, catalog, forHomepage !== false))
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

function comingSoonCourses(platform, catalog) {
  const list = (catalog && catalog.courses) || [];
  return list
    .filter((c) => {
      if (!c || c.enabled === false) return false;
      if (normalizeStatus(c.status) !== "coming-soon") return false;
      if (c.topic) {
        const topic = findTopic(platform, c.topic);
        if (topic) {
          if (topic.enabled === false) return false;
          const ts = normalizeStatus(topic.status);
          if (["paused", "disabled", "archived"].includes(ts)) return false;
        }
      }
      return true;
    })
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

function deriveContentTypeHref(platform, contentType) {
  if (!contentType) return null;
  if (contentType.url) return contentType.url;
  if (contentType.topicSlug) {
    const topic = findTopic(platform, contentType.topicSlug);
    if (topic) return "/topics/" + topic.slug;
  }
  return null;
}

function itemMatchesTopic(item, topic) {
  if (!item || !topic) return false;
  const keys = [topic.id, topic.slug].map(normalizeKey);
  if (keys.includes(normalizeKey(item.topicSlug))) return true;
  if (keys.includes(normalizeKey(item.topicId))) return true;
  if (keys.includes(normalizeKey(item.topic))) return true;
  if (Array.isArray(item.tags)) {
    if (item.tags.some((t) => keys.includes(normalizeKey(t)))) return true;
  }
  return false;
}

function itemMatchesFormat(item, format) {
  if (!item || !format) return false;
  const f = normalizeKey(format);
  return (
    normalizeKey(item.type) === f ||
    normalizeKey(item.format) === f ||
    normalizeKey(item.contentType) === f
  );
}

function sortItemsRecent(items) {
  return items.slice().sort((a, b) => {
    const da = Date.parse(a.publishedAt || a.date || 0) || 0;
    const db = Date.parse(b.publishedAt || b.date || 0) || 0;
    return db - da;
  });
}

function deriveCtaHref(section, platform) {
  if (section.ctaHref) return section.ctaHref;
  const source = section.source;
  if (!source) return undefined;
  if (source.kind === "topic" && source.topicId) {
    const topic = findTopic(platform, source.topicId);
    if (topic) return "/topics/" + topic.slug;
  }
  if (source.kind === "format") {
    const format = source.format;
    const typeId = FORMAT_TO_CONTENT_TYPE[format] || format;
    const ct = findContentType(platform, typeId);
    const href = deriveContentTypeHref(platform, ct);
    if (href) return href;
    if (format === "guide" || format === "guides") return "/guides";
    if (format === "project" || format === "projects") return "/projects";
    if (format === "lesson" || format === "learn") return "/learn";
  }
  if (source.kind === "channel" && (source.channelId || source.id)) {
    const ch = findChannel(platform, source.channelId || source.id);
    if (ch && ch.href) return ch.href;
  }
  return undefined;
}

function isEntityPublic(entity) {
  if (!entity || entity.enabled === false) return false;
  const status = normalizeStatus(entity.status);
  if (["planned", "paused", "disabled", "archived", "coming-soon"].includes(status)) {
    return false;
  }
  return true;
}

function resolveContentList(section, platform, catalog) {
  const source = section.source || { kind: "recent" };
  const maxItems = Number(section.maxItems || 6) || 6;
  const allItems = Array.isArray(catalog && catalog.items) ? catalog.items : [];
  let items = allItems;
  let emptyBecauseHidden = false;

  if (source.kind === "topic") {
    const topic = findTopic(platform, source.topicId);
    if (!topic) {
      return { items: [], empty: true, missingSource: true, topic: null };
    }
    if (!isEntityPublic(topic) && section.showWhenEmpty !== true) {
      emptyBecauseHidden = true;
    }
    items = allItems.filter((item) => itemMatchesTopic(item, topic));
    if (items.length === 0 && topicCount(catalog, topic) <= 0) {
      return {
        items: [],
        empty: true,
        topic,
        ctaHref: deriveCtaHref(section, platform),
      };
    }
  } else if (source.kind === "format") {
    const format = source.format;
    const typeId = FORMAT_TO_CONTENT_TYPE[format] || format;
    const ct = findContentType(platform, typeId);
    if (ct && !isEntityPublic(ct) && section.showWhenEmpty !== true) {
      emptyBecauseHidden = true;
    }
    items = allItems.filter((item) => itemMatchesFormat(item, format));
    if (items.length === 0 && formatCount(catalog, format) <= 0) {
      return {
        items: [],
        empty: true,
        format,
        ctaHref: deriveCtaHref(section, platform),
      };
    }
  } else if (source.kind === "channel") {
    const ch = findChannel(platform, source.channelId || source.id);
    if (!ch) return { items: [], empty: true, missingSource: true };
    if (!isEntityPublic(ch)) {
      emptyBecauseHidden = true;
    }
    items = allItems.filter(
      (item) =>
        normalizeKey(item.type) === normalizeKey(ch.id) ||
        normalizeKey(item.channelId) === normalizeKey(ch.id)
    );
  } else {
    items = allItems;
  }

  const sliced = sortItemsRecent(items).slice(0, maxItems);
  const empty = emptyBecauseHidden || sliced.length === 0;
  return {
    items: emptyBecauseHidden ? [] : sliced,
    empty,
    ctaHref: deriveCtaHref(section, platform),
  };
}


function deriveHeroModes(platform, catalog) {
  const modes = [];
  if (publicCourses(platform, catalog, true).length > 0) {
    modes.push({ id: "learn", label: "Learn", href: "#learn" });
  }

  const formatModes = [
    { format: "guide", typeId: "guides", id: "read", label: "Read", href: "#read" },
    { format: "project", typeId: "projects", id: "build", label: "Build", href: "#build" },
    { format: "youtube", typeId: "youtube", id: "watch", label: "Watch", href: "#watch" },
    { format: "instagram", typeId: "instagram", id: "connect", label: "Connect", href: "#connect" },
    { format: "update", typeId: "updates", id: "updates", label: "Updates", href: "#feed" },
    { format: "interview", typeId: "interview", id: "interview", label: "Interview", href: "#voices" },
  ];

  for (const mode of formatModes) {
    if (formatCount(catalog, mode.format) <= 0) continue;
    const ct = findContentType(platform, mode.typeId);
    if (ct && !isEntityPublic(ct)) continue;
    if (mode.format === "youtube" || mode.format === "instagram") {
      const ch = findChannel(platform, mode.format);
      if (ch && !isChannelVisible(platform, ch, "homepage", catalog)) continue;
    }
    modes.push({ id: mode.id, label: mode.label, href: mode.href });
  }

  return modes;
}

function resolveSectionData(section, platform, catalog) {
  const type = section.type;
  if (type === "hero") {
    const topics = publicTopics(platform, catalog, "homepage");
    return {
      topics,
      focusTopic: topics.length === 1 ? topics[0] : null,
      tone: topics.length === 1 ? "focus" : "discovery",
      modes: deriveHeroModes(platform, catalog),
      empty: false,
    };
  }
  if (type === "topic-grid") {
    const topics = publicTopics(platform, catalog, "homepage");
    return { topics, empty: topics.length === 0 };
  }
  if (type === "course-list") {
    const courses = publicCourses(platform, catalog, true);
    return { courses, empty: courses.length === 0 };
  }
  if (type === "content-list") {
    return resolveContentList(section, platform, catalog);
  }
  if (type === "channel-grid") {
    const channels = publicChannels(platform, catalog, "homepage");
    return { channels, empty: channels.length === 0 };
  }
  if (type === "continue-learning") {
    const courses = publicCourses(platform, catalog, true);
    return { courses, empty: courses.length === 0 };
  }
  if (type === "cta") {
    return { empty: false };
  }
  return { empty: true, unknown: true };
}

function resolveHomepageSections(platform, catalog) {
  const cat = catalog || emptyCatalog();
  const sections = (((platform || {}).homepage || {}).sections || [])
    .filter((s) => s && s.enabled !== false)
    .slice()
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  const resolved = [];
  const unknownTypes = [];
  const skipped = [];

  for (const section of sections) {
    const type = section.type;
    if (!type || SECTION_TYPES.indexOf(type) === -1) {
      unknownTypes.push(section);
      skipped.push({ id: section.id, reason: "unknown-type", type });
      continue;
    }

    if (section.source && section.source.kind === "topic" && section.source.topicId) {
      const topic = findTopic(platform, section.source.topicId);
      if (!topic) {
        skipped.push({ id: section.id, reason: "missing-source-topic" });
        continue;
      }
    }
    if (section.source && section.source.kind === "channel") {
      const ch = findChannel(platform, section.source.channelId || section.source.id);
      if (!ch) {
        skipped.push({ id: section.id, reason: "missing-source-channel" });
        continue;
      }
    }
    if (section.source && section.source.kind === "format") {
      const typeId = FORMAT_TO_CONTENT_TYPE[section.source.format] || section.source.format;
      const ct = findContentType(platform, typeId);
      if (!ct && typeId) {
        // format can exist as a loader (guide/project) without a contentType row;
        // only skip if the content type exists and is hidden, handled in resolveSectionData
      }
    }

    const data = resolveSectionData(section, platform, cat);
    const showWhenEmpty = section.showWhenEmpty === true;
    if (data.empty && !showWhenEmpty) {
      skipped.push({ id: section.id, reason: "empty" });
      continue;
    }

    resolved.push({
      id: section.id,
      type,
      enabled: true,
      order: section.order,
      title: section.title,
      subtitle: section.subtitle,
      ctaLabel: section.ctaLabel,
      ctaHref: data.ctaHref || section.ctaHref,
      source: section.source,
      maxItems: section.maxItems,
      showWhenEmpty,
      data,
    });
  }

  return { sections: resolved, unknownTypes, skipped };
}

function hrefLooksLikeTopic(href) {
  const match = String(href || "").match(/^\/topics\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function channelFromHref(platform, href) {
  const list = (platform && platform.social) || [];
  const normalized = String(href || "").replace(/\/+$/, "") || "/";
  return (
    list.find((ch) => {
      const chHref = String(ch.href || "").replace(/\/+$/, "");
      return chHref && chHref === normalized;
    }) || null
  );
}

function contentTypeFromHref(platform, href) {
  const list = (platform && platform.contentTypes) || [];
  const normalized = String(href || "").replace(/\/+$/, "") || "/";
  return (
    list.find((ct) => {
      const url = String(ct.url || "").replace(/\/+$/, "");
      return url && url === normalized;
    }) || null
  );
}

function resolveNavItem(item, platform, catalog) {
  if (!item || item.enabled === false) return null;
  const status = normalizeStatus(item.status || "active");
  if (["planned", "paused", "disabled", "archived"].includes(status)) return null;
  if (status === "coming-soon" && item.showInNavigation !== true) return null;

  const source = item.source;
  if (source && source.kind === "topic") {
    const topic = findTopic(platform, source.topicId || source.id);
    if (!topic) return null;
    const navTopic = Object.assign({}, topic, {
      showInNavigation: topic.showInNavigation === true || true,
    });
    if (!isTopicVisible(platform, navTopic, "navigation", catalog, { requireContent: false })) {
      // Bound nav items are an explicit request to show the topic in nav.
      // Still hide if the topic itself is not public on any route-like surface.
      if (topic.enabled === false) return null;
      const ts = normalizeStatus(topic.status);
      if (["planned", "paused", "disabled", "archived"].includes(ts)) return null;
      if (ts === "coming-soon" && topic.showInNavigation !== true && item.showInNavigation !== true) {
        return null;
      }
      if (ts === "coming-soon") return null;
      // active topic: show in this bound nav item even if showInNavigation was false on the topic
      // BUT hide empty-active from nav? Spec: "Drop nav items whose source is not visible on navigation surface."
      // Topic with showInNavigation false should not auto-appear, but an explicit nav source IS the flag.
      if (ts !== "active") return null;
    }
    // Explicit source binding means "show this if the topic is publicly usable"
    if (topic.enabled === false) return null;
    const ts = normalizeStatus(topic.status);
    if (["planned", "paused", "disabled", "archived"].includes(ts)) return null;
    if (ts === "coming-soon") return null;
    const count = topicCount(catalog, topic);
    if (ts === "active" && count <= 0) return null;
    return {
      id: item.id,
      label: topic.shortName || topic.name,
      href: "/topics/" + topic.slug,
      enabled: true,
      order: item.order,
      status: topic.status,
      source,
    };
  }

  if (source && source.kind === "contentType") {
    const ct = findContentType(platform, source.id || source.contentTypeId);
    if (!ct) return null;
    if (ct.enabled === false) return null;
    const ts = normalizeStatus(ct.status);
    if (["planned", "paused", "disabled", "archived"].includes(ts)) return null;
    if (ts === "coming-soon") return null;
    const count = formatCount(catalog, ct.id);
    if (ts === "active" && count <= 0 && ct.id !== "learn") {
      // learn can still show if there are public courses
      const courses = publicCourses(platform, catalog, true);
      if (ct.id === "learn" && courses.length > 0) {
        // ok
      } else {
        return null;
      }
    }
    if (ct.id === "learn") {
      const courses = publicCourses(platform, catalog, true);
      const lessons = formatCount(catalog, "lesson");
      if (courses.length === 0 && lessons <= 0) return null;
    }
    const href = deriveContentTypeHref(platform, ct) || item.href;
    if (!href) return null;
    return {
      id: item.id,
      label: item.label || ct.title,
      href,
      enabled: true,
      order: item.order,
      status: ct.status,
      source,
    };
  }

  if (source && source.kind === "channel") {
    const ch = findChannel(platform, source.channelId || source.id);
    if (!ch) return null;
    if (ch.enabled === false) return null;
    const ts = normalizeStatus(ch.status);
    if (["planned", "paused", "disabled", "archived"].includes(ts)) return null;
    if (ts === "coming-soon" && ch.showInNavigation !== true && item.showInNavigation !== true) {
      return null;
    }
    if (ts === "coming-soon") return null;
    const count = channelCount(catalog, ch);
    if (ts === "active" && count <= 0) return null;
    return {
      id: item.id,
      label: item.label || ch.label || ch.displayName,
      href: ch.href || item.href,
      enabled: true,
      order: item.order,
      status: ch.status,
      source,
    };
  }

  // Static href — still drop dead topic/channel/content-type links
  const href = item.href;
  if (!href) return null;

  const topicSlug = hrefLooksLikeTopic(href);
  if (topicSlug) {
    const topic = findTopic(platform, topicSlug);
    if (!topic) return null;
    if (topic.enabled === false) return null;
    const ts = normalizeStatus(topic.status);
    if (["planned", "paused", "disabled", "archived", "coming-soon"].includes(ts)) return null;
    if (topicCount(catalog, topic) <= 0) return null;
    return {
      id: item.id,
      label: topic.shortName || topic.name || item.label,
      href: "/topics/" + topic.slug,
      enabled: true,
      order: item.order,
      status: topic.status,
    };
  }

  const ch = channelFromHref(platform, href);
  if (ch) {
    if (ch.enabled === false) return null;
    const ts = normalizeStatus(ch.status);
    if (["planned", "paused", "disabled", "archived", "coming-soon"].includes(ts)) return null;
    if (channelCount(catalog, ch) <= 0) return null;
  }

  const ct = contentTypeFromHref(platform, href);
  if (ct) {
    if (ct.enabled === false) return null;
    const ts = normalizeStatus(ct.status);
    if (["planned", "paused", "disabled", "archived", "coming-soon"].includes(ts)) return null;
    if (ct.id === "learn") {
      const courses = publicCourses(platform, catalog, true);
      const lessons = formatCount(catalog, "lesson");
      if (courses.length === 0 && lessons <= 0) return null;
    } else if (formatCount(catalog, ct.id) <= 0) {
      return null;
    }
  }

  return {
    id: item.id,
    label: item.label,
    href,
    enabled: true,
    order: item.order,
    status: item.status || "active",
  };
}

function resolveNavItems(platform, catalog, listKind) {
  const cat = catalog || emptyCatalog();
  const nav = (platform && platform.navigation) || {};
  const list = (listKind === "footer" ? nav.footer : nav.main) || [];
  const resolved = [];
  for (const item of list) {
    try {
      const next = resolveNavItem(item, platform, cat, listKind);
      if (next) resolved.push(next);
    } catch {
      // Removing a topic must never throw
    }
  }
  const hrefs = new Set(resolved.map((item) => item.href));
  let extraOrder = resolved.reduce((max, item) => Math.max(max, item.order || 0), 0);
  for (const topic of publicTopics(platform, cat, "navigation")) {
    const href = "/topics/" + topic.slug;
    if (hrefs.has(href)) continue;
    extraOrder += 1;
    resolved.push({
      id: "topic-" + topic.id,
      label: topic.shortName || topic.name,
      href,
      enabled: true,
      order: extraOrder,
      status: topic.status,
    });
    hrefs.add(href);
  }
  return resolved.sort((a, b) => (a.order || 99) - (b.order || 99));
}

function getSearchIndexInputs(platform, catalog) {
  const cat = catalog || emptyCatalog();
  const topics = publicTopics(platform, cat, "search");
  const channels = publicChannels(platform, cat, "search");
  const contentTypes = publicContentTypes(platform, cat, "search");
  const courses = publicCourses(platform, cat, true);
  const items = (cat.items || []).filter((item) => {
    const status = normalizeStatus(item.status || "active");
    if (item.enabled === false) return false;
    if (["planned", "paused", "disabled", "archived", "coming-soon", "draft"].includes(status)) {
      return false;
    }
    if (item.topicSlug) {
      const topic = findTopic(platform, item.topicSlug);
      if (topic && !isTopicVisible(platform, topic, "search", cat)) return false;
    }
    const ch = findChannel(platform, item.type) || findChannel(platform, item.channelId);
    if (ch) {
      if (!isChannelVisible(platform, ch, "search", cat)) return false;
      return true;
    }
    const typeId = FORMAT_TO_CONTENT_TYPE[normalizeKey(item.type)] || item.type;
    const ct = findContentType(platform, typeId);
    if (ct && !isContentTypeVisible(platform, ct, "search", cat)) return false;
    return true;
  });
  return { topics, channels, contentTypes, courses, items };
}

function getSitemapInputs(platform, catalog) {
  const cat = catalog || emptyCatalog();
  const topics = publicTopics(platform, cat, "sitemap");
  const channels = publicChannels(platform, cat, "sitemap");
  const contentTypes = publicContentTypes(platform, cat, "sitemap");
  const courses = publicCourses(platform, cat, true);
  const items = getSearchIndexInputs(platform, cat).items;
  const corePaths = ["/"];
  for (const ct of contentTypes) {
    const href = deriveContentTypeHref(platform, ct);
    if (href) corePaths.push(href);
  }
  if (!corePaths.includes("/about")) corePaths.push("/about");
  return {
    topics,
    channels,
    contentTypes,
    courses,
    items,
    corePaths: Array.from(new Set(corePaths)),
    topicPaths: topics.map((t) => "/topics/" + t.slug),
    channelPaths: channels.map((c) => c.href).filter(Boolean),
  };
}

function getRouteTopics(platform, catalog) {
  return publicTopics(platform, catalog || emptyCatalog(), "route");
}

function getRouteChannels(platform, catalog) {
  return publicChannels(platform, catalog || emptyCatalog(), "route");
}

function topicRouteState(platform, key, catalog) {
  const topic = findTopic(platform, key);
  if (!topic || topic.enabled === false) return { state: "not-found", topic: null };
  const status = normalizeStatus(topic.status);
  if (["planned", "paused", "disabled", "archived", "coming-soon"].includes(status)) {
    return { state: "not-found", topic };
  }
  const count = topicCount(catalog, topic);
  if (status === "active" && count <= 0) return { state: "not-found", topic };
  return { state: "active", topic };
}

function channelRouteState(platform, key, catalog) {
  const channel = findChannel(platform, key);
  if (!channel || channel.enabled === false) return { state: "not-found", channel: null };
  const status = normalizeStatus(channel.status);
  if (["planned", "paused", "disabled", "archived", "coming-soon"].includes(status)) {
    return { state: "not-found", channel };
  }
  const count = channelCount(catalog, channel);
  if (status === "active" && count <= 0) return { state: "not-found", channel };
  return { state: "active", channel };
}

const PRIMARY_NAV_LIMIT = 5;

function splitPrimaryNav(items, limit) {
  const cap =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : PRIMARY_NAV_LIMIT;
  const list = Array.isArray(items) ? items : [];
  if (list.length <= cap) {
    return { primary: list.slice(), explore: [], limit: cap };
  }
  return {
    primary: list.slice(0, cap),
    explore: list.slice(cap),
    limit: cap,
  };
}

function collectResolvedText(resolved) {
  try {
    return JSON.stringify(resolved).toLowerCase();
  } catch {
    return "";
  }
}

module.exports = {
  LIFECYCLE_STATUSES,
  SURFACES,
  SECTION_TYPES,
  FORMAT_TO_CONTENT_TYPE,
  CONTENT_TYPE_TO_FORMAT,
  normalizeKey,
  normalizeStatus,
  isValidLifecycle,
  emptyCatalog,
  findTopic,
  findContentType,
  findChannel,
  findCourse,
  topicCount,
  formatCount,
  channelCount,
  isVisibleOnSurface,
  isTopicVisible,
  isContentTypeVisible,
  isChannelVisible,
  publicTopics,
  publicContentTypes,
  publicChannels,
  publicCourses,
  comingSoonCourses,
  resolveHomepageSections,
  resolveNavItems,
  getSearchIndexInputs,
  getSitemapInputs,
  getRouteTopics,
  getRouteChannels,
  topicRouteState,
  channelRouteState,
  deriveContentTypeHref,
  collectResolvedText,
  PRIMARY_NAV_LIMIT,
  splitPrimaryNav,
};
