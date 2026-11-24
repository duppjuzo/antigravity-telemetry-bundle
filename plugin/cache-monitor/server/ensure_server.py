"""
Cross-platform headless background daemon launcher for Antigravity Telemetry Web Server.
Supports Windows (pythonw.exe detached without console window), macOS, and Linux.
Zero external dependencies — runs on Python 3.8+ standard library.
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765


def _runtime_dir() -> str:
    gemini_home = os.path.abspath(
        os.path.expanduser(os.environ.get("GEMINI_HOME") or os.path.join("~", ".gemini"))
    )
    preferred = os.path.join(gemini_home, "antigravity")
    try:
        os.makedirs(preferred, exist_ok=True)
        probe = os.path.join(preferred, ".telemetry_write_test")
        with open(probe, "w", encoding="utf-8") as f:
            f.write("")
        os.remove(probe)
        return preferred
    except OSError:
        fallback = os.path.join(tempfile.gettempdir(), "antigravity-telemetry")
        os.makedirs(fallback, exist_ok=True)
        return fallback


def _state_file(port: int) -> str:
    return os.path.join(_runtime_dir(), f"telemetry_server_{port}.pid.json")


def _log_file(port: int) -> str:
    return os.path.join(_runtime_dir(), f"telemetry_server_{port}.log")


def _health_host(bind_host: str) -> str:
    if bind_host in ("0.0.0.0", "::", ""):
        return "127.0.0.1"
    return bind_host


def check_health(host: str, port: int, timeout: float = 1.5) -> dict | None:
    url = f"http://{_health_host(host)}:{port}/api/health"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode("utf-8", errors="replace"))
    except Exception:
        return None
    return None


def resolve_background_python() -> str:
    if os.name == "nt":
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
        pyw = os.path.join(exe_dir, "pythonw.exe")
        if os.path.exists(pyw):
            return pyw
    return sys.executable


def _read_state(port: int) -> dict | None:
    sf = _state_file(port)
    if not os.path.exists(sf):
        return None
    try:
        with open(sf, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def _write_state(port: int, payload: dict) -> None:
    sf = _state_file(port)
    try:
        with open(sf, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
    except OSError:
        pass


def _remove_state(port: int) -> None:
    sf = _state_file(port)
    try:
        if os.path.exists(sf):
            os.remove(sf)
    except OSError:
        pass


def _pid_alive(pid: int) -> bool:
    if pid <= 0:
        return False
    if os.name == "nt":
        try:
            res = subprocess.run(
                ["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV", "/NH"],
                capture_output=True,
                text=True,
                timeout=3,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000),
            )
            return f'"{pid}"' in res.stdout
        except Exception:
            return False
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    except OSError:
        return False


def _stop_pid(pid: int) -> bool:
    if not _pid_alive(pid):
        return False
    if os.name == "nt":
        try:
            subprocess.run(
                ["taskkill", "/PID", str(pid), "/T", "/F"],
                capture_output=True,
                timeout=5,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000),
            )
            return True
        except Exception:
            return False
    try:
        os.kill(pid, signal.SIGTERM)
        deadline = time.monotonic() + 3.0
        while time.monotonic() < deadline:
            if not _pid_alive(pid):
                return True
            time.sleep(0.1)
        os.kill(pid, signal.SIGKILL)
        return True
    except OSError:
        return False


def stop_server(port: int) -> dict:
    state = _read_state(port)
    stopped_pids: list[int] = []
    if state and isinstance(state.get("pid"), int):
        if _stop_pid(state["pid"]):
            stopped_pids.append(state["pid"])
    _remove_state(port)
    time.sleep(0.2)
    return {"status": "stopped", "port": port, "stopped_pids": stopped_pids}


def start_server(
    host: str,
    port: int,
    *,
    force_restart: bool = False,
    gemini_home: str | None = None,
    cache_file: str | None = None,
    demo: bool = False,
) -> tuple[int, dict]:
    url = f"http://{_health_host(host)}:{port}"
    if force_restart:
        stop_server(port)
    else:
        health = check_health(host, port)
        if health is not None:
            return 0, {"status": "already_running", "url": url, "health": health}

    base_dir = os.path.dirname(os.path.abspath(__file__))
    server_py = os.path.join(base_dir, "server.py")
    if not os.path.exists(server_py):
        return 1, {"status": "error", "error": f"server.py not found at {server_py}"}

    py_exe = resolve_background_python()
    cmd = [py_exe, server_py, "--host", host, "--port", str(port), "--secondary-port", "0"]
    if gemini_home:
        cmd.extend(["--gemini-home", gemini_home])
    if cache_file:
        cmd.extend(["--cache-file", cache_file])
    if demo:
        cmd.append("--demo")

    env = os.environ.copy()
    env.pop("ANTIGRAVITY_SIDECAR_WEB_PORT", None)
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUNBUFFERED"] = "1"

    log_path = _log_file(port)
    log_fh = None
    try:
        log_fh = open(log_path, "a", encoding="utf-8")
    except OSError:
        log_fh = None

    popen_kwargs: dict = {
        "cwd": base_dir,
        "env": env,
        "stdin": subprocess.DEVNULL,
        "stdout": log_fh if log_fh is not None else subprocess.DEVNULL,
        "stderr": log_fh if log_fh is not None else subprocess.DEVNULL,
        "close_fds": True,
    }
    if os.name == "nt":
        popen_kwargs["creationflags"] = (
            getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
            | getattr(subprocess, "DETACHED_PROCESS", 0x00000008)
        )
    else:
        popen_kwargs["start_new_session"] = True

    try:
        proc = subprocess.Popen(cmd, **popen_kwargs)
    finally:
        if log_fh is not None:
            log_fh.close()

    deadline = time.monotonic() + 6.0
    while time.monotonic() < deadline:
        health = check_health(host, port, timeout=1.0)
        if health is not None:
            _write_state(
                port,
                {
                    "pid": proc.pid,
                    "host": host,
                    "port": port,
                    "server_script": server_py,
                    "log_file": log_path,
                    "started_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                },
            )
            return 0, {
                "status": "started",
                "pid": proc.pid,
                "url": url,
                "log_file": log_path,
                "health": health,
            }
        if proc.poll() is not None:
            break
        time.sleep(0.15)

    return 1, {
        "status": "timeout",
        "pid": proc.pid,
        "url": url,
        "log_file": log_path,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Manage Antigravity Telemetry background server")
    parser.add_argument("--host", default=os.environ.get("TELEMETRY_HOST", DEFAULT_HOST))
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.environ.get("TELEMETRY_PORT", str(DEFAULT_PORT))),
    )
    parser.add_argument("--gemini-home", default=None)
    parser.add_argument("--cache-file", default=None)
    parser.add_argument("--demo", action="store_true")
    parser.add_argument("--restart", action="store_true")
    parser.add_argument("--stop", action="store_true")
    parser.add_argument("--status", action="store_true")
    args = parser.parse_args(argv)

    if args.stop:
        res = stop_server(args.port)
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.status:
        health = check_health(args.host, args.port)
        state = _read_state(args.port)
        payload = {
            "running": health is not None,
            "url": f"http://{_health_host(args.host)}:{args.port}",
            "state": state,
            "health": health,
        }
        print(json.dumps(payload, ensure_ascii=False))
        return 0 if health is not None else 1

    code, payload = start_server(
        args.host,
        args.port,
        force_restart=args.restart,
        gemini_home=args.gemini_home,
        cache_file=args.cache_file,
        demo=args.demo,
    )
    out = sys.stdout if code == 0 else sys.stderr
    print(json.dumps(payload, ensure_ascii=False), file=out)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
