---
name: cache-stats
description: >-
  Inspect real-time Gemini Context Caching metrics, prompt cache hit rates, token usage breakdown, and cost savings for the current Antigravity conversation.
---

# Cache Stats Skill

Inspect and display detailed prompt caching metrics, TTFT, Stream/E2E TPS, thinking time, and token usage for an Antigravity session.

## Usage

Run the bundled cross-platform extractor (uses the plugin's own bundled `server/collector.py`, zero external dependencies):

```bash
# macOS / Linux
node ~/.gemini/config/plugins/cache-monitor/run_hook.mjs <conversation-id>
# or directly with Python 3.8+
python3 ~/.gemini/config/plugins/cache-monitor/cache_hook.py <conversation-id>
```

```powershell
# Windows (PowerShell)
node "$env:USERPROFILE\.gemini\config\plugins\cache-monitor\run_hook.mjs" <conversation-id>
# or directly with Python 3.8+
python "$env:USERPROFILE\.gemini\config\plugins\cache-monitor\cache_hook.py" <conversation-id>
```

Omit `<conversation-id>` to inspect the most recently updated conversation automatically.

Metrics reported:
- **Cache Read Tokens**: Tokens read directly from Gemini context cache (costing 10%–25% of normal input pricing).
- **Uncached Input Tokens**: Fresh tokens processed without cache hit (e.g. newly appended messages or files).
- **Output & Thinking Tokens**: Generated model tokens and internal reasoning tokens.
- **Cache Hit Rate**: `cache_read_tokens / (cache_read_tokens + input_tokens) * 100%`.
- **Latency & Throughput**: TTFT, Stream TPS, End-to-End TPS, and thinking duration.

## Interactive Dashboard

When this plugin is enabled, you can also open the interactive Telemetry Dashboard sidecar directly inside Antigravity using `[Telemetry Dashboard](sidecar://cache-monitor/telemetry/)`, or in any browser at `http://127.0.0.1:8765/`.
