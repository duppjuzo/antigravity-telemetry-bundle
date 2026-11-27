#!/usr/bin/env python3
"""
Antigravity Floating Telemetry HUD Pill for Linux (GTK 4)
Displays live conversation TPS, TTFT, cache hit rate, and steps/turns
in a draggable borderless pill window while Antigravity is running.
"""

from __future__ import annotations

import json
import os
import sys
import threading
import time
import urllib.request
import webbrowser

import gi

gi.require_version("Gtk", "4.0")
gi.require_version("Gdk", "4.0")
from gi.repository import Gdk, GLib, Gtk  # noqa: E402

HUD_API_URL = os.environ.get("ANTIGRAVITY_HUD_URL", "http://127.0.0.1:8765/api/hud")
DASHBOARD_URL = os.environ.get("ANTIGRAVITY_DASHBOARD_URL", "http://127.0.0.1:8765/")
POLL_INTERVAL_SEC = 1.5

CSS = b"""
window.agy-pill-window {
    background-color: transparent;
}
.agy-pill-box {
    background-color: rgba(25, 28, 30, 0.92);
    border: 1px solid rgba(140, 207, 240, 0.35);
    border-radius: 999px;
    padding: 5px 14px;
}
.agy-pill-box.running {
    border-color: rgba(129, 201, 149, 0.72);
}
.agy-dot {
    min-width: 8px;
    min-height: 8px;
    border-radius: 999px;
    background-color: #8ccff0;
}
.agy-dot.running {
    background-color: #81c995;
}
.agy-dot.offline {
    background-color: #8b9198;
}
.agy-text {
    color: #e1e2e5;
    font-size: 12px;
    font-weight: 600;
}
.agy-btn {
    background: transparent;
    border: none;
    color: #9aa0a6;
    padding: 0 4px;
    min-height: 16px;
    min-width: 16px;
    font-size: 12px;
}
.agy-btn:hover {
    color: #e1e2e5;
}
"""


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


class HudApp(Gtk.Application):
    def __init__(self) -> None:
        super().__init__(application_id="com.antigravity.telemetry.hud")
        self._stop_event = threading.Event()
        self._win: Gtk.ApplicationWindow | None = None
        self._box: Gtk.Box | None = None
        self._dot: Gtk.Box | None = None
        self._label: Gtk.Label | None = None

    def do_activate(self) -> None:
        if self._win is not None:
            self._win.present()
            return

        provider = Gtk.CssProvider()
        provider.load_from_data(CSS)
        display = Gdk.Display.get_default()
        if display is not None:
            Gtk.StyleContext.add_provider_for_display(
                display, provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
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
        open_btn.connect("clicked", lambda *_: webbrowser.open(DASHBOARD_URL))

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

        t = threading.Thread(target=self._poll_loop, daemon=True)
        t.start()

    def do_shutdown(self) -> None:
        self._stop_event.set()
        Gtk.Application.do_shutdown(self)

    def _poll_loop(self) -> None:
        while not self._stop_event.is_set():
            agy_running = _is_antigravity_running()
            payload = None
            if agy_running:
                try:
                    with urllib.request.urlopen(HUD_API_URL, timeout=1.5) as resp:
                        if resp.status == 200:
                            payload = json.loads(resp.read().decode("utf-8", errors="replace"))
                except Exception:
                    payload = None
            GLib.idle_add(self._apply_state, agy_running, payload)
            self._stop_event.wait(POLL_INTERVAL_SEC)

    def _apply_state(self, agy_running: bool, payload: dict | None) -> bool:
        if self._win is None or self._box is None or self._dot is None or self._label is None:
            return False

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
    app = HudApp()
    return app.run(sys.argv)


if __name__ == "__main__":
    raise SystemExit(main())
