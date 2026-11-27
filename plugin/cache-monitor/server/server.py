"""
Antigravity Usage & Performance Telemetry Web Server
Serves the local interactive dashboard and live analytics JSON API.
Zero external dependencies — runs on Python 3.8+ standard library.
"""

from __future__ import annotations

import argparse
import ast
import ctypes
import json
import mimetypes
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
import urllib.parse
from ctypes import wintypes
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import collector  # noqa: E402
import system_theme  # noqa: E402

VERSION = "1.2.0"
DASHBOARD_HTML = os.path.join(BASE_DIR, "web_dashboard.html")
HUD_SCRIPT = os.path.join(BASE_DIR, "hud_overlay.py")
HUD_LINUX_SCRIPT = os.path.join(BASE_DIR, "hud_linux.py")
HUD_MUTEX_NAME = "Local\\AntigravityTelemetryHUDMutex"
GNOME_EXT_UUID = "antigravity-telemetry-hud@duppjuzo"
_LINUX_HUD_PYTHON_CACHE: str | None = None
ASSETS_DIR = os.path.realpath(os.path.join(BASE_DIR, "assets"))
ASSET_MIME_TYPES = {
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
}
DEMO_MODE = False
IS_SIDECAR = False
PRIMARY_HOST = "127.0.0.1"
PRIMARY_PORT = 8765
SECONDARY_PORT = 0
_HUD_CFG_LOCK = threading.Lock()
_HEX_COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")
_M3_PALETTE_KEYS = (
    "surface_container_low",
    "surface_container",
    "surface_container_high",
    "surface_container_highest",
    "on_surface",
    "on_surface_variant",
    "outline",
    "outline_variant",
    "primary",
    "on_primary",
    "primary_container",
    "on_primary_container",
    "secondary_container",
    "on_secondary_container",
    "tertiary",
    "tertiary_container",
    "on_tertiary_container",
    "error",
    "error_container",
    "on_error_container",
)


def _hud_runtime_dir() -> str:
    preferred = os.path.join(collector.get_gemini_home(), "antigravity")
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


def _hud_config_path() -> str:
    preferred = os.path.join(collector.get_gemini_home(), "antigravity", "telemetry_hud_config.json")
    if os.path.exists(preferred):
        return preferred
    return os.path.join(_hud_runtime_dir(), "telemetry_hud_config.json")


def _hud_pid_path() -> str:
    preferred = os.path.join(collector.get_gemini_home(), "antigravity", "telemetry_hud.pid.json")
    if os.path.exists(preferred):
        return preferred
    return os.path.join(_hud_runtime_dir(), "telemetry_hud.pid.json")


def _load_hud_config() -> dict:
    defaults: dict = {
        "dx": 0,
        "dy": 40,
        "theme": "dark",
        "always_on_top": False,
        "pinned_convo_id": None,
    }
    path = _hud_config_path()
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


def _save_hud_config(cfg: dict) -> bool:
    targets = [
        os.path.join(collector.get_gemini_home(), "antigravity", "telemetry_hud_config.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud_config.json"),
    ]
    for path in targets:
        tmp = f"{path}.{os.getpid()}.{threading.get_ident()}.tmp"
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(cfg, f, indent=2, ensure_ascii=False)
            os.replace(tmp, path)
            return True
        except OSError:
            try:
                if os.path.exists(tmp):
                    os.remove(tmp)
            except OSError:
                pass
    return False


def _read_hud_pid_info() -> dict | None:
    path = _hud_pid_path()
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else None
    except Exception:
        return None


def _remove_hud_pid_info() -> None:
    for path in (
        os.path.join(collector.get_gemini_home(), "antigravity", "telemetry_hud.pid.json"),
        os.path.join(tempfile.gettempdir(), "antigravity-telemetry", "telemetry_hud.pid.json"),
    ):
        try:
            if os.path.exists(path):
                os.remove(path)
        except OSError:
            pass


def _resolve_linux_hud_python() -> str | None:
    global _LINUX_HUD_PYTHON_CACHE
    if _LINUX_HUD_PYTHON_CACHE and os.path.exists(_LINUX_HUD_PYTHON_CACHE):
        return _LINUX_HUD_PYTHON_CACHE
    candidates = []
    for candidate in (
        sys.executable,
        shutil.which("python3"),
        "/usr/bin/python3",
        "/usr/local/bin/python3",
    ):
        if candidate and candidate not in candidates:
            candidates.append(candidate)
    for py in candidates:
        try:
            proc = subprocess.run(
                [py, "-c", "import gi; gi.require_version('Gtk', '4.0'); from gi.repository import Gtk"],
                capture_output=True,
                timeout=3,
            )
            if proc.returncode == 0:
                _LINUX_HUD_PYTHON_CACHE = py
                return py
        except Exception:
            continue
    return None


def _active_hud_script() -> str:
    return HUD_SCRIPT if os.name == "nt" else HUD_LINUX_SCRIPT


def _hud_platform_name() -> str:
    if os.name == "nt":
        return "windows"
    if sys.platform.startswith("linux"):
        return "linux"
    if sys.platform == "darwin":
        return "macos"
    return sys.platform


def is_hud_supported() -> tuple[bool, str]:
    if os.name == "nt":
        if not os.path.isfile(HUD_SCRIPT):
            return False, "hud_overlay.py missing"
        return True, ""
    if sys.platform.startswith("linux"):
        if not os.path.isfile(HUD_LINUX_SCRIPT):
            return False, "hud_linux.py missing"
        if not (os.environ.get("DISPLAY") or os.environ.get("WAYLAND_DISPLAY")):
            return False, "No graphical display (DISPLAY/WAYLAND_DISPLAY unset)"
        if _resolve_linux_hud_python() is None:
            return False, "PyGObject (Gtk 4.0) not installed"
        return True, ""
    return False, "Windows or Linux desktop only"


def _is_hud_mutex_alive() -> bool:
    if os.name != "nt":
        return False
    try:
        kernel32 = ctypes.windll.kernel32
        SYNCHRONIZE = 0x00100000
        kernel32.OpenMutexW.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.LPCWSTR]
        kernel32.OpenMutexW.restype = wintypes.HANDLE
        kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
        kernel32.CloseHandle.restype = wintypes.BOOL
        handle = kernel32.OpenMutexW(SYNCHRONIZE, False, HUD_MUTEX_NAME)
        if handle:
            kernel32.CloseHandle(handle)
            return True
    except Exception:
        pass
    return False


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
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    except OSError:
        return False
    return False


def _resolve_background_python() -> str:
    if os.name == "nt":
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
        pyw = os.path.join(exe_dir, "pythonw.exe")
        if os.path.exists(pyw):
            return pyw
    elif sys.platform.startswith("linux"):
        py_gtk = _resolve_linux_hud_python()
        if py_gtk:
            return py_gtk
    return sys.executable


def _health_host(host: str) -> str:
    return "127.0.0.1" if host in ("0.0.0.0", "::", "") else host


def get_hud_status() -> dict:
    supported, reason = is_hud_supported()
    with _HUD_CFG_LOCK:
        cfg = _load_hud_config()

    pid_info = _read_hud_pid_info() if supported else None
    pid = pid_info.get("pid") if isinstance(pid_info, dict) and isinstance(pid_info.get("pid"), int) else None
    mutex_alive = _is_hud_mutex_alive() if supported else False
    pid_alive = _is_pid_alive(pid) if (supported and pid) else False
    running = bool(supported and (mutex_alive or pid_alive))
    if not running and pid_info is not None:
        _remove_hud_pid_info()
        pid = None

    palettes = cfg.get("palettes")
    has_monet_palette = isinstance(palettes, dict) and (
        isinstance(palettes.get("dark"), dict) or isinstance(palettes.get("light"), dict)
    )
    is_win = os.name == "nt"
    return {
        "supported": supported,
        "reason": reason,
        "platform": _hud_platform_name(),
        "capabilities": {
            "always_on_top": is_win,
            "reset_position": is_win,
        },
        "running": running,
        "pid": pid if running else None,
        "always_on_top": bool(cfg.get("always_on_top", False)),
        "theme": cfg.get("theme", "dark"),
        "has_monet_palette": has_monet_palette,
    }


def start_hud_process() -> tuple[bool, dict]:
    supported, reason = is_hud_supported()
    if not supported:
        status = get_hud_status()
        status["error"] = reason or "HUD is not supported on this platform"
        return False, status

    current = get_hud_status()
    if current["running"]:
        current["status"] = "already_running"
        return True, current

    with _HUD_CFG_LOCK:
        cfg = _load_hud_config()
        if "stop_requested_at" in cfg:
            cfg.pop("stop_requested_at", None)
            _save_hud_config(cfg)

    py_exe = _resolve_background_python()
    hud_script = _active_hud_script()
    hud_host = _health_host(PRIMARY_HOST)
    hud_port = SECONDARY_PORT if SECONDARY_PORT > 0 else PRIMARY_PORT
    cmd = [py_exe, hud_script, "--host", hud_host, "--port", str(hud_port)]
    if IS_SIDECAR:
        cmd.extend(["--parent-pid", str(os.getpid())])
    if DEMO_MODE:
        cmd.append("--demo")

    env = os.environ.copy()
    env["GEMINI_HOME"] = collector.get_gemini_home()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUNBUFFERED"] = "1"

    popen_kwargs: dict = {
        "cwd": BASE_DIR,
        "env": env,
        "stdin": subprocess.DEVNULL,
        "stdout": subprocess.DEVNULL,
        "stderr": subprocess.DEVNULL,
        "close_fds": True,
    }
    if os.name == "nt":
        flags = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
        if not IS_SIDECAR:
            flags |= getattr(subprocess, "DETACHED_PROCESS", 0x00000008)
        popen_kwargs["creationflags"] = flags
    elif not IS_SIDECAR:
        popen_kwargs["start_new_session"] = True

    proc = subprocess.Popen(cmd, **popen_kwargs)
    deadline = time.monotonic() + 2.5
    while time.monotonic() < deadline:
        if os.name == "nt" and _is_hud_mutex_alive():
            status = get_hud_status()
            status["status"] = "started"
            return True, status
        if os.name != "nt":
            pid_info = _read_hud_pid_info()
            if isinstance(pid_info, dict) and pid_info.get("pid") == proc.pid and _is_pid_alive(proc.pid):
                status = get_hud_status()
                status["status"] = "started"
                return True, status
        if proc.poll() is not None:
            break
        time.sleep(0.08)

    if proc.poll() is None and _is_pid_alive(proc.pid):
        status = get_hud_status()
        status["running"] = True
        status["pid"] = proc.pid
        status["status"] = "started"
        return True, status

    status = get_hud_status()
    status["error"] = "Failed to start floating HUD process"
    return False, status


def stop_hud_process() -> tuple[bool, dict]:
    supported, reason = is_hud_supported()
    if not supported:
        status = get_hud_status()
        status["error"] = reason or "HUD is not supported on this platform"
        return False, status

    with _HUD_CFG_LOCK:
        cfg = _load_hud_config()
        cfg["stop_requested_at"] = time.time()
        _save_hud_config(cfg)

    pid_info = _read_hud_pid_info()
    pid = pid_info.get("pid") if isinstance(pid_info, dict) and isinstance(pid_info.get("pid"), int) else None
    hwnd = pid_info.get("hwnd") if isinstance(pid_info, dict) and isinstance(pid_info.get("hwnd"), int) else None

    if os.name == "nt" and hwnd:
        try:
            WM_CLOSE = 0x0010
            ctypes.windll.user32.PostMessageW(wintypes.HWND(hwnd), WM_CLOSE, 0, 0)
        except Exception:
            pass
    elif os.name != "nt" and pid and _is_pid_alive(pid):
        try:
            os.kill(int(pid), signal.SIGTERM)
        except OSError:
            pass

    deadline = time.monotonic() + 1.2
    while time.monotonic() < deadline:
        if not _is_hud_mutex_alive() and not _is_pid_alive(pid):
            break
        time.sleep(0.06)

    if os.name == "nt" and pid and _is_pid_alive(pid):
        terminated = False
        try:
            kernel32 = ctypes.windll.kernel32
            PROCESS_TERMINATE = 0x0001
            handle = kernel32.OpenProcess(PROCESS_TERMINATE, False, int(pid))
            if handle:
                try:
                    terminated = bool(kernel32.TerminateProcess(handle, 0))
                finally:
                    kernel32.CloseHandle(handle)
        except Exception:
            terminated = False
        if not terminated:
            try:
                subprocess.run(
                    ["taskkill", "/PID", str(pid), "/F"],
                    capture_output=True,
                    timeout=3,
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000),
                )
            except Exception:
                pass
        time.sleep(0.15)
    elif os.name != "nt" and pid and _is_pid_alive(pid):
        try:
            os.kill(int(pid), signal.SIGKILL)
        except OSError:
            pass
        time.sleep(0.1)

    if not _is_hud_mutex_alive() and not _is_pid_alive(pid):
        _remove_hud_pid_info()

    status = get_hud_status()
    status["status"] = "stopped" if not status["running"] else "stop_pending"
    return not status["running"], status


def _gnome_ext_source_dir() -> str | None:
    candidates = [
        os.path.realpath(os.path.join(BASE_DIR, "..", "gnome-extension", GNOME_EXT_UUID)),
        os.path.realpath(os.path.join(BASE_DIR, "..", "..", "..", "gnome-extension", GNOME_EXT_UUID)),
    ]
    for path in candidates:
        if os.path.isfile(os.path.join(path, "metadata.json")) and os.path.isfile(os.path.join(path, "extension.js")):
            return path
    return None


def _gnome_ext_install_dir() -> str:
    return os.path.join(os.path.expanduser("~"), ".local", "share", "gnome-shell", "extensions", GNOME_EXT_UUID)


def _read_gsettings_enabled_extensions() -> list[str] | None:
    if not shutil.which("gsettings"):
        return None
    try:
        proc = subprocess.run(
            ["gsettings", "get", "org.gnome.shell", "enabled-extensions"],
            capture_output=True,
            text=True,
            timeout=3,
        )
        if proc.returncode != 0:
            return None
        parsed = ast.literal_eval(proc.stdout.strip())
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
    except Exception:
        pass
    return None


def _write_gsettings_enabled_extensions(exts: list[str]) -> bool:
    if not shutil.which("gsettings"):
        return False
    try:
        proc = subprocess.run(
            ["gsettings", "set", "org.gnome.shell", "enabled-extensions", str(exts)],
            capture_output=True,
            text=True,
            timeout=3,
        )
        return proc.returncode == 0
    except Exception:
        return False


def _query_gnome_shell_ext_info() -> tuple[bool, str]:
    if not shutil.which("gnome-extensions"):
        return False, ""
    try:
        proc = subprocess.run(
            ["gnome-extensions", "info", GNOME_EXT_UUID],
            capture_output=True,
            text=True,
            timeout=3,
        )
        if proc.returncode != 0:
            return False, ""
        state = ""
        for line in proc.stdout.splitlines():
            stripped = line.strip()
            if stripped.startswith("State:") or stripped.startswith("状态：") or stripped.startswith("状态:"):
                state = stripped.split(":", 1)[-1].split("：", 1)[-1].strip()
                break
        return True, state
    except Exception:
        return False, ""


def get_gnome_extension_status() -> dict:
    is_linux = sys.platform.startswith("linux")
    desktop = (os.environ.get("XDG_CURRENT_DESKTOP") or "").upper()
    has_gnome_cli = bool(shutil.which("gnome-shell") or shutil.which("gnome-extensions"))
    is_gnome = is_linux and ("GNOME" in desktop or has_gnome_cli)
    is_wayland = (os.environ.get("XDG_SESSION_TYPE") or "").lower() == "wayland" or bool(
        os.environ.get("WAYLAND_DISPLAY")
    )
    src_dir = _gnome_ext_source_dir()
    install_dir = _gnome_ext_install_dir()
    installed = os.path.isfile(os.path.join(install_dir, "metadata.json"))

    shell_ver = ""
    if is_gnome and shutil.which("gnome-shell"):
        try:
            proc = subprocess.run(["gnome-shell", "--version"], capture_output=True, text=True, timeout=2)
            if proc.returncode == 0:
                shell_ver = proc.stdout.strip()
        except Exception:
            pass

    gsettings_exts = _read_gsettings_enabled_extensions() if is_gnome else None
    enabled_in_gsettings = bool(gsettings_exts is not None and GNOME_EXT_UUID in gsettings_exts)
    loaded_in_shell, shell_state = _query_gnome_shell_ext_info() if is_gnome else (False, "")
    enabled = enabled_in_gsettings or shell_state.upper() in ("ACTIVE", "ENABLED", "INITIALIZED", "已启用", "活跃")

    supported = bool(is_gnome and (src_dir is not None or installed))
    reason = ""
    if not is_linux:
        reason = "仅支持 Linux GNOME 桌面"
    elif not is_gnome:
        reason = "未检测到 GNOME Shell 桌面环境"
    elif src_dir is None and not installed:
        reason = "未找到 GNOME 扩展源文件"

    needs_relogin = bool(supported and installed and is_wayland and not loaded_in_shell)
    return {
        "supported": supported,
        "reason": reason,
        "is_gnome": is_gnome,
        "is_wayland": is_wayland,
        "gnome_shell_version": shell_ver,
        "uuid": GNOME_EXT_UUID,
        "installed": installed,
        "enabled": bool(installed and enabled),
        "loaded_in_shell": loaded_in_shell,
        "shell_state": shell_state,
        "needs_relogin": needs_relogin,
        "install_path": install_dir,
        "source_available": src_dir is not None,
    }


def control_gnome_extension(action: str) -> tuple[bool, dict]:
    status = get_gnome_extension_status()
    if not status["supported"]:
        status["error"] = status.get("reason") or "GNOME extension is not supported on this platform"
        return False, status

    install_dir = _gnome_ext_install_dir()
    src_dir = _gnome_ext_source_dir()

    if action == "install":
        if not src_dir:
            status["error"] = "GNOME extension source directory not found"
            return False, status
        try:
            os.makedirs(os.path.dirname(install_dir), exist_ok=True)
            if os.path.islink(install_dir):
                os.unlink(install_dir)
            elif os.path.exists(install_dir):
                shutil.rmtree(install_dir)
            shutil.copytree(src_dir, install_dir)
        except OSError as exc:
            status["error"] = f"Failed to copy GNOME extension: {exc}"
            return False, status

        exts = _read_gsettings_enabled_extensions()
        if exts is not None and GNOME_EXT_UUID not in exts:
            exts.append(GNOME_EXT_UUID)
            _write_gsettings_enabled_extensions(exts)
        if shutil.which("gnome-extensions"):
            subprocess.run(["gnome-extensions", "enable", GNOME_EXT_UUID], capture_output=True, timeout=3)
        return True, get_gnome_extension_status()

    if action == "uninstall":
        if shutil.which("gnome-extensions"):
            subprocess.run(["gnome-extensions", "disable", GNOME_EXT_UUID], capture_output=True, timeout=3)
        exts = _read_gsettings_enabled_extensions()
        if exts is not None and GNOME_EXT_UUID in exts:
            exts = [x for x in exts if x != GNOME_EXT_UUID]
            _write_gsettings_enabled_extensions(exts)
        try:
            if os.path.islink(install_dir):
                os.unlink(install_dir)
            elif os.path.exists(install_dir):
                shutil.rmtree(install_dir)
        except OSError as exc:
            status = get_gnome_extension_status()
            status["error"] = f"Failed to remove GNOME extension: {exc}"
            return False, status
        return True, get_gnome_extension_status()

    if action in ("enable", "disable"):
        if not status["installed"]:
            status["error"] = "GNOME extension is not installed yet"
            return False, status
        exts = _read_gsettings_enabled_extensions()
        if exts is not None:
            if action == "enable" and GNOME_EXT_UUID not in exts:
                exts.append(GNOME_EXT_UUID)
                _write_gsettings_enabled_extensions(exts)
            elif action == "disable" and GNOME_EXT_UUID in exts:
                exts = [x for x in exts if x != GNOME_EXT_UUID]
                _write_gsettings_enabled_extensions(exts)
        if shutil.which("gnome-extensions"):
            subprocess.run(["gnome-extensions", action, GNOME_EXT_UUID], capture_output=True, timeout=3)
        return True, get_gnome_extension_status()

    status["error"] = f"Unsupported action: {action}"
    return False, status


def _sanitize_palette(raw: object) -> dict[str, str]:
    if not isinstance(raw, dict):
        return {}
    clean: dict[str, str] = {}
    for key in _M3_PALETTE_KEYS:
        val = raw.get(key)
        if isinstance(val, str) and _HEX_COLOR_RE.match(val.strip()):
            clean[key] = val.strip().lower()
    return clean


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
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self._safe_write(body)

    def _send_html(self, status: int, html_bytes: bytes):
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(html_bytes)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self._safe_write(html_bytes)

    def _send_asset(self, rel_path: str):
        decoded = urllib.parse.unquote(rel_path)
        if not decoded or "\x00" in decoded or decoded.startswith(("/", "\\")):
            self._send_json(403, {"error": "Forbidden"})
            return

        parts = [p for p in decoded.replace("\\", "/").split("/") if p]
        if not parts or any(p in (".", "..") for p in parts):
            self._send_json(403, {"error": "Forbidden"})
            return

        candidate = os.path.realpath(os.path.join(ASSETS_DIR, *parts))
        try:
            common = os.path.commonpath([ASSETS_DIR, candidate])
        except ValueError:
            self._send_json(403, {"error": "Forbidden"})
            return

        if common != ASSETS_DIR or candidate == ASSETS_DIR:
            self._send_json(403, {"error": "Forbidden"})
            return

        if not os.path.isfile(candidate):
            self._send_json(404, {"error": "Asset not found"})
            return

        _, ext = os.path.splitext(candidate)
        mime_type = (
            ASSET_MIME_TYPES.get(ext.lower())
            or mimetypes.guess_type(candidate)[0]
            or "application/octet-stream"
        )
        try:
            with open(candidate, "rb") as f:
                body = f.read()
        except OSError:
            self._send_json(404, {"error": "Asset not found"})
            return

        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self._safe_write(body)

    def _read_json_body(self, max_bytes: int = 262144) -> dict | None:
        raw_len = self.headers.get("Content-Length")
        if raw_len is None:
            return {}
        try:
            length = int(raw_len)
        except ValueError:
            return None
        if length < 0 or length > max_bytes:
            return None
        if length == 0:
            return {}
        raw = self.rfile.read(length)
        try:
            parsed = json.loads(raw.decode("utf-8", errors="replace"))
        except Exception:
            return None
        return parsed if isinstance(parsed, dict) else None

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, *")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_json_body()
        if body is None:
            self._send_json(400, {"error": "Invalid JSON request body"})
            return

        if path == "/api/hud/control":
            if "enabled" not in body or not isinstance(body.get("enabled"), bool):
                self._send_json(400, {"error": "Missing boolean field 'enabled'"})
                return
            enabled = body["enabled"]
            if enabled:
                ok, payload = start_hud_process()
            else:
                ok, payload = stop_hud_process()
            self._send_json(200 if ok else 400 if not payload.get("supported", True) else 500, payload)
            return

        if path == "/api/gnome-extension/control":
            action = body.get("action")
            if action not in ("install", "uninstall", "enable", "disable"):
                self._send_json(400, {"error": "Invalid 'action'; expected install|uninstall|enable|disable"})
                return
            ok, payload = control_gnome_extension(action)
            self._send_json(200 if ok else 400 if not payload.get("supported", True) else 500, payload)
            return

        if path == "/api/hud/config":
            with _HUD_CFG_LOCK:
                cfg = _load_hud_config()
                if "always_on_top" in body:
                    cfg["always_on_top"] = bool(body["always_on_top"])
                if body.get("reset_position"):
                    cfg["dx"] = 0
                    cfg["dy"] = 40
                    cfg["reset_nonce"] = int(cfg.get("reset_nonce", 0) or 0) + 1
                if body.get("theme") in ("dark", "light"):
                    cfg["theme"] = body["theme"]
                if "pinned_convo_id" in body:
                    pinned = body.get("pinned_convo_id")
                    cfg["pinned_convo_id"] = str(pinned).strip() if pinned else None
                _save_hud_config(cfg)
            self._send_json(200, get_hud_status())
            return

        if path == "/api/hud/theme":
            theme_mode = body.get("theme")
            raw_palettes = body.get("palettes")
            clean_palettes: dict[str, dict[str, str]] = {}
            if isinstance(raw_palettes, dict):
                for mode in ("dark", "light"):
                    cleaned = _sanitize_palette(raw_palettes.get(mode))
                    if cleaned:
                        clean_palettes[mode] = cleaned

            with _HUD_CFG_LOCK:
                cfg = _load_hud_config()
                if theme_mode in ("dark", "light"):
                    cfg["theme"] = theme_mode
                if clean_palettes:
                    existing = cfg.get("palettes")
                    merged = dict(existing) if isinstance(existing, dict) else {}
                    merged.update(clean_palettes)
                    cfg["palettes"] = merged
                meta = {}
                for k in ("variant", "spec_version", "seed_hex"):
                    v = body.get(k)
                    if isinstance(v, str) and v.strip():
                        meta[k] = v.strip()
                if meta:
                    cfg["monet_meta"] = meta
                _save_hud_config(cfg)

            self._send_json(200, {"ok": True})
            return

        self._send_json(404, {"error": "Not found"})

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

        if path == "/api/hud/status":
            self._send_json(200, get_hud_status())
            return

        if path == "/api/gnome-extension/status":
            self._send_json(200, get_gnome_extension_status())
            return

        if path == "/api/theme/system":
            qs = urllib.parse.parse_qs(parsed.query)
            raw_dark = qs.get("dark", [None])[0]
            if raw_dark in ("1", "true", "yes"):
                prefer_dark: bool | None = True
            elif raw_dark in ("0", "false", "no"):
                prefer_dark = False
            else:
                prefer_dark = None
            force = qs.get("force", ["0"])[0] in ("1", "true", "yes")
            try:
                self._send_json(200, system_theme.get_system_theme_info(prefer_dark=prefer_dark, force=force))
            except Exception as exc:
                self._send_json(500, {"error": str(exc)})
            return

        if path == "/api/theme/wallpaper":
            qs = urllib.parse.parse_qs(parsed.query)
            monitor_id = (qs.get("monitor", [""])[0] or "").strip()
            wp_path, mime_type = system_theme.resolve_wallpaper_file(monitor_id)
            if not wp_path or not mime_type:
                self._send_json(404, {"error": "Wallpaper not found"})
                return
            try:
                with open(wp_path, "rb") as f:
                    body = f.read()
            except OSError:
                self._send_json(404, {"error": "Wallpaper not found"})
                return
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self._safe_write(body)
            return

        if path == "/api/hud":
            qs = urllib.parse.parse_qs(parsed.query)
            raw_convo = (qs.get("convo_id", [None])[0] or "").strip()
            convo_id = None if (not raw_convo or raw_convo == "auto") else raw_convo
            window_title = (qs.get("window_title", [""])[0] or "").strip()
            force = qs.get("force", ["0"])[0] in ("1", "true", "yes")
            demo_req = qs.get("demo", ["0"])[0] in ("1", "true", "yes")
            try:
                data = collector.get_hud_snapshot(
                    convo_id=convo_id,
                    window_title=window_title,
                    force=force,
                    demo=(DEMO_MODE or demo_req),
                )
                data["generated_at"] = datetime.now().strftime("%H:%M:%S")
                data["version"] = VERSION
                self._send_json(200, data)
            except Exception as exc:
                self._send_json(500, {"error": str(exc)})
            return

        if path == "/api/stats":
            qs = urllib.parse.parse_qs(parsed.query)
            range_name = qs.get("range", ["all"])[0]
            force = qs.get("force", ["0"])[0] in ("1", "true", "yes")
            demo_req = qs.get("demo", ["0"])[0] in ("1", "true", "yes")
            start_param = qs.get("start", [None])[0]
            end_param = qs.get("end", [None])[0]
            raw_convo = (qs.get("convo_id", [None])[0] or "").strip()
            convo_id = None if (not raw_convo or raw_convo == "auto") else raw_convo
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
                    convo_id=convo_id,
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

        if path.startswith("/assets/"):
            self._send_asset(path[len("/assets/"):])
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
    parser.add_argument(
        "--watch-stdin",
        action="store_true",
        help="Exit cleanly when stdin reaches EOF (used by sidecar parent process)",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None):
    global DEMO_MODE, IS_SIDECAR, PRIMARY_HOST, PRIMARY_PORT, SECONDARY_PORT

    args = parse_args(argv)
    if args.gemini_home:
        os.environ["GEMINI_HOME"] = os.path.abspath(os.path.expanduser(args.gemini_home))
    if args.cache_file:
        os.environ["ANTIGRAVITY_CACHE_FILE"] = os.path.abspath(os.path.expanduser(args.cache_file))
    DEMO_MODE = bool(args.demo)

    host = args.host
    port = args.port
    is_sidecar = bool(os.environ.get("ANTIGRAVITY_SIDECAR_WEB_PORT", "").strip())
    IS_SIDECAR = is_sidecar

    try:
        server = ReusableThreadingHTTPServer((host, port), TelemetryHandler)
    except OSError as exc:
        if is_sidecar:
            sys.stderr.write(f"Failed to bind required sidecar port {host}:{port}: {exc}\n")
            raise SystemExit(1) from exc
        raise SystemExit(f"Failed to bind {host}:{port}: {exc}") from exc

    PRIMARY_HOST = host
    PRIMARY_PORT = server.server_address[1]
    SECONDARY_PORT = 0

    secondary_server = None
    if args.secondary_port and args.secondary_port != PRIMARY_PORT:
        try:
            secondary_server = ReusableThreadingHTTPServer((host, args.secondary_port), TelemetryHandler)
            SECONDARY_PORT = secondary_server.server_address[1]
            threading.Thread(target=secondary_server.serve_forever, daemon=True).start()
        except OSError:
            secondary_server = None
            SECONDARY_PORT = 0

    shutdown_lock = threading.Lock()
    shutdown_started = False

    def _trigger_shutdown(stop_hud: bool = False):
        nonlocal shutdown_started
        with shutdown_lock:
            if shutdown_started:
                return
            shutdown_started = True
        if stop_hud and IS_SIDECAR:
            try:
                if get_hud_status().get("running"):
                    stop_hud_process()
            except Exception:
                pass
        threading.Thread(target=server.shutdown, daemon=True).start()
        if secondary_server is not None:
            threading.Thread(target=secondary_server.shutdown, daemon=True).start()

    def _handle_shutdown(signum, _frame):
        _trigger_shutdown(stop_hud=True)

    for sig_name in ("SIGTERM", "SIGINT", "SIGHUP"):
        sig = getattr(signal, sig_name, None)
        if sig is not None:
            try:
                signal.signal(sig, _handle_shutdown)
            except (ValueError, OSError):
                pass

    if args.watch_stdin:
        def _watch_stdin_eof():
            stream = getattr(sys.stdin, "buffer", sys.stdin)
            try:
                while stream is not None:
                    chunk = stream.read(1)
                    if not chunk:
                        break
            except Exception:
                pass
            _trigger_shutdown(stop_hud=True)
            time.sleep(2.0)
            os._exit(0)

        threading.Thread(target=_watch_stdin_eof, daemon=True).start()

    msg = f"Antigravity Telemetry Dashboard v{VERSION} running at http://{PRIMARY_HOST}:{PRIMARY_PORT}"
    if secondary_server is not None:
        msg += f" (and http://{PRIMARY_HOST}:{args.secondary_port})"
    print(msg, flush=True)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        if IS_SIDECAR:
            try:
                if get_hud_status().get("running"):
                    stop_hud_process()
            except Exception:
                pass
        server.server_close()
        if secondary_server is not None:
            secondary_server.server_close()


if __name__ == "__main__":
    main()
