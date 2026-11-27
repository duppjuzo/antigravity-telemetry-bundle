#!/usr/bin/env python3
"""
Antigravity Floating Telemetry HUD Pill for Linux (GTK 4 + Monet M3)
Displays live conversation TPS, TTFT, cache hit rate, and steps/turns
in a draggable borderless pill window while Antigravity is running.
Integrates with server.py (/api/hud, telemetry_hud_config.json, telemetry_hud.pid.json).
"""

from __future__ import annotations

import argparse
import atexit
import fcntl
import json
import os
import re
import signal
import sys
import tempfile
import threading
import time
import urllib.parse
import urllib.request
import webbrowser

import gi

gi.require_version("Gtk", "4.0")
gi.require_version("Gdk", "4.0")
from gi.repository import Gdk, GLib, Gtk  # noqa: E402

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765
POLL_INTERVAL_SEC = 1.5
_HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


def _gemini_home() -> str:
    env_home = os.environ.get("GEMINI_HOME", "").strip()
    if env_home:
        return os.path.abspath(os.path.expanduser(env_home))
    return os.path.join(os.path.expanduser("~"), ".gemini")


def _runtime_dir() -> str:
    preferred = os.path.join(_gemini_home(), "antigravity")
    try:
        os.makedirs(preferred, exist_ok=True)
        probe = os.path.join(preferred, ".hud_linux_probe")
        with open(probe, "w", encoding="utf-8") as f:
            f.write("")
        os.remove(probe)
        return preferred
    except OSError:
        fallback = os.path.join(tempfile.gettempdir(), "antigravity-telemetry")
        os.makedirs(fallback, exist_ok=True)
        return fallback


def _config_path() -> str:
    preferred = os.path.join(_gemini_home(), "antigravity", "telemetry_hud_config.json")
    if os.path.exists(preferred):
        return preferred
    return os.path.join(_runtime_dir(), "telemetry_hud_config.json")


def _pid_path() -> str:
    preferred = os.path.join(_gemini_home(), "antigravity", "telemetry_hud.pid.json")
    if os.path.exists(preferred):
        return preferred
    return os.path.join(_runtime_dir(), "telemetry_hud.pid.json")


def _lock_path() -> str:
    return os.path.join(_runtime_dir(), "telemetry_hud_linux.lock")


def _load_hud_config() -> dict:
    path = _config_path()
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict):
                return data
        except Exception:
            pass
    return {}


def _write_pid_file() -> None:
    payload = {
        "pid": os.getpid(),
        "started_at": time.time(),
        "platform": "linux",
    }
    for path in (
        os.path.join(_gemini_home(), "antigravity", "telemetry_hud.pid.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud.pid.json"),
    ):
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                json.dump(payload, f)
            break
        except OSError:
            continue


def _remove_pid_file() -> None:
    for path in (
        os.path.join(_gemini_home(), "antigravity", "telemetry_hud.pid.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud.pid.json"),
    ):
        try:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    info = json.load(f)
                if isinstance(info, dict) and info.get("pid") not in (None, os.getpid()):
                    continue
        except Exception:
            pass
        try:
            if os.path.exists(path):
                os.remove(path)
        except OSError:
            pass


def _is_pid_alive(pid: int | None) -> bool:
    if not pid or pid <= 0:
        return False
    try:
        os.kill(int(pid), 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    except OSError:
        return False


def _is_antigravity_running() -> bool:
    try:
        for entry in os.scandir("/proc"):
            if not entry.name.isdigit():
                continue
            try:
                with open(os.path.join(entry.path, "cmdline"), "rb") as f:
                    cmd = f.read().decode("utf-8", errors="ignore").lower()
                if "antigravity" in cmd and "telemetry" not in cmd and "hud_linux" not in cmd:
                    return True
            except OSError:
                continue
    except OSError:
        return True
    return False


def _fmt_num(val: object, decimals: int = 1, fallback: str = "--") -> str:
    if isinstance(val, (int, float)):
        return f"{val:.{decimals}f}"
    return fallback


def _fmt_int(val: object, fallback: str = "-") -> str:
    if isinstance(val, (int, float)):
        return str(int(round(val)))
    return fallback


def _hex_to_rgba(hex_color: str, alpha: float = 1.0) -> str:
    if not isinstance(hex_color, str) or not _HEX_RE.match(hex_color):
        return f"rgba(25, 28, 30, {alpha})"
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    return f"rgba({r}, {g}, {b}, {alpha})"


def _build_css(cfg: dict) -> bytes:
    theme = cfg.get("theme") if cfg.get("theme") in ("dark", "light") else "dark"
    palettes = cfg.get("palettes") if isinstance(cfg.get("palettes"), dict) else {}
    pal = palettes.get(theme) if isinstance(palettes.get(theme), dict) else {}

    if theme == "light":
        bg_hex = pal.get("surface_container_high", "#e6e8eb")
        fg_hex = pal.get("on_surface", "#191c1e")
        muted_hex = pal.get("on_surface_variant", "#41484d")
        accent_hex = pal.get("primary", "#126682")
        outline_hex = pal.get("outline_variant", "#c1c7ce")
        running_hex = pal.get("tertiary", "#1e8e3e")
    else:
        bg_hex = pal.get("surface_container", "#1d2022")
        fg_hex = pal.get("on_surface", "#e1e2e5")
        muted_hex = pal.get("on_surface_variant", "#c1c7ce")
        accent_hex = pal.get("primary", "#8ccff0")
        outline_hex = pal.get("outline_variant", "#41484d")
        running_hex = "#81c995"

    css = f"""
window.agy-pill-window {{
    background-color: transparent;
}}
.agy-pill-box {{
    background-color: {_hex_to_rgba(bg_hex, 0.92)};
    border: 1px solid {_hex_to_rgba(accent_hex, 0.42)};
    border-radius: 999px;
    padding: 5px 14px;
}}
.agy-pill-box.running {{
    border-color: {_hex_to_rgba(running_hex, 0.78)};
}}
.agy-dot {{
    min-width: 8px;
    min-height: 8px;
    border-radius: 999px;
    background-color: {accent_hex};
}}
.agy-dot.running {{
    background-color: {running_hex};
}}
.agy-dot.offline {{
    background-color: {outline_hex};
}}
.agy-text {{
    color: {fg_hex};
    font-size: 12px;
    font-weight: 600;
}}
.agy-btn {{
    background: transparent;
    border: none;
    color: {muted_hex};
    padding: 0 4px;
    min-height: 16px;
    min-width: 16px;
    font-size: 12px;
}}
.agy-btn:hover {{
    color: {fg_hex};
}}
"""
    return css.encode("utf-8")


class HudApp(Gtk.Application):
    def __init__(self, host: str, port: int, parent_pid: int | None, demo: bool) -> None:
        super().__init__(application_id="com.antigravity.telemetry.hud")
        self._base_url = f"http://{host}:{port}"
        self._parent_pid = parent_pid
        self._demo = demo
        self._started_at = time.time()
        self._stop_event = threading.Event()
        self._win: Gtk.ApplicationWindow | None = None
        self._box: Gtk.Box | None = None
        self._dot: Gtk.Box | None = None
        self._label: Gtk.Label | None = None
        self._css_provider: Gtk.CssProvider | None = None
        self._last_theme_sig: str = ""

    def do_activate(self) -> None:
        if self._win is not None:
            self._win.present()
            return

        self._css_provider = Gtk.CssProvider()
        cfg = _load_hud_config()
        self._apply_theme_css(cfg)

        display = Gdk.Display.get_default()
        if display is not None:
            Gtk.StyleContext.add_provider_for_display(
                display, self._css_provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
            )

        self._win = Gtk.ApplicationWindow(application=self)
        self._win.set_title("Antigravity Telemetry HUD")
        self._win.set_decorated(False)
        self._win.set_resizable(False)
        self._win.add_css_class("agy-pill-window")

        handle = Gtk.WindowHandle()
        self._box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
        self._box.add_css_class("agy-pill-box")

        self._dot = Gtk.Box()
        self._dot.set_valign(Gtk.Align.CENTER)
        self._dot.add_css_class("agy-dot")
        self._dot.add_css_class("offline")

        self._label = Gtk.Label(label="AGY 连接中...")
        self._label.add_css_class("agy-text")

        open_btn = Gtk.Button(label="↗")
        open_btn.add_css_class("agy-btn")
        open_btn.set_tooltip_text("打开 Web 仪表盘")
        open_btn.connect("clicked", lambda *_: webbrowser.open(f"{self._base_url}/"))

        close_btn = Gtk.Button(label="×")
        close_btn.add_css_class("agy-btn")
        close_btn.set_tooltip_text("关闭悬浮窗")
        close_btn.connect("clicked", lambda *_: self.quit())

        self._box.append(self._dot)
        self._box.append(self._label)
        self._box.append(open_btn)
        self._box.append(close_btn)

        handle.set_child(self._box)
        self._win.set_child(handle)
        self._win.present()

        _write_pid_file()
        atexit.register(_remove_pid_file)

        for sig in (signal.SIGTERM, signal.SIGINT):
            try:
                GLib.unix_signal_add(GLib.PRIORITY_DEFAULT, sig, self._on_unix_signal)
            except Exception:
                pass

        t = threading.Thread(target=self._poll_loop, daemon=True)
        t.start()

    def _on_unix_signal(self) -> bool:
        self.quit()
        return GLib.SOURCE_REMOVE

    def do_shutdown(self) -> None:
        self._stop_event.set()
        _remove_pid_file()
        Gtk.Application.do_shutdown(self)

    def _apply_theme_css(self, cfg: dict) -> None:
        if self._css_provider is None:
            return
        sig = json.dumps(
            {
                "theme": cfg.get("theme"),
                "palettes": cfg.get("palettes"),
            },
            sort_keys=True,
        )
        if sig == self._last_theme_sig:
            return
        self._last_theme_sig = sig
        self._css_provider.load_from_data(_build_css(cfg))

    def _poll_loop(self) -> None:
        while not self._stop_event.is_set():
            if self._parent_pid and not _is_pid_alive(self._parent_pid):
                GLib.idle_add(self.quit)
                return

            cfg = _load_hud_config()
            stop_req = cfg.get("stop_requested_at")
            if isinstance(stop_req, (int, float)) and stop_req >= self._started_at - 0.5:
                GLib.idle_add(self.quit)
                return

            agy_running = True if self._demo else _is_antigravity_running()
            payload = None
            if agy_running:
                params = []
                pinned = cfg.get("pinned_convo_id")
                if isinstance(pinned, str) and pinned.strip():
                    params.append(f"convo_id={urllib.parse.quote(pinned.strip())}")
                url = f"{self._base_url}/api/hud" + (f"?{'&'.join(params)}" if params else "")
                try:
                    with urllib.request.urlopen(url, timeout=1.5) as resp:
                        if resp.status == 200:
                            payload = json.loads(resp.read().decode("utf-8", errors="replace"))
                except Exception:
                    payload = None

            GLib.idle_add(self._apply_state, agy_running, payload, cfg)
            self._stop_event.wait(POLL_INTERVAL_SEC)

    def _apply_state(self, agy_running: bool, payload: dict | None, cfg: dict) -> bool:
        if self._win is None or self._box is None or self._dot is None or self._label is None:
            return False

        self._apply_theme_css(cfg)
        self._win.set_visible(agy_running)
        if not agy_running:
            return False

        self._dot.remove_css_class("running")
        self._dot.remove_css_class("offline")
        self._box.remove_css_class("running")

        active = payload.get("active") if isinstance(payload, dict) else None
        if not isinstance(active, dict):
            self._dot.add_css_class("offline")
            self._label.set_text("AGY 离线" if payload is None else "AGY 无对话")
            return False

        if active.get("is_running"):
            self._dot.add_css_class("running")
            self._box.add_css_class("running")

        tps = _fmt_num(active.get("stream_tps") or active.get("avg_stream_tps"), 1)
        ttft = _fmt_num(active.get("ttft_sec") or active.get("avg_ttft_sec"), 1)
        hit = _fmt_num(active.get("cache_hit_rate_pct"), 1)
        steps = _fmt_int(active.get("step_count"))
        turns = _fmt_int(active.get("user_turns"))

        self._label.set_text(f"TPS {tps}  ·  TTFT {ttft}s  ·  命中 {hit}%  ·  {steps}/{turns}")
        title = active.get("title") or active.get("convo_id") or ""
        model = active.get("model") or ""
        self._win.set_tooltip_text(f"{title}\n{model}".strip())
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Antigravity Linux GTK4 Telemetry HUD")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--parent-pid", type=int, default=None)
    parser.add_argument("--demo", action="store_true")
    args = parser.parse_args()

    lock_fd = None
    try:
        lock_fd = open(_lock_path(), "w", encoding="utf-8")
        fcntl.flock(lock_fd.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        return 0

    try:
        app = HudApp(
            host=args.host,
            port=args.port,
            parent_pid=args.parent_pid,
            demo=args.demo,
        )
        return app.run([])
    finally:
        if lock_fd is not None:
            try:
                fcntl.flock(lock_fd.fileno(), fcntl.LOCK_UN)
                lock_fd.close()
            except OSError:
                pass


if __name__ == "__main__":
    raise SystemExit(main())
