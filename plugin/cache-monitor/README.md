# Token Cache Monitor (`cache-monitor`)

Self-contained Antigravity App plugin (`v1.2.0`) providing the pinned-ready **Telemetry Dashboard** `aux_pane` sidecar panel, local web server (`http://127.0.0.1:8765/`), Windows floating HUD capsule, OS dynamic theming, and on-demand `cache-stats` inspection skill (without lifecycle hooks).

## Components

- **Telemetry Dashboard Sidecar** (`sidecars/telemetry/`): Cross-platform Node launcher that starts the bundled Python telemetry server and renders the responsive Material 3 (M3) Monet `aux_pane` dashboard (sticky summary bar with `ctx%` ring, `TTFT`, `Cache Hit`, `Token/s`, `Total Tokens`, auto-tracking latest session + searchable session switcher, editable Home cards, Context breakdown, Steps waterfall, Models, Recent Sessions, Global Trends, and Settings).
- **Bundled Telemetry Service** (`server/`):
  - `collector.py`: Zero-dependency Python 3.8+ SQLite/Protobuf telemetry, user-turn, and native context window collector.
  - `server.py`: Threaded HTTP server exposing `/api/health`, `/api/stats`, `/api/hud`, `/api/hud/*`, and `/api/theme/*`.
  - `system_theme.py`: Cross-platform OS accent color & multi-monitor wallpaper extractor (Windows DWM/COM `IDesktopWallpaper`, Linux XDG Portal/KDE/GNOME) powering dynamic Monet palette generation.
  - `hud_overlay.py` & `launch_hud.bat`: Windows borderless rounded floating HUD capsule that docks above the Antigravity window, matches active conversations via `conversation_summaries.db`, and syncs Monet palettes from the WebUI.
  - `ensure_server.py`: Cross-platform headless background daemon launcher.
  - `web_dashboard.html`: Single-file offline M3 Monet dashboard UI following Antigravity host tokens, `userSettings.themeMode`, and OS theme preferences.
- **On-Demand `cache-stats` Skill** (`skills/cache-stats/`): Run `node run_hook.mjs [conversation-id]` or `python3 cache_hook.py [conversation-id]` to print per-step and session cache/TPS metrics.
