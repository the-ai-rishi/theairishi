import type { MetadataRoute } from "next";
import { loadPlatformConfig, getDefaultsConfig } from "@/lib/config";
import { getLiveCatalog } from "@/lib/catalog";
import { getSitemapInputs } from "@/lib/visibility-core";
import { getSiteOrigin } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteOrigin();
  const platform = loadPlatformConfig();
  const catalog = getLiveCatalog();
  const inputs = getSitemapInputs(platform, catalog);
  const stamp = new Date(getDefaultsConfig().contentDate || "2026-08-20");

  const routes: MetadataRoute.Sitemap = inputs.corePaths.map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: stamp,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : 0.8,
  }));

  for (const path of inputs.topicPaths) {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: stamp,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const path of inputs.channelPaths) {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: stamp,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const item of inputs.items) {
    const path = String(item.url || "");
    if (!path || !path.startsWith("/")) continue;
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: stamp,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  const seen = new Set<string>();
  return routes.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
