import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Keep the source-tree filesystem path available to Node-based Vercel builds.
  // Cloudflare uses the embedded content catalog instead of relying on this path.
};

initOpenNextCloudflareForDev();

export default nextConfig;
