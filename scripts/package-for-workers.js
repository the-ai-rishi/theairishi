const { existsSync } = require("node:fs");
const { spawnSync } = require("node:child_process");

const isWorkersCi = Boolean(
  process.env.WORKERS_CI ||
    process.env.CF_PAGES ||
    process.env.CLOUDFLARE ||
    existsSync("/opt/buildhome"),
);

if (!isWorkersCi) {
  process.exit(0);
}

// This is safe because open-next.config.ts already sets buildCommand to
// "npx next build", so OpenNext does not re-enter this package lifecycle
// and postbuild cannot loop.
const result = process.env.npm_execpath
  ? spawnSync(
      process.execPath,
      [process.env.npm_execpath, "run", "cf:build"],
      { stdio: "inherit", env: process.env },
    )
  : null;

if (!result) {
  console.error("npm_execpath is missing in this environment");
  process.exit(1);
}
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status == null ? 1 : result.status);
