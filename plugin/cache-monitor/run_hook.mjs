import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const IS_WINDOWS = process.platform === "win32";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const HOOK_SCRIPT = path.join(HERE, "cache_hook.py");

function pythonCandidates() {
  const list = [];
  const envPy = (process.env.ANTIGRAVITY_TELEMETRY_PYTHON || "").trim();
  if (envPy) list.push([envPy, []]);

  if (IS_WINDOWS) {
    list.push(["python", []], ["py", ["-3"]], ["python3", []]);
    const dirs = [
      "C:\\",
      path.join(process.env.LOCALAPPDATA || "", "Programs", "Python"),
      process.env.ProgramFiles || "C:\\Program Files",
    ];
    for (const root of dirs) {
      if (!root || !fs.existsSync(root)) continue;
      try {
        const entries = fs
          .readdirSync(root, { withFileTypes: true })
          .filter((d) => d.isDirectory() && /^Python3\d+$/i.test(d.name))
          .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
        for (const e of entries) {
          const exe = path.join(root, e.name, "python.exe");
          if (fs.existsSync(exe)) list.push([exe, []]);
        }
      } catch {
        // Ignore unreadable directories
      }
    }
  } else {
    list.push(
      ["python3", []],
      ["/opt/homebrew/bin/python3", []],
      ["/usr/local/bin/python3", []],
      ["/usr/bin/python3", []],
      ["python", []]
    );
  }
  return list;
}

function findPython() {
  for (const [cmd, prefix] of pythonCandidates()) {
    try {
      const check = spawnSync(
        cmd,
        [...prefix, "-c", "import sys, sqlite3; assert sys.version_info >= (3, 8)"],
        { stdio: "ignore", windowsHide: true, timeout: 3000 }
      );
      if (check.status === 0) return [cmd, prefix];
    } catch {
      // Try next candidate
    }
  }
  return null;
}

const found = findPython();
if (!found) {
  if (!process.stdin.isTTY) {
    process.stdout.write("{}\n");
    process.exit(0);
  }
  console.error("Python 3.8+ with sqlite3 was not found on this machine.");
  process.exit(1);
}

const [cmd, prefix] = found;
const child = spawn(cmd, [...prefix, HOOK_SCRIPT, ...process.argv.slice(2)], {
  stdio: "inherit",
  windowsHide: true,
  env: {
    ...process.env,
    PYTHONIOENCODING: "utf-8",
    PYTHONUNBUFFERED: "1",
  },
});

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(err.message);
  process.exit(1);
});
