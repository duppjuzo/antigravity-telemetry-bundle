#!/usr/bin/env python3
"""
Antigravity Telemetry Bundle — Cross-Platform One-Click Deployer
Supports Windows (Registry HKCU Run), macOS (launchd LaunchAgent),
Linux (systemd --user with detached daemon fallback), and foreground serving.

Zero external dependencies — runs on Python 3.8+ standard library.
"""

from __future__ import annotations

import argparse
import json
import os
import platform
import plistlib
import shutil
import stat
import subprocess
import sys
import time
import urllib.request
import webbrowser
from pathlib import Path

VERSION = "1.2.0"
BUNDLE_ROOT = Path(__file__).resolve().parent
PLUGIN_SRC = BUNDLE_ROOT / "plugin" / "cache-monitor"
PLUGIN_NAME = "cache-monitor"

WINDOWS_RUN_KEY = r"Software\Microsoft\Windows\CurrentVersion\Run"
WINDOWS_RUN_VALUE = "AntigravityTelemetryDashboard"
MACOS_LABEL = "com.antigravity.telemetry"
LINUX_UNIT_NAME = "antigravity-telemetry.service"


def _configure_stdio() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8", errors="replace")
            except Exception:
                pass


def _is_windows() -> bool:
    return os.name == "nt"


def _is_macos() -> bool:
    return sys.platform == "darwin"


def _is_linux() -> bool:
    return sys.platform.startswith("linux")


def _default_gemini_home() -> Path:
    env_home = os.environ.get("GEMINI_HOME", "").strip()
    if env_home:
        return Path(os.path.expanduser(env_home)).resolve()
    return (Path.home() / ".gemini").resolve()


def _default_service_only_dir() -> Path:
    if _is_windows():
        base = os.environ.get("LOCALAPPDATA") or str(Path.home() / "AppData" / "Local")
        return Path(base) / "antigravity-telemetry"
    return Path.home() / ".local" / "share" / "antigravity-telemetry"


def _plugin_install_dir(gemini_home: Path) -> Path:
    return gemini_home / "config" / "plugins" / PLUGIN_NAME


def _resolve_server_dir(gemini_home: Path, service_only: bool, service_dir: str | None) -> Path:
    if service_dir:
        return Path(os.path.expanduser(service_dir)).resolve()
    if service_only:
        return _default_service_only_dir().resolve()
    return _plugin_install_dir(gemini_home) / "server"


def _health_host(host: str) -> str:
    return "127.0.0.1" if host in ("0.0.0.0", "::", "") else host


def _check_health(host: str, port: int, timeout: float = 1.5) -> dict | None:
    url = f"http://{_health_host(host)}:{port}/api/health"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode("utf-8", errors="replace"))
    except Exception:
        return None
    return None


def _wait_health(host: str, port: int, timeout_sec: float = 8.0) -> dict | None:
    deadline = time.monotonic() + timeout_sec
    while time.monotonic() < deadline:
        data = _check_health(host, port, timeout=1.0)
        if data is not None:
            return data
        time.sleep(0.2)
    return None


def _copy_tree_clean(src: Path, dst: Path) -> None:
    if not src.exists():
        raise FileNotFoundError(f"Source directory not found: {src}")
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(
        src,
        dst,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.pyo", ".DS_Store"),
    )
    if not _is_windows():
        for rel in (
            "cache_hook.py",
            "server/server.py",
            "server/collector.py",
            "server/ensure_server.py",
        ):
            p = dst / rel
            if p.exists():
                p.chmod(p.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)


def _resolve_pythonw() -> str:
    if _is_windows():
        pyw = Path(sys.executable).resolve().parent / "pythonw.exe"
        if pyw.exists():
            return str(pyw)
    return str(Path(sys.executable).resolve())


def _is_default_gemini_home(gemini_home: Path) -> bool:
    return gemini_home.resolve() == (Path.home() / ".gemini").resolve()


# ---------------------------------------------------------------------------
# OS-native autostart managers
# ---------------------------------------------------------------------------

def _windows_set_autostart(server_dir: Path, host: str, port: int, gemini_home: Path) -> dict:
    import winreg  # type: ignore

    pyw = _resolve_pythonw()
    ensure_py = server_dir / "ensure_server.py"
    parts = [f'"{pyw}"', f'"{ensure_py}"', "--host", host, "--port", str(port)]
    if not _is_default_gemini_home(gemini_home):
        parts.extend(["--gemini-home", f'"{gemini_home}"'])
    cmd = " ".join(parts)

    with winreg.CreateKey(winreg.HKEY_CURRENT_USER, WINDOWS_RUN_KEY) as key:
        winreg.SetValueEx(key, WINDOWS_RUN_VALUE, 0, winreg.REG_SZ, cmd)
    return {"method": "windows-registry-hkcu", "command": cmd}


def _windows_remove_autostart() -> bool:
    import winreg  # type: ignore

    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, WINDOWS_RUN_KEY, 0, winreg.KEY_SET_VALUE) as key:
            winreg.DeleteValue(key, WINDOWS_RUN_VALUE)
            return True
    except FileNotFoundError:
        return False
    except OSError:
        return False


def _windows_get_autostart() -> str | None:
    import winreg  # type: ignore

    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, WINDOWS_RUN_KEY, 0, winreg.KEY_READ) as key:
            val, _ = winreg.QueryValueEx(key, WINDOWS_RUN_VALUE)
            return str(val)
    except OSError:
        return None


def _macos_plist_path() -> Path:
    return Path.home() / "Library" / "LaunchAgents" / f"{MACOS_LABEL}.plist"


def _macos_install_autostart(server_dir: Path, host: str, port: int, gemini_home: Path, start_now: bool) -> dict:
    plist_path = _macos_plist_path()
    plist_path.parent.mkdir(parents=True, exist_ok=True)
    log_dir = Path.home() / "Library" / "Logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_path = str(log_dir / "antigravity-telemetry.log")

    py_exe = str(Path(sys.executable).resolve())
    args = [py_exe, str(server_dir / "server.py"), "--host", host, "--port", str(port), "--secondary-port", "0"]
    if not _is_default_gemini_home(gemini_home):
        args.extend(["--gemini-home", str(gemini_home)])

    plist_data = {
        "Label": MACOS_LABEL,
        "ProgramArguments": args,
        "WorkingDirectory": str(server_dir),
        "RunAtLoad": True,
        "KeepAlive": {"SuccessfulExit": False},
        "StandardOutPath": log_path,
        "StandardErrorPath": log_path,
        "EnvironmentVariables": {
            "PYTHONIOENCODING": "utf-8",
            "PYTHONUNBUFFERED": "1",
            "GEMINI_HOME": str(gemini_home),
        },
    }
    with open(plist_path, "wb") as f:
        plistlib.dump(plist_data, f)

    if start_now:
        uid = str(os.getuid())
        subprocess.run(["launchctl", "bootout", f"gui/{uid}", str(plist_path)], capture_output=True)
        res = subprocess.run(["launchctl", "bootstrap", f"gui/{uid}", str(plist_path)], capture_output=True, text=True)
        if res.returncode != 0:
            subprocess.run(["launchctl", "unload", str(plist_path)], capture_output=True)
            subprocess.run(["launchctl", "load", "-w", str(plist_path)], capture_output=True)

    return {"method": "macos-launchd", "plist": str(plist_path), "log": log_path}


def _macos_remove_autostart() -> bool:
    plist_path = _macos_plist_path()
    if not plist_path.exists():
        return False
    uid = str(os.getuid())
    subprocess.run(["launchctl", "bootout", f"gui/{uid}", str(plist_path)], capture_output=True)
    subprocess.run(["launchctl", "unload", "-w", str(plist_path)], capture_output=True)
    try:
        plist_path.unlink()
    except OSError:
        pass
    return True


def _linux_unit_path() -> Path:
    xdg = os.environ.get("XDG_CONFIG_HOME")
    base = Path(xdg) if xdg else (Path.home() / ".config")
    return base / "systemd" / "user" / LINUX_UNIT_NAME


def _has_systemd_user() -> bool:
    if not _is_linux() or not shutil.which("systemctl"):
        return False
    try:
        res = subprocess.run(["systemctl", "--user", "show-environment"], capture_output=True, timeout=3)
        return res.returncode == 0
    except Exception:
        return False


def _linux_install_autostart(server_dir: Path, host: str, port: int, gemini_home: Path, start_now: bool) -> dict:
    if not _has_systemd_user():
        return {
            "method": "detached-daemon-fallback",
            "note": (
                "systemd --user is not active in this environment (e.g. WSL/container). "
                "Started via background daemon; add an @reboot cron entry if auto-boot is desired."
            ),
        }

    unit_path = _linux_unit_path()
    unit_path.parent.mkdir(parents=True, exist_ok=True)
    py_exe = str(Path(sys.executable).resolve())
    exec_parts = [f'"{py_exe}"', f'"{server_dir / "server.py"}"', "--host", host, "--port", str(port), "--secondary-port", "0"]
    if not _is_default_gemini_home(gemini_home):
        exec_parts.extend(["--gemini-home", f'"{gemini_home}"'])

    unit_text = "\n".join(
        [
            "[Unit]",
            "Description=Antigravity Usage & Performance Telemetry Dashboard",
            "After=network.target",
            "",
            "[Service]",
            "Type=simple",
            f"WorkingDirectory={server_dir}",
            "Environment=PYTHONIOENCODING=utf-8",
            "Environment=PYTHONUNBUFFERED=1",
            f"Environment=GEMINI_HOME={gemini_home}",
            f"ExecStart={' '.join(exec_parts)}",
            "Restart=on-failure",
            "RestartSec=3",
            "",
            "[Install]",
            "WantedBy=default.target",
            "",
        ]
    )
    unit_path.write_text(unit_text, encoding="utf-8")

    subprocess.run(["systemctl", "--user", "daemon-reload"], check=False, capture_output=True)
    if start_now:
        subprocess.run(["systemctl", "--user", "enable", LINUX_UNIT_NAME], check=False, capture_output=True)
        subprocess.run(["systemctl", "--user", "restart", LINUX_UNIT_NAME], check=False, capture_output=True)
    else:
        subprocess.run(["systemctl", "--user", "enable", LINUX_UNIT_NAME], check=False, capture_output=True)

    return {"method": "linux-systemd-user", "unit": str(unit_path)}


def _linux_remove_autostart() -> bool:
    unit_path = _linux_unit_path()
    existed = unit_path.exists()
    if _has_systemd_user():
        subprocess.run(["systemctl", "--user", "disable", "--now", LINUX_UNIT_NAME], capture_output=True)
    if existed:
        try:
            unit_path.unlink()
        except OSError:
            pass
    if _has_systemd_user():
        subprocess.run(["systemctl", "--user", "daemon-reload"], capture_output=True)
    return existed


# ---------------------------------------------------------------------------
# Daemon helper bridge
# ---------------------------------------------------------------------------

def _run_ensure(
    server_dir: Path,
    host: str,
    port: int,
    gemini_home: Path,
    extra_args: list[str] | None = None,
) -> tuple[int, dict]:
    ensure_py = server_dir / "ensure_server.py"
    if not ensure_py.exists():
        ensure_py = PLUGIN_SRC / "server" / "ensure_server.py"
    cmd = [sys.executable, str(ensure_py), "--host", host, "--port", str(port)]
    if not _is_default_gemini_home(gemini_home):
        cmd.extend(["--gemini-home", str(gemini_home)])
    if extra_args:
        cmd.extend(extra_args)

    res = subprocess.run(cmd, capture_output=True, text=True)
    raw = (res.stdout or res.stderr or "").strip()
    try:
        payload = json.loads(raw.splitlines()[-1]) if raw else {}
    except Exception:
        payload = {"raw": raw}
    return res.returncode, payload


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_install(args: argparse.Namespace) -> int:
    if sys.version_info < (3, 8):
        print("ERROR: Python 3.8+ is required.", file=sys.stderr)
        return 1
    try:
        import sqlite3  # noqa: F401
    except ImportError:
        print("ERROR: Python sqlite3 module is required.", file=sys.stderr)
        return 1

    gemini_home = Path(os.path.expanduser(args.gemini_home)).resolve() if args.gemini_home else _default_gemini_home()
    plugin_dst = _plugin_install_dir(gemini_home)
    server_dir = _resolve_server_dir(gemini_home, args.service_only, args.service_dir)

    print(f"=== Antigravity Telemetry Bundle v{VERSION} Installer ===")
    print(f"Platform    : {platform.system()} {platform.release()} ({platform.machine()})")
    print(f"Python      : {sys.executable} ({platform.python_version()})")
    print(f"GEMINI_HOME : {gemini_home}")

    # 1. Install plugin or standalone service files
    if args.service_only:
        print(f"\n[1/3] Installing standalone telemetry service -> {server_dir}")
        _copy_tree_clean(PLUGIN_SRC / "server", server_dir)
    else:
        print(f"\n[1/3] Installing self-contained Antigravity plugin -> {plugin_dst}")
        _copy_tree_clean(PLUGIN_SRC, plugin_dst)
        if not shutil.which("node"):
            print("  Note: 'node' was not found on PATH. The standalone web service works with Python alone,")
            print("        while Antigravity's built-in Node runs the sidecar automatically inside Antigravity.")

    # 2. Configure OS autostart
    autostart_info: dict = {"method": "skipped"}
    if args.plugin_only:
        print("\n[2/3] Skipping standalone OS service (--plugin-only).")
        print("      Antigravity will automatically start the dashboard sidecar when the plugin is enabled.")
    elif args.no_autostart:
        print("\n[2/3] Skipping OS autostart (--no-autostart).")
    else:
        print("\n[2/3] Configuring OS-native autostart...")
        if _is_windows():
            autostart_info = _windows_set_autostart(server_dir, args.host, args.port, gemini_home)
        elif _is_macos():
            autostart_info = _macos_install_autostart(server_dir, args.host, args.port, gemini_home, start_now=not args.no_start)
        elif _is_linux():
            autostart_info = _linux_install_autostart(server_dir, args.host, args.port, gemini_home, start_now=not args.no_start)
        print(f"      Autostart method: {autostart_info.get('method')}")
        if autostart_info.get("note"):
            print(f"      {autostart_info['note']}")

    # 3. Start and verify service
    url = f"http://{_health_host(args.host)}:{args.port}/"
    health = None
    if args.plugin_only or args.no_start:
        print("\n[3/3] Service startup skipped per flags.")
    else:
        print(f"\n[3/3] Starting & verifying telemetry service at {url} ...")
        managed_by_os = autostart_info.get("method") in ("macos-launchd", "linux-systemd-user")
        if managed_by_os:
            health = _wait_health(args.host, args.port, timeout_sec=6.0)
        if health is None:
            extra = ["--restart"] if args.restart else []
            if args.demo:
                extra.append("--demo")
            code, payload = _run_ensure(server_dir, args.host, args.port, gemini_home, extra_args=extra)
            if code == 0:
                health = payload.get("health") or _check_health(args.host, args.port)
            else:
                print(f"  Warning: background launcher returned code {code}: {payload}", file=sys.stderr)
                return 1

    print("\n=== Deployment Complete ===")
    if not args.service_only:
        print(f"  Antigravity Plugin : {plugin_dst}")
        print("  Sidecar Panel      : Telemetry Dashboard (sidecar://cache-monitor/telemetry/)")
    print(f"  Service Directory  : {server_dir}")
    print(f"  Dashboard URL      : {url}")
    if health:
        print(f"  Health Status      : OK (v{health.get('version', VERSION)}, {health.get('timestamp', '')})")

    if args.open and health:
        try:
            webbrowser.open(url)
        except Exception:
            pass

    return 0


def cmd_uninstall(args: argparse.Namespace) -> int:
    gemini_home = Path(os.path.expanduser(args.gemini_home)).resolve() if args.gemini_home else _default_gemini_home()
    plugin_dst = _plugin_install_dir(gemini_home)
    service_dir = Path(os.path.expanduser(args.service_dir)).resolve() if args.service_dir else _default_service_only_dir().resolve()

    print("=== Antigravity Telemetry Bundle Uninstaller ===")

    # 1. Remove OS autostart
    removed_auto = False
    if not args.skip_autostart:
        if _is_windows():
            removed_auto = _windows_remove_autostart()
        elif _is_macos():
            removed_auto = _macos_remove_autostart()
        elif _is_linux():
            removed_auto = _linux_remove_autostart()
    print(f"[1/3] OS autostart removed : {removed_auto}")

    # 2. Stop running background daemon managed by PID file
    active_srv_dir = plugin_dst / "server" if (plugin_dst / "server").exists() else (service_dir if service_dir.exists() else PLUGIN_SRC / "server")
    _, stop_res = _run_ensure(active_srv_dir, args.host, args.port, gemini_home, extra_args=["--stop"])
    print(f"[2/3] Background service   : {stop_res.get('status', 'stopped')} (pids={stop_res.get('stopped_pids', [])})")

    # 3. Remove installed files
    removed_paths = []
    if not args.keep_plugin and plugin_dst.exists():
        shutil.rmtree(plugin_dst)
        removed_paths.append(str(plugin_dst))
    if not args.keep_service and service_dir.exists():
        shutil.rmtree(service_dir)
        removed_paths.append(str(service_dir))
    print(f"[3/3] Removed directories  : {removed_paths if removed_paths else 'none'}")
    print("\nUninstall complete.")
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    gemini_home = Path(os.path.expanduser(args.gemini_home)).resolve() if args.gemini_home else _default_gemini_home()
    plugin_dst = _plugin_install_dir(gemini_home)
    service_dir = Path(os.path.expanduser(args.service_dir)).resolve() if args.service_dir else _default_service_only_dir().resolve()

    autostart_status: str | bool = False
    if _is_windows():
        autostart_status = _windows_get_autostart() or False
    elif _is_macos():
        autostart_status = str(_macos_plist_path()) if _macos_plist_path().exists() else False
    elif _is_linux():
        autostart_status = str(_linux_unit_path()) if _linux_unit_path().exists() else False

    health = _check_health(args.host, args.port)
    info = {
        "bundle_version": VERSION,
        "platform": f"{platform.system()} {platform.release()} ({platform.machine()})",
        "python": platform.python_version(),
        "node_on_path": bool(shutil.which("node")),
        "gemini_home": str(gemini_home),
        "plugin_installed": (plugin_dst / "plugin.json").exists(),
        "plugin_path": str(plugin_dst),
        "service_only_installed": (service_dir / "server.py").exists(),
        "autostart": autostart_status,
        "dashboard_url": f"http://{_health_host(args.host)}:{args.port}/",
        "server_running": health is not None,
        "health": health,
    }
    if args.json:
        print(json.dumps(info, indent=2, ensure_ascii=False))
    else:
        print(f"=== Antigravity Telemetry Status (v{VERSION}) ===")
        for k, v in info.items():
            if k == "health":
                continue
            print(f"  {k:<24}: {v}")
        if health:
            print(f"  {'server_timestamp':<24}: {health.get('timestamp')}")
    return 0 if health is not None else 1


def cmd_lifecycle(args: argparse.Namespace) -> int:
    gemini_home = Path(os.path.expanduser(args.gemini_home)).resolve() if args.gemini_home else _default_gemini_home()
    plugin_srv = _plugin_install_dir(gemini_home) / "server"
    standalone_srv = Path(os.path.expanduser(args.service_dir)).resolve() if args.service_dir else _default_service_only_dir().resolve()
    server_dir = plugin_srv if (plugin_srv / "server.py").exists() else (standalone_srv if (standalone_srv / "server.py").exists() else PLUGIN_SRC / "server")

    if args.command == "serve":
        cmd = [sys.executable, str(server_dir / "server.py"), "--host", args.host, "--port", str(args.port), "--secondary-port", "0"]
        if not _is_default_gemini_home(gemini_home):
            cmd.extend(["--gemini-home", str(gemini_home)])
        if args.demo:
            cmd.append("--demo")
        return subprocess.call(cmd)

    extra = []
    if args.command == "stop":
        extra = ["--stop"]
    elif args.command == "restart":
        extra = ["--restart"]
    if args.command in ("start", "restart") and args.demo:
        extra.append("--demo")

    code, payload = _run_ensure(server_dir, args.host, args.port, gemini_home, extra_args=extra)
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    return code


def build_parser() -> argparse.ArgumentParser:
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--host", default=os.environ.get("TELEMETRY_HOST", "127.0.0.1"), help="Bind host (default: 127.0.0.1)")
    common.add_argument("--port", type=int, default=int(os.environ.get("TELEMETRY_PORT", "8765")), help="HTTP port (default: 8765)")
    common.add_argument("--gemini-home", default=None, help="Override ~/.gemini directory")
    common.add_argument("--service-dir", default=None, help="Override standalone service directory (with --service-only)")

    parser = argparse.ArgumentParser(
        prog="deploy.py",
        description="Cross-platform one-click deployer for Antigravity Telemetry Plugin & Web Service",
    )
    sub = parser.add_subparsers(dest="command")

    p_inst = sub.add_parser("install", parents=[common], help="One-click install plugin, autostart, and start service")
    p_inst.add_argument("--plugin-only", action="store_true", help="Install only the Antigravity plugin (skip OS autostart/daemon)")
    p_inst.add_argument("--service-only", action="store_true", help="Install only the standalone web service (skip Antigravity plugin)")
    p_inst.add_argument("--no-autostart", action="store_true", help="Do not register OS autostart")
    p_inst.add_argument("--no-start", action="store_true", help="Do not start the server after installation")
    p_inst.add_argument("--restart", action="store_true", help="Restart managed daemon if already running")
    p_inst.add_argument("--open", action="store_true", help="Open dashboard in default browser after installation")
    p_inst.add_argument("--demo", action="store_true", help="Launch server in demo mode")

    p_uninst = sub.add_parser("uninstall", parents=[common], help="Stop service, remove autostart, and uninstall plugin")
    p_uninst.add_argument("--keep-plugin", action="store_true", help="Keep installed Antigravity plugin files")
    p_uninst.add_argument("--keep-service", action="store_true", help="Keep standalone service directory")
    p_uninst.add_argument("--skip-autostart", action="store_true", help="Do not modify OS autostart configuration")

    p_stat = sub.add_parser("status", parents=[common], help="Show installation, autostart, and live server status")
    p_stat.add_argument("--json", action="store_true", help="Output JSON")

    for name in ("start", "stop", "restart", "serve"):
        p_cmd = sub.add_parser(name, parents=[common], help=f"{name.capitalize()} the telemetry server")
        p_cmd.add_argument("--demo", action="store_true", help="Run in demo mode")

    return parser


def main(argv: list[str] | None = None) -> int:
    _configure_stdio()
    parser = build_parser()
    raw_argv = list(sys.argv[1:] if argv is None else argv)
    if not raw_argv or raw_argv[0].startswith("-"):
        if "-h" not in raw_argv and "--help" not in raw_argv:
            raw_argv = ["install"] + raw_argv
    args = parser.parse_args(raw_argv)

    if args.command == "install":
        return cmd_install(args)
    if args.command == "uninstall":
        return cmd_uninstall(args)
    if args.command == "status":
        return cmd_status(args)
    if args.command in ("start", "stop", "restart", "serve"):
        return cmd_lifecycle(args)
    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
