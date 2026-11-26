#!/usr/bin/env python3
"""
Antigravity Telemetry Bundle — Release Packager & Integrity Verifier.
Zero external dependencies — runs on Python 3.8+ standard library.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tarfile
import zipfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = REPO_ROOT / "dist"

EXCLUDED_DIRS = {".git", "dist", "__pycache__", "node_modules"}
EXCLUDED_FILES = {".env", ".DS_Store"}
EXCLUDED_SUFFIXES = (".pyc", ".pyo")

EXEC_REL_PATHS = {
    "install.sh",
    "uninstall.sh",
    "deploy.py",
    "scripts/package_release.py",
    "plugin/cache-monitor/cache_hook.py",
    "plugin/cache-monitor/server/collector.py",
    "plugin/cache-monitor/server/server.py",
    "plugin/cache-monitor/server/ensure_server.py",
    "plugin/cache-monitor/server/hud_overlay.py",
    "plugin/cache-monitor/server/system_theme.py",
}

BUNDLE_REQUIRED = (
    "README.md",
    "VERSION",
    "system_theme.py",
    "hud_overlay.py",
    "launch_hud.bat",
    "collector.py",
    "server.py",
    "web_dashboard.html",
)

PLUGIN_REQUIRED = (
    "README.md",
    "plugin.json",
    "system_theme.py",
    "hud_overlay.py",
    "launch_hud.bat",
    "collector.py",
    "server.py",
    "web_dashboard.html",
)


def read_repo_version() -> str:
    ver_file = REPO_ROOT / "VERSION"
    if not ver_file.exists():
        raise FileNotFoundError(f"VERSION file not found: {ver_file}")
    ver = ver_file.read_text(encoding="utf-8").strip()
    if not re.match(r"^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$", ver):
        raise ValueError(f"Invalid VERSION format: {ver!r}")
    return ver


def check_version_consistency(expect_tag: str | None = None) -> str:
    ver = read_repo_version()
    mismatches: list[str] = []

    deploy_txt = (REPO_ROOT / "deploy.py").read_text(encoding="utf-8")
    m_deploy = re.search(r'^VERSION\s*=\s*"([^"]+)"', deploy_txt, re.MULTILINE)
    if not m_deploy or m_deploy.group(1) != ver:
        mismatches.append(f"deploy.py={m_deploy.group(1) if m_deploy else 'missing'} (expected {ver})")

    docker_txt = (REPO_ROOT / "Dockerfile").read_text(encoding="utf-8")
    m_docker = re.search(r'org\.opencontainers\.image\.version="([^"]+)"', docker_txt)
    if not m_docker or m_docker.group(1) != ver:
        mismatches.append(f"Dockerfile={m_docker.group(1) if m_docker else 'missing'} (expected {ver})")

    plugin_json = json.loads((REPO_ROOT / "plugin/cache-monitor/plugin.json").read_text(encoding="utf-8"))
    if plugin_json.get("version") != ver:
        mismatches.append(f"plugin.json={plugin_json.get('version')!r} (expected {ver!r})")

    srv_txt = (REPO_ROOT / "plugin/cache-monitor/server/server.py").read_text(encoding="utf-8")
    m_srv = re.search(r'^VERSION\s*=\s*"([^"]+)"', srv_txt, re.MULTILINE)
    if not m_srv or m_srv.group(1) != ver:
        mismatches.append(f"server.py={m_srv.group(1) if m_srv else 'missing'} (expected {ver})")

    if expect_tag:
        clean_tag = expect_tag.strip()
        tag_ver = clean_tag[1:] if clean_tag.startswith("v") else clean_tag
        if tag_ver != ver:
            mismatches.append(f"tag={clean_tag!r} != VERSION={ver!r}")

    if mismatches:
        raise ValueError("Version mismatch: " + "; ".join(mismatches))
    return ver


def iter_repo_files() -> list[tuple[Path, str]]:
    items: list[tuple[Path, str]] = []
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDED_DIRS)
        for fn in sorted(files):
            if fn in EXCLUDED_FILES or fn.endswith(EXCLUDED_SUFFIXES):
                continue
            p = Path(root) / fn
            rel = p.relative_to(REPO_ROOT).as_posix()
            items.append((p, rel))
    items.sort(key=lambda x: x[1])
    return items


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest().lower()


def build_archives(ver: str) -> list[Path]:
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    files = iter_repo_files()

    bundle_zip = DIST_DIR / f"antigravity-telemetry-bundle-v{ver}.zip"
    bundle_tgz = DIST_DIR / f"antigravity-telemetry-bundle-v{ver}.tar.gz"
    plugin_zip = DIST_DIR / f"cache-monitor-plugin-v{ver}.zip"

    with zipfile.ZipFile(bundle_zip, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p, rel in files:
            zf.write(p, f"antigravity-telemetry-bundle/{rel}")

    with tarfile.open(bundle_tgz, "w:gz") as tf:
        for p, rel in files:
            ti = tf.gettarinfo(str(p), arcname=f"antigravity-telemetry-bundle/{rel}")
            ti.mode = 0o755 if rel in EXEC_REL_PATHS else 0o644
            with open(p, "rb") as fh:
                tf.addfile(ti, fh)

    plugin_prefix = "plugin/cache-monitor/"
    with zipfile.ZipFile(plugin_zip, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p, rel in files:
            if rel.startswith(plugin_prefix):
                sub_rel = rel[len(plugin_prefix):]
                zf.write(p, f"cache-monitor/{sub_rel}")

    archives = [bundle_zip, bundle_tgz, plugin_zip]
    sums_lines = [f"{sha256_file(a)}  {a.name}" for a in archives]
    (DIST_DIR / "SHA256SUMS.txt").write_text("\n".join(sums_lines) + "\n", encoding="utf-8")
    return archives


def verify_archives(ver: str) -> None:
    sums_path = DIST_DIR / "SHA256SUMS.txt"
    if not sums_path.exists():
        raise FileNotFoundError(f"Missing SHA256SUMS.txt at {sums_path}")

    expected_sums: dict[str, str] = {}
    for line in sums_path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            digest, filename = line.strip().split(None, 1)
            expected_sums[filename] = digest

    names_to_check = (
        f"antigravity-telemetry-bundle-v{ver}.zip",
        f"antigravity-telemetry-bundle-v{ver}.tar.gz",
        f"cache-monitor-plugin-v{ver}.zip",
    )

    for name in names_to_check:
        p = DIST_DIR / name
        if not p.exists():
            raise FileNotFoundError(f"Missing archive: {p}")
        actual = sha256_file(p)
        if expected_sums.get(name) != actual:
            raise ValueError(f"SHA256 mismatch for {name}: expected={expected_sums.get(name)}, actual={actual}")

        if name.endswith(".zip"):
            with zipfile.ZipFile(p) as zf:
                corrupt = zf.testzip()
                if corrupt is not None:
                    raise ValueError(f"Corrupt zip member {corrupt} in {name}")
                member_names = zf.namelist()
                if name.startswith("antigravity-telemetry-bundle"):
                    v_txt = zf.read("antigravity-telemetry-bundle/VERSION").decode("utf-8").strip()
                    if v_txt != ver:
                        raise ValueError(f"VERSION mismatch inside {name}: {v_txt!r} != {ver!r}")
        else:
            with tarfile.open(p, "r:gz") as tf:
                members = tf.getmembers()
                member_names = [m.name for m in members]
                v_fh = tf.extractfile("antigravity-telemetry-bundle/VERSION")
                v_txt = v_fh.read().decode("utf-8").strip() if v_fh else ""
                if v_txt != ver:
                    raise ValueError(f"VERSION mismatch inside {name}: {v_txt!r} != {ver!r}")

        bad = [
            n
            for n in member_names
            if any(seg in EXCLUDED_DIRS for seg in n.split("/"))
            or n.endswith(EXCLUDED_SUFFIXES)
            or n.endswith(".DS_Store")
            or os.path.basename(n) in {".env", "hooks.json"}
        ]
        if bad:
            raise ValueError(f"Forbidden entries in {name}: {bad}")

        reqs = PLUGIN_REQUIRED if name.startswith("cache-monitor-plugin") else BUNDLE_REQUIRED
        for req in reqs:
            if not any(n.endswith("/" + req) for n in member_names):
                raise ValueError(f"Missing required file {req} in {name}")

        print(f"OK {name}: entries={len(member_names)}, size={p.stat().st_size}, sha256={actual}")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Package and verify Antigravity Telemetry Bundle releases")
    parser.add_argument("--check-version", action="store_true", help="Check version consistency across repo files")
    parser.add_argument(
        "--check-version-only",
        action="store_true",
        help="Only validate version (and optional --expect-tag) without writing dist/",
    )
    parser.add_argument("--expect-tag", default=None, help="Verify git tag (e.g. v1.2.0) matches VERSION")
    parser.add_argument("--verify", action="store_true", help="Verify generated archives and SHA256SUMS.txt")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    ver = check_version_consistency(expect_tag=args.expect_tag)
    print(f"Version check OK: {ver}")
    if args.check_version_only:
        return 0

    archives = build_archives(ver)
    for a in archives:
        print(f"Built {a.relative_to(REPO_ROOT).as_posix()} ({a.stat().st_size} bytes)")

    if args.verify:
        verify_archives(ver)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
