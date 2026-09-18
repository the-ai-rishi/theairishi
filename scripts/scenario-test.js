"use strict";

const fs = require("fs");
const path = require("path");
const vis = require("../lib/visibility-core");
const social = require("../lib/social");
const { runFutureOperationsTests } = require("./future-operations-test");

const platformPath = path.join(__dirname, "..", "content", "config", "platform.json");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function productionCatalog(overrides) {
  return Object.assign(
    {
      topicContentCounts: { ai: 15, devops: 2 },
      formatContentCounts: { lesson: 17, guide: 1, project: 1 },
      channelItemCounts: { youtube: 0, instagram: 0 },
      courses: [
        {
          id: "ai",
          slug: "ai",
          title: "Artificial Intelligence & LLMs",
          topic: "ai",
          status: "active",
          enabled: true,
          lessonCount: 15,
          order: 1,
        },
        {
          id: "devops",
          slug: "devops",
          title: "DevOps & Kubernetes",
          topic: "devops",
          status: "active",
          enabled: true,
          lessonCount: 2,
          order: 2,
        },
      ],
      items: [
        {
          id: "lesson-1",
          type: "lesson",
          title: "What is AI?",
          topicSlug: "ai",
          status: "published",
          url: "/learn/ai-fundamentals-01",
        },
        {
          id: "guide-1",
          type: "guide",
          title: "First principles",
          topicSlug: "ai",
          status: "published",
          url: "/guides/first-principles-ai-learning",
        },
        {
          id: "project-1",
          type: "project",
          title: "Research agent",
          topicSlug: "ai",
          status: "published",
          url: "/projects/autonomous-research-agent",
        },
      ],
    },
    overrides || {}
  );
}

function hrefsOf(nav) {
  return nav.map((item) => item.href);
}

function topicGrid(sections) {
  const section = sections.find((s) => s.type === "topic-grid");
  return (section && section.data && section.data.topics) || [];
}

function channelGrid(sections) {
  const section = sections.find((s) => s.type === "channel-grid");
  return (section && section.data && section.data.channels) || [];
}

function allHrefs(nav, sections) {
  const hrefs = hrefsOf(nav);
  for (const section of sections) {
    if (section.ctaHref) hrefs.push(section.ctaHref);
    const topics = (section.data && section.data.topics) || [];
    for (const t of topics) hrefs.push("/topics/" + t.slug);
    const channels = (section.data && section.data.channels) || [];
    for (const c of channels) if (c.href) hrefs.push(c.href);
  }
  return hrefs;
}

function allLabels(nav, sections) {
  const labels = nav.map((item) => item.label);
  for (const section of sections) {
    const topics = (section.data && section.data.topics) || [];
    for (const t of topics) labels.push(t.name, t.shortName, t.slug);
    const channels = (section.data && section.data.channels) || [];
    for (const c of channels) labels.push(c.label, c.id);
  }
  return labels.filter(Boolean).join(" | ").toLowerCase();
}

function enableChannelGrid(platform) {
  platform.homepage.sections.push({
    id: "channels",
    type: "channel-grid",
    enabled: true,
    order: 50,
    title: "Channels",
    showWhenEmpty: false,
  });
}

function enableTopicGrid(platform) {
  const existing = (platform.homepage.sections || []).find((section) => section.type === "topic-grid");
  if (existing) {
    existing.enabled = true;
    return;
  }
  platform.homepage.sections.push({
    id: "topics-test",
    type: "topic-grid",
    enabled: true,
    order: 50,
    title: "The field",
    showWhenEmpty: false,
  });
}

function runScenarioTests() {
  const originalRaw = fs.readFileSync(platformPath, "utf8");
  const live = JSON.parse(originalRaw);
  const failures = [];

  function check(condition, message) {
    if (!condition) failures.push(message);
  }

  try {
    // ── Test 1: only one active topic with content ──────────────────────────
    const t1 = clone(live);
    enableTopicGrid(t1);
    for (const topic of t1.topics) {
      if (topic.id === "ai") {
        topic.enabled = true;
        topic.status = "active";
        topic.showOnHomepage = true;
        continue;
      }
      topic.enabled = false;
      topic.status = "disabled";
      topic.showOnHomepage = false;
      topic.showInNavigation = false;
    }
    const cat1 = productionCatalog({
      topicContentCounts: { ai: 15, devops: 0 },
      courses: [
        {
          id: "ai",
          slug: "ai",
          title: "AI",
          topic: "ai",
          status: "active",
          enabled: true,
          lessonCount: 15,
          order: 1,
        },
      ],
    });
    const home1 = vis.resolveHomepageSections(t1, cat1).sections;
    const nav1 = vis.resolveNavItems(t1, cat1, "main");
    const grid1 = topicGrid(home1);
    check(grid1.length === 1, "Test 1: topic-grid length should be 1");
    check(grid1[0] && grid1[0].id === "ai", "Test 1: remaining topic should be ai");
    const hrefs1 = allHrefs(nav1, home1).join(" ");
    check(!hrefs1.includes("/topics/devops"), "Test 1: no devops topic href");
    check(!hrefs1.includes("/topics/cloud"), "Test 1: no cloud topic href");
    check(!hrefs1.includes("/topics/interview"), "Test 1: no interview topic href");
    check(!hrefs1.includes("/topics/updates"), "Test 1: no updates topic href");
    check(!hrefs1.includes("/youtube"), "Test 1: no youtube href on homepage/nav");
    check(
      !home1.some((s) => s.id === "technology-updates" || s.id === "interviews"),
      "Test 1: no frozen updates/interview sections"
    );
    check(
      !grid1.some((t) => ["devops", "cloud", "interview", "updates"].includes(t.id)),
      "Test 1: topic-grid has none of the empty domains"
    );

    // ── Test 2: disable a topic that had content ────────────────────────────
    const t2 = clone(live);
    enableTopicGrid(t2);
    const devops2 = t2.topics.find((t) => t.id === "devops");
    devops2.enabled = false;
    devops2.status = "disabled";
    const cat2 = productionCatalog();
    const home2 = vis.resolveHomepageSections(t2, cat2).sections;
    const nav2 = vis.resolveNavItems(t2, cat2, "main");
    const search2 = vis.getSearchIndexInputs(t2, cat2);
    const sitemap2 = vis.getSitemapInputs(t2, cat2);
    check(
      !topicGrid(home2).some((t) => t.id === "devops" || t.slug === "devops"),
      "Test 2: devops gone from homepage topic-grid"
    );
    check(
      !allHrefs(nav2, home2).some((h) => String(h).includes("/topics/devops")),
      "Test 2: devops gone from nav/homepage hrefs"
    );
    check(
      !search2.topics.some((t) => t.id === "devops"),
      "Test 2: devops gone from search index"
    );
    check(
      !sitemap2.topicPaths.some((p) => p.includes("/topics/devops")),
      "Test 2: devops gone from sitemap"
    );

    // ── Test 3: remove a topic object entirely ──────────────────────────────
    const t3 = clone(live);
    t3.topics = t3.topics.filter((t) => t.id !== "devops");
    let threw = false;
    let home3;
    let nav3;
    try {
      home3 = vis.resolveHomepageSections(t3, productionCatalog()).sections;
      nav3 = vis.resolveNavItems(t3, productionCatalog(), "main");
    } catch (err) {
      threw = true;
      failures.push("Test 3: threw after removing topic: " + err.message);
    }
    check(!threw, "Test 3: must not throw when a topic object is removed");
    if (!threw) {
      check(
        !allHrefs(nav3, home3).some((h) => String(h).includes("/topics/devops")),
        "Test 3: no leftover /topics/devops href"
      );
    }

    // ── Test 4: rename topic name and slug ──────────────────────────────────
    const t4 = clone(live);
    enableTopicGrid(t4);
    const devops4 = t4.topics.find((t) => t.id === "devops");
    devops4.slug = "full-stack-engineering";
    devops4.name = "Full Stack Engineering";
    devops4.shortName = "Full Stack";
    const cat4 = productionCatalog({
      topicContentCounts: { ai: 15, devops: 2, "full-stack-engineering": 2 },
    });
    const home4 = vis.resolveHomepageSections(t4, cat4).sections;
    const nav4 = vis.resolveNavItems(t4, cat4, "main");
    const grid4 = topicGrid(home4);
    const renamed = grid4.find((t) => t.id === "devops");
    check(Boolean(renamed), "Test 4: renamed topic still resolved by id");
    check(renamed && renamed.slug === "full-stack-engineering", "Test 4: slug updated");
    check(renamed && renamed.name === "Full Stack Engineering", "Test 4: name updated");
    const blob4 = allLabels(nav4, home4) + " " + allHrefs(nav4, home4).join(" ");
    check(blob4.includes("full-stack-engineering"), "Test 4: new slug present");
    check(!allHrefs(nav4, home4).some((h) => h === "/topics/devops"), "Test 4: old slug href gone");
    check(
      !grid4.some((t) => t.slug === "devops"),
      "Test 4: old slug not in topic-grid"
    );

    // ── Test 5: add python as active with content ───────────────────────────
    const t5 = clone(live);
    enableTopicGrid(t5);
    t5.topics.push({
      id: "python",
      slug: "python",
      name: "Python",
      shortName: "Python",
      description: "Python from first principles.",
      badge: "Python",
      category: "Languages",
      color: "amber",
      order: 20,
      enabled: true,
      featured: true,
      showOnHomepage: true,
      showInNavigation: true,
      status: "active",
    });
    const cat5 = productionCatalog({
      topicContentCounts: { ai: 15, devops: 2, python: 4 },
    });
    const home5 = vis.resolveHomepageSections(t5, cat5).sections;
    const nav5 = vis.resolveNavItems(t5, cat5, "main");
    check(
      topicGrid(home5).some((t) => t.id === "python"),
      "Test 5: python appears in topic-grid"
    );
    check(
      nav5.some((item) => item.href === "/topics/python" && item.label.toLowerCase().includes("python")),
      "Test 5: python appears in nav with live label/href"
    );

    // ── Test 6: disable YouTube ─────────────────────────────────────────────
    const t6 = clone(live);
    enableChannelGrid(t6);
    t6.navigation.main.push({
      id: "youtube",
      label: "YouTube",
      enabled: true,
      order: 20,
      source: { kind: "channel", id: "youtube" },
    });
    const yt6 = t6.social.find((s) => s.id === "youtube");
    yt6.enabled = false;
    yt6.status = "disabled";
    const cat6 = productionCatalog({ channelItemCounts: { youtube: 3, instagram: 0 } });
    const home6 = vis.resolveHomepageSections(t6, cat6).sections;
    const nav6 = vis.resolveNavItems(t6, cat6, "main");
    const search6 = vis.getSearchIndexInputs(t6, cat6);
    const sitemap6 = vis.getSitemapInputs(t6, cat6);
    check(
      !channelGrid(home6).some((c) => c.id === "youtube"),
      "Test 6: youtube gone from channel-grid"
    );
    check(
      !nav6.some((item) => item.id === "youtube" || String(item.href).includes("youtube")),
      "Test 6: youtube gone from nav"
    );
    check(
      !search6.channels.some((c) => c.id === "youtube"),
      "Test 6: youtube gone from search"
    );
    check(
      !sitemap6.channelPaths.some((p) => String(p).includes("youtube")),
      "Test 6: youtube gone from sitemap"
    );

    // ── Test 7: enable YouTube as active with items ─────────────────────────
    const t7 = clone(live);
    enableChannelGrid(t7);
    const yt7 = t7.social.find((s) => s.id === "youtube");
    yt7.enabled = true;
    yt7.status = "active";
    yt7.showOnHomepage = true;
    yt7.showInNavigation = true;
    const cat7 = productionCatalog({
      channelItemCounts: { youtube: 4, instagram: 0 },
      items: [
        ...productionCatalog().items,
        {
          id: "yt-1",
          type: "youtube",
          title: "A video",
          status: "published",
          url: "/youtube",
        },
      ],
    });
    const home7 = vis.resolveHomepageSections(t7, cat7).sections;
    check(
      channelGrid(home7).some((c) => c.id === "youtube"),
      "Test 7: youtube appears in channel-grid when active with items"
    );
    const sitemap7 = vis.getSitemapInputs(t7, cat7);
    const search7 = vis.getSearchIndexInputs(t7, cat7);
    check(
      vis.getRouteChannels(t7, cat7).some((c) => c.href === "/youtube" || c.id === "youtube"),
      "Test 7: enabling YouTube with items adds a /youtube route"
    );
    check(
      sitemap7.channelPaths.includes("/youtube"),
      "Test 7: /youtube appears in sitemap channelPaths"
    );
    check(
      vis.channelRouteState(t7, "youtube", cat7).state === "active",
      "Test 7: channelRouteState is active when YouTube has items"
    );
    check(
      search7.items.some((item) => item.type === "youtube"),
      "Test 7: youtube items are in search when the channel is active with content"
    );
    check(
      search7.channels.some((c) => c.id === "youtube"),
      "Test 7: youtube channel is in search inputs when active with content"
    );

    // ── Test 8: disable guides content type ─────────────────────────────────
    const t8 = clone(live);
    const guidesType = t8.contentTypes.find((ct) => ct.id === "guides");
    guidesType.enabled = false;
    guidesType.status = "disabled";
    const cat8 = productionCatalog();
    const home8 = vis.resolveHomepageSections(t8, cat8).sections;
    const nav8 = vis.resolveNavItems(t8, cat8, "main");
    const search8 = vis.getSearchIndexInputs(t8, cat8);
    const sitemap8 = vis.getSitemapInputs(t8, cat8);
    check(
      !nav8.some((item) => item.id === "guides" || item.href === "/guides"),
      "Test 8: guides gone from nav"
    );
    check(
      !home8.some(
        (s) =>
          s.id === "guides" ||
          (s.source && s.source.kind === "format" && s.source.format === "guide")
      ),
      "Test 8: guides content-list gone from homepage"
    );
    check(
      !search8.contentTypes.some((ct) => ct.id === "guides"),
      "Test 8: guides gone from search content types"
    );
    check(
      !search8.items.some((item) => item.type === "guide"),
      "Test 8: guide items gone from search"
    );
    check(
      !sitemap8.corePaths.includes("/guides"),
      "Test 8: /guides gone from sitemap"
    );

    // ── Test 9: enabled planned area with 0 content ─────────────────────────
    const t9 = clone(live);
    t9.homepage.sections.push({
      id: "updates-feed",
      type: "content-list",
      enabled: true,
      order: 40,
      title: "Updates theater",
      source: { kind: "topic", topicId: "updates" },
      showWhenEmpty: false,
    });
    const cat9 = productionCatalog({ topicContentCounts: { ai: 15, devops: 2, updates: 0 } });
    const home9 = vis.resolveHomepageSections(t9, cat9).sections;
    check(
      !home9.some((s) => s.id === "updates-feed"),
      "Test 9: planned empty area must not become a large homepage section"
    );
    check(
      !topicGrid(home9).some((t) => t.id === "updates" || t.id === "cloud" || t.id === "interview"),
      "Test 9: planned topics stay out of topic-grid"
    );

    // Production default sanity on the unmodified live config
    const liveCat = productionCatalog();
    const liveHome = vis.resolveHomepageSections(live, liveCat).sections;
    const liveNav = vis.resolveNavItems(live, liveCat, "main");
    const liveGrid = topicGrid(liveHome);
    const liveHomeTopics = vis.publicTopics(live, liveCat, "homepage");
    const liveHomeTypes = liveHome.map((section) => section.type);
    check(
      liveHomeTypes.includes("hero") &&
        liveHomeTypes.includes("program") &&
        liveHomeTypes.includes("phases") &&
        liveHomeTypes.includes("why") &&
        liveHomeTypes.includes("today") &&
        liveHomeTypes.includes("method") &&
        liveHomeTypes.includes("path"),
      "Production: homepage is learner-first (hero/program/phases/why/today/method/path)"
    );
    check(
      !liveHome.some((s) => s.type === "topic-grid"),
      "Production: topic-grid stays off the live homepage"
    );
    check(liveGrid.length === 0, "Production: resolved topic-grid is empty because it is disabled");
    check(
      liveHomeTopics.some((t) => t.id === "devops"),
      "Production: DevOps is a homepage topic"
    );
    check(
      !liveHomeTopics.some((t) => t.id === "ai"),
      "Production: AI is not a homepage topic"
    );
    check(
      liveHomeTopics.every((t) => t.id === "devops"),
      "Production: homepage topics do not include empty planned areas"
    );
    check(
      liveNav.some((item) => item.href === "/learn/day-01") &&
        liveNav.some((item) => item.href === "/learn") &&
        liveNav.some((item) => item.href === "/about"),
      "Production: nav is Start / 120 Days / About"
    );
    check(
      liveNav.some((item) => item.href === "/guides") &&
        liveNav.some((item) => item.href === "/projects") &&
        liveNav.every((item) => item.href !== "/topics/ai"),
      "Production: Guides and Projects are in nav; AI topic is not"
    );
    check(
      liveNav.every((item) => !String(item.href).includes("/topics/updates")),
      "Production: nav has no /topics/updates"
    );
    check(
      liveNav.every((item) => !String(item.href).includes("/youtube")),
      "Production: nav has no YouTube while coming-soon"
    );
    check(
      !liveHome.some((s) => s.type === "channel-grid"),
      "Production: channel-grid is not on the live homepage"
    );
    check(
      !liveHome.some(
        (s) =>
          s.id === "technology-updates" ||
          s.id === "interviews" ||
          s.type === "technology-updates" ||
          s.type === "interviews"
      ),
      "Production: homepage resolved types do not include frozen ids"
    );
    const liveSitemap = vis.getSitemapInputs(live, liveCat);
    check(
      !liveSitemap.channelPaths.some((path) => String(path).includes("youtube")),
      "Production: coming-soon YouTube is not a sitemap channelPath"
    );
    check(
      !vis.getRouteChannels(live, liveCat).some((c) => c.id === "youtube"),
      "Production: coming-soon YouTube is not a route channel"
    );
    check(
      vis.channelRouteState(live, "youtube", liveCat).state === "not-found",
      "Production: direct /youtube while coming-soon is not-found"
    );
    check(
      vis.channelRouteState(live, "instagram", liveCat).state === "not-found",
      "Production: Instagram is not a site route"
    );
    check(
      social.publicDestinations(live).some((ch) => ch.id === "instagram"),
      "Production: Instagram is a public external destination"
    );
    check(
      social.publicDestinations(live).some((ch) => ch.id === "telegram"),
      "Production: Telegram placeholder is a public destination"
    );
    check(
      !social.publicDestinations(live).some((ch) => ch.id === "github"),
      "Production: GitHub is hidden while disabled"
    );
    check(
      social.sameAsUrls(live).length === 1 &&
        social.INSTAGRAM_PROFILE_RE.test(social.sameAsUrls(live)[0]),
      "Production: JSON-LD sameAs is Instagram only"
    );
    check(
      liveHome.some((s) => s.type === "destinations"),
      "Production: destinations section is on the homepage"
    );

    // ── Test 10: planned/coming-soon YouTube has no public route ────────────
    const t10 = clone(live);
    enableChannelGrid(t10);
    t10.navigation.main.push({
      id: "youtube",
      label: "YouTube",
      enabled: true,
      order: 20,
      source: { kind: "channel", id: "youtube" },
    });
    const yt10 = t10.social.find((s) => s.id === "youtube");
    yt10.enabled = true;
    yt10.status = "planned";
    yt10.showOnHomepage = true;
    yt10.showInNavigation = true;
    const cat10 = productionCatalog({ channelItemCounts: { youtube: 0, instagram: 0 } });
    const home10 = vis.resolveHomepageSections(t10, cat10).sections;
    const nav10 = vis.resolveNavItems(t10, cat10, "main");
    const search10 = vis.getSearchIndexInputs(t10, cat10);
    const sitemap10 = vis.getSitemapInputs(t10, cat10);
    check(
      !vis.getRouteChannels(t10, cat10).some((c) => c.id === "youtube"),
      "Test 10: planned YouTube is not a route channel"
    );
    check(
      !sitemap10.channelPaths.includes("/youtube"),
      "Test 10: planned YouTube is not a channelPath"
    );
    check(
      vis.channelRouteState(t10, "youtube", cat10).state === "not-found",
      "Test 10: planned YouTube route state is not-found"
    );
    check(
      !channelGrid(home10).some((c) => c.id === "youtube"),
      "Test 10: planned YouTube is not on homepage channel-grid"
    );
    check(
      !nav10.some((item) => item.id === "youtube" || String(item.href).includes("youtube")),
      "Test 10: planned YouTube is not in nav"
    );
    check(
      !search10.channels.some((c) => c.id === "youtube"),
      "Test 10: planned YouTube is not in search"
    );
    yt10.status = "coming-soon";
    const sitemap10b = vis.getSitemapInputs(t10, cat10);
    check(
      !sitemap10b.channelPaths.includes("/youtube"),
      "Test 10: coming-soon YouTube is not a channelPath"
    );
    check(
      vis.channelRouteState(t10, "youtube", cat10).state === "not-found",
      "Test 10: coming-soon YouTube route state is not-found"
    );
    check(
      !vis.getRouteChannels(t10, cat10).some((c) => c.id === "youtube"),
      "Test 10: coming-soon YouTube is not a route channel"
    );

    // ── Test 11: nav split — 8 visible items => 5 primary + 3 explore ───────
    const eight = Array.from({ length: 8 }, (_, i) => ({
      id: "nav-" + (i + 1),
      label: "Item " + (i + 1),
      href: "/item-" + (i + 1),
    }));
    const split8 = vis.splitPrimaryNav(eight, 5);
    check(split8.primary.length === 5, "Test 11: header primary count is 5");
    check(split8.explore.length === 3, "Test 11: Explore contains the remaining 3");
    check(split8.primary[0].id === "nav-1", "Test 11: first primary is the first item");
    check(split8.explore[0].id === "nav-6", "Test 11: Explore starts at the 6th item");
    const split5 = vis.splitPrimaryNav(eight.slice(0, 5), 5);
    check(split5.primary.length === 5 && split5.explore.length === 0, "Test 11: 5 items stay in the bar");
    const splitDefault = vis.splitPrimaryNav(eight);
    check(
      splitDefault.primary.length === 5 && splitDefault.explore.length === 3,
      "Test 11: default limit is 5"
    );

    // ── Test 12: active-with-zero-content YouTube is not a public route ──────
    const t12 = clone(live);
    enableChannelGrid(t12);
    const yt12 = t12.social.find((s) => s.id === "youtube");
    yt12.enabled = true;
    yt12.status = "active";
    yt12.showOnHomepage = true;
    const cat12 = productionCatalog({ channelItemCounts: { youtube: 0, instagram: 0 } });
    check(
      vis.channelRouteState(t12, "youtube", cat12).state === "not-found",
      "Test 12: active YouTube with zero items is not-found"
    );
    check(
      !vis.getSitemapInputs(t12, cat12).channelPaths.includes("/youtube"),
      "Test 12: active empty YouTube is not a channelPath"
    );

    // ── Test 13: listing file routes follow content type status ─────────────
    check(
      vis.contentTypeRouteState(live, "learn").state === "active",
      "Test 13: live learn is routable"
    );
    check(
      vis.contentTypeRouteState(live, "guides").state === "active",
      "Test 13: live guides is routable"
    );
    check(
      vis.contentTypeRouteState(live, "projects").state === "active",
      "Test 13: live projects is routable"
    );
    const t13 = clone(live);
    const learn13 = t13.contentTypes.find((c) => c.id === "learn");
    learn13.status = "disabled";
    check(
      vis.contentTypeRouteState(t13, "learn").state === "not-found",
      "Test 13: disabled learn is not-found"
    );
    learn13.status = "coming-soon";
    check(
      vis.contentTypeRouteState(t13, "learn").state === "not-found",
      "Test 13: coming-soon learn is not-found"
    );
    learn13.status = "active";
    learn13.enabled = false;
    check(
      vis.contentTypeRouteState(t13, "learn").state === "not-found",
      "Test 13: enabled-false learn is not-found"
    );

    check(
      liveNav.some((item) => item.label === "Start") &&
        liveNav.some((item) => item.label === "120 Days") &&
        liveNav.some((item) => item.label === "About") &&
        liveNav.every((item) => item.label !== "Journey"),
      "Production: nav labels are Start / 120 Days / About, not Journey"
    );
    check(
      !Object.prototype.hasOwnProperty.call(live.copy, "heroTitle"),
      "Production: unused copy.heroTitle is omitted; the hero uses the program title"
    );
    check(
      !Object.prototype.hasOwnProperty.call(live.copy, "heroTagline"),
      "Production: unused copy.heroTagline is omitted"
    );
    check(
      live.copy.heroBadge !== live.brand.name,
      "Production: hero does not repeat the brand name"
    );
    check(
      !Object.prototype.hasOwnProperty.call(live.brand, "lineage"),
      "Production: brand.lineage is absent"
    );
    check(
      !Object.prototype.hasOwnProperty.call(live.brand, "tagline") ||
        (typeof live.brand.tagline === "string" && live.brand.tagline.trim().length > 0),
      "Production: brand.tagline is omitted unless it is a real slogan"
    );
    check(
      vis.getSitemapInputs(live, liveCat).items.every((item) => item.topicSlug !== "ai"),
      "Production: sitemap items exclude the AI topic"
    );

    const liveSearch = vis.getSearchIndexInputs(live, liveCat);
    check(
      !liveSearch.topics.some((topic) => topic.id === "ai"),
      "Production: AI topic is excluded from search by includeInSearch: false"
    );
    check(
      !liveSearch.items.some((item) => item.topicSlug === "ai"),
      "Production: AI notes are excluded from search items"
    );
    check(
      vis.topicRouteState(live, "ai", liveCat).state === "active",
      "Production: AI notes remain routable at their URLs"
    );
    check(
      !vis.getSitemapInputs(live, liveCat).topicPaths.includes("/topics/ai"),
      "Production: /topics/ai is omitted from the sitemap"
    );

    // ── Test 14: includeInSearch false hides topic from search, not routes ──
    const t14 = clone(live);
    const ai14 = t14.topics.find((topic) => topic.id === "ai");
    ai14.includeInSearch = true;
    ai14.includeInSitemap = true;
    const search14on = vis.getSearchIndexInputs(t14, liveCat);
    check(
      search14on.topics.some((topic) => topic.id === "ai"),
      "Test 14: includeInSearch true puts AI back in search topics"
    );
    ai14.includeInSearch = false;
    ai14.includeInSitemap = false;
    const search14off = vis.getSearchIndexInputs(t14, liveCat);
    check(
      !search14off.topics.some((topic) => topic.id === "ai"),
      "Test 14: includeInSearch false removes AI from search topics"
    );
    check(
      !search14off.items.some((item) => item.topicSlug === "ai"),
      "Test 14: includeInSearch false removes AI items from search"
    );
    check(
      vis.topicRouteState(t14, "ai", liveCat).state === "active",
      "Test 14: route for AI stays active when search is off"
    );

    ai14.includeInSearch = true;
    ai14.includeInSitemap = false;
    const mixed14 = vis.getSearchIndexInputs(t14, liveCat);
    const mixed14map = vis.getSitemapInputs(t14, liveCat);
    check(
      mixed14.topics.some((topic) => topic.id === "ai"),
      "Test 14: search can include a topic that the sitemap omits"
    );
    check(
      mixed14.items.some((item) => item.topicSlug === "ai"),
      "Test 14: search items include AI when search is on and sitemap is off"
    );
    check(
      !mixed14map.topicPaths.includes("/topics/ai"),
      "Test 14: includeInSitemap false omits /topics/ai even if search is on"
    );
    check(
      mixed14map.items.every((item) => item.topicSlug !== "ai"),
      "Test 14: includeInSitemap false omits AI item URLs from the sitemap"
    );

    ai14.includeInSearch = false;
    ai14.includeInSitemap = true;
    const mixed14bSearch = vis.getSearchIndexInputs(t14, liveCat);
    const mixed14bMap = vis.getSitemapInputs(t14, liveCat);
    check(
      !mixed14bSearch.topics.some((topic) => topic.id === "ai"),
      "Test 14: search can omit a topic that the sitemap includes"
    );
    check(
      !mixed14bSearch.items.some((item) => item.topicSlug === "ai"),
      "Test 14: search items omit AI when search is off and sitemap is on"
    );
    check(
      mixed14bMap.topicPaths.includes("/topics/ai"),
      "Test 14: includeInSitemap true lists /topics/ai even if search is off"
    );
    check(
      mixed14bMap.items.some((item) => item.topicSlug === "ai"),
      "Test 14: sitemap items include AI when sitemap is on and search is off"
    );

    // ── Test 15: planned topic cannot leak into search or sitemap ───────────
    const t15 = clone(live);
    const cloud15 = t15.topics.find((topic) => topic.id === "cloud");
    cloud15.includeInSearch = true;
    cloud15.includeInSitemap = true;
    cloud15.showOnHomepage = true;
    cloud15.showInNavigation = true;
    const cat15 = productionCatalog({ topicContentCounts: { ai: 15, devops: 2, cloud: 0 } });
    check(
      vis.normalizeStatus(cloud15.status) === "planned",
      "Test 15: cloud stays planned"
    );
    check(
      !vis.getSearchIndexInputs(t15, cat15).topics.some((topic) => topic.id === "cloud"),
      "Test 15: planned cloud is absent from search"
    );
    check(
      !vis.getSitemapInputs(t15, cat15).topicPaths.includes("/topics/cloud"),
      "Test 15: planned cloud is absent from sitemap"
    );
    check(
      vis.topicRouteState(t15, "cloud", cat15).state === "not-found",
      "Test 15: planned cloud has no public route"
    );

    // ── Test 16: course href cannot point at another course ────────────────
    const { hrefForCourse } = require("../lib/course-href");
    const program16 = {
      id: "devops-engineer-mastery",
      slug: "devops-engineer-mastery",
      startHref: "/learn/day-01",
    };
    const foreignLive = {
      id: "devops-engineer-mastery",
      stages: [{ lessons: [{ slug: "ai-fundamentals-01", metadata: { course: "ai" } }] }],
    };
    check(
      hrefForCourse({ id: "devops-engineer-mastery", slug: "devops-engineer-mastery" }, foreignLive, program16) ===
        "/learn/day-01",
      "Test 16: program course always uses startHref, even if live first lesson belongs elsewhere"
    );
    check(
      hrefForCourse(
        { id: "ai", slug: "ai" },
        { id: "ai", stages: [{ lessons: [{ slug: "ai-fundamentals-01", metadata: { course: "ai" } }] }] },
        program16
      ) === "/learn/ai-fundamentals-01",
      "Test 16: a matching course may link its own first lesson"
    );
    check(
      hrefForCourse(
        { id: "ai", slug: "ai" },
        { id: "ai", stages: [{ lessons: [{ slug: "day-01", metadata: { course: "devops-engineer-mastery" } }] }] },
        program16
      ) === "/learn",
      "Test 16: a course cannot inherit another course's first lesson"
    );
    check(
      hrefForCourse(
        { id: "ai", slug: "ai" },
        { id: "someone-else", stages: [{ lessons: [{ slug: "day-01", metadata: { course: "ai" } }] }] },
        program16
      ) === "/learn",
      "Test 16: live course id must match the catalog course"
    );

    // ── Test 17: one publication predicate (gray-matter, not regex) ────────
    const publish = require("../lib/lesson-publish");
    const completeLesson =
      "---\ntitle: Probe\ncourse: devops-engineer-mastery\nstage: Foundations\nlesson: 4\nstatus: published\n---\nbody\n";
    check(
      publish.isPublicLessonMarkdown(completeLesson) === true,
      "Test 17: a complete published lesson is public"
    );
    check(
      publish.isPublicLessonMarkdown(completeLesson.replace("status: published\n", "")) === false,
      "Test 17: omitted status is not public"
    );
    check(
      publish.isPublicLessonMarkdown("---\nstatus: published\n---\nstatus: published in the body\n") === false,
      "Test 17: a regex-only status match is not a public lesson"
    );
    check(
      publish.isPublicLessonMarkdown(completeLesson.replace("status: published", "status: draft")) === false,
      "Test 17: draft is not public"
    );
    check(
      publish.isPublicLessonMarkdown(completeLesson.replace("status: published", "enabled: false\nstatus: published")) ===
        false,
      "Test 17: enabled false is not public"
    );
    check(
      publish.isPublicLessonMarkdown(completeLesson.replace("status: published", "status: coming-soon")) === false,
      "Test 17: coming-soon is not public"
    );
    check(
      publish.isPublicLessonMarkdown(completeLesson.replace("\ncourse: devops-engineer-mastery", "")) === false,
      "Test 17: missing course is not public"
    );
    check(
      publish.isLessonSourcePath("content/lessons/day-01.md") === true &&
        publish.isLessonSourcePath("content/courses/devops/secret.md") === false,
      "Test 17: only content/lessons/ is a lesson source path"
    );

    const mixedCatalog = {
      "content/lessons/day-01.md": completeLesson.replace("lesson: 4", "lesson: 1"),
      "content/courses/devops/secret-syllabus.md": completeLesson.replace("lesson: 4", "lesson: 99"),
      "content/lessons/notes.md": "# just a note\nstatus: published\n",
    };
    const mixedSlugs = publish.collectPublishedLessonSlugs(mixedCatalog);
    check(
      mixedSlugs.includes("day-01") && !mixedSlugs.includes("secret-syllabus") && !mixedSlugs.includes("notes"),
      "Test 17: generator slugs ignore content/courses and incomplete markdown"
    );

    // ── Test 18: static /learn segments require a real page file ───────────
    const { collectStaticLearnSegments } = require("./generate-content-data");
    const static18 = collectStaticLearnSegments(path.join(__dirname, ".."));
    check(
      static18.includes("ai-fundamentals"),
      "Test 18: existing ai-fundamentals redirect page is a static learn segment"
    );
    check(
      !static18.includes("[slug]"),
      "Test 18: the dynamic [slug] folder is not a static learn segment"
    );

    const future = runFutureOperationsTests(live);
    if (!future.ok) {
      future.failures.forEach((f) => failures.push(f));
    }

  } finally {
    const after = fs.readFileSync(platformPath, "utf8");
    if (after !== originalRaw) {
      fs.writeFileSync(platformPath, originalRaw);
      failures.push("platform.json was mutated; restored original");
    }
  }

  if (failures.length) {
    console.error("SCENARIO TESTS FAILED:");
    failures.forEach((f) => console.error("  - " + f));
    return false;
  }
  console.log("SCENARIO TESTS PASSED (1-18 + future operations A-N)");
  return true;
}

if (require.main === module) {
  process.exit(runScenarioTests() ? 0 : 1);
}

module.exports = { runScenarioTests };
