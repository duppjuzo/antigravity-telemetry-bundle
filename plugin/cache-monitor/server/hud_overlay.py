"""
Antigravity Floating Telemetry HUD Capsule (Material 3 + Monet Edition)
Zero-dependency Windows overlay using Python standard library (tkinter + ctypes Win32).
Docks above the active Antigravity window and live-tracks Cache Hit, TPS, TTFT,
Turns/Steps, Total Tokens, and Context Window %, with live Monet M3 palette sync.
"""

from __future__ import annotations

import argparse
import atexit
import ctypes
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import time
import tkinter as tk
import tkinter.font as tkfont
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from ctypes import wintypes

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765
MUTEX_NAME = "Local\\AntigravityTelemetryHUDMutex"
_HEX_COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")

# Material 3 Monet default palettes derived from seed #ADD8E6 (Tonal Spot)
DEFAULT_M3_PALETTES: dict[str, dict[str, str]] = {
    "dark": {
        "surface_container_low": "#191c1e",
        "surface_container": "#1d2022",
        "surface_container_high": "#272a2d",
        "surface_container_highest": "#323538",
        "on_surface": "#e1e2e5",
        "on_surface_variant": "#c1c7ce",
        "outline": "#8b9198",
        "outline_variant": "#41484d",
        "primary": "#8ccff0",
        "on_primary": "#003547",
        "primary_container": "#004d66",
        "on_primary_container": "#bfe9ff",
        "secondary_container": "#364955",
        "on_secondary_container": "#d0e6f4",
        "tertiary": "#cfc0e8",
        "tertiary_container": "#4d4163",
        "on_tertiary_container": "#ebdcff",
        "error": "#ffb4ab",
        "error_container": "#93000a",
        "on_error_container": "#ffdad6",
    },
    "light": {
        "surface_container_low": "#f1f4f7",
        "surface_container": "#ebeef1",
        "surface_container_high": "#e6e8eb",
        "surface_container_highest": "#e0e3e6",
        "on_surface": "#191c1e",
        "on_surface_variant": "#41484d",
        "outline": "#71787e",
        "outline_variant": "#c1c7ce",
        "primary": "#126682",
        "on_primary": "#ffffff",
        "primary_container": "#bfe9ff",
        "on_primary_container": "#001f2a",
        "secondary_container": "#d0e6f4",
        "on_secondary_container": "#091e29",
        "tertiary": "#65587c",
        "tertiary_container": "#ebdcff",
        "on_tertiary_container": "#211535",
        "error": "#ba1a1a",
        "error_container": "#ffdad6",
        "on_error_container": "#410002",
    },
}


# ---------------------------------------------------------------------------
# Helpers, Config & Formatting
# ---------------------------------------------------------------------------

def _gemini_home() -> str:
    env_home = os.environ.get("GEMINI_HOME", "").strip()
    if env_home:
        return os.path.abspath(os.path.expanduser(env_home))
    return os.path.join(os.path.expanduser("~"), ".gemini")


def _runtime_dir() -> str:
    preferred = os.path.join(_gemini_home(), "antigravity")
    try:
        os.makedirs(preferred, exist_ok=True)
        probe = os.path.join(preferred, ".hud_write_probe")
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


def load_hud_config() -> dict:
    defaults: dict = {
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
    if defaults.get("theme") not in ("dark", "light"):
        defaults["theme"] = "dark"
    return defaults


def save_hud_config(cfg: dict) -> None:
    """Atomically saves HUD settings while preserving server-synced palettes/flags."""
    targets = [
        os.path.join(_gemini_home(), "antigravity", "telemetry_hud_config.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud_config.json"),
    ]
    merged = load_hud_config()
    for key in ("dx", "dy", "theme", "always_on_top", "pinned_convo_id", "reset_nonce"):
        if key in cfg:
            merged[key] = cfg[key]

    for path in targets:
        tmp = f"{path}.{os.getpid()}.tmp"
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(merged, f, indent=2, ensure_ascii=False)
            os.replace(tmp, path)
            return
        except OSError:
            try:
                if os.path.exists(tmp):
                    os.remove(tmp)
            except OSError:
                pass


def write_pid_file(pid: int, hwnd: int, host: str, port: int, started_at: float) -> None:
    payload = {
        "pid": int(pid),
        "hwnd": int(hwnd or 0),
        "host": host,
        "port": int(port),
        "started_at": started_at,
    }
    for path in (
        os.path.join(_gemini_home(), "antigravity", "telemetry_hud.pid.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud.pid.json"),
    ):
        tmp = f"{path}.{os.getpid()}.tmp"
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2)
            os.replace(tmp, path)
            return
        except OSError:
            try:
                if os.path.exists(tmp):
                    os.remove(tmp)
            except OSError:
                pass


def _is_pid_alive(pid: int | None) -> bool:
    if not pid or pid <= 0:
        return False
    if os.name == "nt":
        try:
            kernel32 = ctypes.windll.kernel32
            PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
            STILL_ACTIVE = 259
            kernel32.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
            kernel32.OpenProcess.restype = wintypes.HANDLE
            kernel32.GetExitCodeProcess.argtypes = [wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD)]
            kernel32.GetExitCodeProcess.restype = wintypes.BOOL
            kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
            kernel32.CloseHandle.restype = wintypes.BOOL
            handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, int(pid))
            if not handle:
                return False
            try:
                code = wintypes.DWORD()
                if kernel32.GetExitCodeProcess(handle, ctypes.byref(code)):
                    return code.value == STILL_ACTIVE
            finally:
                kernel32.CloseHandle(handle)
        except Exception:
            return False
    try:
        os.kill(int(pid), 0)
        return True
    except OSError:
        return False


def remove_pid_file(expected_pid: int) -> None:
    for path in (
        os.path.join(_gemini_home(), "antigravity", "telemetry_hud.pid.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud.pid.json"),
    ):
        try:
            if not os.path.exists(path):
                continue
            with open(path, "r", encoding="utf-8") as f:
                info = json.load(f)
            if isinstance(info, dict) and info.get("pid") not in (None, expected_pid):
                continue
            os.remove(path)
        except Exception:
            pass


def resolve_palette(cfg: dict) -> dict[str, str]:
    mode = cfg.get("theme") if cfg.get("theme") in ("dark", "light") else "dark"
    base = dict(DEFAULT_M3_PALETTES[mode])
    palettes = cfg.get("palettes")
    if isinstance(palettes, dict):
        override = palettes.get(mode)
        if isinstance(override, dict):
            for key, default_val in base.items():
                val = override.get(key)
                if isinstance(val, str) and _HEX_COLOR_RE.match(val.strip()):
                    base[key] = val.strip().lower()
                else:
                    base[key] = default_val
    return base


def fmt_tokens(val) -> str:
    if val is None:
        return "--"
    n = float(val)
    if n >= 1_000_000_000:
        return f"{n / 1_000_000_000:.2f}B"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.2f}M"
    if n >= 10_000:
        return f"{n / 1_000:.0f}K"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
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
    ctx_s = f"上下文 {float(ctx_pct):.1f}%" if ctx_pct is not None else "上下文 --"
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


def release_single_instance_mutex(handle: object | None) -> None:
    if os.name != "nt" or not handle or handle is True:
        return
    try:
        ctypes.windll.kernel32.CloseHandle(handle)
    except Exception:
        pass


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
        try:
            self.shcore = ctypes.windll.shcore
        except Exception:
            self.shcore = None
        self.self_pid = os.getpid()

        self._get_dpi_for_window = getattr(self.user32, "GetDpiForWindow", None)
        if self._get_dpi_for_window is not None:
            self._get_dpi_for_window.argtypes = [wintypes.HWND]
            self._get_dpi_for_window.restype = wintypes.UINT
        self._get_dpi_for_system = getattr(self.user32, "GetDpiForSystem", None)
        if self._get_dpi_for_system is not None:
            self._get_dpi_for_system.argtypes = []
            self._get_dpi_for_system.restype = wintypes.UINT
        self._get_dpi_for_monitor = getattr(self.shcore, "GetDpiForMonitor", None) if self.shcore else None
        if self._get_dpi_for_monitor is not None:
            self._get_dpi_for_monitor.argtypes = [
                wintypes.HMONITOR,
                ctypes.c_int,
                ctypes.POINTER(wintypes.UINT),
                ctypes.POINTER(wintypes.UINT),
            ]
            self._get_dpi_for_monitor.restype = ctypes.c_long

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

    def get_window_dpi(self, hwnd: int) -> int:
        if not self.enabled:
            return 96
        if hwnd and self._get_dpi_for_window is not None:
            try:
                dpi = int(self._get_dpi_for_window(hwnd))
                if dpi > 0:
                    return dpi
            except Exception:
                pass
        if hwnd and self._get_dpi_for_monitor is not None:
            try:
                hmon = self.user32.MonitorFromWindow(hwnd, 2)
                if hmon:
                    dx = wintypes.UINT()
                    dy = wintypes.UINT()
                    if self._get_dpi_for_monitor(hmon, 0, ctypes.byref(dx), ctypes.byref(dy)) == 0 and dx.value > 0:
                        return int(dx.value)
            except Exception:
                pass
        if self._get_dpi_for_system is not None:
            try:
                dpi = int(self._get_dpi_for_system())
                if dpi > 0:
                    return dpi
            except Exception:
                pass
        return 96

    def get_toplevel_hwnd(self, tk_win: tk.Misc) -> int:
        if not self.enabled:
            return 0
        wid = tk_win.winfo_id()
        # GA_ROOT = 2
        root_hwnd = self.user32.GetAncestor(wid, 2)
        return int(root_hwnd or self.user32.GetParent(wid) or wid)

    def apply_tool_window(self, hwnd: int, noactivate: bool = True) -> None:
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
        new_style = (style | WS_EX_TOOLWINDOW) & ~WS_EX_APPWINDOW
        if noactivate:
            new_style |= WS_EX_NOACTIVATE
        else:
            new_style &= ~WS_EX_NOACTIVATE
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
# Canvas M3 Drawing Primitives
# ---------------------------------------------------------------------------

def _draw_pill_shape(
    canvas: tk.Canvas,
    x0: float,
    y0: float,
    x1: float,
    y1: float,
    *,
    fill: str,
    outline: str = "",
    tag: str = "shape",
) -> None:
    w = max(0.0, x1 - x0)
    h = max(0.0, y1 - y0)
    if w <= 0 or h <= 0:
        return
    if w <= h:
        canvas.create_oval(x0, y0, x1, y1, fill=fill, outline=outline, width=1 if outline else 0, tags=tag)
        return
    r = h / 2.0
    canvas.create_oval(x0, y0, x0 + h, y1, fill=fill, outline=outline, width=1 if outline else 0, tags=tag)
    canvas.create_oval(x1 - h, y0, x1, y1, fill=fill, outline=outline, width=1 if outline else 0, tags=tag)
    canvas.create_rectangle(x0 + r, y0, x1 - r, y1, fill=fill, outline="", tags=tag)
    if outline:
        canvas.create_line(x0 + r, y0, x1 - r, y0, fill=outline, width=1, tags=tag)
        canvas.create_line(x0 + r, y1, x1 - r, y1, fill=outline, width=1, tags=tag)


def _draw_m3_linear_progress(
    canvas: tk.Canvas,
    width: int,
    height: int,
    pct: float | None,
    track_color: str,
    fill_color: str,
) -> None:
    canvas.delete("all")
    _draw_pill_shape(canvas, 0, 0, width, height, fill=track_color, tag="track")
    if pct is None:
        return
    clamped = max(0.0, min(100.0, float(pct)))
    if clamped <= 0:
        return
    fill_w = max(float(height), round(width * (clamped / 100.0), 1))
    fill_w = min(float(width), fill_w)
    _draw_pill_shape(canvas, 0, 0, fill_w, height, fill=fill_color, tag="fill")


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
        register_runtime: bool = True,
        mutex_handle: object | None = None,
        parent_pid: int | None = None,
    ) -> None:
        self.host = host
        self.port = port
        self.demo = demo
        self.register_runtime = register_runtime
        self.mutex_handle = mutex_handle
        self.parent_pid = parent_pid if (parent_pid and parent_pid > 0) else None
        self.started_at = time.time()
        self.win32 = Win32Helper()
        self.cfg = load_hud_config()
        if initial_convo_id:
            self.cfg["pinned_convo_id"] = initial_convo_id
        self.last_reset_nonce = int(self.cfg.get("reset_nonce", 0) or 0)
        self.last_cfg_mtime_ns = self._stat_config_mtime_ns()

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
        self.menu_win: tk.Toplevel | None = None
        self.dragging: bool = False
        self.drag_start_pointer: tuple[int, int] = (0, 0)
        self.drag_start_pos: tuple[int, int] = (0, 0)
        self.hover_job: str | None = None
        self.hide_popover_job: str | None = None
        self.popover_pinned: bool = False
        self.pulse_phase: bool = False
        self.chip_hovered: bool = False
        self.menu_btn_hovered: bool = False
        self.close_btn_hovered: bool = False
        self.chip_text: str = "连接中…"
        self.chip_dot_color: str = DEFAULT_M3_PALETTES["dark"]["primary"]
        self.stop_event = threading.Event()
        self._cleaned_up = False

        self.root = tk.Tk()
        self.root.withdraw()
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.attributes("-alpha", 0.97)
        self.root.protocol("WM_DELETE_WINDOW", self.quit)

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

        initial_dpi = self.win32.get_window_dpi(self.last_ag_hwnd)
        self.ui_scale: float = max(0.75, initial_dpi / 96.0)
        self._init_fonts()

        self._build_ui()
        self._build_popover()
        self._apply_theme()

        self.root.update_idletasks()
        self.hud_hwnd = self.win32.get_toplevel_hwnd(self.root)
        self.win32.apply_tool_window(self.hud_hwnd, noactivate=True)
        self.win32.apply_dwm_style(self.hud_hwnd, self._pal()["outline_variant"])
        self._sync_scale_for_hwnd(self.last_ag_hwnd or self.hud_hwnd)

        if self.register_runtime:
            write_pid_file(os.getpid(), self.hud_hwnd, self.host, self.port, self.started_at)
            atexit.register(self._cleanup_runtime)

        self._start_poller()
        self.root.after(80, self._tick_track_window)
        self.root.after(200, self._tick_refresh_ui)
        self.root.after(650, self._tick_pulse)

    def _dp(self, val: float, minimum: int = 1) -> int:
        return max(minimum, int(round(val * self.ui_scale)))

    def _fpx(self, dp_val: float) -> int:
        return -max(9, int(round(dp_val * self.ui_scale)))

    def _init_fonts(self) -> None:
        self._font_specs: list[tuple[tkfont.Font, float]] = []

        def make_font(family: str, dp_val: float, weight: str = "normal") -> tkfont.Font:
            f = tkfont.Font(root=self.root, family=family, size=self._fpx(dp_val), weight=weight)
            self._font_specs.append((f, dp_val))
            return f

        self.font_chip = make_font("Microsoft YaHei UI", 11.5, "bold")
        self.font_caption = make_font("Microsoft YaHei UI", 10.5, "normal")
        self.font_value = make_font("Segoe UI", 11.5, "bold")
        self.font_ctx = make_font("Microsoft YaHei UI", 10.5, "bold")
        self.font_pop_title = make_font("Microsoft YaHei UI", 12.5, "bold")
        self.font_pop_badge = make_font("Microsoft YaHei UI", 10.5, "bold")
        self.font_pop_key = make_font("Microsoft YaHei UI", 10.5, "normal")
        self.font_pop_val = make_font("Segoe UI", 10.5, "bold")
        self.font_menu = make_font("Microsoft YaHei UI", 11.5, "normal")
        self.font_menu_bold = make_font("Microsoft YaHei UI", 11.5, "bold")
        self.font_menu_sub = make_font("Segoe UI", 10.5, "normal")

    def _sync_scale_for_hwnd(self, hwnd: int) -> bool:
        dpi = self.win32.get_window_dpi(hwnd)
        target_scale = max(0.75, dpi / 96.0)
        if abs(target_scale - self.ui_scale) <= 0.01:
            return False
        self.ui_scale = target_scale
        self._apply_scale()
        return True

    def _apply_scale(self) -> None:
        for f, dp_val in self._font_specs:
            f.configure(size=self._fpx(dp_val))

        self.inner.configure(padx=self._dp(9), pady=self._dp(4))
        self.chip_canvas.configure(height=self._dp(22))
        for sep in self.seps:
            sep.configure(height=self._dp(13))
            sep.pack_configure(padx=self._dp(7), pady=self._dp(3))
        for cap, _val in self.metric_labels:
            cap.pack_configure(padx=(0, self._dp(3)))
        self.lbl_tok.pack_configure(padx=(0, self._dp(5)))
        self.lbl_ctx_pct.pack_configure(padx=(0, self._dp(5)))
        self.ctx_bar.configure(width=self._dp(46), height=self._dp(5))
        self.btn_menu.configure(width=self._dp(22), height=self._dp(22))
        self.btn_menu.pack_configure(padx=(0, self._dp(2)))
        self.btn_close.configure(width=self._dp(22), height=self._dp(22))

        self.pop_inner.configure(padx=self._dp(12), pady=self._dp(10))
        self.pop_title.configure(wraplength=self._dp(310))
        self.pop_badge_row.pack_configure(pady=(self._dp(4), self._dp(7)))
        self.pop_badge.configure(padx=self._dp(7), pady=self._dp(2))
        self.pop_sep.pack_configure(pady=(0, self._dp(7)))
        for row in self.pop_row_frames:
            row.pack_configure(pady=self._dp(2))
        self.pop_ctx_bar.configure(width=self._dp(300), height=self._dp(5))
        self.pop_ctx_bar.pack_configure(pady=(self._dp(7), 0))

        self._render_session_chip()
        self._render_icon_buttons()
        self._refresh_ui_now()

    def _pal(self) -> dict[str, str]:
        return resolve_palette(self.cfg)

    def _stat_config_mtime_ns(self) -> int | None:
        try:
            return os.stat(_config_path()).st_mtime_ns
        except OSError:
            return None

    def _cleanup_runtime(self) -> None:
        if self._cleaned_up:
            return
        self._cleaned_up = True
        if self.register_runtime:
            remove_pid_file(os.getpid())
        release_single_instance_mutex(self.mutex_handle)
        self.mutex_handle = None

    # -- UI Construction -----------------------------------------------------

    def _build_ui(self) -> None:
        self.outer = tk.Frame(self.root, bd=0, highlightthickness=1)
        self.outer.pack(fill="both", expand=True)

        self.inner = tk.Frame(self.outer, bd=0, padx=self._dp(9), pady=self._dp(4))
        self.inner.pack(fill="both", expand=True)

        # Left M3 Tonal Session Chip
        self.chip_canvas = tk.Canvas(
            self.inner,
            width=self._dp(96),
            height=self._dp(22),
            highlightthickness=0,
            bd=0,
            cursor="hand2",
        )
        self.chip_canvas.pack(side="left")

        self.seps: list[tk.Frame] = []
        self.metric_labels: list[tuple[tk.Label, tk.Label]] = []

        def add_sep() -> None:
            sep = tk.Frame(self.inner, width=1, height=self._dp(13), bd=0)
            sep.pack(side="left", padx=self._dp(7), fill="y", pady=self._dp(3))
            self.seps.append(sep)

        def add_metric(caption: str, init_val: str) -> tk.Label:
            box = tk.Frame(self.inner, bd=0)
            box.pack(side="left")
            cap = tk.Label(box, text=caption, font=self.font_caption)
            cap.pack(side="left", padx=(0, self._dp(3)))
            val = tk.Label(box, text=init_val, font=self.font_value)
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
        self.lbl_tok = tk.Label(self.ctx_box, text="--", font=self.font_value)
        self.lbl_tok.pack(side="left", padx=(0, self._dp(5)))
        self.lbl_ctx_pct = tk.Label(self.ctx_box, text="上下文 --", font=self.font_ctx)
        self.lbl_ctx_pct.pack(side="left", padx=(0, self._dp(5)))

        self.ctx_bar = tk.Canvas(self.ctx_box, width=self._dp(46), height=self._dp(5), highlightthickness=0, bd=0)
        self.ctx_bar.pack(side="left", pady=1)

        add_sep()

        # Right M3 Circular Icon Buttons (Menu + Close)
        btn_s = self._dp(22)
        self.btn_menu = tk.Canvas(self.inner, width=btn_s, height=btn_s, highlightthickness=0, bd=0, cursor="hand2")
        self.btn_menu.pack(side="left", padx=(0, self._dp(2)))

        self.btn_close = tk.Canvas(self.inner, width=btn_s, height=btn_s, highlightthickness=0, bd=0, cursor="hand2")
        self.btn_close.pack(side="left")

        # Bindings
        self.chip_canvas.bind("<Button-1>", self._on_menu_click)
        self.chip_canvas.bind("<Button-3>", self._on_menu_click)
        self.chip_canvas.bind("<Enter>", lambda _e: self._set_chip_hover(True))
        self.chip_canvas.bind("<Leave>", lambda _e: self._set_chip_hover(False))

        self.btn_menu.bind("<Button-1>", self._on_menu_click)
        self.btn_menu.bind("<Button-3>", self._on_menu_click)
        self.btn_menu.bind("<Enter>", lambda _e: self._set_icon_hover("menu", True))
        self.btn_menu.bind("<Leave>", lambda _e: self._set_icon_hover("menu", False))

        self.btn_close.bind("<Button-1>", lambda _e: self.quit())
        self.btn_close.bind("<Enter>", lambda _e: self._set_icon_hover("close", True))
        self.btn_close.bind("<Leave>", lambda _e: self._set_icon_hover("close", False))

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

    def _build_popover(self) -> None:
        self.pop = tk.Toplevel(self.root)
        self.pop.withdraw()
        self.pop.overrideredirect(True)
        self.pop.attributes("-topmost", True)
        self.pop.attributes("-alpha", 0.98)

        self.pop_outer = tk.Frame(self.pop, bd=0, highlightthickness=1)
        self.pop_outer.pack(fill="both", expand=True)
        self.pop_inner = tk.Frame(self.pop_outer, bd=0, padx=self._dp(12), pady=self._dp(10))
        self.pop_inner.pack(fill="both", expand=True)

        self.pop_title = tk.Label(
            self.pop_inner,
            text="",
            font=self.font_pop_title,
            anchor="w",
            justify="left",
            wraplength=self._dp(310),
        )
        self.pop_title.pack(fill="x")

        self.pop_badge_row = tk.Frame(self.pop_inner, bd=0)
        self.pop_badge_row.pack(fill="x", pady=(self._dp(4), self._dp(7)))
        self.pop_badge = tk.Label(
            self.pop_badge_row,
            text="",
            font=self.font_pop_badge,
            padx=self._dp(7),
            pady=self._dp(2),
            anchor="w",
        )
        self.pop_badge.pack(side="left")

        self.pop_sep = tk.Frame(self.pop_inner, height=1, bd=0)
        self.pop_sep.pack(fill="x", pady=(0, self._dp(7)))

        self.pop_row_frames: list[tk.Frame] = []
        self.pop_rows: list[tuple[tk.Label, tk.Label]] = []
        for label_text in ("缓存命中", "生成速度", "首字延迟", "轮数 / 步数", "Token 构成", "原生上下文"):
            row = tk.Frame(self.pop_inner, bd=0)
            row.pack(fill="x", pady=self._dp(2))
            kl = tk.Label(row, text=label_text, font=self.font_pop_key, width=11, anchor="w")
            kl.pack(side="left")
            vl = tk.Label(row, text="--", font=self.font_pop_val, anchor="e")
            vl.pack(side="right")
            self.pop_row_frames.append(row)
            self.pop_rows.append((kl, vl))

        self.pop_ctx_bar = tk.Canvas(
            self.pop_inner,
            width=self._dp(300),
            height=self._dp(5),
            highlightthickness=0,
            bd=0,
        )
        self.pop_ctx_bar.pack(fill="x", pady=(self._dp(7), 0))

        self.pop.update_idletasks()
        pop_hwnd = self.win32.get_toplevel_hwnd(self.pop)
        self.win32.apply_tool_window(pop_hwnd, noactivate=True)
        self.win32.apply_dwm_style(pop_hwnd, self._pal()["outline_variant"])
        self.pop.bind("<Enter>", self._cancel_hide_popover)
        self.pop.bind("<Leave>", self._on_pill_leave)

    def _render_session_chip(self) -> None:
        p = self._pal()
        pill_h = self._dp(22)
        text_w = self.font_chip.measure(self.chip_text)
        pill_w = max(self._dp(76), min(self._dp(210), text_w + self._dp(26)))
        if int(self.chip_canvas.cget("width")) != pill_w or int(self.chip_canvas.cget("height")) != pill_h:
            self.chip_canvas.configure(width=pill_w, height=pill_h)

        fill = p["primary_container"] if self.chip_hovered else p["secondary_container"]
        fg = p["on_primary_container"] if self.chip_hovered else p["on_secondary_container"]

        self.chip_canvas.delete("all")
        _draw_pill_shape(self.chip_canvas, 0, 0, pill_w, pill_h, fill=fill, tag="chip_bg")
        dot_d = self._dp(7)
        dot_x0 = self._dp(7)
        dot_y0 = (pill_h - dot_d) / 2.0
        self.chip_dot_id = self.chip_canvas.create_oval(
            dot_x0, dot_y0, dot_x0 + dot_d, dot_y0 + dot_d, outline="", fill=self.chip_dot_color, tags="dot"
        )
        self.chip_canvas.create_text(
            self._dp(19),
            pill_h / 2.0,
            text=self.chip_text,
            fill=fg,
            font=self.font_chip,
            anchor="w",
            tags="label",
        )

    def _render_icon_buttons(self) -> None:
        p = self._pal()
        s = self._dp(22)
        pad = max(1, self._dp(1))
        cy = s / 2.0
        dot_r = max(1.0, round(1.2 * self.ui_scale, 1))

        # Menu icon button (⋯)
        self.btn_menu.delete("all")
        if self.menu_btn_hovered or self.menu_open:
            self.btn_menu.create_oval(pad, pad, s - pad, s - pad, fill=p["surface_container_highest"], outline="")
            fg_m = p["on_surface"]
        else:
            fg_m = p["on_surface_variant"]
        for cx in (s * 0.30, s * 0.50, s * 0.70):
            self.btn_menu.create_oval(cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r, fill=fg_m, outline="")

        # Close icon button (×)
        self.btn_close.delete("all")
        if self.close_btn_hovered:
            self.btn_close.create_oval(pad, pad, s - pad, s - pad, fill=p["error_container"], outline="")
            fg_c = p["on_error_container"]
        else:
            fg_c = p["on_surface_variant"]
        m = s * 0.34
        lw = max(1.4, round(1.6 * self.ui_scale, 1))
        self.btn_close.create_line(m, m, s - m, s - m, fill=fg_c, width=lw, capstyle="round")
        self.btn_close.create_line(s - m, m, m, s - m, fill=fg_c, width=lw, capstyle="round")

    def _set_chip_hover(self, entering: bool) -> None:
        self.chip_hovered = entering
        self._render_session_chip()

    def _set_icon_hover(self, kind: str, entering: bool) -> None:
        if kind == "menu":
            self.menu_btn_hovered = entering
        else:
            self.close_btn_hovered = entering
        self._render_icon_buttons()

    def _apply_theme(self) -> None:
        p = self._pal()
        bg = p["surface_container_high"]
        self.root.configure(bg=bg)
        self.outer.configure(bg=bg, highlightbackground=p["outline_variant"], highlightcolor=p["outline_variant"])
        self.inner.configure(bg=bg)
        self.chip_canvas.configure(bg=bg)
        for sep in self.seps:
            sep.configure(bg=p["outline_variant"])
        for cap, val in self.metric_labels:
            cap.master.configure(bg=bg)
            cap.configure(bg=bg, fg=p["on_surface_variant"])
            val.configure(bg=bg, fg=p["on_surface"])
        self.ctx_box.configure(bg=bg)
        self.lbl_tok.configure(bg=bg, fg=p["on_surface"])
        self.lbl_ctx_pct.configure(bg=bg, fg=p["primary"])
        self.ctx_bar.configure(bg=bg)
        self.btn_menu.configure(bg=bg)
        self.btn_close.configure(bg=bg)

        self._render_session_chip()
        self._render_icon_buttons()

        # Popover theme (Elevated surface_container_low)
        pop_bg = p["surface_container_low"]
        self.pop.configure(bg=pop_bg)
        self.pop_outer.configure(bg=pop_bg, highlightbackground=p["outline_variant"], highlightcolor=p["outline_variant"])
        self.pop_inner.configure(bg=pop_bg)
        self.pop_title.configure(bg=pop_bg, fg=p["on_surface"])
        self.pop_badge_row.configure(bg=pop_bg)
        self.pop_badge.configure(bg=p["secondary_container"], fg=p["on_secondary_container"])
        self.pop_sep.configure(bg=p["outline_variant"])
        for kl, vl in self.pop_rows:
            kl.master.configure(bg=pop_bg)
            kl.configure(bg=pop_bg, fg=p["on_surface_variant"])
            vl.configure(bg=pop_bg, fg=p["on_surface"])
        self.pop_ctx_bar.configure(bg=pop_bg)

        if self.hud_hwnd:
            self.win32.apply_dwm_style(self.hud_hwnd, p["outline_variant"])
        pop_hwnd = self.win32.get_toplevel_hwnd(self.pop)
        if pop_hwnd:
            self.win32.apply_dwm_style(pop_hwnd, p["outline_variant"])

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
        self._sync_scale_for_hwnd(self.hud_hwnd or self.last_ag_hwnd)
        cur_x = self.root.winfo_x()
        cur_y = self.root.winfo_y()
        hud_w = max(1, self.root.winfo_width())
        if self.last_ag_rect:
            l, t, r, _b = self.last_ag_rect
            ag_cx = (l + r) // 2
            self.cfg["dx"] = (cur_x + hud_w // 2) - ag_cx
            self.cfg["dy"] = cur_y - t
            save_hud_config(self.cfg)
            self.last_cfg_mtime_ns = self._stat_config_mtime_ns()

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
            self.win32.apply_tool_window(self.hud_hwnd, noactivate=True)
            self.is_visible = True

    def _hide_hud(self) -> None:
        if self.is_visible:
            self._close_m3_menu()
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
                self._sync_scale_for_hwnd(self.last_ag_hwnd)
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
                self._sync_scale_for_hwnd(self.hud_hwnd or self.last_ag_hwnd)
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
                self._sync_scale_for_hwnd(self.last_ag_hwnd or self.hud_hwnd)
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

        gap = self._dp(6)
        x = rx + (rw - pw) // 2
        y = ry + rh + gap
        wa = self.win32.get_work_area(self.last_ag_hwnd or self.hud_hwnd)
        if wa and y + ph > wa[3] - 4:
            y = ry - ph - gap
        x, y = self._clamp_to_screen(x, y, pw, ph)
        self.pop.geometry(f"+{x}+{y}")
        self.pop.deiconify()
        self.pop.attributes("-topmost", True)

    def _hide_popover(self) -> None:
        if self.pop.winfo_viewable():
            self.pop.withdraw()

    def _update_popover_content(self) -> None:
        p = self._pal()
        bar_w = max(self._dp(220), self.pop_ctx_bar.winfo_width() or self._dp(300))
        bar_h = self._dp(5)
        with self.data_lock:
            payload = self.latest_payload
        if not payload or not payload.get("active"):
            self.pop_title.configure(text="等待遥测数据…")
            self.pop_badge.configure(text=f"服务地址: http://{self.host}:{self.port}/")
            for _, vl in self.pop_rows:
                vl.configure(text="--")
            _draw_m3_linear_progress(
                self.pop_ctx_bar, bar_w, bar_h, None, p["surface_container_highest"], p["primary"]
            )
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
        self.pop_badge.configure(text=f"{a.get('model', '')} · {m_label} · {state_s}")

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

        fill_color = self._ctx_color(ctx_pct, p)
        _draw_m3_linear_progress(self.pop_ctx_bar, bar_w, bar_h, ctx_pct, p["surface_container_highest"], fill_color)

    # -- Custom M3 Surface Popup Menu ---------------------------------------

    def _close_m3_menu(self) -> None:
        if self.menu_win is not None:
            try:
                self.menu_win.destroy()
            except Exception:
                pass
            self.menu_win = None
        if self.menu_open:
            self.menu_open = False
            self._render_icon_buttons()

    def _on_menu_click(self, event: tk.Event) -> None:
        self._cancel_hover()
        self._hide_popover()
        if self.menu_open:
            self._close_m3_menu()
            return
        self._open_m3_menu(event.x_root, event.y_root)

    def _open_m3_menu(self, x_root: int, y_root: int) -> None:
        p = self._pal()
        menu = tk.Toplevel(self.root)
        menu.withdraw()
        menu.overrideredirect(True)
        menu.attributes("-topmost", True)
        menu.attributes("-alpha", 0.98)
        self.menu_win = menu
        self.menu_open = True
        self._render_icon_buttons()

        outer = tk.Frame(
            menu,
            bg=p["surface_container"],
            highlightbackground=p["outline_variant"],
            highlightcolor=p["outline_variant"],
            highlightthickness=1,
            bd=0,
        )
        outer.pack(fill="both", expand=True)

        inner = tk.Frame(outer, bg=p["surface_container"], padx=self._dp(5), pady=self._dp(5), bd=0)
        inner.pack(fill="both", expand=True)

        def add_divider() -> None:
            tk.Frame(inner, height=1, bg=p["outline_variant"], bd=0).pack(
                fill="x", padx=self._dp(4), pady=self._dp(4)
            )

        def add_section_label(text: str) -> None:
            tk.Label(
                inner,
                text=text,
                font=self.font_pop_key,
                bg=p["surface_container"],
                fg=p["on_surface_variant"],
                anchor="w",
                padx=self._dp(9),
                pady=self._dp(2),
            ).pack(fill="x")

        def add_item(
            label: str,
            command,
            *,
            selected: bool = False,
            danger: bool = False,
            trailing: str = "",
        ) -> None:
            base_bg = p["secondary_container"] if selected else p["surface_container"]
            base_fg = p["on_secondary_container"] if selected else p["on_surface"]
            hover_bg = p["error_container"] if danger else (p["primary_container"] if selected else p["surface_container_highest"])
            hover_fg = p["on_error_container"] if danger else (p["on_primary_container"] if selected else p["on_surface"])

            row = tk.Frame(inner, bg=base_bg, cursor="hand2", bd=0, padx=self._dp(9), pady=self._dp(4))
            row.pack(fill="x", pady=1)

            lbl = tk.Label(
                row,
                text=label,
                font=self.font_menu_bold if selected else self.font_menu,
                bg=base_bg,
                fg=base_fg,
                anchor="w",
            )
            lbl.pack(side="left", fill="x", expand=True)

            tr_lbl = None
            if trailing:
                tr_lbl = tk.Label(
                    row,
                    text=trailing,
                    font=self.font_menu_sub,
                    bg=base_bg,
                    fg=p["on_secondary_container"] if selected else p["on_surface_variant"],
                    anchor="e",
                    padx=self._dp(5),
                )
                tr_lbl.pack(side="right")

            def set_hover(entering: bool) -> None:
                bg_c = hover_bg if entering else base_bg
                fg_c = hover_fg if entering else base_fg
                row.configure(bg=bg_c)
                lbl.configure(bg=bg_c, fg=fg_c)
                if tr_lbl is not None:
                    tr_lbl.configure(bg=bg_c, fg=fg_c if entering else (p["on_secondary_container"] if selected else p["on_surface_variant"]))

            def on_click(_e: tk.Event) -> None:
                self._close_m3_menu()
                command()

            for w in (row, lbl) + ((tr_lbl,) if tr_lbl is not None else ()):
                w.bind("<Enter>", lambda _e: set_hover(True))
                w.bind("<Leave>", lambda _e: set_hover(False))
                w.bind("<Button-1>", on_click)

        with self.data_lock:
            payload = self.latest_payload

        pinned_id = self.cfg.get("pinned_convo_id")
        if pinned_id:
            add_item("取消锁定（自动跟随窗口）", lambda: self._set_pinned(None), trailing="↺")
        else:
            add_item("自动跟随当前窗口 / 最新会话", lambda: None, selected=True, trailing="✓")

        sessions = (payload or {}).get("sessions") or []
        if sessions:
            add_divider()
            add_section_label("切换 / 锁定会话")
            for s in sessions[:8]:
                cid = s.get("convo_id", "")
                is_pinned = cid == pinned_id
                prefix = "● " if s.get("is_running") else "○ "
                t_str = truncate_title(s.get("title", ""), 20)
                turns_s = fmt_turns(s.get("user_turns"), s.get("step_count"))
                hit_s = f"{float(s.get('cache_hit_rate_pct', 0)):.0f}%"
                add_item(
                    f"{prefix}{t_str}",
                    lambda c=cid: self._set_pinned(c),
                    selected=is_pinned,
                    trailing=f"{turns_s} · {hit_s}" + (" ✓" if is_pinned else ""),
                )

        add_divider()
        aot = bool(self.cfg.get("always_on_top"))
        add_item("始终置顶显示（切窗不隐藏）", self._toggle_always_on_top, selected=aot, trailing="✓" if aot else "")
        next_theme = "浅色主题" if self.cfg.get("theme") == "dark" else "深色主题"
        add_item(f"切换为{next_theme}", self._toggle_theme)
        add_item("固定详情卡片", self._toggle_popover_pinned, selected=self.popover_pinned, trailing="✓" if self.popover_pinned else "")
        add_item("重置悬浮位置", self._reset_position)

        add_divider()
        add_item("打开完整 Web 仪表盘", lambda: webbrowser.open(f"http://{self.host}:{self.port}/"))
        add_item("退出悬浮窗", self.quit, danger=True)

        menu.update_idletasks()
        mw = max(self._dp(230), menu.winfo_reqwidth())
        mh = menu.winfo_reqheight()
        mx, my = self._clamp_to_screen(x_root, y_root + self._dp(4), mw, mh)
        menu.geometry(f"{mw}x{mh}+{mx}+{my}")
        menu.deiconify()
        menu_hwnd = self.win32.get_toplevel_hwnd(menu)
        self.win32.apply_tool_window(menu_hwnd, noactivate=False)
        self.win32.apply_dwm_style(menu_hwnd, p["outline_variant"])
        menu.focus_force()
        menu.bind("<Escape>", lambda _e: self._close_m3_menu())
        menu.bind("<FocusOut>", lambda _e: self.root.after(60, self._close_menu_if_unfocused))

    def _close_menu_if_unfocused(self) -> None:
        if self.menu_win is None:
            return
        try:
            focus_w = self.root.focus_get()
            if focus_w is not None and focus_w.winfo_toplevel() == self.menu_win:
                return
        except Exception:
            pass
        self._close_m3_menu()

    def _set_pinned(self, convo_id: str | None) -> None:
        self.cfg["pinned_convo_id"] = convo_id
        save_hud_config(self.cfg)
        self.last_cfg_mtime_ns = self._stat_config_mtime_ns()
        threading.Thread(target=self._poll_once, daemon=True).start()

    def _toggle_always_on_top(self) -> None:
        self.cfg["always_on_top"] = not bool(self.cfg.get("always_on_top"))
        save_hud_config(self.cfg)
        self.last_cfg_mtime_ns = self._stat_config_mtime_ns()

    def _toggle_theme(self) -> None:
        self.cfg["theme"] = "light" if self.cfg.get("theme") == "dark" else "dark"
        save_hud_config(self.cfg)
        self.last_cfg_mtime_ns = self._stat_config_mtime_ns()
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
        self.last_cfg_mtime_ns = self._stat_config_mtime_ns()
        self._position_near_ag()

    # -- External Config Sync & Background Poller ----------------------------

    def _sync_external_config(self) -> None:
        mtime_ns = self._stat_config_mtime_ns()
        if mtime_ns is None or mtime_ns == self.last_cfg_mtime_ns:
            return
        self.last_cfg_mtime_ns = mtime_ns
        fresh = load_hud_config()

        stop_req = fresh.get("stop_requested_at")
        if isinstance(stop_req, (int, float)) and float(stop_req) > self.started_at:
            self.quit()
            return

        theme_changed = (
            fresh.get("theme") != self.cfg.get("theme")
            or fresh.get("palettes") != self.cfg.get("palettes")
        )
        pin_changed = fresh.get("pinned_convo_id") != self.cfg.get("pinned_convo_id")
        new_nonce = int(fresh.get("reset_nonce", 0) or 0)
        reset_pos = new_nonce != self.last_reset_nonce

        self.cfg = fresh
        if reset_pos:
            self.last_reset_nonce = new_nonce
            self._position_near_ag()
        if theme_changed:
            self._apply_theme()
        if pin_changed:
            threading.Thread(target=self._poll_once, daemon=True).start()

    def _start_ensure_server_once(self) -> None:
        if self.parent_pid is not None:
            return
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
        p = self._pal()
        active = (payload or {}).get("active") if payload else None
        if active and active.get("is_running"):
            self.chip_dot_color = p["primary"] if self.pulse_phase else p["tertiary"]
        elif active:
            self.chip_dot_color = p["primary"]
        else:
            self.chip_dot_color = p["outline"]
        self.chip_canvas.itemconfig(self.chip_dot_id, fill=self.chip_dot_color)
        self.root.after(650, self._tick_pulse)

    @staticmethod
    def _ctx_color(ctx_pct: float | None, p: dict[str, str]) -> str:
        if ctx_pct is None:
            return p["on_surface_variant"]
        cv = float(ctx_pct)
        if cv >= 80:
            return p["error"]
        if cv >= 60:
            return p["tertiary"]
        return p["primary"]

    def _refresh_ui_now(self) -> None:
        p = self._pal()
        bar_w = self._dp(46)
        bar_h = self._dp(5)
        with self.data_lock:
            payload = self.latest_payload
            err = self.last_error

        if not payload or not payload.get("active"):
            self.chip_text = "连接服务中…" if err else "等待会话"
            self._render_session_chip()
            self.val_hit.configure(text="--", fg=p["on_surface_variant"])
            self.val_tps.configure(text="--", fg=p["on_surface_variant"])
            self.val_ttft.configure(text="--", fg=p["on_surface_variant"])
            self.val_turns.configure(text="--", fg=p["on_surface_variant"])
            self.lbl_tok.configure(text="--", fg=p["on_surface"])
            self.lbl_ctx_pct.configure(text="上下文 --", fg=p["on_surface_variant"])
            _draw_m3_linear_progress(self.ctx_bar, bar_w, bar_h, None, p["surface_container_highest"], p["primary"])
            return

        a = payload["active"]
        pin_prefix = "📌 " if self.cfg.get("pinned_convo_id") else ""
        self.chip_text = pin_prefix + truncate_title(a.get("title", ""), 15)
        self._render_session_chip()

        hit = a.get("last_cache_hit_rate_pct")
        if hit is None:
            hit = a.get("cache_hit_rate_pct")
        if hit is not None:
            hv = float(hit)
            h_color = p["primary"] if hv >= 80 else (p["tertiary"] if hv >= 50 else p["error"])
            self.val_hit.configure(text=f"{hv:.1f}%", fg=h_color)
        else:
            self.val_hit.configure(text="--", fg=p["on_surface_variant"])

        tps = a.get("stream_tps") if a.get("stream_tps") is not None else a.get("e2e_tps")
        self.val_tps.configure(text=fmt_tps(tps), fg=p["primary"] if tps is not None else p["on_surface_variant"])

        ttft = a.get("ttft_sec")
        if ttft is not None:
            tv = float(ttft)
            t_color = p["primary"] if tv <= 2.0 else (p["on_surface"] if tv <= 5.0 else p["tertiary"])
            self.val_ttft.configure(text=fmt_ttft(tv), fg=t_color)
        else:
            self.val_ttft.configure(text="--", fg=p["on_surface_variant"])

        self.val_turns.configure(text=fmt_turns(a.get("user_turns"), a.get("step_count")), fg=p["on_surface"])
        self.lbl_tok.configure(text=fmt_tokens(a.get("total_tokens")), fg=p["on_surface"])

        ctx_pct = a.get("ctx_pct")
        if ctx_pct is not None:
            cv = max(0.0, min(100.0, float(ctx_pct)))
            c_color = self._ctx_color(cv, p)
            self.lbl_ctx_pct.configure(text=f"上下文 {cv:.1f}%", fg=c_color)
            _draw_m3_linear_progress(self.ctx_bar, bar_w, bar_h, cv, p["surface_container_highest"], c_color)
        else:
            self.lbl_ctx_pct.configure(text="上下文 --", fg=p["on_surface_variant"])
            _draw_m3_linear_progress(self.ctx_bar, bar_w, bar_h, None, p["surface_container_highest"], p["primary"])

        if self.pop.winfo_viewable():
            self._update_popover_content()
        if self.is_visible and not self.dragging:
            self._position_near_ag()

    def _tick_refresh_ui(self) -> None:
        if self.stop_event.is_set():
            return
        if self.parent_pid is not None and not _is_pid_alive(self.parent_pid):
            self.quit()
            return
        try:
            self._sync_external_config()
            if not self.stop_event.is_set():
                self._refresh_ui_now()
        except Exception:
            pass
        if not self.stop_event.is_set():
            self.root.after(400, self._tick_refresh_ui)

    def quit(self) -> None:
        self.stop_event.set()
        self._close_m3_menu()
        self._cleanup_runtime()
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
    # Verify Tk + Win32 bindings can construct and tear down the M3 overlay cleanly
    hud = TelemetryHUD(
        args.host,
        args.port,
        demo=args.demo,
        initial_convo_id=args.convo_id,
        register_runtime=False,
    )
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
    parser.add_argument("--parent-pid", type=int, default=None, help="Exit automatically when parent sidecar PID exits")
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

    app = TelemetryHUD(
        args.host,
        args.port,
        demo=args.demo,
        initial_convo_id=args.convo_id,
        register_runtime=True,
        mutex_handle=mutex,
        parent_pid=args.parent_pid,
    )
    app.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
