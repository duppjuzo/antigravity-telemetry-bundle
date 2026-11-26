"""
Cross-platform OS accent color and multi-monitor wallpaper discovery.
Zero external dependencies — uses Python 3.8+ standard library only.

Supported platforms:
- Windows: DWM / Explorer registry accent color + COM IDesktopWallpaper (multi-monitor,
  solid background, TranscodedWallpaper fallback, Span crop, active Antigravity window monitor)
- Linux: XDG Desktop Portal v2 / KDE kdeglobals / GNOME gsettings accent color +
  GNOME / KDE Plasma multi-screen wallpaper parsing (graceful fallback elsewhere)
"""

from __future__ import annotations

import hashlib
import os
import re
import subprocess
import sys
import threading
import time
import urllib.parse
import xml.etree.ElementTree as ET

_LOCK = threading.Lock()
_CACHE_TTL_SEC = 1.5
_CACHE: dict[str, object] = {
    "ts": 0.0,
    "prefer_dark": None,
    "payload": None,
}
_WALLPAPER_ALLOWLIST: dict[str, str] = {}
_MAX_WALLPAPER_BYTES = 40 * 1024 * 1024

_GNOME_ACCENT_HEX = {
    "blue": "#3584E4",
    "teal": "#2190A4",
    "green": "#3A944A",
    "yellow": "#C88800",
    "orange": "#ED5B00",
    "red": "#E62D42",
    "pink": "#D56199",
    "purple": "#9141AC",
    "slate": "#6F8396",
}

_YARU_ACCENT_HEX = {
    "bark": "#787859",
    "sage": "#657B69",
    "olive": "#4B8501",
    "viridian": "#03875B",
    "prussiangreen": "#308280",
    "blue": "#0073E5",
    "purple": "#7764D8",
    "magenta": "#B34CB3",
    "red": "#DA3450",
    "wartybrown": "#B39169",
}

_EXT_MIME_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".bmp": "image/bmp",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
}

_IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".avif")


def _rgb_to_hex(r: int, g: int, b: int) -> str:
    r_c = max(0, min(255, int(r)))
    g_c = max(0, min(255, int(g)))
    b_c = max(0, min(255, int(b)))
    return f"#{r_c:02X}{g_c:02X}{b_c:02X}"


def _parse_rgb_triplet(text: str) -> str | None:
    parts = [p.strip() for p in text.split(",")]
    if len(parts) < 3:
        return None
    try:
        r, g, b = int(parts[0]), int(parts[1]), int(parts[2])
    except ValueError:
        return None
    if 0 <= r <= 255 and 0 <= g <= 255 and 0 <= b <= 255:
        return _rgb_to_hex(r, g, b)
    return None


def _normalize_hex_str(raw: str) -> str | None:
    s = raw.strip().strip("'\"")
    if not s:
        return None
    if s.startswith("rgb(") and s.endswith(")"):
        return _parse_rgb_triplet(s[4:-1])
    if s.startswith("#"):
        body = s[1:]
        if len(body) == 3 and all(c in "0123456789abcdefABCDEF" for c in body):
            return "#" + "".join(c * 2 for c in body.upper())
        if len(body) >= 6 and all(c in "0123456789abcdefABCDEF" for c in body[:6]):
            return "#" + body[:6].upper()
    return None


def _file_signature(path: str | None, extra: str = "") -> str:
    h = hashlib.sha1()
    if path:
        h.update(path.encode("utf-8", errors="replace"))
        try:
            st = os.stat(path)
            h.update(f"|{st.st_size}|{st.st_mtime_ns}".encode("ascii"))
        except OSError:
            h.update(b"|missing")
    if extra:
        h.update(f"|{extra}".encode("utf-8", errors="replace"))
    return h.hexdigest()[:16]


def _sniff_image_mime(path: str) -> str | None:
    try:
        with open(path, "rb") as f:
            head = f.read(32)
    except OSError:
        return None
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if head.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if head.startswith(b"BM"):
        return "image/bmp"
    if len(head) >= 12 and head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "image/webp"
    if head.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if len(head) >= 16 and head[4:8] == b"ftyp" and head[8:12] in (b"avif", b"avis"):
        return "image/avif"
    _, ext = os.path.splitext(path)
    return _EXT_MIME_TYPES.get(ext.lower())


def _run_cmd(cmd: list[str], timeout: float = 1.5) -> str | None:
    try:
        res = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
        )
        if res.returncode == 0:
            return (res.stdout or "").strip()
    except Exception:
        pass
    return None


def _decode_file_uri(raw: str) -> str:
    s = raw.strip().strip("'\"")
    if not s:
        return ""
    if s.startswith("file://"):
        parsed = urllib.parse.urlparse(s)
        p = urllib.parse.unquote(parsed.path or "")
        if os.name == "nt" and len(p) >= 3 and p[0] == "/" and p[2] == ":":
            p = p[1:]
        return p
    return os.path.expanduser(s)


# ---------------------------------------------------------------------------
# Windows implementation (Registry + COM IDesktopWallpaper + Win32 monitors)
# ---------------------------------------------------------------------------

def _get_windows_accent() -> dict:
    try:
        import winreg  # type: ignore
    except ImportError:
        return {"supported": False, "hex": None, "source": None, "reason": "winreg 模块不可用"}

    # 1. DWM AccentColor (DWORD: 0xAABBGGRR)
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\DWM") as key:
            val, _ = winreg.QueryValueEx(key, "AccentColor")
            if isinstance(val, int):
                r = val & 0xFF
                g = (val >> 8) & 0xFF
                b = (val >> 16) & 0xFF
                return {"supported": True, "hex": _rgb_to_hex(r, g, b), "source": "windows-dwm", "reason": ""}
    except OSError:
        pass

    # 2. Explorer AccentColorMenu (DWORD: 0xAABBGGRR)
    try:
        with winreg.OpenKey(
            winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Explorer\Accent"
        ) as key:
            try:
                val, _ = winreg.QueryValueEx(key, "AccentColorMenu")
                if isinstance(val, int):
                    r = val & 0xFF
                    g = (val >> 8) & 0xFF
                    b = (val >> 16) & 0xFF
                    return {
                        "supported": True,
                        "hex": _rgb_to_hex(r, g, b),
                        "source": "windows-explorer",
                        "reason": "",
                    }
            except OSError:
                pass
            try:
                palette, _ = winreg.QueryValueEx(key, "AccentPalette")
                if isinstance(palette, (bytes, bytearray)) and len(palette) >= 15:
                    # AccentPalette stores 8 x 4-byte RGBA swatches; index 3 (offset 12) is base accent.
                    return {
                        "supported": True,
                        "hex": _rgb_to_hex(palette[12], palette[13], palette[14]),
                        "source": "windows-explorer",
                        "reason": "",
                    }
            except OSError:
                pass
    except OSError:
        pass

    # 3. DWM ColorizationColor (DWORD: 0xAARRGGBB)
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\DWM") as key:
            val, _ = winreg.QueryValueEx(key, "ColorizationColor")
            if isinstance(val, int):
                r = (val >> 16) & 0xFF
                g = (val >> 8) & 0xFF
                b = val & 0xFF
                return {"supported": True, "hex": _rgb_to_hex(r, g, b), "source": "windows-dwm", "reason": ""}
    except OSError:
        pass

    return {"supported": False, "hex": None, "source": None, "reason": "未在 Windows 注册表中找到系统主题色"}


def _win_extract_monitor_model(device_id: str) -> str:
    # Example: \\?\DISPLAY#BOE0D5E#5&3a31c0a&0&UID4354#{...}
    if not device_id:
        return ""
    parts = device_id.split("#")
    if len(parts) >= 2 and parts[1]:
        return parts[1].strip()
    return ""


def _win_physical_monitors_and_active() -> tuple[list[dict], tuple[int, int, int, int] | None]:
    """
    Enumerates physical monitor rects via EnumDisplayMonitors + EnumDisplaySettingsW
    so rects match IDesktopWallpaper::GetMonitorRECT regardless of process DPI awareness,
    and locates the Antigravity window's physical monitor rect.
    """
    import ctypes
    from ctypes import wintypes

    user32 = ctypes.windll.user32
    kernel32 = ctypes.windll.kernel32

    class MONITORINFOEXW(ctypes.Structure):
        _fields_ = [
            ("cbSize", wintypes.DWORD),
            ("rcMonitor", wintypes.RECT),
            ("rcWork", wintypes.RECT),
            ("dwFlags", wintypes.DWORD),
            ("szDevice", wintypes.WCHAR * 32),
        ]

    class DEVMODEW(ctypes.Structure):
        _fields_ = [
            ("dmDeviceName", wintypes.WCHAR * 32),
            ("dmSpecVersion", wintypes.WORD),
            ("dmDriverVersion", wintypes.WORD),
            ("dmSize", wintypes.WORD),
            ("dmDriverExtra", wintypes.WORD),
            ("dmFields", wintypes.DWORD),
            ("dmPositionX", ctypes.c_long),
            ("dmPositionY", ctypes.c_long),
            ("dmDisplayOrientation", wintypes.DWORD),
            ("dmDisplayFixedOutput", wintypes.DWORD),
            ("dmColor", ctypes.c_short),
            ("dmDuplex", ctypes.c_short),
            ("dmYResolution", ctypes.c_short),
            ("dmTTOption", ctypes.c_short),
            ("dmCollate", ctypes.c_short),
            ("dmFormName", wintypes.WCHAR * 32),
            ("dmLogPixels", wintypes.WORD),
            ("dmBitsPerPel", wintypes.DWORD),
            ("dmPelsWidth", wintypes.DWORD),
            ("dmPelsHeight", wintypes.DWORD),
            ("dmDisplayFlags", wintypes.DWORD),
            ("dmDisplayFrequency", wintypes.DWORD),
            ("dmICMMethod", wintypes.DWORD),
            ("dmICMIntent", wintypes.DWORD),
            ("dmMediaType", wintypes.DWORD),
            ("dmDitherType", wintypes.DWORD),
            ("dmReserved1", wintypes.DWORD),
            ("dmReserved2", wintypes.DWORD),
            ("dmPanningWidth", wintypes.DWORD),
            ("dmPanningHeight", wintypes.DWORD),
        ]

    user32.GetMonitorInfoW.argtypes = [wintypes.HMONITOR, ctypes.POINTER(MONITORINFOEXW)]
    user32.GetMonitorInfoW.restype = wintypes.BOOL
    user32.EnumDisplaySettingsW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, ctypes.POINTER(DEVMODEW)]
    user32.EnumDisplaySettingsW.restype = wintypes.BOOL

    MONITORENUMPROC = ctypes.WINFUNCTYPE(
        wintypes.BOOL, wintypes.HMONITOR, wintypes.HDC, ctypes.POINTER(wintypes.RECT), wintypes.LPARAM
    )
    user32.EnumDisplayMonitors.argtypes = [wintypes.HDC, ctypes.POINTER(wintypes.RECT), MONITORENUMPROC, wintypes.LPARAM]
    user32.EnumDisplayMonitors.restype = wintypes.BOOL

    ENUM_CURRENT_SETTINGS = 0xFFFFFFFF
    MONITORINFOF_PRIMARY = 0x1
    monitors_by_hmon: dict[int, dict] = {}
    monitors_list: list[dict] = []

    def _on_monitor(hmon, _hdc, _lprc, _lparam):
        info = MONITORINFOEXW()
        info.cbSize = ctypes.sizeof(MONITORINFOEXW)
        if not user32.GetMonitorInfoW(hmon, ctypes.byref(info)):
            return True

        dm = DEVMODEW()
        dm.dmSize = ctypes.sizeof(DEVMODEW)
        if user32.EnumDisplaySettingsW(info.szDevice, ENUM_CURRENT_SETTINGS, ctypes.byref(dm)) and dm.dmPelsWidth > 0:
            left = int(dm.dmPositionX)
            top = int(dm.dmPositionY)
            right = left + int(dm.dmPelsWidth)
            bottom = top + int(dm.dmPelsHeight)
        else:
            left = int(info.rcMonitor.left)
            top = int(info.rcMonitor.top)
            right = int(info.rcMonitor.right)
            bottom = int(info.rcMonitor.bottom)

        entry = {
            "hmon": int(hmon),
            "device": info.szDevice,
            "is_primary": bool(info.dwFlags & MONITORINFOF_PRIMARY),
            "rect": (left, top, right, bottom),
        }
        monitors_by_hmon[int(hmon)] = entry
        monitors_list.append(entry)
        return True

    try:
        user32.EnumDisplayMonitors(None, None, MONITORENUMPROC(_on_monitor), 0)
    except Exception:
        pass

    # Locate active Antigravity window -> HMONITOR
    active_rect: tuple[int, int, int, int] | None = None
    try:
        PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
        MONITOR_DEFAULTTONEAREST = 2

        user32.GetForegroundWindow.restype = wintypes.HWND
        user32.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
        user32.GetWindowThreadProcessId.restype = wintypes.DWORD
        user32.IsWindowVisible.argtypes = [wintypes.HWND]
        user32.IsWindowVisible.restype = wintypes.BOOL
        user32.IsIconic.argtypes = [wintypes.HWND]
        user32.IsIconic.restype = wintypes.BOOL
        user32.MonitorFromWindow.argtypes = [wintypes.HWND, wintypes.DWORD]
        user32.MonitorFromWindow.restype = wintypes.HMONITOR

        kernel32.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        kernel32.OpenProcess.restype = wintypes.HANDLE
        kernel32.QueryFullProcessImageNameW.argtypes = [
            wintypes.HANDLE,
            wintypes.DWORD,
            wintypes.LPWSTR,
            ctypes.POINTER(wintypes.DWORD),
        ]
        kernel32.QueryFullProcessImageNameW.restype = wintypes.BOOL
        kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
        kernel32.CloseHandle.restype = wintypes.BOOL

        def _exe_name_for_hwnd(hwnd: int) -> str:
            if not hwnd:
                return ""
            pid = wintypes.DWORD(0)
            user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
            if not pid.value:
                return ""
            handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid.value)
            if not handle:
                return ""
            try:
                buf = ctypes.create_unicode_buffer(512)
                size = wintypes.DWORD(len(buf))
                if kernel32.QueryFullProcessImageNameW(handle, 0, buf, ctypes.byref(size)):
                    return os.path.basename(buf.value).lower()
            finally:
                kernel32.CloseHandle(handle)
            return ""

        target_hwnd: int | None = None
        fg = user32.GetForegroundWindow()
        if fg and _exe_name_for_hwnd(fg) == "antigravity.exe":
            target_hwnd = int(fg)

        if target_hwnd is None:
            WNDENUMPROC = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
            user32.EnumWindows.argtypes = [WNDENUMPROC, wintypes.LPARAM]
            user32.EnumWindows.restype = wintypes.BOOL
            found: list[int] = []

            def _on_win(hwnd, _lp):
                if user32.IsWindowVisible(hwnd) and not user32.IsIconic(hwnd):
                    if _exe_name_for_hwnd(hwnd) == "antigravity.exe":
                        found.append(int(hwnd))
                        return False
                return True

            user32.EnumWindows(WNDENUMPROC(_on_win), 0)
            if found:
                target_hwnd = found[0]

        if target_hwnd:
            hmon = int(user32.MonitorFromWindow(target_hwnd, MONITOR_DEFAULTTONEAREST) or 0)
            if hmon in monitors_by_hmon:
                active_rect = monitors_by_hmon[hmon]["rect"]
    except Exception:
        pass

    return monitors_list, active_rect


def _win_fallback_wallpaper_file(width: int = 0, height: int = 0) -> str | None:
    appdata = os.environ.get("APPDATA", "")
    themes_dir = os.path.join(appdata, "Microsoft", "Windows", "Themes") if appdata else ""
    if themes_dir:
        if width > 0 and height > 0:
            cached_dir = os.path.join(themes_dir, "CachedFiles")
            if os.path.isdir(cached_dir):
                prefix = f"CachedImage_{width}_{height}_"
                try:
                    for name in os.listdir(cached_dir):
                        if name.startswith(prefix):
                            candidate = os.path.join(cached_dir, name)
                            if os.path.isfile(candidate):
                                return candidate
                except OSError:
                    pass
        transcoded = os.path.join(themes_dir, "TranscodedWallpaper")
        if os.path.isfile(transcoded):
            return transcoded
    return None


def _get_windows_wallpapers() -> tuple[dict, dict[str, str]]:
    import ctypes
    from ctypes import wintypes

    pos_map = {
        0: "center",
        1: "tile",
        2: "stretch",
        3: "fit",
        4: "fill",
        5: "span",
    }

    phys_monitors, active_rect = _win_physical_monitors_and_active()
    primary_rects = {m["rect"] for m in phys_monitors if m["is_primary"]}

    class GUID(ctypes.Structure):
        _fields_ = [
            ("Data1", wintypes.DWORD),
            ("Data2", wintypes.WORD),
            ("Data3", wintypes.WORD),
            ("Data4", ctypes.c_ubyte * 8),
        ]

    CLSID_DesktopWallpaper = GUID(
        0xC2CF3110, 0x460E, 0x4FC1, (ctypes.c_ubyte * 8)(0xB9, 0xD0, 0x8A, 0x1C, 0x0C, 0x9C, 0xC4, 0xBD)
    )
    IID_IDesktopWallpaper = GUID(
        0xB92B56A9, 0x8B55, 0x4E14, (ctypes.c_ubyte * 8)(0x9A, 0x89, 0x01, 0x99, 0xBB, 0xB6, 0xF9, 0x3B)
    )

    ole32 = ctypes.windll.ole32
    ole32.CoInitializeEx.argtypes = [wintypes.LPVOID, wintypes.DWORD]
    ole32.CoInitializeEx.restype = ctypes.c_long
    ole32.CoCreateInstance.argtypes = [
        ctypes.POINTER(GUID),
        wintypes.LPVOID,
        wintypes.DWORD,
        ctypes.POINTER(GUID),
        ctypes.POINTER(ctypes.c_void_p),
    ]
    ole32.CoCreateInstance.restype = ctypes.c_long
    ole32.CoTaskMemFree.argtypes = [wintypes.LPVOID]

    CLSCTX_LOCAL_SERVER = 0x4
    COINIT_APARTMENTTHREADED = 0x2
    hr_init = ole32.CoInitializeEx(None, COINIT_APARTMENTTHREADED)
    need_uninit = hr_init in (0, 1)  # S_OK or S_FALSE; RPC_E_CHANGED_MODE must not CoUninitialize

    allowlist: dict[str, str] = {}
    monitors: list[dict] = []
    position_str = "unknown"
    solid_bg_hex: str | None = None
    ptr = ctypes.c_void_p()

    try:
        hr = ole32.CoCreateInstance(
            ctypes.byref(CLSID_DesktopWallpaper),
            None,
            CLSCTX_LOCAL_SERVER,
            ctypes.byref(IID_IDesktopWallpaper),
            ctypes.byref(ptr),
        )
        if hr >= 0 and ptr.value:
            vtable = ctypes.cast(
                ctypes.cast(ptr, ctypes.POINTER(ctypes.c_void_p)).contents,
                ctypes.POINTER(ctypes.c_void_p),
            )
            Release = ctypes.WINFUNCTYPE(wintypes.ULONG, ctypes.c_void_p)(vtable[2])
            GetWallpaper = ctypes.WINFUNCTYPE(
                ctypes.c_long, ctypes.c_void_p, wintypes.LPCWSTR, ctypes.POINTER(wintypes.LPWSTR)
            )(vtable[4])
            GetPathAt = ctypes.WINFUNCTYPE(
                ctypes.c_long, ctypes.c_void_p, wintypes.UINT, ctypes.POINTER(wintypes.LPWSTR)
            )(vtable[5])
            GetCount = ctypes.WINFUNCTYPE(
                ctypes.c_long, ctypes.c_void_p, ctypes.POINTER(wintypes.UINT)
            )(vtable[6])
            GetRECT = ctypes.WINFUNCTYPE(
                ctypes.c_long, ctypes.c_void_p, wintypes.LPCWSTR, ctypes.POINTER(wintypes.RECT)
            )(vtable[7])
            GetBgColor = ctypes.WINFUNCTYPE(
                ctypes.c_long, ctypes.c_void_p, ctypes.POINTER(wintypes.DWORD)
            )(vtable[9])
            GetPosition = ctypes.WINFUNCTYPE(
                ctypes.c_long, ctypes.c_void_p, ctypes.POINTER(ctypes.c_int)
            )(vtable[11])

            try:
                pos_val = ctypes.c_int(4)
                if GetPosition(ptr, ctypes.byref(pos_val)) >= 0:
                    position_str = pos_map.get(pos_val.value, "unknown")

                bg_val = wintypes.DWORD(0)
                if GetBgColor(ptr, ctypes.byref(bg_val)) >= 0:
                    # COLORREF is 0x00BBGGRR
                    c = bg_val.value
                    solid_bg_hex = _rgb_to_hex(c & 0xFF, (c >> 8) & 0xFF, (c >> 16) & 0xFF)

                default_wp_ptr = wintypes.LPWSTR()
                default_wp = ""
                if GetWallpaper(ptr, None, ctypes.byref(default_wp_ptr)) >= 0:
                    if default_wp_ptr.value is not None:
                        default_wp = default_wp_ptr.value.strip()
                        ole32.CoTaskMemFree(default_wp_ptr)

                cnt = wintypes.UINT(0)
                if GetCount(ptr, ctypes.byref(cnt)) >= 0:
                    for i in range(cnt.value):
                        mid_ptr = wintypes.LPWSTR()
                        if GetPathAt(ptr, i, ctypes.byref(mid_ptr)) < 0:
                            if mid_ptr.value is not None:
                                ole32.CoTaskMemFree(mid_ptr)
                            continue
                        device_id = mid_ptr.value or ""

                        rc = wintypes.RECT()
                        hr_rc = GetRECT(ptr, mid_ptr, ctypes.byref(rc))
                        if hr_rc < 0 or rc.right <= rc.left or rc.bottom <= rc.top:
                            ole32.CoTaskMemFree(mid_ptr)
                            continue

                        wp_ptr = wintypes.LPWSTR()
                        wp_raw = ""
                        if GetWallpaper(ptr, mid_ptr, ctypes.byref(wp_ptr)) >= 0 and wp_ptr.value is not None:
                            wp_raw = wp_ptr.value.strip()
                        if wp_ptr.value is not None:
                            ole32.CoTaskMemFree(wp_ptr)
                        ole32.CoTaskMemFree(mid_ptr)

                        w = int(rc.right - rc.left)
                        h = int(rc.bottom - rc.top)
                        rect_tuple = (int(rc.left), int(rc.top), int(rc.right), int(rc.bottom))

                        candidate_path = wp_raw or default_wp
                        resolved_path: str | None = None
                        if candidate_path and os.path.isfile(candidate_path):
                            resolved_path = candidate_path
                        elif candidate_path:
                            resolved_path = _win_fallback_wallpaper_file(w, h)

                        mon_id = f"win-{len(monitors)}"
                        is_primary = (
                            rect_tuple in primary_rects
                            if primary_rects
                            else (rect_tuple[0] == 0 and rect_tuple[1] == 0)
                        )
                        is_active = active_rect is not None and rect_tuple == active_rect

                        model = _win_extract_monitor_model(device_id)
                        idx_num = len(monitors) + 1
                        primary_tag = " · 主屏" if is_primary else ""
                        if model:
                            label = f"显示器 {idx_num} · {model} ({w}×{h}{primary_tag})"
                        else:
                            label = f"显示器 {idx_num} ({w}×{h}{primary_tag})"

                        if resolved_path:
                            allowlist[mon_id] = resolved_path

                        monitors.append(
                            {
                                "id": mon_id,
                                "index": len(monitors),
                                "label": label,
                                "is_primary": is_primary,
                                "is_active_window": is_active,
                                "rect": {
                                    "left": rect_tuple[0],
                                    "top": rect_tuple[1],
                                    "right": rect_tuple[2],
                                    "bottom": rect_tuple[3],
                                    "width": w,
                                    "height": h,
                                },
                                "has_image": bool(resolved_path),
                                "solid_color": None if resolved_path else (solid_bg_hex or "#000000"),
                                "crop": None,
                                "signature": _file_signature(
                                    resolved_path,
                                    extra=(solid_bg_hex or "") if not resolved_path else "",
                                ),
                            }
                        )
            finally:
                Release(ptr)
    except Exception:
        pass
    finally:
        if need_uninit:
            try:
                ole32.CoUninitialize()
            except Exception:
                pass

    # Fallback if COM returned no monitors
    if not monitors:
        import winreg  # type: ignore

        reg_wp = ""
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Control Panel\Desktop") as key:
                val, _ = winreg.QueryValueEx(key, "WallPaper")
                if isinstance(val, str):
                    reg_wp = val.strip()
        except OSError:
            pass
        fallback_path = reg_wp if (reg_wp and os.path.isfile(reg_wp)) else _win_fallback_wallpaper_file()
        if fallback_path:
            allowlist["win-0"] = fallback_path
            monitors.append(
                {
                    "id": "win-0",
                    "index": 0,
                    "label": "主显示器",
                    "is_primary": True,
                    "is_active_window": True,
                    "rect": None,
                    "has_image": True,
                    "solid_color": None,
                    "crop": None,
                    "signature": _file_signature(fallback_path),
                }
            )

    if monitors and not any(m["is_primary"] for m in monitors):
        monitors[0]["is_primary"] = True
        if "主屏" not in monitors[0]["label"]:
            monitors[0]["label"] += " · 主屏"

    # In Windows Span mode, each monitor displays a crop of the shared wallpaper image.
    if position_str == "span" and len(monitors) > 1 and all(m["rect"] for m in monitors):
        min_x = min(m["rect"]["left"] for m in monitors)
        min_y = min(m["rect"]["top"] for m in monitors)
        max_x = max(m["rect"]["right"] for m in monitors)
        max_y = max(m["rect"]["bottom"] for m in monitors)
        total_w = max(1, max_x - min_x)
        total_h = max(1, max_y - min_y)
        for m in monitors:
            r = m["rect"]
            crop = {
                "x": round((r["left"] - min_x) / total_w, 4),
                "y": round((r["top"] - min_y) / total_h, 4),
                "w": round(r["width"] / total_w, 4),
                "h": round(r["height"] / total_h, 4),
            }
            m["crop"] = crop
            m["signature"] = _file_signature(allowlist.get(m["id"]), extra=f"span:{crop}")

    active_id = next((m["id"] for m in monitors if m["is_active_window"]), None)
    return (
        {
            "supported": bool(monitors),
            "follow_window_supported": bool(monitors),
            "active_window_monitor_id": active_id,
            "position": position_str,
            "solid_color": solid_bg_hex,
            "monitors": monitors,
            "reason": "" if monitors else "未能读取 Windows 桌面壁纸",
        },
        allowlist,
    )


# ---------------------------------------------------------------------------
# Linux implementation (XDG Desktop Portal v2 + GNOME + KDE Plasma)
# ---------------------------------------------------------------------------

def _detect_linux_desktop() -> str:
    if not (
        os.environ.get("DISPLAY")
        or os.environ.get("WAYLAND_DISPLAY")
        or os.environ.get("DBUS_SESSION_BUS_ADDRESS")
    ):
        return "Headless"
    raw = (
        os.environ.get("XDG_CURRENT_DESKTOP")
        or os.environ.get("XDG_SESSION_DESKTOP")
        or os.environ.get("DESKTOP_SESSION")
        or ""
    ).strip()
    upper = raw.upper()
    if "KDE" in upper or "PLASMA" in upper:
        return "KDE Plasma"
    if "GNOME" in upper or "UBUNTU" in upper or "POP" in upper:
        return "GNOME"
    return raw or "Linux Desktop"


def _parse_xdg_portal_accent_output(text: str) -> str | None:
    if not text:
        return None
    # gdbus: "(<(0.207843..., 0.517647..., 0.894118...)>,)"
    # busctl: "v (ddd) 0.207843 0.517647 0.894118"
    nums = re.findall(r"[-+]?(?:\d+\.\d+|\d+)(?:[eE][-+]?\d+)?", text)
    if len(nums) < 3:
        return None
    try:
        vals = [float(x) for x in nums[-3:]]
    except ValueError:
        return None
    if any(v < 0.0 or v > 1.0 for v in vals):
        return None
    return _rgb_to_hex(round(vals[0] * 255), round(vals[1] * 255), round(vals[2] * 255))


def _parse_kdeglobals_accent(path: str) -> str | None:
    if not os.path.isfile(path):
        return None
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
    except OSError:
        return None

    section = ""
    general_accent: str | None = None
    selection_bg: str | None = None
    for line in lines:
        s = line.strip()
        if not s or s.startswith(("#", ";")):
            continue
        if s.startswith("[") and s.endswith("]"):
            section = s[1:-1]
            continue
        if "=" not in s:
            continue
        k, v = s.split("=", 1)
        k = k.strip()
        v = v.strip()
        if section == "General" and k == "AccentColor":
            general_accent = _parse_rgb_triplet(v) or _normalize_hex_str(v)
        elif section == "Colors:Selection" and k == "BackgroundNormal" and selection_bg is None:
            selection_bg = _parse_rgb_triplet(v) or _normalize_hex_str(v)
    return general_accent or selection_bg


def _get_linux_accent(desktop_env: str) -> dict:
    # 1. XDG Desktop Portal v2 (GNOME 47+, KDE Plasma 5.27+/6, modern portals)
    out = _run_cmd(
        [
            "gdbus",
            "call",
            "--session",
            "--dest",
            "org.freedesktop.portal.Desktop",
            "--object-path",
            "/org/freedesktop/portal/desktop",
            "--method",
            "org.freedesktop.portal.Settings.ReadOne",
            "org.freedesktop.appearance",
            "accent-color",
        ]
    )
    if not out:
        out = _run_cmd(
            [
                "busctl",
                "--user",
                "call",
                "org.freedesktop.portal.Desktop",
                "/org/freedesktop/portal/desktop",
                "org.freedesktop.portal.Settings",
                "ReadOne",
                "ss",
                "org.freedesktop.appearance",
                "accent-color",
            ]
        )
    portal_hex = _parse_xdg_portal_accent_output(out or "")
    if portal_hex:
        return {"supported": True, "hex": portal_hex, "source": "xdg-portal", "reason": ""}

    # 2. KDE Plasma kdeglobals fallback
    kde_cfg = os.path.join(
        os.environ.get("XDG_CONFIG_HOME") or os.path.join(os.path.expanduser("~"), ".config"),
        "kdeglobals",
    )
    kde_hex = _parse_kdeglobals_accent(kde_cfg)
    if kde_hex:
        return {"supported": True, "hex": kde_hex, "source": "kdeglobals", "reason": ""}

    # 3. GNOME gsettings fallback (GNOME 47+ accent-color enum, then Ubuntu Yaru gtk-theme)
    gs_accent = _run_cmd(["gsettings", "get", "org.gnome.desktop.interface", "accent-color"])
    if gs_accent:
        name = gs_accent.strip().strip("'\"").lower()
        if name in _GNOME_ACCENT_HEX:
            return {
                "supported": True,
                "hex": _GNOME_ACCENT_HEX[name],
                "source": "gnome-gsettings",
                "reason": "",
            }

    gs_theme = _run_cmd(["gsettings", "get", "org.gnome.desktop.interface", "gtk-theme"])
    if gs_theme:
        t = gs_theme.strip().strip("'\"").lower()
        if "yaru-" in t:
            for variant, hex_val in _YARU_ACCENT_HEX.items():
                if f"yaru-{variant}" in t:
                    return {
                        "supported": True,
                        "hex": hex_val,
                        "source": "gnome-yaru",
                        "reason": "",
                    }

    return {
        "supported": False,
        "hex": None,
        "source": None,
        "reason": f"未能从 {desktop_env} 读取系统主题色（需要 XDG Portal / GNOME 47+ / KDE Plasma）",
    }


def _resolve_gnome_xml_wallpaper(xml_path: str) -> str | None:
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
    except Exception:
        return None
    for tag in ("file", "from"):
        for elem in root.iter(tag):
            if elem.text:
                cand = _decode_file_uri(elem.text)
                if cand and os.path.isfile(cand):
                    return cand
    return None


def _get_gnome_wallpapers(prefer_dark: bool | None) -> tuple[dict, dict[str, str]]:
    opts = (_run_cmd(["gsettings", "get", "org.gnome.desktop.background", "picture-options"]) or "").strip("'\" ").lower()
    if opts == "none":
        primary_col = _run_cmd(["gsettings", "get", "org.gnome.desktop.background", "primary-color"]) or ""
        hex_col = _normalize_hex_str(primary_col) or "#000000"
        monitors = [
            {
                "id": "gnome-0",
                "index": 0,
                "label": "GNOME 桌面背景（纯色）",
                "is_primary": True,
                "is_active_window": False,
                "rect": None,
                "has_image": False,
                "solid_color": hex_col,
                "crop": None,
                "signature": _file_signature(None, extra=hex_col),
            }
        ]
        return (
            {
                "supported": True,
                "follow_window_supported": False,
                "active_window_monitor_id": None,
                "position": "solid",
                "solid_color": hex_col,
                "monitors": monitors,
                "reason": "",
            },
            {},
        )

    is_dark = prefer_dark
    if is_dark is None:
        cs = (_run_cmd(["gsettings", "get", "org.gnome.desktop.interface", "color-scheme"]) or "").lower()
        is_dark = "prefer-dark" in cs

    uri = ""
    if is_dark:
        uri = _run_cmd(["gsettings", "get", "org.gnome.desktop.background", "picture-uri-dark"]) or ""
    if not uri or uri.strip("'\" ") == "":
        uri = _run_cmd(["gsettings", "get", "org.gnome.desktop.background", "picture-uri"]) or ""

    wp_path = _decode_file_uri(uri)
    if wp_path.lower().endswith(".xml") and os.path.isfile(wp_path):
        wp_path = _resolve_gnome_xml_wallpaper(wp_path) or ""

    if not wp_path or not os.path.isfile(wp_path):
        return (
            {
                "supported": False,
                "follow_window_supported": False,
                "active_window_monitor_id": None,
                "position": opts or "unknown",
                "solid_color": None,
                "monitors": [],
                "reason": "未找到有效的 GNOME 桌面壁纸文件",
            },
            {},
        )

    pos_val = opts if opts in ("fill", "fit", "stretch", "tile", "center", "span") else "zoom"
    monitors = [
        {
            "id": "gnome-0",
            "index": 0,
            "label": f"GNOME 主桌面 · {os.path.basename(wp_path)}",
            "is_primary": True,
            "is_active_window": False,
            "rect": None,
            "has_image": True,
            "solid_color": None,
            "crop": None,
            "signature": _file_signature(wp_path, extra=f"dark={bool(is_dark)}"),
        }
    ]
    return (
        {
            "supported": True,
            "follow_window_supported": False,
            "active_window_monitor_id": None,
            "position": pos_val,
            "solid_color": None,
            "monitors": monitors,
            "reason": "",
        },
        {"gnome-0": wp_path},
    )


def _resolve_kde_image_path(raw: str) -> str | None:
    p = _decode_file_uri(raw)
    if not p:
        return None
    if os.path.isfile(p):
        return p
    if os.path.isdir(p):
        # KDE wallpaper package directory: prefer largest resolution inside contents/images/
        img_dir = os.path.join(p, "contents", "images")
        search_dir = img_dir if os.path.isdir(img_dir) else p
        best: tuple[int, str] | None = None
        try:
            for name in os.listdir(search_dir):
                full = os.path.join(search_dir, name)
                if not os.path.isfile(full) or not name.lower().endswith(_IMAGE_EXTENSIONS):
                    continue
                m = re.match(r"^(\d+)x(\d+)", name)
                area = int(m.group(1)) * int(m.group(2)) if m else os.path.getsize(full)
                if best is None or area > best[0]:
                    best = (area, full)
        except OSError:
            return None
        return best[1] if best else None
    return None


def _parse_kde_appletsrc(path: str) -> list[dict]:
    if not os.path.isfile(path):
        return []
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
    except OSError:
        return []

    containments: dict[str, dict] = {}
    current_tokens: list[str] = []

    for line in lines:
        s = line.strip()
        if not s or s.startswith(("#", ";")):
            continue
        if s.startswith("[") and s.endswith("]"):
            current_tokens = re.findall(r"\[([^\]]+)\]", s)
            continue
        if "=" not in s or len(current_tokens) < 2 or current_tokens[0] != "Containments":
            continue
        cid = current_tokens[1]
        entry = containments.setdefault(
            cid,
            {
                "id": cid,
                "plugin": "",
                "lastScreen": -1,
                "wallpaperPlugin": "org.kde.image",
                "image": "",
                "color": "",
                "slidePaths": "",
            },
        )
        k, v = s.split("=", 1)
        k = k.strip()
        v = v.strip()

        if len(current_tokens) == 2:
            if k == "plugin":
                entry["plugin"] = v
            elif k == "lastScreen":
                try:
                    entry["lastScreen"] = int(v)
                except ValueError:
                    pass
            elif k == "wallpaperplugin":
                entry["wallpaperPlugin"] = v
        elif len(current_tokens) >= 4 and current_tokens[2] == "Wallpaper":
            wp_plugin = current_tokens[3]
            if len(current_tokens) == 5 and current_tokens[4] == "General":
                if wp_plugin == "org.kde.image":
                    if k == "Image":
                        entry["image"] = v
                elif wp_plugin == "org.kde.color":
                    if k == "Color":
                        entry["color"] = v
                elif wp_plugin == "org.kde.slideshow":
                    if k == "Image" and not entry["image"]:
                        entry["image"] = v
                    elif k == "SlidePaths":
                        entry["slidePaths"] = v

    desktop_plugins = {"org.kde.plasma.folder", "org.kde.desktopcontainment"}
    results = [
        c for c in containments.values() if c["lastScreen"] >= 0 and c["plugin"] in desktop_plugins
    ]
    results.sort(key=lambda c: c["lastScreen"])
    return results


def _get_kde_wallpapers() -> tuple[dict, dict[str, str]]:
    cfg_root = os.environ.get("XDG_CONFIG_HOME") or os.path.join(os.path.expanduser("~"), ".config")
    appletsrc = os.path.join(cfg_root, "plasma-org.kde.plasma.desktop-appletsrc")
    entries = _parse_kde_appletsrc(appletsrc)

    monitors: list[dict] = []
    allowlist: dict[str, str] = {}
    seen_screens: set[int] = set()

    for c in entries:
        scr = c["lastScreen"]
        if scr in seen_screens:
            continue
        seen_screens.add(scr)

        wp_plugin = c["wallpaperPlugin"]
        resolved_img: str | None = None
        solid_hex: str | None = None

        if wp_plugin == "org.kde.color":
            solid_hex = _parse_rgb_triplet(c["color"]) or _normalize_hex_str(c["color"]) or "#000000"
        else:
            resolved_img = _resolve_kde_image_path(c["image"])
            if not resolved_img and c["slidePaths"]:
                for sp in c["slidePaths"].split(","):
                    sp_clean = _decode_file_uri(sp)
                    if os.path.isdir(sp_clean):
                        try:
                            for name in sorted(os.listdir(sp_clean)):
                                cand = os.path.join(sp_clean, name)
                                if os.path.isfile(cand) and name.lower().endswith(_IMAGE_EXTENSIONS):
                                    resolved_img = cand
                                    break
                        except OSError:
                            pass
                    if resolved_img:
                        break

        if not resolved_img and not solid_hex:
            continue

        mon_id = f"kde-{scr}"
        is_primary = scr == 0
        primary_tag = " · 主屏" if is_primary else ""
        if resolved_img:
            allowlist[mon_id] = resolved_img
            label = f"KDE 屏幕 {scr + 1} · {os.path.basename(resolved_img)}{primary_tag}"
        else:
            label = f"KDE 屏幕 {scr + 1}（纯色{primary_tag}）"

        monitors.append(
            {
                "id": mon_id,
                "index": scr,
                "label": label,
                "is_primary": is_primary,
                "is_active_window": False,
                "rect": None,
                "has_image": bool(resolved_img),
                "solid_color": solid_hex,
                "crop": None,
                "signature": _file_signature(resolved_img, extra=solid_hex or ""),
            }
        )

    if monitors and not any(m["is_primary"] for m in monitors):
        monitors[0]["is_primary"] = True

    return (
        {
            "supported": bool(monitors),
            "follow_window_supported": False,
            "active_window_monitor_id": None,
            "position": "unknown",
            "solid_color": None,
            "monitors": monitors,
            "reason": "" if monitors else "未在 KDE Plasma 配置中找到有效壁纸",
        },
        allowlist,
    )


def _get_linux_system_theme(prefer_dark: bool | None) -> tuple[dict, dict[str, str]]:
    desktop_env = _detect_linux_desktop()
    if desktop_env == "Headless":
        return (
            {
                "platform": "linux",
                "desktop_env": "Headless",
                "accent": {
                    "supported": False,
                    "hex": None,
                    "source": None,
                    "reason": "当前为无图形会话环境（Headless / SSH / 容器），请使用手动指定种子色",
                },
                "wallpaper": {
                    "supported": False,
                    "follow_window_supported": False,
                    "active_window_monitor_id": None,
                    "position": "unknown",
                    "solid_color": None,
                    "monitors": [],
                    "reason": "无图形桌面会话，无法读取桌面壁纸",
                },
            },
            {},
        )

    accent = _get_linux_accent(desktop_env)
    if desktop_env == "GNOME":
        wallpaper, allowlist = _get_gnome_wallpapers(prefer_dark)
    elif desktop_env == "KDE Plasma":
        wallpaper, allowlist = _get_kde_wallpapers()
    else:
        wallpaper = {
            "supported": False,
            "follow_window_supported": False,
            "active_window_monitor_id": None,
            "position": "unknown",
            "solid_color": None,
            "monitors": [],
            "reason": f"当前 Linux 壁纸读取仅适配 GNOME / KDE Plasma（检测到: {desktop_env}）",
        }
        allowlist = {}

    return (
        {
            "platform": "linux",
            "desktop_env": desktop_env,
            "accent": accent,
            "wallpaper": wallpaper,
        },
        allowlist,
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def _build_system_theme_info(prefer_dark: bool | None) -> tuple[dict, dict[str, str]]:
    if os.name == "nt":
        accent = _get_windows_accent()
        wallpaper, allowlist = _get_windows_wallpapers()
        return (
            {
                "platform": "windows",
                "desktop_env": "Windows",
                "accent": accent,
                "wallpaper": wallpaper,
            },
            allowlist,
        )

    if sys.platform.startswith("linux"):
        return _get_linux_system_theme(prefer_dark)

    plat = "darwin" if sys.platform == "darwin" else "other"
    return (
        {
            "platform": plat,
            "desktop_env": plat,
            "accent": {
                "supported": False,
                "hex": None,
                "source": None,
                "reason": "当前平台暂未适配系统主题色读取，请使用手动指定种子色",
            },
            "wallpaper": {
                "supported": False,
                "follow_window_supported": False,
                "active_window_monitor_id": None,
                "position": "unknown",
                "solid_color": None,
                "monitors": [],
                "reason": "当前平台暂未适配壁纸取色，请使用手动指定种子色",
            },
        },
        {},
    )


def get_system_theme_info(prefer_dark: bool | None = None, force: bool = False) -> dict:
    now = time.monotonic()
    with _LOCK:
        cached = _CACHE.get("payload")
        if (
            not force
            and isinstance(cached, dict)
            and _CACHE.get("prefer_dark") == prefer_dark
            and (now - float(_CACHE.get("ts") or 0.0)) < _CACHE_TTL_SEC
        ):
            return dict(cached)

    payload, allowlist = _build_system_theme_info(prefer_dark)
    with _LOCK:
        _CACHE["ts"] = time.monotonic()
        _CACHE["prefer_dark"] = prefer_dark
        _CACHE["payload"] = payload
        _WALLPAPER_ALLOWLIST.clear()
        _WALLPAPER_ALLOWLIST.update(allowlist)
        return dict(payload)


def resolve_wallpaper_file(monitor_id: str) -> tuple[str | None, str | None]:
    mid = (monitor_id or "").strip()
    if not mid or "/" in mid or "\\" in mid or ".." in mid:
        return None, None

    with _LOCK:
        path = _WALLPAPER_ALLOWLIST.get(mid)

    if not path:
        get_system_theme_info(force=True)
        with _LOCK:
            path = _WALLPAPER_ALLOWLIST.get(mid)

    if not path or not os.path.isfile(path):
        return None, None

    try:
        if os.path.getsize(path) > _MAX_WALLPAPER_BYTES:
            return None, None
    except OSError:
        return None, None

    mime = _sniff_image_mime(path)
    if not mime:
        return None, None
    return path, mime
