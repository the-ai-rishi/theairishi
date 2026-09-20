import type { NextConfig } from "next";
import { createRequire } from "node:module";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// BUILD CONTRACT (intentional module-load side effect):
// OpenNext Cloudflare runs `npx next build`, which does not run npm prebuild.
// This is the one required generation site so the embedded catalog and the
// published-lesson allow-list exist before Next compiles middleware.
// Do not duplicate this call in other config files. Do not remove it.
const require = createRequire(import.meta.url);
require("./scripts/generate-content-data.js").generateContentData();

const canonicalHostRedirects = [
  "theairishi.vercel.app",
  "theairishi-the-ai-rishi.vercel.app",
  "theairishi-git-main-the-ai-rishi.vercel.app",
].map((host) => ({
  source: "/:path*",
  has: [{ type: "host" as const, value: host }],
  destination: "https://theairishi.com/:path*",
  permanent: true,
}));

const nextConfig: NextConfig = {
  // Content is compiled into the JS bundle. Production runtimes (Vercel Node
  // and Cloudflare Workers) never read content/ from disk.
  async redirects() {
    return [
      { source: "/programs/devops", destination: "/learn", permanent: false },
      { source: "/programs/devops-engineer-mastery", destination: "/learn", permanent: false },
      ...canonicalHostRedirects,
    ];
  },
};

if (process.env.OPEN_NEXT_CLOUDFLARE || process.env.CLOUDFLARE || process.env.WORKERS_CI) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
