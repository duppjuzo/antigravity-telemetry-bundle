# Token Cache Monitor (`cache-monitor`)

Self-contained Antigravity App plugin (`v1.2.0`) providing the pinned-ready **Telemetry Dashboard** `aux_pane` sidecar panel, local web server (`http://127.0.0.1:8765/`), and on-demand `cache-stats` inspection skill (without lifecycle hooks).

## Components

- **Telemetry Dashboard Sidecar** (`sidecars/telemetry/`): Cross-platform Node launcher that starts the bundled Python telemetry server and renders the responsive `aux_pane` dashboard (sticky summary bar with `ctx%` ring, `TTFT`, `Cache Hit`, `Token/s`, `Total Tokens`, auto-tracking latest session + searchable session switcher, and 5 category tabs).
- **Bundled Telemetry Service** (`server/`): Zero-dependency Python 3.8+ SQLite/Protobuf telemetry & context collector (`collector.py`), threaded HTTP server (`server.py`), cross-platform background daemon launcher (`ensure_server.py`), and dual-theme (Light & Dark) hot-switching dashboard UI (`web_dashboard.html`) following Antigravity host CSS tokens, `userSettings.themeMode`, and OS preference.
- **On-Demand `cache-stats` Skill** (`skills/cache-stats/`): Run `node run_hook.mjs [conversation-id]` or `python3 cache_hook.py [conversation-id]` to print per-step and session cache/TPS metrics.
