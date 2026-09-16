import type { MetadataRoute } from "next";
import { getBrandConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  const brand = getBrandConfig();
  return {
    name: brand.name,
    short_name: brand.shortName || brand.name,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08080b",
    theme_color: "#08080b",
    icons: [
      {
        src: brand.faviconUrl || "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: brand.logoMark || "/brand/logo-mark.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
