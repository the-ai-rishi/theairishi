import type { MetadataRoute } from "next";
import { getAllLessonSlugs } from "@/lib/lessons";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllProjectSlugs } from "@/lib/projects";
import { getAllTopics, getSocialPlatforms } from "@/lib/config";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Core static routes (always included)
  const coreRoutes = ["", "/learn", "/guides", "/projects", "/about"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    })
  );

  // Social platform routes — only include if status is active
  const socialRoutes = getSocialPlatforms()
    .filter((s) => s.status === "active")
    .map((s) => ({
      url: `${baseUrl}${s.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Enabled topics only
  const topicRoutes = getAllTopics().map((t) => ({
    url: `${baseUrl}/topics/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Published lessons
  const lessonRoutes = getAllLessonSlugs().map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Guides
  const guideRoutes = getAllGuideSlugs().map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Projects
  const projectRoutes = getAllProjectSlugs().map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...coreRoutes,
    ...socialRoutes,
    ...topicRoutes,
    ...lessonRoutes,
    ...guideRoutes,
    ...projectRoutes,
  ];
}
