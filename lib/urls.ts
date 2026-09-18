import { getBrandConfig } from "./config";

export function getSiteOrigin(): string {
  const brand = getBrandConfig();
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const raw = (fromEnv && fromEnv.trim()) || brand.url || "https://theairishi.com";
  return raw.replace(/\/+$/, "");
}

export function canonicalUrl(path: string = "/"): string {
  const origin = getSiteOrigin();
  if (!path || path === "/") return origin;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized.replace(/\/+$/, "")}`;
}

export function canonicalAlternates(path: string = "/") {
  return {
    canonical: canonicalUrl(path),
  };
}
