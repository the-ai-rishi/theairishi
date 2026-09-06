"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const cloudflareEnvVars = [
  "OPEN_NEXT_CLOUDFLARE",
  "CF_PAGES",
  "CLOUDFLARE",
  "WORKERS_CI",
  "CF_WORKER_BUILD",
];
const detectedByEnv = cloudflareEnvVars.find((name) => process.env[name]);
const detectedByBuildHome = fs.existsSync("/opt/buildhome");
const isCloudflare = Boolean(detectedByEnv || detectedByBuildHome);


if (isCloudflare) {
  const reason = detectedByEnv ? "environment variable " + detectedByEnv : "/opt/buildhome is present";
  console.log("Cloudflare build detected via " + reason + ".");
  const result = spawnSync(process.execPath, [process.env.npm_execpath, "run", "cf:build"], { stdio: "inherit", env: process.env });
  process.exit(result.status ?? 1);
}

const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
if (fs.existsSync(nextCli)) {
  console.log("Non-Cloudflare build detected; running the local Next.js build.");
  const result = spawnSync(process.execPath, [nextCli, "build"], { stdio: "inherit", env: process.env });
  if (result.error) console.error(result.error.message);
  process.exit(result.status ?? 1);
}

console.log("Local Next.js binary not found; running npx next build.");
const result = spawnSync("npx", ["next", "build"], { stdio: "inherit", env: process.env });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
