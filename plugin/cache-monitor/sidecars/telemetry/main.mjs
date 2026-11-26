import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IS_WINDOWS = process.platform === "win32";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.resolve(HERE, "..", "..");
const SERVER_SCRIPT = path.join(PLUGIN_ROOT, "server", "server.py");
const PORT = Number(process.env.ANTIGRAVITY_SIDECAR_WEB_PORT || process.env.TELEMETRY_PORT || 8765);
const MAX_OUTPUT_CHARS = 4000;

let child = null;
let pageServer = null;
let stopping = false;

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  if (child && !child.killed) {
    try {
      child.stdin?.end();
    } catch {
      // Ignore
    }
    try {
      child.kill("SIGTERM");
    } catch {
      // Ignore already exited child
    }
  }
  if (pageServer) {
    try {
      pageServer.close();
      pageServer.closeAllConnections?.();
    } catch {
      // Ignore
    }
  }
  process.exit(code);
}

for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(sig, () => shutdown(0));
}

function pythonCandidates() {
  const candidates = [];
  const envPy = (process.env.ANTIGRAVITY_TELEMETRY_PYTHON || "").trim();
  if (envPy) candidates.push([envPy, []]);

  if (IS_WINDOWS) {
    candidates.push(["python", []], ["py", ["-3"]], ["python3", []]);
    const searchRoots = [
      "C:\\",
      path.join(process.env.LOCALAPPDATA || "", "Programs", "Python"),
      process.env.ProgramFiles || "C:\\Program Files",
    ];
    for (const root of searchRoots) {
      if (!root || !fs.existsSync(root)) continue;
      try {
        const entries = fs
          .readdirSync(root, { withFileTypes: true })
          .filter((d) => d.isDirectory() && /^Python3\d+$/i.test(d.name))
          .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
        for (const entry of entries) {
          const exe = path.join(root, entry.name, "python.exe");
          if (fs.existsSync(exe)) candidates.push([exe, []]);
        }
      } catch {
        // Ignore permission errors
      }
    }
  } else {
    candidates.push(
      ["python3", []],
      ["/opt/homebrew/bin/python3", []],
      ["/usr/local/bin/python3", []],
      ["/usr/bin/python3", []],
      ["python", []]
    );
  }
  return candidates;
}

function findValidPython() {
  for (const [cmd, prefixArgs] of pythonCandidates()) {
    try {
      const probe = spawnSync(
        cmd,
        [...prefixArgs, "-c", "import sys, sqlite3; assert sys.version_info >= (3, 8)"],
        { stdio: "ignore", windowsHide: true, timeout: 3000 }
      );
      if (probe.status === 0) {
        return { cmd, prefixArgs };
      }
    } catch {
      // Try next candidate
    }
  }
  return null;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function buildErrorPage(title, bodyHtml) {
  const marker = `<meta name="telemetry-sidecar-error" content="${randomUUID()}">`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="color-scheme" content="dark" />
${marker}
<title>${escapeHtml(title)}</title>
<style>
  body { margin: 0; padding: 24px; background: #0b0f17; color: #e6edf7; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
  .box { max-width: 680px; margin: 24px auto; background: #121826; border: 1px solid #222d42; border-radius: 12px; padding: 20px 24px; }
  h1 { margin: 0 0 10px; font-size: 18px; color: #38bdf8; }
  pre { background: #0b0f17; border: 1px solid #222d42; border-radius: 8px; padding: 12px; overflow: auto; font-size: 12px; white-space: pre-wrap; word-break: break-word; }
  button { margin-top: 12px; background: rgba(16,185,129,0.16); color: #10b981; border: 1px solid rgba(16,185,129,0.5); border-radius: 8px; padding: 8px 16px; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: 0.6; cursor: default; }
</style>
</head>
<body>
  <div class="box">
    <h1>${escapeHtml(title)}</h1>
    ${bodyHtml}
    <button id="retry" type="button">Retry</button>
  </div>
  <script>
    const btn = document.getElementById("retry");
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Restarting...";
      try { await fetch("/__telemetry_sidecar/retry", { method: "POST" }); } catch {}
      const poll = async () => {
        try {
          const res = await fetch(location.href, { cache: "no-store" });
          if (res.ok && !(await res.text()).includes(${JSON.stringify(marker)})) {
            location.reload();
            return;
          }
        } catch {}
        setTimeout(poll, 500);
      };
      setTimeout(poll, 500);
    });
  </script>
</body>
</html>`;
}

function serveErrorUntilRetry(title, bodyHtml) {
  return new Promise((resolve) => {
    const html = buildErrorPage(title, bodyHtml);
    pageServer = createServer((req, res) => {
      if (req.method === "POST" && req.url === "/__telemetry_sidecar/retry") {
        res.writeHead(204).end();
        const srv = pageServer;
        pageServer = null;
        srv.close(() => resolve());
        srv.closeAllConnections?.();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }).end(html);
    });
    pageServer.on("error", (err) => {
      console.error(`[telemetry-sidecar] Error page bind failed: ${err.message}`);
      process.exit(1);
    });
    pageServer.listen(PORT, "127.0.0.1");
  });
}

function runServer(py) {
  return new Promise((resolve) => {
    let output = "";
    const keep = (chunk) => {
      output = (output + chunk.toString()).slice(-MAX_OUTPUT_CHARS);
    };
    const proc = spawn(py.cmd, [...py.prefixArgs, SERVER_SCRIPT, "--port", String(PORT), "--watch-stdin"], {
      cwd: path.dirname(SERVER_SCRIPT),
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        PYTHONUNBUFFERED: "1",
      },
    });
    child = proc;
    proc.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
      keep(chunk);
    });
    proc.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
      keep(chunk);
    });
    proc.on("error", (err) => {
      child = null;
      resolve({ exitCode: -1, signal: null, output: `${output}\n${err.message}` });
    });
    proc.on("close", (code, sig) => {
      child = null;
      resolve({ exitCode: code ?? -1, signal: sig, output });
    });
  });
}

async function main() {
  for (;;) {
    if (!fs.existsSync(SERVER_SCRIPT)) {
      await serveErrorUntilRetry(
        "Telemetry Server Missing",
        `<p>Could not locate bundled server script:</p><pre>${escapeHtml(SERVER_SCRIPT)}</pre>`
      );
      continue;
    }

    const py = findValidPython();
    if (!py) {
      await serveErrorUntilRetry(
        "Python 3.8+ Required",
        `<p>The Telemetry Dashboard sidecar requires Python 3.8+ (standard library only, no pip packages).</p>
         <p>Install Python 3 or set <code>ANTIGRAVITY_TELEMETRY_PYTHON</code>, then click Retry.</p>`
      );
      continue;
    }

    const res = await runServer(py);
    if (stopping || res.signal || res.exitCode === 0) {
      process.exit(0);
    }

    await serveErrorUntilRetry(
      "Telemetry Server Stopped",
      `<p><code>${escapeHtml(py.cmd)}</code> exited with code ${res.exitCode}.</p>` +
        (res.output.trim() ? `<pre>${escapeHtml(res.output.trim())}</pre>` : "")
    );
  }
}

main();
