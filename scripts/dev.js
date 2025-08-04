/* eslint-env node */
const { spawn, spawnSync } = require("child_process");

// Determine whether to open the browser. On Linux this requires xdg-open.
const hasXdgOpen =
  process.platform !== "linux" ||
  spawnSync("command", ["-v", "xdg-open"]).status === 0;

const args = ["preview", "--port", "3000"];
if (hasXdgOpen) {
  args.push("--open");
}

const vite = spawn("vite", args, { stdio: "inherit", shell: true });
vite.on("close", (code) => process.exit(code));
