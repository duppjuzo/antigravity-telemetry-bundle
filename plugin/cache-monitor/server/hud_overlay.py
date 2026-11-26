"""
Antigravity Floating Telemetry HUD Capsule
Zero-dependency Windows overlay using Python standard library (tkinter + ctypes Win32).
Docks above the active Antigravity window and live-tracks Cache Hit, TPS, TTFT,
Turns/Steps, Total Tokens, and Context Window %.
"""

from __future__ import annotations

import argparse
import ctypes
import json
import os
import subprocess
import sys
import threading
import tkinter as tk
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from ctypes import wintypes

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765
MUTEX_NAME = "Local\\AntigravityTelemetryHUDMutex"

THEMES = {
    "dark": {
        "bg": "#111622",
        "card_bg": "#151c2c",
        "hover_bg": "#1b2438",
        "border": "#243047",
        "sep": "#25324a",
        "text": "#e6edf7",
        "muted": "#8b9bb4",
        "track": "#1f293d",
        "emerald": "#34d399",
        "sky": "#38bdf8",
        "amber": "#fbbf24",
        "rose": "#fb7185",
        "slate": "#64748b",
        "menu_bg": "#161e2e",
        "menu_active": "#24314a",
    },
    "light": {
        "bg": "#f8fafc",
        "card_bg": "#ffffff",
        "hover_bg": "#e2e8f0",
        "border": "#cbd5e1",
        "sep": "#cbd5e1",
        "text": "#0f172a",
        "muted": "#64748b",
        "track": "#e2e8f0",
        "emerald": "#059669",
        "sky": "#0284c7",
        "amber": "#d97706",
        "rose": "#e11d48",
        "slate": "#94a3b8",
        "menu_bg": "#ffffff",
        "menu_active": "#e2e8f0",
    },
}


# ---------------------------------------------------------------------------
# Helpers & Formatting
# ---------------------------------------------------------------------------

def _gemini_home() -> str:
    env_home = os.environ.get("GEMINI_HOME", "").strip()
    if env_home:
        return os.path.abspath(os.path.expanduser(env_home))
    return os.path.join(os.path.expanduser("~"), ".gemini")


def _config_path() -> str:
    return os.path.join(_gemini_home(), "antigravity", "telemetry_hud_config.json")


def load_hud_config() -> dict:
    defaults = {
        "dx": 0,
        "dy": 40,
        "theme": "dark",
        "always_on_top": False,
        "pinned_convo_id": None,
    }
    path = _config_path()
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                loaded = json.load(f)
            if isinstance(loaded, dict):
                defaults.update(loaded)
        except Exception:
            pass
    if defaults.get("theme") not in THEMES:
        defaults["theme"] = "dark"
    return defaults


def save_hud_config(cfg: dict) -> None:
    path = _config_path()
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = f"{path}.{os.getpid()}.tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
        os.replace(tmp, path)
    except Exception:
        pass


def fmt_tokens(val) -> str:
    if val is None:
        return "--"
    n = float(val)
    if n >= 1_000_000:
        return f"{n / 1_000_000:.2f}M"
    if n >= 10_000:
        return f"{n / 1_000:.0f}k"
    if n >= 1_000:
        return f"{n / 1_000:.1f}k"
    return str(int(n))


def fmt_tps(val) -> str:
    if val is None:
        return "-- t/s"
    return f"{float(val):.1f} t/s"


def fmt_ttft(val) -> str:
    if val is None:
        return "--"
    sec = float(val)
    if sec >= 10:
        return f"{sec:.1f}s"
    return f"{sec:.2f}s"


def fmt_turns(user_turns, step_count) -> str:
    steps = int(step_count or 0)
    if user_turns is not None and int(user_turns) > 0:
        return f"{int(user_turns)}轮/{steps}步"
    return f"{steps}步"


def truncate_title(title: str, max_len: int = 16) -> str:
    t = " ".join((title or "").split())
    if len(t) <= max_len:
        return t or "等待会话"
    return t[: max_len - 1] + "…"


def format_hud_preview(payload: dict) -> str:
    active = payload.get("active") if isinstance(payload, dict) else None
    if not active:
        return "暂无会话数据"
    title = truncate_title(active.get("title", ""), 18)
    hit = active.get("last_cache_hit_rate_pct")
    if hit is None:
        hit = active.get("cache_hit_rate_pct")
    hit_s = f"{float(hit):.1f}%" if hit is not None else "--"
    tps_s = fmt_tps(active.get("stream_tps") if active.get("stream_tps") is not None else active.get("e2e_tps"))
    ttft_s = fmt_ttft(active.get("ttft_sec"))
    turns_s = fmt_turns(active.get("user_turns"), active.get("step_count"))
    tok_s = fmt_tokens(active.get("total_tokens"))
    ctx_pct = active.get("ctx_pct")
    ctx_s = f"Ctx {float(ctx_pct):.1f}%" if ctx_pct is not None else "Ctx --"
    return f"{title} | Hit {hit_s} | {tps_s} | TTFT {ttft_s} | {turns_s} | {tok_s} · {ctx_s}"


def fetch_hud_snapshot(
    host: str,
    port: int,
    *,
    convo_id: str | None = None,
    window_title: str | None = None,
    demo: bool = False,
    timeout: float = 2.5,
) -> dict:
    params = {}
    if convo_id:
        params["convo_id"] = convo_id
    elif window_title:
        params["window_title"] = window_title
    if demo:
        params["demo"] = "1"
    qs = urllib.parse.urlencode(params)
    url = f"http://{host}:{port}/api/hud" + (f"?{qs}" if qs else "")
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


# ---------------------------------------------------------------------------
# Win32 Integration (DPI, Focus-Free Floating, DWM Rounded Corners, Tracking)
# ---------------------------------------------------------------------------

def enable_dpi_awareness() -> None:
    if os.name != "nt":
        return
    try:
        # DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2 = -4
        ctypes.windll.user32.SetProcessDpiAwarenessContext(ctypes.c_void_p(-4))
        return
    except Exception:
        pass
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        pass


def acquire_single_instance_mutex() -> object | None:
    if os.name != "nt":
        return True
    kernel32 = ctypes.windll.kernel32
    kernel32.CreateMutexW.argtypes = [wintypes.LPVOID, wintypes.BOOL, wintypes.LPCWSTR]
    kernel32.CreateMutexW.restype = wintypes.HANDLE
    handle = kernel32.CreateMutexW(None, False, MUTEX_NAME)
    if not handle:
        return True
    if kernel32.GetLastError() == 183:  # ERROR_ALREADY_EXISTS
        kernel32.CloseHandle(handle)
        return None
    return handle


def _hex_to_colorref(hex_color: str) -> int:
    h = hex_color.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (b << 16) | (g << 8) | r


class _MONITORINFO(ctypes.Structure):
    _fields_ = [
        ("cbSize", wintypes.DWORD),
        ("rcMonitor", wintypes.RECT),
        ("rcWork", wintypes.RECT),
        ("dwFlags", wintypes.DWORD),
    ]


class Win32Helper:
    def __init__(self) -> None:
        self.enabled = os.name == "nt"
        if not self.enabled:
            return
        self.user32 = ctypes.windll.user32
        self.kernel32 = ctypes.windll.kernel32
        try:
            self.dwmapi = ctypes.windll.dwmapi
        except Exception:
            self.dwmapi = None
        self.self_pid = os.getpid()

        self._enum_proc_type = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
        long_ptr_t = ctypes.c_ssize_t

        self.user32.GetForegroundWindow.argtypes = []
        self.user32.GetForegroundWindow.restype = wintypes.HWND
        self.user32.GetAncestor.argtypes = [wintypes.HWND, wintypes.UINT]
        self.user32.GetAncestor.restype = wintypes.HWND
        self.user32.GetParent.argtypes = [wintypes.HWND]
        self.user32.GetParent.restype = wintypes.HWND
        self.user32.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
        self.user32.GetWindowThreadProcessId.restype = wintypes.DWORD
        self.user32.GetWindowTextLengthW.argtypes = [wintypes.HWND]
        self.user32.GetWindowTextLengthW.restype = ctypes.c_int
        self.user32.GetWindowTextW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
        self.user32.GetWindowTextW.restype = ctypes.c_int
        self.user32.GetWindowRect.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.RECT)]
        self.user32.GetWindowRect.restype = wintypes.BOOL
        self.user32.IsWindow.argtypes = [wintypes.HWND]
        self.user32.IsWindow.restype = wintypes.BOOL
        self.user32.IsWindowVisible.argtypes = [wintypes.HWND]
        self.user32.IsWindowVisible.restype = wintypes.BOOL
        self.user32.IsIconic.argtypes = [wintypes.HWND]
        self.user32.IsIconic.restype = wintypes.BOOL
        self.user32.MonitorFromWindow.argtypes = [wintypes.HWND, wintypes.DWORD]
        self.user32.MonitorFromWindow.restype = wintypes.HMONITOR
        self.user32.GetMonitorInfoW.argtypes = [wintypes.HMONITOR, ctypes.POINTER(_MONITORINFO)]
        self.user32.GetMonitorInfoW.restype = wintypes.BOOL
        self.user32.SetWindowPos.argtypes = [
            wintypes.HWND, wintypes.HWND, ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_int, wintypes.UINT
        ]
        self.user32.SetWindowPos.restype = wintypes.BOOL
        self.user32.EnumWindows.argtypes = [self._enum_proc_type, wintypes.LPARAM]
        self.user32.EnumWindows.restype = wintypes.BOOL

        if hasattr(self.user32, "GetWindowLongPtrW") and hasattr(self.user32, "SetWindowLongPtrW"):
            self._get_window_long = self.user32.GetWindowLongPtrW
            self._set_window_long = self.user32.SetWindowLongPtrW
        else:
            self._get_window_long = self.user32.GetWindowLongW
            self._set_window_long = self.user32.SetWindowLongW
        self._get_window_long.argtypes = [wintypes.HWND, ctypes.c_int]
        self._get_window_long.restype = long_ptr_t
        self._set_window_long.argtypes = [wintypes.HWND, ctypes.c_int, long_ptr_t]
        self._set_window_long.restype = long_ptr_t

        self.kernel32.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        self.kernel32.OpenProcess.restype = wintypes.HANDLE
        self.kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
        self.kernel32.CloseHandle.restype = wintypes.BOOL
        self.kernel32.QueryFullProcessImageNameW.argtypes = [
            wintypes.HANDLE, wintypes.DWORD, wintypes.LPWSTR, ctypes.POINTER(wintypes.DWORD)
        ]
        self.kernel32.QueryFullProcessImageNameW.restype = wintypes.BOOL

        if self.dwmapi:
            self.dwmapi.DwmSetWindowAttribute.argtypes = [
                wintypes.HWND, wintypes.DWORD, ctypes.c_void_p, wintypes.DWORD
            ]
            self.dwmapi.DwmSetWindowAttribute.restype = ctypes.c_long

    def get_toplevel_hwnd(self, tk_win: tk.Misc) -> int:
        if not self.enabled:
            return 0
        wid = tk_win.winfo_id()
        # GA_ROOT = 2
        root_hwnd = self.user32.GetAncestor(wid, 2)
        return int(root_hwnd or self.user32.GetParent(wid) or wid)

    def apply_tool_noactivate(self, hwnd: int) -> None:
        if not self.enabled or not hwnd:
            return
        GWL_EXSTYLE = -20
        WS_EX_TOOLWINDOW = 0x00000080
        WS_EX_NOACTIVATE = 0x08000000
        WS_EX_APPWINDOW = 0x00040000
        SWP_NOMOVE = 0x0002
        SWP_NOSIZE = 0x0001
        SWP_NOZORDER = 0x0004
        SWP_NOACTIVATE = 0x0010
        SWP_FRAMECHANGED = 0x0020
        style = self._get_window_long(hwnd, GWL_EXSTYLE)
        new_style = (style | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE) & ~WS_EX_APPWINDOW
        if new_style != style:
            self._set_window_long(hwnd, GWL_EXSTYLE, new_style)
            self.user32.SetWindowPos(
                hwnd,
                0,
                0,
                0,
                0,
                0,
                SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_NOACTIVATE | SWP_FRAMECHANGED,
            )

    def apply_dwm_style(self, hwnd: int, border_hex: str) -> None:
        if not self.enabled or not self.dwmapi or not hwnd:
            return
        try:
            # DWMWA_WINDOW_CORNER_PREFERENCE = 33, DWMWCP_ROUND = 2
            pref = ctypes.c_int(2)
            self.dwmapi.DwmSetWindowAttribute(hwnd, 33, ctypes.byref(pref), ctypes.sizeof(pref))
            # DWMWA_BORDER_COLOR = 34
            cref = ctypes.c_uint32(_hex_to_colorref(border_hex))
            self.dwmapi.DwmSetWindowAttribute(hwnd, 34, ctypes.byref(cref), ctypes.sizeof(cref))
        except Exception:
            pass

    def _exe_basename(self, pid: int) -> str:
        if pid <= 0:
            return ""
        hproc = self.kernel32.OpenProcess(0x1000, False, pid)
        if not hproc:
            return ""
        try:
            sz = wintypes.DWORD(512)
            buf = ctypes.create_unicode_buffer(512)
            if self.kernel32.QueryFullProcessImageNameW(hproc, 0, buf, ctypes.byref(sz)):
                return os.path.basename(buf.value).lower()
        finally:
            self.kernel32.CloseHandle(hproc)
        return ""

    def _window_title(self, hwnd: int) -> str:
        length = self.user32.GetWindowTextLengthW(hwnd)
        if length <= 0:
            return ""
        buf = ctypes.create_unicode_buffer(length + 1)
        self.user32.GetWindowTextW(hwnd, buf, length + 1)
        return buf.value

    def get_window_rect(self, hwnd: int) -> tuple[int, int, int, int] | None:
        if not self.enabled or not hwnd or not self.user32.IsWindow(hwnd):
            return None
        if self.user32.IsIconic(hwnd):
            return None
        rect = wintypes.RECT()
        if not self.user32.GetWindowRect(hwnd, ctypes.byref(rect)):
            return None
        w = rect.right - rect.left
        h = rect.bottom - rect.top
        if w <= 100 or h <= 100:
            return None
        return (rect.left, rect.top, rect.right, rect.bottom)

    def get_work_area(self, hwnd: int) -> tuple[int, int, int, int] | None:
        if not self.enabled or not hwnd:
            return None
        try:
            hmon = self.user32.MonitorFromWindow(hwnd, 2)  # MONITOR_DEFAULTTONEAREST
            if not hmon:
                return None
            mi = _MONITORINFO()
            mi.cbSize = ctypes.sizeof(_MONITORINFO)
            if self.user32.GetMonitorInfoW(hmon, ctypes.byref(mi)):
                rc = mi.rcWork
                return (rc.left, rc.top, rc.right, rc.bottom)
        except Exception:
            return None
        return None

    def inspect_foreground_antigravity(self) -> dict:
        if not self.enabled:
            return {"is_self": False, "is_ag": False, "hwnd": 0, "title": "", "rect": None}
        fg = self.user32.GetForegroundWindow()
        if not fg:
            return {"is_self": False, "is_ag": False, "hwnd": 0, "title": "", "rect": None}
        pid = wintypes.DWORD()
        self.user32.GetWindowThreadProcessId(fg, ctypes.byref(pid))
        if pid.value == self.self_pid:
            return {"is_self": True, "is_ag": False, "hwnd": int(fg), "title": "", "rect": None}
        exe = self._exe_basename(pid.value)
        if exe == "antigravity.exe":
            title = self._window_title(fg)
            rect = self.get_window_rect(fg)
            if rect and (rect[2] - rect[0]) > 300 and (rect[3] - rect[1]) > 200 and title != "OleMainThreadWndName":
                return {"is_self": False, "is_ag": True, "hwnd": int(fg), "title": title, "rect": rect}
        return {"is_self": False, "is_ag": False, "hwnd": int(fg), "title": "", "rect": None}

    def find_any_antigravity_window(self) -> tuple[int, str, tuple[int, int, int, int]] | None:
        if not self.enabled:
            return None
        found: list[tuple[int, int, str, tuple[int, int, int, int]]] = []

        def cb(hwnd, _lp):
            if not self.user32.IsWindowVisible(hwnd) or self.user32.IsIconic(hwnd):
                return True
            pid = wintypes.DWORD()
            self.user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
            if self._exe_basename(pid.value) != "antigravity.exe":
                return True
            title = self._window_title(hwnd)
            if not title or title == "OleMainThreadWndName":
                return True
            rect = self.get_window_rect(hwnd)
            if rect and (rect[2] - rect[0]) > 300 and (rect[3] - rect[1]) > 200:
                area = (rect[2] - rect[0]) * (rect[3] - rect[1])
                found.append((area, int(hwnd), title, rect))
            return True

        self.user32.EnumWindows(self._enum_proc_type(cb), 0)
        if not found:
            return None
        found.sort(reverse=True)
        _, hwnd, title, rect = found[0]
        return (hwnd, title, rect)


# ---------------------------------------------------------------------------
# HUD Application
# ---------------------------------------------------------------------------

class TelemetryHUD:
    def __init__(
        self,
        host: str,
        port: int,
        *,
        demo: bool = False,
        initial_convo_id: str | None = None,
    ) -> None:
        self.host = host
        self.port = port
        self.demo = demo
        self.win32 = Win32Helper()
        self.cfg = load_hud_config()
        if initial_convo_id:
            self.cfg["pinned_convo_id"] = initial_convo_id

        self.data_lock = threading.Lock()
        self.latest_payload: dict | None = None
        self.last_error: str | None = None
        self.ensured_server = False
        self.current_window_title: str = ""
        self.last_ag_hwnd: int = 0
        self.last_ag_rect: tuple[int, int, int, int] | None = None
        self.hud_hwnd: int = 0
        self.is_visible: bool = False
        self.menu_open: bool = False
        self.dragging: bool = False
        self.drag_start_pointer: tuple[int, int] = (0, 0)
        self.drag_start_pos: tuple[int, int] = (0, 0)
        self.hover_job: str | None = None
        self.hide_popover_job: str | None = None
        self.popover_pinned: bool = False
        self.pulse_phase: bool = False
        self.stop_event = threading.Event()

        self.root = tk.Tk()
        self.root.withdraw()
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.attributes("-alpha", 0.94)

        self._build_ui()
        self._build_popover()
        self._apply_theme()

        self.root.update_idletasks()
        self.hud_hwnd = self.win32.get_toplevel_hwnd(self.root)
        self.win32.apply_tool_noactivate(self.hud_hwnd)
        self.win32.apply_dwm_style(self.hud_hwnd, THEMES[self.cfg["theme"]]["border"])

        try:
            fg = self.win32.inspect_foreground_antigravity()
            if fg["is_ag"]:
                self.last_ag_hwnd = fg["hwnd"]
                self.last_ag_rect = fg["rect"]
                if fg["title"]:
                    self.current_window_title = fg["title"]
            else:
                any_ag = self.win32.find_any_antigravity_window()
                if any_ag:
                    self.last_ag_hwnd, title, rect = any_ag
                    self.last_ag_rect = rect
                    if title:
                        self.current_window_title = title
        except Exception:
            pass

        self._start_poller()
        self.root.after(80, self._tick_track_window)
        self.root.after(200, self._tick_refresh_ui)
        self.root.after(650, self._tick_pulse)

    # -- UI Construction -----------------------------------------------------

    def _build_ui(self) -> None:
        self.outer = tk.Frame(self.root, bd=0, highlightthickness=1)
        self.outer.pack(fill="both", expand=True)

        self.inner = tk.Frame(self.outer, bd=0, padx=10, pady=5)
        self.inner.pack(fill="both", expand=True)

        # Status dot + Session badge
        self.session_btn = tk.Frame(self.inner, bd=0, cursor="hand2")
        self.session_btn.pack(side="left")

        self.dot_canvas = tk.Canvas(self.session_btn, width=10, height=10, highlightthickness=0, bd=0)
        self.dot_canvas.pack(side="left", padx=(0, 5))
        self.dot_id = self.dot_canvas.create_oval(2, 2, 9, 9, outline="", fill="#38bdf8")

        self.lbl_title = tk.Label(
            self.session_btn,
            text="连接中…",
            font=("Microsoft YaHei UI", 9, "bold"),
            cursor="hand2",
        )
        self.lbl_title.pack(side="left")

        self.seps: list[tk.Frame] = []
        self.metric_labels: list[tuple[tk.Label, tk.Label]] = []

        def add_sep() -> None:
            sep = tk.Frame(self.inner, width=1, height=14, bd=0)
            sep.pack(side="left", padx=8, fill="y", pady=2)
            self.seps.append(sep)

        def add_metric(caption: str, init_val: str) -> tk.Label:
            box = tk.Frame(self.inner, bd=0)
            box.pack(side="left")
            cap = tk.Label(box, text=caption, font=("Microsoft YaHei UI", 8))
            cap.pack(side="left", padx=(0, 3))
            val = tk.Label(box, text=init_val, font=("Segoe UI", 9, "bold"))
            val.pack(side="left")
            self.metric_labels.append((cap, val))
            return val

        add_sep()
        self.val_hit = add_metric("命中", "--")
        add_sep()
        self.val_tps = add_metric("TPS", "--")
        add_sep()
        self.val_ttft = add_metric("TTFT", "--")
        add_sep()
        self.val_turns = add_metric("轮/步", "--")
        add_sep()

        self.ctx_box = tk.Frame(self.inner, bd=0)
        self.ctx_box.pack(side="left")
        self.lbl_tok = tk.Label(self.ctx_box, text="--", font=("Segoe UI", 9, "bold"))
        self.lbl_tok.pack(side="left", padx=(0, 5))
        self.lbl_ctx_pct = tk.Label(self.ctx_box, text="Ctx --", font=("Segoe UI", 8, "bold"))
        self.lbl_ctx_pct.pack(side="left", padx=(0, 5))

        self.ctx_bar = tk.Canvas(self.ctx_box, width=44, height=6, highlightthickness=0, bd=0)
        self.ctx_bar.pack(side="left", pady=1)
        self.ctx_track_id = self.ctx_bar.create_rectangle(0, 0, 44, 6, outline="", fill="#1f293d")
        self.ctx_fill_id = self.ctx_bar.create_rectangle(0, 0, 0, 6, outline="", fill="#38bdf8")

        add_sep()
        self.btn_menu = tk.Label(self.inner, text="▾", font=("Segoe UI", 9, "bold"), padx=3, cursor="hand2")
        self.btn_menu.pack(side="left")

        self.btn_close = tk.Label(self.inner, text="×", font=("Segoe UI", 10, "bold"), padx=3, cursor="hand2")
        self.btn_close.pack(side="left", padx=(2, 0))

        # Bindings
        for w in (self.session_btn, self.dot_canvas, self.lbl_title, self.btn_menu):
            w.bind("<Button-1>", self._on_menu_click)
        self.btn_close.bind("<Button-1>", lambda _e: self.quit())
        self.outer.bind("<Button-3>", self._on_menu_click)

        # Drag on non-button surfaces
        drag_widgets = [self.outer, self.inner, self.ctx_box, self.lbl_tok, self.lbl_ctx_pct, self.ctx_bar]
        for cap, val in self.metric_labels:
            drag_widgets.extend([cap.master, cap, val])
        for w in drag_widgets:
            w.bind("<ButtonPress-1>", self._on_drag_start)
            w.bind("<B1-Motion>", self._on_drag_motion)
            w.bind("<ButtonRelease-1>", self._on_drag_end)
            w.bind("<Button-3>", self._on_menu_click)

        # Hover popover
        self.root.bind("<Enter>", self._on_pill_enter)
        self.root.bind("<Leave>", self._on_pill_leave)

        self.btn_menu.bind("<Enter>", lambda _e: self._set_ctrl_hover(self.btn_menu, True))
        self.btn_menu.bind("<Leave>", lambda _e: self._set_ctrl_hover(self.btn_menu, False))
        self.btn_close.bind("<Enter>", lambda _e: self._set_ctrl_hover(self.btn_close, True, danger=True))
        self.btn_close.bind("<Leave>", lambda _e: self._set_ctrl_hover(self.btn_close, False))

    def _build_popover(self) -> None:
        self.pop = tk.Toplevel(self.root)
        self.pop.withdraw()
        self.pop.overrideredirect(True)
        self.pop.attributes("-topmost", True)
        self.pop.attributes("-alpha", 0.96)

        self.pop_outer = tk.Frame(self.pop, bd=0, highlightthickness=1)
        self.pop_outer.pack(fill="both", expand=True)
        self.pop_inner = tk.Frame(self.pop_outer, bd=0, padx=12, pady=10)
        self.pop_inner.pack(fill="both", expand=True)

        self.pop_title = tk.Label(self.pop_inner, text="", font=("Microsoft YaHei UI", 9, "bold"), anchor="w", justify="left", wraplength=330)
        self.pop_title.pack(fill="x")

        self.pop_sub = tk.Label(self.pop_inner, text="", font=("Microsoft YaHei UI", 8), anchor="w")
        self.pop_sub.pack(fill="x", pady=(2, 6))

        self.pop_sep = tk.Frame(self.pop_inner, height=1, bd=0)
        self.pop_sep.pack(fill="x", pady=(0, 6))

        self.pop_rows: list[tuple[tk.Label, tk.Label]] = []
        for label_text in ("缓存命中", "生成速度", "首字延迟", "轮数 / 步数", "Token 构成", "原生上下文"):
            row = tk.Frame(self.pop_inner, bd=0)
            row.pack(fill="x", pady=1)
            kl = tk.Label(row, text=label_text, font=("Microsoft YaHei UI", 8), width=11, anchor="w")
            kl.pack(side="left")
            vl = tk.Label(row, text="--", font=("Segoe UI", 8, "bold"), anchor="e")
            vl.pack(side="right")
            self.pop_rows.append((kl, vl))

        self.pop.update_idletasks()
        pop_hwnd = self.win32.get_toplevel_hwnd(self.pop)
        self.win32.apply_tool_noactivate(pop_hwnd)
        self.win32.apply_dwm_style(pop_hwnd, THEMES[self.cfg["theme"]]["border"])
        self.pop.bind("<Enter>", self._cancel_hide_popover)
        self.pop.bind("<Leave>", self._on_pill_leave)

    def _set_ctrl_hover(self, widget: tk.Label, entering: bool, danger: bool = False) -> None:
        t = THEMES[self.cfg["theme"]]
        if entering:
            widget.configure(fg=t["rose"] if danger else t["text"], bg=t["hover_bg"])
        else:
            widget.configure(fg=t["muted"], bg=t["bg"])

    def _apply_theme(self) -> None:
        t = THEMES[self.cfg["theme"]]
        self.root.configure(bg=t["bg"])
        self.outer.configure(bg=t["bg"], highlightbackground=t["border"], highlightcolor=t["border"])
        self.inner.configure(bg=t["bg"])
        self.session_btn.configure(bg=t["bg"])
        self.dot_canvas.configure(bg=t["bg"])
        self.lbl_title.configure(bg=t["bg"], fg=t["text"])
        for sep in self.seps:
            sep.configure(bg=t["sep"])
        for cap, val in self.metric_labels:
            cap.master.configure(bg=t["bg"])
            cap.configure(bg=t["bg"], fg=t["muted"])
            val.configure(bg=t["bg"], fg=t["text"])
        self.ctx_box.configure(bg=t["bg"])
        self.lbl_tok.configure(bg=t["bg"], fg=t["text"])
        self.lbl_ctx_pct.configure(bg=t["bg"], fg=t["sky"])
        self.ctx_bar.configure(bg=t["bg"])
        self.ctx_bar.itemconfig(self.ctx_track_id, fill=t["track"])
        self.btn_menu.configure(bg=t["bg"], fg=t["muted"])
        self.btn_close.configure(bg=t["bg"], fg=t["muted"])

        # Popover theme
        self.pop.configure(bg=t["card_bg"])
        self.pop_outer.configure(bg=t["card_bg"], highlightbackground=t["border"], highlightcolor=t["border"])
        self.pop_inner.configure(bg=t["card_bg"])
        self.pop_title.configure(bg=t["card_bg"], fg=t["text"])
        self.pop_sub.configure(bg=t["card_bg"], fg=t["muted"])
        self.pop_sep.configure(bg=t["sep"])
        for kl, vl in self.pop_rows:
            kl.master.configure(bg=t["card_bg"])
            kl.configure(bg=t["card_bg"], fg=t["muted"])
            vl.configure(bg=t["card_bg"], fg=t["text"])

        if self.hud_hwnd:
            self.win32.apply_dwm_style(self.hud_hwnd, t["border"])
        pop_hwnd = self.win32.get_toplevel_hwnd(self.pop)
        if pop_hwnd:
            self.win32.apply_dwm_style(pop_hwnd, t["border"])

    # -- Dragging & Positioning ----------------------------------------------

    def _on_drag_start(self, event: tk.Event) -> None:
        self.dragging = True
        self._cancel_hover()
        self._hide_popover()
        self.drag_start_pointer = (event.x_root, event.y_root)
        self.drag_start_pos = (self.root.winfo_x(), self.root.winfo_y())

    def _on_drag_motion(self, event: tk.Event) -> None:
        if not self.dragging:
            return
        dx_p = event.x_root - self.drag_start_pointer[0]
        dy_p = event.y_root - self.drag_start_pointer[1]
        new_x = self.drag_start_pos[0] + dx_p
        new_y = self.drag_start_pos[1] + dy_p
        self.root.geometry(f"+{new_x}+{new_y}")

    def _on_drag_end(self, _event: tk.Event) -> None:
        if not self.dragging:
            return
        self.dragging = False
        cur_x = self.root.winfo_x()
        cur_y = self.root.winfo_y()
        hud_w = max(1, self.root.winfo_width())
        if self.last_ag_rect:
            l, t, r, _b = self.last_ag_rect
            ag_cx = (l + r) // 2
            self.cfg["dx"] = (cur_x + hud_w // 2) - ag_cx
            self.cfg["dy"] = cur_y - t
            save_hud_config(self.cfg)

    def _clamp_to_screen(self, x: int, y: int, w: int, h: int) -> tuple[int, int]:
        wa = self.win32.get_work_area(self.last_ag_hwnd or self.hud_hwnd)
        if wa:
            wl, wt, wr, wb = wa
        else:
            wl, wt = 0, 0
            wr, wb = self.root.winfo_screenwidth(), self.root.winfo_screenheight()
        x = max(wl + 4, min(x, wr - w - 4))
        y = max(wt + 4, min(y, wb - h - 4))
        return x, y

    def _position_near_ag(self) -> None:
        if self.dragging:
            return
        self.root.update_idletasks()
        hud_w = self.root.winfo_reqwidth()
        hud_h = self.root.winfo_reqheight()
        rect = self.last_ag_rect
        if rect:
            l, t, r, _b = rect
            ag_cx = (l + r) // 2
            x = ag_cx + int(self.cfg.get("dx", 0)) - hud_w // 2
            y = t + int(self.cfg.get("dy", 40))
        else:
            sw = self.root.winfo_screenwidth()
            x = sw // 2 + int(self.cfg.get("dx", 0)) - hud_w // 2
            y = 40
        x, y = self._clamp_to_screen(x, y, hud_w, hud_h)
        self.root.geometry(f"+{x}+{y}")

    def _show_hud(self) -> None:
        self._position_near_ag()
        if not self.is_visible:
            self.root.deiconify()
            self.root.attributes("-topmost", True)
            self.win32.apply_tool_noactivate(self.hud_hwnd)
            self.is_visible = True

    def _hide_hud(self) -> None:
        if self.is_visible:
            self._hide_popover()
            self.root.withdraw()
            self.is_visible = False

    def _tick_track_window(self) -> None:
        if self.stop_event.is_set():
            return
        try:
            fg = self.win32.inspect_foreground_antigravity()
            if fg["is_ag"]:
                self.last_ag_hwnd = fg["hwnd"]
                self.last_ag_rect = fg["rect"]
                if fg["title"] and fg["title"] != self.current_window_title:
                    self.current_window_title = fg["title"]
                    if not self.cfg.get("pinned_convo_id"):
                        threading.Thread(target=self._poll_once, daemon=True).start()
                self._show_hud()
            elif fg["is_self"] or self.menu_open or self.dragging:
                if self.last_ag_hwnd:
                    r = self.win32.get_window_rect(self.last_ag_hwnd)
                    if r:
                        self.last_ag_rect = r
                self._show_hud()
            elif self.cfg.get("always_on_top"):
                if self.last_ag_hwnd:
                    r = self.win32.get_window_rect(self.last_ag_hwnd)
                    if r:
                        self.last_ag_rect = r
                if not self.last_ag_rect:
                    any_ag = self.win32.find_any_antigravity_window()
                    if any_ag:
                        self.last_ag_hwnd, title, rect = any_ag
                        self.last_ag_rect = rect
                        if title:
                            self.current_window_title = title
                self._show_hud()
            else:
                self._hide_hud()
        except Exception:
            pass
        self.root.after(250, self._tick_track_window)

    # -- Hover Popover -------------------------------------------------------

    def _on_pill_enter(self, _event: tk.Event) -> None:
        self._cancel_hide_popover()
        if self.dragging or self.menu_open or self.hover_job is not None:
            return
        self.hover_job = self.root.after(420, self._show_popover)

    def _on_pill_leave(self, _event: tk.Event) -> None:
        self._cancel_hover()
        if self.popover_pinned:
            return
        if self.hide_popover_job is None:
            self.hide_popover_job = self.root.after(180, self._maybe_hide_popover)

    def _cancel_hover(self) -> None:
        if self.hover_job is not None:
            try:
                self.root.after_cancel(self.hover_job)
            except Exception:
                pass
            self.hover_job = None

    def _cancel_hide_popover(self, _event: tk.Event | None = None) -> None:
        if self.hide_popover_job is not None:
            try:
                self.root.after_cancel(self.hide_popover_job)
            except Exception:
                pass
            self.hide_popover_job = None

    def _pointer_inside(self, win: tk.Misc) -> bool:
        try:
            if not win.winfo_viewable():
                return False
            px, py = win.winfo_pointerxy()
            x0, y0 = win.winfo_rootx(), win.winfo_rooty()
            x1, y1 = x0 + win.winfo_width(), y0 + win.winfo_height()
            return x0 <= px <= x1 and y0 <= py <= y1
        except Exception:
            return False

    def _maybe_hide_popover(self) -> None:
        self.hide_popover_job = None
        if self.popover_pinned:
            return
        if self._pointer_inside(self.root) or self._pointer_inside(self.pop):
            return
        self._hide_popover()

    def _show_popover(self) -> None:
        self.hover_job = None
        if not self.is_visible or self.dragging or self.menu_open:
            return
        self._update_popover_content()
        self.pop.update_idletasks()
        pw = self.pop.winfo_reqwidth()
        ph = self.pop.winfo_reqheight()
        rx = self.root.winfo_rootx()
        ry = self.root.winfo_rooty()
        rw = self.root.winfo_width()
        rh = self.root.winfo_height()

        x = rx + (rw - pw) // 2
        y = ry + rh + 6
        wa = self.win32.get_work_area(self.last_ag_hwnd or self.hud_hwnd)
        if wa and y + ph > wa[3] - 4:
            y = ry - ph - 6
        x, y = self._clamp_to_screen(x, y, pw, ph)
        self.pop.geometry(f"+{x}+{y}")
        self.pop.deiconify()
        self.pop.attributes("-topmost", True)

    def _hide_popover(self) -> None:
        if self.pop.winfo_viewable():
            self.pop.withdraw()

    def _update_popover_content(self) -> None:
        with self.data_lock:
            payload = self.latest_payload
        if not payload or not payload.get("active"):
            self.pop_title.configure(text="等待遥测数据…")
            self.pop_sub.configure(text=f"服务地址: http://{self.host}:{self.port}/")
            for _, vl in self.pop_rows:
                vl.configure(text="--")
            return

        a = payload["active"]
        match_map = {
            "window_title": "窗口标题匹配",
            "pinned": "已锁定会话",
            "latest_active": "最近活跃会话",
        }
        m_label = match_map.get(payload.get("matched_by", ""), "自动")
        state_s = "运行中" if a.get("is_running") else "空闲"
        self.pop_title.configure(text=truncate_title(a.get("title") or "未命名会话", 54))
        self.pop_sub.configure(text=f"{a.get('model', '')}  ·  {m_label}  ·  {state_s}")

        last_hit = a.get("last_cache_hit_rate_pct")
        avg_hit = a.get("cache_hit_rate_pct")
        hit_txt = (
            f"最新 {float(last_hit):.1f}% / 均 {float(avg_hit):.1f}%"
            if last_hit is not None and avg_hit is not None
            else "--"
        )
        tps_txt = f"Stream {fmt_tps(a.get('stream_tps'))} / E2E {fmt_tps(a.get('e2e_tps'))}"
        ttft_txt = f"最新 {fmt_ttft(a.get('ttft_sec'))} / 均 {fmt_ttft(a.get('avg_ttft_sec'))}"
        turns_txt = fmt_turns(a.get("user_turns"), a.get("step_count"))
        tok_txt = (
            f"入 {fmt_tokens(a.get('input_tokens'))} · 缓 {fmt_tokens(a.get('cached_tokens'))}"
            f" · 出 {fmt_tokens(a.get('output_tokens'))} · 思 {fmt_tokens(a.get('thinking_tokens'))}"
        )
        ctx_src = "原生" if a.get("ctx_source") == "db_native" else "估算"
        ctx_pct = a.get("ctx_pct")
        ctx_pct_s = f"{float(ctx_pct):.1f}%" if ctx_pct is not None else "--"
        ctx_txt = f"{fmt_tokens(a.get('ctx_used'))} / {fmt_tokens(a.get('ctx_limit'))} ({ctx_pct_s}) [{ctx_src}]"

        values = [hit_txt, tps_txt, ttft_txt, turns_txt, tok_txt, ctx_txt]
        for (_, vl), txt in zip(self.pop_rows, values):
            vl.configure(text=txt)

    # -- Popup Menu ----------------------------------------------------------

    def _on_menu_click(self, event: tk.Event) -> None:
        self._cancel_hover()
        self._hide_popover()
        t = THEMES[self.cfg["theme"]]
        menu = tk.Menu(
            self.root,
            tearoff=0,
            bg=t["menu_bg"],
            fg=t["text"],
            activebackground=t["menu_active"],
            activeforeground=t["text"],
            font=("Microsoft YaHei UI", 9),
        )

        with self.data_lock:
            payload = self.latest_payload

        pinned_id = self.cfg.get("pinned_convo_id")
        if pinned_id:
            menu.add_command(label="🔄 取消锁定（自动跟随当前窗口）", command=lambda: self._set_pinned(None))
        else:
            menu.add_command(label="✓ 自动跟随当前窗口 / 最新会话", state="disabled")

        sessions = (payload or {}).get("sessions") or []
        if sessions:
            sub = tk.Menu(
                menu,
                tearoff=0,
                bg=t["menu_bg"],
                fg=t["text"],
                activebackground=t["menu_active"],
                activeforeground=t["text"],
                font=("Microsoft YaHei UI", 9),
            )
            for s in sessions[:12]:
                cid = s.get("convo_id", "")
                mark = "📌 " if cid == pinned_id else ("● " if s.get("is_running") else "○ ")
                t_str = truncate_title(s.get("title", ""), 22)
                turns_s = fmt_turns(s.get("user_turns"), s.get("step_count"))
                hit_s = f"{float(s.get('cache_hit_rate_pct', 0)):.0f}%"
                label = f"{mark}{t_str}  ({turns_s}, 命中 {hit_s})"
                sub.add_command(label=label, command=lambda c=cid: self._set_pinned(c))
            menu.add_cascade(label="切换 / 锁定会话", menu=sub)

        menu.add_separator()
        aot = bool(self.cfg.get("always_on_top"))
        menu.add_command(
            label=("✓ 始终置顶显示" if aot else "   始终置顶显示（切窗不隐藏）"),
            command=self._toggle_always_on_top,
        )
        next_theme = "浅色主题" if self.cfg.get("theme") == "dark" else "深色主题"
        menu.add_command(label=f"🎨 切换为{next_theme}", command=self._toggle_theme)
        menu.add_command(
            label=("✓ 固定详情卡片" if self.popover_pinned else "   固定详情卡片"),
            command=self._toggle_popover_pinned,
        )
        menu.add_command(label="📍 重置悬浮位置", command=self._reset_position)
        menu.add_separator()
        menu.add_command(
            label="🌐 打开完整 Web 仪表盘",
            command=lambda: webbrowser.open(f"http://{self.host}:{self.port}/"),
        )
        menu.add_command(label="❌ 退出悬浮窗", command=self.quit)

        self.menu_open = True
        try:
            menu.tk_popup(event.x_root, event.y_root)
        finally:
            menu.grab_release()
            self.menu_open = False

    def _set_pinned(self, convo_id: str | None) -> None:
        self.cfg["pinned_convo_id"] = convo_id
        save_hud_config(self.cfg)
        threading.Thread(target=self._poll_once, daemon=True).start()

    def _toggle_always_on_top(self) -> None:
        self.cfg["always_on_top"] = not bool(self.cfg.get("always_on_top"))
        save_hud_config(self.cfg)

    def _toggle_theme(self) -> None:
        self.cfg["theme"] = "light" if self.cfg.get("theme") == "dark" else "dark"
        save_hud_config(self.cfg)
        self._apply_theme()
        self._refresh_ui_now()

    def _toggle_popover_pinned(self) -> None:
        self.popover_pinned = not self.popover_pinned
        if self.popover_pinned:
            self._show_popover()
        else:
            self._hide_popover()

    def _reset_position(self) -> None:
        self.cfg["dx"] = 0
        self.cfg["dy"] = 40
        save_hud_config(self.cfg)
        self._position_near_ag()

    # -- Background Poller & UI Refresh --------------------------------------

    def _start_ensure_server_once(self) -> None:
        if self.ensured_server:
            return
        self.ensured_server = True
        ensure_py = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ensure_server.py")
        if not os.path.exists(ensure_py):
            return
        try:
            kwargs: dict = {
                "stdin": subprocess.DEVNULL,
                "stdout": subprocess.DEVNULL,
                "stderr": subprocess.DEVNULL,
            }
            if os.name == "nt":
                kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
            subprocess.Popen(
                [sys.executable, ensure_py, "--host", self.host, "--port", str(self.port)],
                **kwargs,
            )
        except Exception:
            pass

    def _poll_once(self) -> None:
        try:
            data = fetch_hud_snapshot(
                self.host,
                self.port,
                convo_id=self.cfg.get("pinned_convo_id"),
                window_title=self.current_window_title,
                demo=self.demo,
            )
            with self.data_lock:
                self.latest_payload = data
                self.last_error = None
        except Exception as exc:
            with self.data_lock:
                self.last_error = str(exc)
            self._start_ensure_server_once()

    def _start_poller(self) -> None:
        def worker() -> None:
            while not self.stop_event.is_set():
                self._poll_once()
                self.stop_event.wait(1.5)

        threading.Thread(target=worker, daemon=True).start()

    def _tick_pulse(self) -> None:
        if self.stop_event.is_set():
            return
        self.pulse_phase = not self.pulse_phase
        with self.data_lock:
            payload = self.latest_payload
        t = THEMES[self.cfg["theme"]]
        active = (payload or {}).get("active") if payload else None
        if active and active.get("is_running"):
            self.dot_canvas.itemconfig(self.dot_id, fill=t["emerald"] if self.pulse_phase else t["sky"])
        elif active:
            self.dot_canvas.itemconfig(self.dot_id, fill=t["sky"])
        else:
            self.dot_canvas.itemconfig(self.dot_id, fill=t["slate"])
        self.root.after(650, self._tick_pulse)

    def _refresh_ui_now(self) -> None:
        with self.data_lock:
            payload = self.latest_payload
            err = self.last_error
        t = THEMES[self.cfg["theme"]]

        if not payload or not payload.get("active"):
            self.lbl_title.configure(text="连接服务中…" if err else "等待会话")
            self.val_hit.configure(text="--", fg=t["muted"])
            self.val_tps.configure(text="--", fg=t["muted"])
            self.val_ttft.configure(text="--", fg=t["muted"])
            self.val_turns.configure(text="--", fg=t["muted"])
            self.lbl_tok.configure(text="--")
            self.lbl_ctx_pct.configure(text="Ctx --", fg=t["muted"])
            self.ctx_bar.coords(self.ctx_fill_id, 0, 0, 0, 6)
            return

        a = payload["active"]
        pin_prefix = "📌 " if self.cfg.get("pinned_convo_id") else ""
        self.lbl_title.configure(text=pin_prefix + truncate_title(a.get("title", ""), 15))

        hit = a.get("last_cache_hit_rate_pct")
        if hit is None:
            hit = a.get("cache_hit_rate_pct")
        if hit is not None:
            hv = float(hit)
            h_color = t["emerald"] if hv >= 80 else (t["amber"] if hv >= 50 else t["rose"])
            self.val_hit.configure(text=f"{hv:.1f}%", fg=h_color)
        else:
            self.val_hit.configure(text="--", fg=t["muted"])

        tps = a.get("stream_tps") if a.get("stream_tps") is not None else a.get("e2e_tps")
        self.val_tps.configure(text=fmt_tps(tps), fg=t["sky"] if tps is not None else t["muted"])

        ttft = a.get("ttft_sec")
        if ttft is not None:
            tv = float(ttft)
            t_color = t["emerald"] if tv <= 2.0 else (t["sky"] if tv <= 5.0 else t["amber"])
            self.val_ttft.configure(text=fmt_ttft(tv), fg=t_color)
        else:
            self.val_ttft.configure(text="--", fg=t["muted"])

        self.val_turns.configure(text=fmt_turns(a.get("user_turns"), a.get("step_count")), fg=t["text"])
        self.lbl_tok.configure(text=fmt_tokens(a.get("total_tokens")))

        ctx_pct = a.get("ctx_pct")
        if ctx_pct is not None:
            cv = max(0.0, min(100.0, float(ctx_pct)))
            c_color = t["sky"] if cv < 60 else (t["amber"] if cv < 80 else t["rose"])
            self.lbl_ctx_pct.configure(text=f"Ctx {cv:.1f}%", fg=c_color)
            fill_w = max(2, int(round(44 * (cv / 100.0)))) if cv > 0 else 0
            self.ctx_bar.coords(self.ctx_fill_id, 0, 0, fill_w, 6)
            self.ctx_bar.itemconfig(self.ctx_fill_id, fill=c_color)
        else:
            self.lbl_ctx_pct.configure(text="Ctx --", fg=t["muted"])
            self.ctx_bar.coords(self.ctx_fill_id, 0, 0, 0, 6)

        if self.pop.winfo_viewable():
            self._update_popover_content()
        if self.is_visible and not self.dragging:
            self._position_near_ag()

    def _tick_refresh_ui(self) -> None:
        if self.stop_event.is_set():
            return
        try:
            self._refresh_ui_now()
        except Exception:
            pass
        self.root.after(400, self._tick_refresh_ui)

    def quit(self) -> None:
        self.stop_event.set()
        try:
            self.root.destroy()
        except Exception:
            pass

    def run(self) -> None:
        self.root.mainloop()


# ---------------------------------------------------------------------------
# CLI & Self-Test
# ---------------------------------------------------------------------------

def run_check(args: argparse.Namespace) -> int:
    enable_dpi_awareness()
    payload = fetch_hud_snapshot(
        args.host,
        args.port,
        convo_id=args.convo_id,
        window_title=args.window_title,
        demo=args.demo,
        timeout=5.0,
    )
    # Verify Tk + Win32 bindings can construct and tear down the overlay cleanly
    hud = TelemetryHUD(args.host, args.port, demo=args.demo, initial_convo_id=args.convo_id)
    with hud.data_lock:
        hud.latest_payload = payload
    hud._refresh_ui_now()
    hud.root.update_idletasks()
    preview_line = format_hud_preview(payload)
    hud.quit()

    out = {
        "ok": True,
        "matched_by": payload.get("matched_by"),
        "preview_line": preview_line,
        "active": payload.get("active"),
        "sessions_count": len(payload.get("sessions") or []),
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Antigravity Floating Telemetry HUD Capsule")
    parser.add_argument("--host", default=os.environ.get("TELEMETRY_HOST", DEFAULT_HOST))
    parser.add_argument("--port", type=int, default=int(os.environ.get("TELEMETRY_PORT", str(DEFAULT_PORT))))
    parser.add_argument("--convo-id", default=None, help="Pin a specific conversation ID")
    parser.add_argument("--window-title", default=None, help="Window title override (used with --check)")
    parser.add_argument("--demo", action="store_true", help="Use demo telemetry data")
    parser.add_argument("--allow-multiple", action="store_true", help="Bypass single-instance mutex")
    parser.add_argument("--check", action="store_true", help="Run headless self-test and print JSON summary")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8", errors="replace")
            except Exception:
                pass

    args = parse_args(argv)
    if args.check:
        return run_check(args)

    enable_dpi_awareness()
    mutex = None
    if not args.allow_multiple:
        mutex = acquire_single_instance_mutex()
        if mutex is None:
            return 0

    app = TelemetryHUD(args.host, args.port, demo=args.demo, initial_convo_id=args.convo_id)
    app.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
