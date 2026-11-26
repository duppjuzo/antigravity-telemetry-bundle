"""
Antigravity Usage & Performance Telemetry Web Server
Serves the local interactive dashboard and live analytics JSON API.
Zero external dependencies — runs on Python 3.8+ standard library.
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import sys
import threading
import urllib.parse
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import collector  # noqa: E402

VERSION = "1.1.0"
DASHBOARD_HTML = os.path.join(BASE_DIR, "web_dashboard.html")
DEMO_MODE = False
PRIMARY_HOST = "127.0.0.1"
PRIMARY_PORT = 8765


class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def compute_date_bounds(range_name: str, start_param: str | None, end_param: str | None):
    if start_param or end_param:
        return start_param or None, end_param or None
    today = datetime.now().date()
    if range_name == "today":
        s = today.strftime("%Y-%m-%d")
        return s, s
    if range_name == "yesterday":
        s = (today - timedelta(days=1)).strftime("%Y-%m-%d")
        return s, s
    if range_name == "7d":
        return (today - timedelta(days=6)).strftime("%Y-%m-%d"), today.strftime("%Y-%m-%d")
    if range_name == "30d":
        return (today - timedelta(days=29)).strftime("%Y-%m-%d"), today.strftime("%Y-%m-%d")
    if range_name == "90d":
        return (today - timedelta(days=89)).strftime("%Y-%m-%d"), today.strftime("%Y-%m-%d")
    return None, None


class TelemetryHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep stdout/stderr clean when running as daemon or sidecar
        pass

    def _safe_write(self, body: bytes):
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):
            pass

    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self._safe_write(body)

    def _send_html(self, status: int, html_bytes: bytes):
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(html_bytes)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self._safe_write(html_bytes)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._send_json(
                200,
                {
                    "status": "ok",
                    "version": VERSION,
                    "host": PRIMARY_HOST,
                    "port": PRIMARY_PORT,
                    "gemini_home": collector.get_gemini_home(),
                    "host_theme": collector.get_host_theme(),
                    "demo_mode": DEMO_MODE,
                    "timestamp": datetime.now().isoformat(),
                },
            )
            return

        if path == "/api/stats":
            qs = urllib.parse.parse_qs(parsed.query)
            range_name = qs.get("range", ["all"])[0]
            force = qs.get("force", ["0"])[0] in ("1", "true", "yes")
            demo_req = qs.get("demo", ["0"])[0] in ("1", "true", "yes")
            start_param = qs.get("start", [None])[0]
            end_param = qs.get("end", [None])[0]
            since_ts = None
            if range_name == "since18":
                now_dt = datetime.now()
                cutoff = now_dt.replace(hour=18, minute=0, second=0, microsecond=0)
                if now_dt < cutoff:
                    cutoff = cutoff - timedelta(days=1)
                since_ts = int(cutoff.timestamp())
                start_date = cutoff.strftime("%Y-%m-%d")
                end_date = now_dt.strftime("%Y-%m-%d")
            else:
                start_date, end_date = compute_date_bounds(range_name, start_param, end_param)
            try:
                if DEMO_MODE or demo_req:
                    sessions = collector.build_demo_sessions()
                else:
                    sessions = collector.sync_all_sessions(force=force)
                data = collector.generate_analytics(
                    sessions,
                    start_date=start_date,
                    end_date=end_date,
                    since_ts=since_ts,
                )
                data["generated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                data["range"] = range_name
                data["version"] = VERSION
                data["host_theme"] = collector.get_host_theme()
                self._send_json(200, data)
            except Exception as exc:
                self._send_json(500, {"error": str(exc)})
            return

        if path in ("/", "/index.html"):
            if os.path.exists(DASHBOARD_HTML):
                with open(DASHBOARD_HTML, "rb") as f:
                    self._send_html(200, f.read())
            else:
                self._send_json(404, {"error": "web_dashboard.html not found"})
            return

        self._send_json(404, {"error": "Not found"})


def _env_int(name: str) -> int | None:
    raw = os.environ.get(name, "").strip()
    if raw.isdigit():
        return int(raw)
    return None


def parse_args(argv: list[str] | None = None):
    sidecar_port = _env_int("ANTIGRAVITY_SIDECAR_WEB_PORT")
    default_port = sidecar_port or _env_int("TELEMETRY_PORT") or _env_int("PORT") or 8765
    default_host = os.environ.get("TELEMETRY_HOST", "").strip() or "127.0.0.1"

    env_secondary = os.environ.get("TELEMETRY_SECONDARY_PORT", "").strip()
    if env_secondary.isdigit():
        default_secondary = int(env_secondary)
    elif sidecar_port is not None:
        # In sidecar mode, also attempt to expose http://127.0.0.1:8765/ unless disabled (0)
        default_secondary = 8765
    else:
        default_secondary = 0

    parser = argparse.ArgumentParser(
        description="Antigravity Usage & Performance Telemetry Web Server"
    )
    parser.add_argument("--host", default=default_host, help="Bind address (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=default_port, help="Primary HTTP port (default: 8765)")
    parser.add_argument(
        "--secondary-port",
        type=int,
        default=default_secondary,
        help="Optional secondary HTTP port (0 to disable; defaults to 8765 in sidecar mode)",
    )
    parser.add_argument("--gemini-home", default=None, help="Override ~/.gemini data directory")
    parser.add_argument("--cache-file", default=None, help="Override analytics cache JSON path")
    parser.add_argument(
        "--demo",
        action="store_true",
        default=os.environ.get("TELEMETRY_DEMO", "").strip().lower() in ("1", "true", "yes"),
        help="Serve deterministic demo telemetry data without reading local SQLite databases",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None):
    global DEMO_MODE, PRIMARY_HOST, PRIMARY_PORT

    args = parse_args(argv)
    if args.gemini_home:
        os.environ["GEMINI_HOME"] = os.path.abspath(os.path.expanduser(args.gemini_home))
    if args.cache_file:
        os.environ["ANTIGRAVITY_CACHE_FILE"] = os.path.abspath(os.path.expanduser(args.cache_file))
    DEMO_MODE = bool(args.demo)

    host = args.host
    port = args.port
    is_sidecar = bool(os.environ.get("ANTIGRAVITY_SIDECAR_WEB_PORT", "").strip())

    try:
        server = ReusableThreadingHTTPServer((host, port), TelemetryHandler)
    except OSError as exc:
        if is_sidecar:
            sys.stderr.write(f"Failed to bind required sidecar port {host}:{port}: {exc}\n")
            raise SystemExit(1) from exc
        raise SystemExit(f"Failed to bind {host}:{port}: {exc}") from exc

    PRIMARY_HOST = host
    PRIMARY_PORT = server.server_address[1]

    secondary_server = None
    if args.secondary_port and args.secondary_port != PRIMARY_PORT:
        try:
            secondary_server = ReusableThreadingHTTPServer((host, args.secondary_port), TelemetryHandler)
            threading.Thread(target=secondary_server.serve_forever, daemon=True).start()
        except OSError:
            secondary_server = None

    def _handle_shutdown(signum, _frame):
        threading.Thread(target=server.shutdown, daemon=True).start()
        if secondary_server is not None:
            threading.Thread(target=secondary_server.shutdown, daemon=True).start()

    for sig_name in ("SIGTERM", "SIGINT", "SIGHUP"):
        sig = getattr(signal, sig_name, None)
        if sig is not None:
            try:
                signal.signal(sig, _handle_shutdown)
            except (ValueError, OSError):
                pass

    msg = f"Antigravity Telemetry Dashboard v{VERSION} running at http://{PRIMARY_HOST}:{PRIMARY_PORT}"
    if secondary_server is not None:
        msg += f" (and http://{PRIMARY_HOST}:{args.secondary_port})"
    print(msg, flush=True)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        if secondary_server is not None:
            secondary_server.server_close()


if __name__ == "__main__":
    main()
