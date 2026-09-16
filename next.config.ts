import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Content is compiled into the JS bundle. Production runtimes (Vercel Node
  // and Cloudflare Workers) never read content/ from disk.
};

if (process.env.OPEN_NEXT_CLOUDFLARE || process.env.CLOUDFLARE || process.env.WORKERS_CI) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
