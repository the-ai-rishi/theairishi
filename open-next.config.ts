import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // Must generate the embedded catalog before Next compiles. `npx next build`
  // does not run npm prebuild. Do not set this to `npm run build` — that
  // re-enters postbuild → cf:build and loops.
  buildCommand: "node scripts/generate-content-data.js && npx next build",
};
