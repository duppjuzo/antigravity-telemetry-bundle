# Token Cache Monitor (`cache-monitor`)

Self-contained Antigravity plugin providing the **Telemetry Dashboard** sidecar panel, local web server (`http://127.0.0.1:8765/`), and on-demand `cache-stats` inspection skill.

## Components

- **Telemetry Dashboard Sidecar** (`sidecars/telemetry/`): Cross-platform Node launcher that starts the bundled Python telemetry server and renders the real-time dashboard in Antigravity's auxiliary pane.
- **Bundled Telemetry Service** (`server/`): Zero-dependency Python 3.8+ SQLite telemetry collector (`collector.py`), threaded HTTP server (`server.py`), cross-platform background daemon launcher (`ensure_server.py`), and self-contained dashboard UI (`web_dashboard.html`).
- **On-Demand `cache-stats` Skill** (`skills/cache-stats/`): Run `node run_hook.mjs [conversation-id]` or `python3 cache_hook.py [conversation-id]` to print per-step and session cache/TPS metrics.
- **Lifecycle Hooks** (`hooks.json`): Portable hook entry (disabled by default; set `"enabled": true` if you ever want hook invocation).
