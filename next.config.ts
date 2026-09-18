import type { NextConfig } from "next";
import { createRequire } from "node:module";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Any `next build` / `next dev` regenerates the embedded catalog and the
// published-lesson slug allow-list. npm prebuild is not enough: OpenNext
// used to call `npx next build` and skip lifecycle scripts.
const require = createRequire(import.meta.url);
require("./scripts/generate-content-data.js").generateContentData();

const nextConfig: NextConfig = {
  // Content is compiled into the JS bundle. Production runtimes (Vercel Node
  // and Cloudflare Workers) never read content/ from disk.
};

if (process.env.OPEN_NEXT_CLOUDFLARE || process.env.CLOUDFLARE || process.env.WORKERS_CI) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
