import type { MetadataRoute } from "next";
import { getAllLessonSlugs } from "@/lib/lessons";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllProjectSlugs } from "@/lib/projects";
import { loadPlatformConfig, getContentTypeRecord } from "@/lib/config";
import { getLiveCatalog } from "@/lib/catalog";
import { getSitemapInputs, isVisibleOnSurface, formatCount } from "@/lib/visibility-core";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const platform = loadPlatformConfig();
  const catalog = getLiveCatalog();
  const inputs = getSitemapInputs(platform, catalog);

  const routes: MetadataRoute.Sitemap = inputs.corePaths.map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : 0.8,
  }));

  for (const path of inputs.topicPaths) {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const path of inputs.channelPaths) {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const learnType = getContentTypeRecord("learn");
  if (learnType && isVisibleOnSurface({ ...learnType, contentCount: formatCount(catalog, "learn") }, "sitemap", { requireContent: true })) {
    for (const slug of getAllLessonSlugs()) {
      routes.push({
        url: `${baseUrl}/learn/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  const guidesType = getContentTypeRecord("guides");
  if (guidesType && isVisibleOnSurface({ ...guidesType, contentCount: formatCount(catalog, "guides") }, "sitemap", { requireContent: true })) {
    for (const slug of getAllGuideSlugs()) {
      routes.push({
        url: `${baseUrl}/guides/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  const projectsType = getContentTypeRecord("projects");
  if (projectsType && isVisibleOnSurface({ ...projectsType, contentCount: formatCount(catalog, "projects") }, "sitemap", { requireContent: true })) {
    for (const slug of getAllProjectSlugs()) {
      routes.push({
        url: `${baseUrl}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  const seen = new Set<string>();
  return routes.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
