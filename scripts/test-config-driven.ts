import fs from "fs";
import path from "path";
import {
  resetConfigCache,
  getAllTopics,
  getMainNavigation,
  getHomepageSections,
  getAllContentTypes,
  getTopicBySlug,
  getSocialPlatform,
} from "../lib/config";

const platformPath = path.join(process.cwd(), "content/config/platform.json");
const original = fs.readFileSync(platformPath, "utf8");

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error("Assertion failed: " + message);
  }
}

try {
  resetConfigCache();
  assert(Boolean(getTopicBySlug("updates")), "updates topic should exist");
  assert(
    getMainNavigation().some((item) => item.href === "/topics/updates"),
    "nav should include /topics/updates"
  );
  assert(
    getHomepageSections().some((section) => section.id === "technology-updates"),
    "homepage should include technology-updates"
  );

  const removed = JSON.parse(original);
  removed.topics = removed.topics.filter((topic: { id: string }) => topic.id !== "updates");
  fs.writeFileSync(platformPath, JSON.stringify(removed, null, 2));
  resetConfigCache();

  assert(!getTopicBySlug("updates"), "removed updates topic must not resolve");
  assert(
    !getMainNavigation().some((item) => item.href.includes("/topics/updates")),
    "nav must drop updates after topic removal"
  );
  assert(
    !getHomepageSections().some((section) => section.id === "technology-updates"),
    "homepage must drop the updates section"
  );
  assert(
    !getAllContentTypes().some(
      (type) => type.id === "updates" || type.topicSlug === "updates"
    ),
    "content types must drop updates"
  );

  fs.writeFileSync(platformPath, original);
  resetConfigCache();
  const renamed = JSON.parse(original);
  const devops = renamed.topics.find((topic: { id: string }) => topic.id === "devops");
  devops.name = "Full Stack Engineering";
  devops.shortName = "Full Stack";
  devops.slug = "full-stack-engineering";
  fs.writeFileSync(platformPath, JSON.stringify(renamed, null, 2));
  resetConfigCache();

  const live = getTopicBySlug("devops");
  assert(live?.slug === "full-stack-engineering", "rename must keep id lookup and new slug");
  assert(live?.name === "Full Stack Engineering", "rename must update display name");
  assert(
    getAllTopics().some((topic) => topic.slug === "full-stack-engineering"),
    "topic list must use the new slug"
  );

  fs.writeFileSync(platformPath, original);
  resetConfigCache();
  const reordered = JSON.parse(original);
  const hero = reordered.homepage.sections.find((section: { id: string }) => section.id === "hero");
  const topics = reordered.homepage.sections.find((section: { id: string }) => section.id === "topics");
  hero.enabled = false;
  topics.order = 99;
  fs.writeFileSync(platformPath, JSON.stringify(reordered, null, 2));
  resetConfigCache();

  const sections = getHomepageSections();
  assert(!sections.some((section) => section.id === "hero"), "disabled hero must not render");
  assert(sections[sections.length - 1]?.id === "topics", "topics section should move last");

  fs.writeFileSync(platformPath, original);
  resetConfigCache();
  const social = JSON.parse(original);
  const youtube = social.social.find((item: { id: string }) => item.id === "youtube");
  youtube.status = "disabled";
  fs.writeFileSync(platformPath, JSON.stringify(social, null, 2));
  resetConfigCache();
  assert(!getSocialPlatform("youtube"), "disabled YouTube must not resolve");

  console.log("CONFIG LIFECYCLE TESTS PASSED");
} finally {
  fs.writeFileSync(platformPath, original);
  resetConfigCache();
}
