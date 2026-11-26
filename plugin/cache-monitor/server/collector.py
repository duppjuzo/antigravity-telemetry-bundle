"""
Antigravity Usage Intelligence - Core Telemetry Collector & Engine
Extracts exact token metrics from Antigravity's internal SQLite conversation databases.
"""

from __future__ import annotations

import sys
import os
import re
import glob
import json
import sqlite3
import struct
import tempfile
import threading
import urllib.parse
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from contextlib import closing

_SYNC_LOCK = threading.Lock()


def get_gemini_home() -> str:
    env_home = os.environ.get("GEMINI_HOME", "").strip()
    if env_home:
        return os.path.abspath(os.path.expanduser(env_home))
    return os.path.join(os.path.expanduser("~"), ".gemini")


def get_cache_file() -> str:
    env_cache = os.environ.get("ANTIGRAVITY_CACHE_FILE", "").strip()
    if env_cache:
        return os.path.abspath(os.path.expanduser(env_cache))
    return os.path.join(get_gemini_home(), "antigravity", "antigravity_stats_cache.json")


def _fallback_cache_file() -> str:
    return os.path.join(tempfile.gettempdir(), "antigravity_stats_cache.json")


def get_data_sources() -> list[dict]:
    g_home = get_gemini_home()
    return [
        {"name": "IDE", "root": os.path.join(g_home, "antigravity-ide")},
        {"name": "Core", "root": os.path.join(g_home, "antigravity")},
        {"name": "CLI", "root": os.path.join(g_home, "antigravity-cli")},
    ]


GEMINI_HOME = get_gemini_home()
CACHE_FILE = get_cache_file()
DATA_SOURCES = get_data_sources()

CACHE_SCHEMA_VERSION = 6

def _extract_effort_suffix(r):
    if re.search(r'(?:^|[-_\s])xhigh(?:$|[-_\s])', r):
        return ' (XHigh)'
    if re.search(r'(?:^|[-_\s])high(?:$|[-_\s])', r):
        return ' (High)'
    if re.search(r'(?:^|[-_\s])medium(?:$|[-_\s])', r):
        return ' (Medium)'
    if re.search(r'(?:^|[-_\s])low(?:$|[-_\s])', r):
        return ' (Low)'
    return ''


def normalize_model_name(raw):
    """Maps raw model identifier strings to clean frontier display names."""
    if not raw:
        return None
    r = raw.lower().strip().rstrip('-')
    effort = _extract_effort_suffix(r)

    # Orchestrator / Execution / Gemini 4 models
    if 'orchestrator' in r:
        return 'Orchestrator (Argon)'
    if 'flash-worker' in r:
        return 'Gemini Flash'
    if '4-argon' in r or '4.0-argon' in r:
        return 'Gemini 4 Argon' + effort
    if '4-hydrogen' in r or '4.0-hydrogen' in r:
        return 'Gemini 4 Hydrogen' + effort
    if '4-carbon' in r or '4.0-carbon' in r:
        return 'Gemini 4 Carbon' + effort
    if '4-neon' in r or '4.0-neon' in r:
        return 'Gemini 4 Neon' + effort

    # Claude models
    if 'claude-opus-5-5' in r or 'opus-5.5' in r or 'opus-5-5' in r:
        return 'Claude Opus 5.5' + effort
    if 'claude-sonnet-4-6' in r or 'sonnet-4.6' in r or 'sonnet-4-6' in r:
        return 'Claude Sonnet 4.6' + effort
    if 'claude-opus-4-6' in r or 'opus-4.6' in r or 'opus-4-6' in r:
        return 'Claude Opus 4.6' + effort
    if 'claude-haiku-4-5' in r or 'haiku-4.5' in r or 'haiku-4-5' in r:
        return 'Claude Haiku 4.5' + effort
    if 'claude' in r and 'sonnet' in r:
        return 'Claude Sonnet 4.6' + effort
    if 'claude' in r and 'opus' in r:
        return 'Claude Opus 4.6' + effort
    if 'claude' in r and 'haiku' in r:
        return 'Claude Haiku 4.5' + effort

    # Gemini 3.x models
    if '3.8-flash' in r or '3.8' in r:
        return 'Gemini 3.8 Flash' + effort
    if '3.7-flash' in r or '3.7' in r:
        return 'Gemini 3.7 Flash' + effort
    if '3.6-flash' in r or '3.6' in r:
        return 'Gemini 3.6 Flash' + effort
    if '3.5-flash' in r or '3.5' in r:
        return 'Gemini 3.5 Flash' + effort
    if '3.1-pro' in r or '3.1' in r:
        return 'Gemini 3.1 Pro' + effort
    if '3-flash' in r:
        return 'Gemini 3 Flash' + effort
    if 'gemini-pro' in r:
        return 'Gemini Pro Agent'
    if 'gemini-flash' in r:
        return 'Gemini 3 Flash'

    return None

MODEL_MAP = {
    1016: "Gemini Pro Agent",
    1020: "Gemini 3 Flash",
    1026: "Gemini 3 Flash",
    1035: "Gemini 3.6 Flash",
    1036: "Gemini 3.1 Pro (Low)",
    1071: "Gemini 3.8 Flash",
    1072: "Gemini 3.7 Flash",
    1132: "Gemini 3 Flash",
    1187: "Gemini 3.5 Flash",
    1196: "Gemini 3.6 Flash",
    1298: "Gemini 3.1 Pro",
    1301: "Gemini 3.7 Flash",
    1318: "Gemini 3.8 Flash (High)",
    1319: "Gemini 3.8 Flash (Medium)",
    1320: "Gemini 3.8 Flash (Low)",
    1401: "Claude Opus 5.5 (Medium)",
    1417: "Gemini 4 Argon (High)",
    1418: "Gemini 4 Argon (Medium)",
    1427: "Gemini 4 Carbon (High)",
    1461: "Gemini 4 Hydrogen (High)",
    1525: "Gemini 4 Hydrogen (High)",
    1526: "Gemini 4 Hydrogen (Medium)",
    1528: "Gemini 4 Hydrogen (XHigh)",
    1532: "Gemini 4 Neon (High)",
    1533: "Gemini 4 Neon (Medium)",
    1535: "Gemini 4 Neon (XHigh)",
    1668: "Orchestrator (Argon)",
    1669: "Gemini Flash",
}


def fallback_context_limit(model_name):
    """Fallback context window limit when gen_metadata lacks a native limit."""
    m = (model_name or "").lower()
    if "opus 5.5" in m or "opus-5-5" in m or "opus-5.5" in m:
        return 840_000
    if "claude" in m:
        return 200_000
    if "gemini 4" in m or "orchestrator" in m:
        return 512_000
    return 1_048_576

# Pricing per 1M tokens (Standard Gemini Flash reference model)
RATE_INPUT = 0.10
RATE_CACHE = 0.025
RATE_OUTPUT = 0.40

def parse_proto(data):
    """Fast protobuf wire format parser with boundary guards"""
    pos = 0
    fields = {}
    length_data = len(data)
    while pos < length_data:
        try:
            key = 0
            shift = 0
            while True:
                if pos >= length_data or shift > 64:
                    return fields
                b = data[pos]
                pos += 1
                key |= (b & 0x7F) << shift
                shift += 7
                if not (b & 0x80):
                    break
            field_num = key >> 3
            wire_type = key & 0x7
            if wire_type == 0:  # Varint
                val = 0
                shift = 0
                while True:
                    if pos >= length_data or shift > 64:
                        return fields
                    b = data[pos]
                    pos += 1
                    val |= (b & 0x7F) << shift
                    shift += 7
                    if not (b & 0x80):
                        break
                fields.setdefault(field_num, []).append(('varint', val))
            elif wire_type == 1:  # fixed64
                if pos + 8 > length_data:
                    break
                val = struct.unpack('<Q', data[pos:pos+8])[0]
                pos += 8
                fields.setdefault(field_num, []).append(('fixed64', val))
            elif wire_type == 2:  # bytes / sub-message
                length = 0
                shift = 0
                while True:
                    if pos >= length_data or shift > 64:
                        return fields
                    b = data[pos]
                    pos += 1
                    length |= (b & 0x7F) << shift
                    shift += 7
                    if not (b & 0x80):
                        break
                if length < 0 or pos + length > length_data:
                    break
                payload = data[pos:pos+length]
                pos += length
                fields.setdefault(field_num, []).append(('bytes', payload))
            elif wire_type == 5:  # fixed32
                if pos + 4 > length_data:
                    break
                val = struct.unpack('<I', data[pos:pos+4])[0]
                pos += 4
                fields.setdefault(field_num, []).append(('fixed32', val))
            else:
                break
        except Exception:
            break
    return fields

def parse_ts(proto_bytes):
    """Decodes google.protobuf.Timestamp or Duration (seconds + nanoseconds) to float seconds."""
    if not proto_bytes:
        return None
    p = parse_proto(proto_bytes)
    sec = p.get(1, [('varint', 0)])[0][1]
    nsec = p.get(2, [('varint', 0)])[0][1]
    if sec == 0 and nsec == 0:
        return 0.0
    return sec + nsec / 1e9

def step_perf_metrics(out, text_out, thinking, stream_sec, e2e_sec):
    """Computes clean streaming & E2E output token/duration pairs, filtering sleep stalls and silent-thinking bursts."""
    is_stalled_stream = (stream_sec is not None and stream_sec > 300 and (out / stream_sec) < 2.0)
    is_stalled_e2e = (e2e_sec is not None and e2e_sec > 600 and (out / e2e_sec) < 2.0)

    s_out, s_dur = 0, 0.0
    if stream_sec is not None and stream_sec >= 0.1 and out > 0 and not is_stalled_stream:
        # When thinking finished silently before first visible token, only text_out streamed in stream_sec
        if thinking > 0 and stream_sec < 1.0 and (out / stream_sec) > 1200:
            s_out = text_out if text_out > 0 else 0
        else:
            s_out = out
        if s_out > 0:
            s_dur = stream_sec

    e_out, e_dur = 0, 0.0
    if e2e_sec is not None and e2e_sec >= 0.05 and out > 0 and not is_stalled_e2e:
        e_out = out
        e_dur = e2e_sec

    stream_tps = round(s_out / s_dur, 1) if (s_dur >= 0.25 and s_out > 0 and (s_out / s_dur) <= 2000) else None
    e2e_tps = round(e_out / e_dur, 1) if (e_dur >= 0.05 and e_out > 0) else None
    return s_out, s_dur, e_out, e_dur, stream_tps, e2e_tps

def percentile(values, p):
    """Computes percentile p (0-100) on a list of numbers via linear interpolation."""
    if not values:
        return None
    s = sorted(values)
    if len(s) == 1:
        return round(s[0], 3)
    k = (len(s) - 1) * (p / 100.0)
    f = int(k)
    c = min(f + 1, len(s) - 1)
    val = s[f] + (k - f) * (s[c] - s[f])
    return round(val, 3)

def get_effective_db_mtime(db_path):
    """Returns max mtime of .db and its active SQLite -wal file for live detection."""
    try:
        mt = os.path.getmtime(db_path)
    except OSError:
        mt = 0.0
    wal_path = db_path + "-wal"
    if os.path.exists(wal_path):
        try:
            mt = max(mt, os.path.getmtime(wal_path))
        except OSError:
            pass
    return mt

def open_readonly_db(db_path):
    """Opens an SQLite database in safe read-only WAL mode (with read-only mount fallback)"""
    db_uri = Path(os.path.abspath(db_path)).as_uri()
    uri = f"{db_uri}?mode=ro"
    con = None
    try:
        con = sqlite3.connect(uri, uri=True, timeout=5.0)
        con.execute("PRAGMA busy_timeout = 3000;")
        con.execute("PRAGMA query_only = ON;")
        con.execute("SELECT 1 FROM sqlite_master LIMIT 1;").fetchone()
        return con
    except sqlite3.OperationalError:
        if con is not None:
            try:
                con.close()
            except Exception:
                pass
        # Fallback to immutable snapshot if exclusive write lock or read-only volume prevents -shm creation
        imm_uri = f"{db_uri}?mode=ro&immutable=1"
        return sqlite3.connect(imm_uri, uri=True, timeout=2.0)

def _parse_context_snapshot(sub1):
    """Extracts native context window usage, limit, and category breakdown from gen_metadata sub1[9][10]."""
    if 9 not in sub1 or not sub1[9]:
        return None
    k9 = parse_proto(sub1[9][0][1])
    if 10 not in k9 or not k9[10]:
        return None
    k9_10 = parse_proto(k9[10][0][1])
    est_tokens = k9_10.get(1, [('varint', 0)])[0][1]
    compacted_flag = k9_10.get(2, [('varint', 0)])[0][1]
    limit_tokens = k9_10.get(4, [('varint', 0)])[0][1]

    categories = []
    if 3 in k9_10 and k9_10[3]:
        c3 = parse_proto(k9_10[3][0][1])
        for _, cb in c3.get(1, []):
            cf = parse_proto(cb)
            cname = cf.get(1, [('bytes', b'')])[0][1].decode('utf-8', errors='ignore').strip()
            if not cname:
                continue
            cid = cf.get(2, [('varint', 0)])[0][1]
            is_system = bool(cf.get(3, [('varint', 0)])[0][1])
            ctok = cf.get(4, [('varint', 0)])[0][1]
            items = []
            for _, ib in cf.get(5, []):
                ip = parse_proto(ib)
                iname = ip.get(1, [('bytes', b'')])[0][1].decode('utf-8', errors='ignore').strip()
                itok = ip.get(3, [('varint', 0)])[0][1]
                if iname or itok > 0:
                    items.append({"name": iname or "item", "tokens": itok})
            items.sort(key=lambda x: x["tokens"], reverse=True)
            categories.append({
                "name": cname,
                "category_id": cid,
                "is_system": is_system,
                "tokens": ctok,
                "item_count": len(items),
                "items": items[:40],
            })
    categories.sort(key=lambda x: x["tokens"], reverse=True)
    if est_tokens <= 0 and limit_tokens <= 0 and not categories:
        return None
    return {
        "est_tokens": est_tokens,
        "compacted_flag": compacted_flag,
        "limit_tokens": limit_tokens,
        "categories": categories,
    }


def _extract_gen_metadata(cur):
    """Extracts step->model, ordered model list, model_id->model, fallback usage rows, and context snapshots from gen_metadata."""
    gm_step_models = {}
    gm_id_models = {}
    gm_ordered_models = []
    fallback_rows = []
    latest_ctx = None
    ctx_by_step = {}
    ctx_ordered = []
    try:
        rows = cur.execute('SELECT idx, data FROM gen_metadata ORDER BY idx ASC').fetchall()
        for gm_idx, data in rows:
            if not data:
                continue
            try:
                top = parse_proto(data)
                top3_slug = ""
                if 3 in top and top[3]:
                    top3 = parse_proto(top[3][0][1])
                    if 28 in top3 and top3[28]:
                        top3_slug = top3[28][0][1].decode('utf-8', errors='ignore').strip()

                for _, p1 in top.get(1, []):
                    sub1 = parse_proto(p1)
                    model_id = None
                    usage_vals = None
                    if 4 in sub1 and sub1[4]:
                        usage = parse_proto(sub1[4][0][1])
                        model_id = usage.get(1, [('varint', 0)])[0][1]
                        usage_vals = usage

                    display_name = None
                    if 21 in sub1 and sub1[21]:
                        raw_label = sub1[21][0][1].decode('utf-8', errors='ignore').strip()
                        if raw_label:
                            display_name = raw_label
                    if not display_name and top3_slug:
                        display_name = normalize_model_name(top3_slug)
                    if not display_name and 19 in sub1 and sub1[19]:
                        slug = sub1[19][0][1].decode('utf-8', errors='ignore').strip()
                        display_name = normalize_model_name(slug)

                    last_step_idx = None
                    for _, item in sub1.get(20, []):
                        kv = parse_proto(item)
                        if 1 in kv and 2 in kv:
                            k = kv[1][0][1].decode('utf-8', errors='ignore')
                            v = kv[2][0][1].decode('utf-8', errors='ignore')
                            if k == 'last_step_index' and v.isdigit():
                                last_step_idx = int(v)

                    ctx_snap = _parse_context_snapshot(sub1)
                    if ctx_snap is not None:
                        latest_ctx = ctx_snap
                        step_ctx = {
                            "used": ctx_snap["est_tokens"],
                            "limit": ctx_snap["limit_tokens"],
                        }
                        ctx_ordered.append(step_ctx)
                        if last_step_idx is not None:
                            ctx_by_step[last_step_idx + 1] = step_ctx
                            ctx_by_step.setdefault(last_step_idx, step_ctx)
                    elif usage_vals is not None:
                        ctx_ordered.append(None)

                    if display_name:
                        if model_id:
                            gm_id_models[model_id] = display_name
                        if last_step_idx is not None:
                            gm_step_models[last_step_idx + 1] = display_name
                            gm_step_models.setdefault(last_step_idx, display_name)
                    if usage_vals is not None or display_name:
                        gm_ordered_models.append(display_name)
                    if usage_vals is not None:
                        fallback_rows.append((gm_idx, usage_vals, display_name))
            except Exception:
                pass
    except Exception:
        pass
    return gm_step_models, gm_id_models, gm_ordered_models, fallback_rows, latest_ctx, ctx_by_step, ctx_ordered


def _build_session_context(latest_ctx, latest_api_prompt, latest_model):
    """Builds normalized context window usage & category breakdown payload for a session."""
    if latest_ctx is not None:
        used_tokens = latest_ctx["est_tokens"] or latest_api_prompt
        limit_tokens = latest_ctx["limit_tokens"] or fallback_context_limit(latest_model)
        source = "db_native"
        compacted = bool(latest_ctx["compacted_flag"])
        raw_cats = latest_ctx["categories"]
    else:
        used_tokens = latest_api_prompt
        limit_tokens = fallback_context_limit(latest_model)
        source = "fallback_estimate"
        compacted = False
        raw_cats = []

    free_tokens = max(0, limit_tokens - used_tokens) if limit_tokens > 0 else 0
    used_pct = round(min(100.0, (used_tokens / limit_tokens) * 100.0), 1) if limit_tokens > 0 else None
    free_pct = round(max(0.0, 100.0 - used_pct), 1) if used_pct is not None else None

    categories = []
    system_tokens = 0
    chat_tokens = 0
    for cat in raw_cats:
        ctok = int(cat.get("tokens") or 0)
        if cat.get("is_system"):
            system_tokens += ctok
        else:
            chat_tokens += ctok
        categories.append({
            "name": cat["name"],
            "category_id": cat.get("category_id", 0),
            "is_system": bool(cat.get("is_system")),
            "tokens": ctok,
            "pct_of_limit": round((ctok / limit_tokens) * 100.0, 1) if limit_tokens > 0 else 0.0,
            "pct_of_used": round((ctok / used_tokens) * 100.0, 1) if used_tokens > 0 else 0.0,
            "item_count": cat.get("item_count", len(cat.get("items") or [])),
            "items": cat.get("items") or [],
        })
    if not categories and used_tokens > 0:
        chat_tokens = used_tokens

    return {
        "used_tokens": used_tokens,
        "limit_tokens": limit_tokens,
        "free_tokens": free_tokens,
        "used_pct": used_pct,
        "free_pct": free_pct,
        "api_prompt_tokens": latest_api_prompt,
        "system_tokens": system_tokens,
        "chat_tokens": chat_tokens,
        "compacted": compacted,
        "source": source,
        "categories": categories,
    }

def parse_session_db(db_path, surface="IDE", brain_dir=None):
    """Parses a single conversation SQLite database safely"""
    if not os.path.exists(db_path) or os.path.getsize(db_path) == 0:
        return None

    convo_id = os.path.splitext(os.path.basename(db_path))[0]
    
    try:
        with closing(open_readonly_db(db_path)) as con:
            cur = con.cursor()

            # 1. Extract model mappings & context telemetry from gen_metadata
            gm_step_models, gm_id_models, gm_ordered_models, gm_fallback_rows, latest_ctx, ctx_by_step, ctx_ordered = _extract_gen_metadata(cur)

            # 1.5 Fallback executor_metadata model slugs
            exec_step_models = {}
            try:
                for s_idx, data in cur.execute('SELECT idx, data FROM executor_metadata ORDER BY idx ASC').fetchall():
                    if data:
                        txt = data.decode('latin-1', errors='ignore')
                        for m in re.findall(r'(?:gemini-[a-zA-Z0-9\.\-]+|claude-[a-zA-Z0-9\.\-]+)', txt):
                            norm = normalize_model_name(m)
                            if norm:
                                exec_step_models[s_idx] = norm
                                break
            except Exception:
                pass

            # 2. Extract PLANNER_RESPONSE steps (step_type = 15) with exact nanosecond timestamps & usage
            steps_data = []
            step_times = {}
            session_models_used = []
            unresolved_model_steps = set()
            p15_ordinal = 0
            try:
                rows = cur.execute(
                    'SELECT idx, step_type, metadata, step_payload FROM steps WHERE metadata IS NOT NULL ORDER BY idx ASC'
                ).fetchall()
                for idx, step_type, meta, payload in rows:
                    try:
                        s_proto = parse_proto(meta)
                        t1 = parse_ts(s_proto[1][0][1]) if 1 in s_proto and s_proto[1] else None
                        if t1 is not None:
                            step_times[idx] = int(t1)
                        if step_type != 15 or 9 not in s_proto or not s_proto[9]:
                            continue

                        usage = parse_proto(s_proto[9][0][1])
                        model_id = usage.get(1, [('varint', 0)])[0][1]
                        inp = usage.get(2, [('varint', 0)])[0][1]
                        out = usage.get(3, [('varint', 0)])[0][1]
                        cached = usage.get(5, [('varint', 0)])[0][1]
                        text_out = usage.get(9, [('varint', 0)])[0][1]
                        thinking = usage.get(10, [('varint', 0)])[0][1]

                        t6 = parse_ts(s_proto[6][0][1]) if 6 in s_proto and s_proto[6] else None
                        t7 = parse_ts(s_proto[7][0][1]) if 7 in s_proto and s_proto[7] else None

                        think_sec = None
                        if payload:
                            pp = parse_proto(payload)
                            if 20 in pp and pp[20]:
                                p20 = parse_proto(pp[20][0][1])
                                if 11 in p20 and p20[11]:
                                    td = parse_ts(p20[11][0][1])
                                    if td is not None and td > 0:
                                        think_sec = round(td, 3)

                        ttft_sec = round(max(0.0, t6 - t1), 3) if (t1 and t6 and t6 >= t1) else None
                        stream_sec = round(max(0.0, t7 - t6), 3) if (t6 and t7 and t7 >= t6) else None
                        e2e_sec = round(max(0.0, t7 - t1), 3) if (t1 and t7 and t7 >= t1) else None

                        s_out, s_dur, e_out, e_dur, stream_tps, e2e_tps = step_perf_metrics(out, text_out, thinking, stream_sec, e2e_sec)
                        step_cache_pct = round((cached / (cached + inp)) * 100, 1) if (cached + inp) > 0 else 0.0

                        ordered_model = (
                            gm_ordered_models[p15_ordinal]
                            if p15_ordinal < len(gm_ordered_models) and gm_ordered_models[p15_ordinal]
                            else None
                        )
                        resolved_model = (
                            gm_step_models.get(idx)
                            or ordered_model
                            or gm_id_models.get(model_id)
                            or MODEL_MAP.get(model_id)
                            or exec_step_models.get(idx)
                        )
                        if not resolved_model:
                            unresolved_model_steps.add(len(steps_data))
                        step_model = resolved_model or "Gemini 3.8 Flash"

                        step_ctx = ctx_by_step.get(idx) or (
                            ctx_ordered[p15_ordinal]
                            if p15_ordinal < len(ctx_ordered) and ctx_ordered[p15_ordinal]
                            else None
                        )
                        ctx_used = step_ctx.get("used") if step_ctx else None
                        ctx_limit = (step_ctx.get("limit") if step_ctx else None) or (
                            latest_ctx["limit_tokens"] if latest_ctx else None
                        )
                        ctx_pct = (
                            round(min(100.0, (ctx_used / ctx_limit) * 100.0), 1)
                            if (ctx_used is not None and ctx_limit and ctx_limit > 0)
                            else None
                        )

                        p15_ordinal += 1
                        session_models_used.append(step_model)

                        ts = int(t1) if t1 else int(os.path.getmtime(db_path))
                        steps_data.append({
                            "idx": idx,
                            "timestamp": ts,
                            "date": datetime.fromtimestamp(ts).strftime('%Y-%m-%d'),
                            "model": step_model,
                            "input_tokens": inp,
                            "cached_tokens": cached,
                            "cache_hit_rate_pct": step_cache_pct,
                            "output_tokens": out,
                            "text_tokens": text_out,
                            "thinking_tokens": thinking,
                            "total_tokens": inp + cached + out,
                            "ttft_sec": ttft_sec,
                            "stream_sec": stream_sec,
                            "e2e_sec": e2e_sec,
                            "think_sec": think_sec,
                            "stream_out": s_out,
                            "stream_dur": s_dur,
                            "e2e_out": e_out,
                            "e2e_dur": e_dur,
                            "stream_tps": stream_tps,
                            "e2e_tps": e2e_tps,
                            "ctx_used": ctx_used,
                            "ctx_limit": ctx_limit,
                            "ctx_pct": ctx_pct,
                        })
                    except Exception:
                        pass
            except Exception:
                pass

            # Fallback to gen_metadata usage rows only if steps had no step_type=15 metrics
            if not steps_data and gm_fallback_rows:
                for gm_idx, usage, display_name in gm_fallback_rows:
                    model_id = usage.get(1, [('varint', 0)])[0][1]
                    inp = usage.get(2, [('varint', 0)])[0][1]
                    out = usage.get(3, [('varint', 0)])[0][1]
                    cached = usage.get(5, [('varint', 0)])[0][1]
                    text_out = usage.get(9, [('varint', 0)])[0][1]
                    thinking = usage.get(10, [('varint', 0)])[0][1]
                    resolved_model = display_name or gm_id_models.get(model_id) or MODEL_MAP.get(model_id) or exec_step_models.get(gm_idx)
                    if not resolved_model:
                        unresolved_model_steps.add(len(steps_data))
                    step_model = resolved_model or "Gemini 3.8 Flash"
                    session_models_used.append(step_model)
                    ts = step_times.get(gm_idx) or int(os.path.getmtime(db_path))
                    step_cache_pct = round((cached / (cached + inp)) * 100, 1) if (cached + inp) > 0 else 0.0
                    steps_data.append({
                        "idx": gm_idx,
                        "timestamp": ts,
                        "date": datetime.fromtimestamp(ts).strftime('%Y-%m-%d'),
                        "model": step_model,
                        "input_tokens": inp,
                        "cached_tokens": cached,
                        "cache_hit_rate_pct": step_cache_pct,
                        "output_tokens": out,
                        "text_tokens": text_out,
                        "thinking_tokens": thinking,
                        "total_tokens": inp + cached + out,
                        "ttft_sec": None,
                        "stream_sec": None,
                        "e2e_sec": None,
                        "think_sec": None,
                        "stream_tps": None,
                        "e2e_tps": None,
                        "ctx_used": None,
                        "ctx_limit": None,
                        "ctx_pct": None,
                    })

            model_name = Counter(session_models_used).most_common(1)[0][0] if session_models_used else "Gemini 3.8 Flash"

            # 2.5 Extract project / workspace name
            project_name = "General"
            workspace_path = ""
            try:
                row = cur.execute('SELECT data FROM trajectory_metadata_blob').fetchone()
                if row and row[0]:
                    text = row[0].decode('latin-1', errors='ignore')
                    m = re.search(r'file:///([^\x00-\x20\x7f-\xff]+)', text)
                    if m:
                        raw_path = urllib.parse.unquote(m.group(1))
                        workspace_path = raw_path
                        parts = [p for p in re.split(r'[/\\]+', raw_path.rstrip('/\\')) if p]
                        folder = parts[-1] if parts else ""
                        if folder:
                            project_name = folder
            except Exception:
                pass
    except Exception as err:
        sys.stderr.write(f"Warning: could not read {db_path}: {err}\n")
        return None
    
    if not steps_data:
        return None

    # 3. Read transcript tool calls and errors across candidate brain directories
    g_home = get_gemini_home()
    candidate_brains = [
        os.path.join(g_home, "antigravity-ide", "brain"),
        os.path.join(g_home, "antigravity", "brain"),
        os.path.join(g_home, "antigravity-cli", "brain"),
    ]
    if brain_dir and brain_dir not in candidate_brains:
        candidate_brains.insert(0, brain_dir)

    transcript_path = None
    for b_dir in candidate_brains:
        tp = os.path.join(b_dir, convo_id, ".system_generated", "logs", "transcript.jsonl")
        if os.path.exists(tp):
            transcript_path = tp
            break

    tool_counts = defaultdict(int)
    tool_errors = 0
    first_prompt = ""
    transcript_step_models = {}
    
    if transcript_path and os.path.exists(transcript_path):
        try:
            with open(transcript_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    try:
                        step = json.loads(line)
                        stype = step.get("type", "")
                        status = step.get("status", "")
                        if stype == "USER_INPUT" and not first_prompt:
                            raw_p = step.get("content", "")
                            clean_p = re.sub(r'<[^>]+>', ' ', raw_p).strip()
                            clean_p = ' '.join(clean_p.split())
                            if clean_p:
                                first_prompt = clean_p[:90]
                        if stype == "PLANNER_RESPONSE" and step.get("model"):
                            norm_tm = normalize_model_name(str(step.get("model")))
                            if norm_tm and step.get("step_index") is not None:
                                transcript_step_models[step.get("step_index")] = norm_tm
                        if "tool_calls" in step:
                            for tc in step["tool_calls"]:
                                name = tc.get("name", tc.get("toolAction", "unknown"))
                                tool_counts[name] += 1
                        # Capture tool execution errors and error messages
                        if status == "ERROR" or stype == "ERROR_MESSAGE":
                            tool_errors += 1
                    except Exception:
                        pass
        except Exception:
            pass

    if unresolved_model_steps and transcript_step_models:
        for pos in unresolved_model_steps:
            st = steps_data[pos]
            tm = transcript_step_models.get(st["idx"])
            if tm:
                st["model"] = tm
        model_name = Counter(st["model"] for st in steps_data).most_common(1)[0][0]

    latest_api_prompt = (steps_data[-1]["input_tokens"] + steps_data[-1]["cached_tokens"]) if steps_data else 0
    latest_step_model = steps_data[-1]["model"] if steps_data else model_name
    context_info = _build_session_context(latest_ctx, latest_api_prompt, latest_step_model)

    total_input = sum(s["input_tokens"] for s in steps_data)
    total_cached = sum(s["cached_tokens"] for s in steps_data)
    total_output = sum(s["output_tokens"] for s in steps_data)
    total_thinking = sum(s["thinking_tokens"] for s in steps_data)

    ttfts = [s["ttft_sec"] for s in steps_data if s.get("ttft_sec") is not None]
    stream_tps_vals = [s["stream_tps"] for s in steps_data if s.get("stream_tps") is not None]
    think_durs = [s["think_sec"] for s in steps_data if s.get("think_sec") is not None and s["think_sec"] > 0]

    valid_stream_out = sum(s.get("stream_out", 0) for s in steps_data)
    valid_stream_dur = sum(s.get("stream_dur", 0.0) for s in steps_data)
    valid_e2e_out = sum(s.get("e2e_out", 0) for s in steps_data)
    valid_e2e_dur = sum(s.get("e2e_dur", 0.0) for s in steps_data)

    avg_ttft = round(sum(ttfts) / len(ttfts), 3) if ttfts else None
    p50_ttft = percentile(ttfts, 50)
    p90_ttft = percentile(ttfts, 90)
    avg_stream_tps = round(valid_stream_out / valid_stream_dur, 1) if valid_stream_dur > 0 else None
    peak_stream_tps = round(max(stream_tps_vals), 1) if stream_tps_vals else None
    avg_e2e_tps = round(valid_e2e_out / valid_e2e_dur, 1) if valid_e2e_dur > 0 else None
    total_think_sec = round(sum(think_durs), 3) if think_durs else 0.0
    avg_think_sec = round(total_think_sec / len(think_durs), 3) if think_durs else None
    cache_hit_rate = round((total_cached / (total_cached + total_input)) * 100, 1) if (total_cached + total_input) > 0 else 0.0

    db_mtime = get_effective_db_mtime(db_path)
    start_ts = steps_data[0]["timestamp"] if steps_data else int(db_mtime)
    end_ts = steps_data[-1]["timestamp"] if steps_data else start_ts
    # Use the LATEST of (last step timestamp, db mtime) as the session's active date.
    # This ensures sessions that span midnight always appear in the correct day's view.
    last_active_ts = max(end_ts, int(db_mtime))
    
    return {
        "schema_version": CACHE_SCHEMA_VERSION,
        "convo_id": convo_id,
        "mtime": db_mtime,
        "last_active_ts": last_active_ts,
        "last_active_at": datetime.fromtimestamp(last_active_ts).strftime('%Y-%m-%d %H:%M:%S'),
        "surface": surface,
        "created_at": datetime.fromtimestamp(start_ts).strftime('%Y-%m-%d %H:%M:%S'),
        "date": datetime.fromtimestamp(last_active_ts).strftime('%Y-%m-%d'),
        "duration_sec": max(0, end_ts - start_ts),
        "model": model_name,
        "project": project_name,
        "workspace_path": workspace_path,
        "title": first_prompt if first_prompt else f"Session {convo_id[:8]}",
        "turn_count": len(steps_data),
        "input_tokens": total_input,
        "cached_tokens": total_cached,
        "cache_hit_rate_pct": cache_hit_rate,
        "output_tokens": total_output,
        "thinking_tokens": total_thinking,
        "total_tokens": total_input + total_cached + total_output,
        "avg_ttft_sec": avg_ttft,
        "p50_ttft_sec": p50_ttft,
        "p90_ttft_sec": p90_ttft,
        "avg_stream_tps": avg_stream_tps,
        "peak_stream_tps": peak_stream_tps,
        "avg_e2e_tps": avg_e2e_tps,
        "avg_think_sec": avg_think_sec,
        "total_think_sec": total_think_sec,
        "think_steps": len(think_durs),
        "valid_stream_out": valid_stream_out,
        "valid_stream_dur": round(valid_stream_dur, 4),
        "valid_e2e_out": valid_e2e_out,
        "valid_e2e_dur": round(valid_e2e_dur, 4),
        "context": context_info,
        "steps_detail": steps_data,
        "tool_counts": dict(tool_counts),
        "tool_errors": tool_errors
    }

def sync_all_sessions(force=False):
    """Incremental sync across all Antigravity surfaces with thread-safe cache and atomic save"""
    with _SYNC_LOCK:
        return _sync_all_sessions_unlocked(force=force)


def _sync_all_sessions_unlocked(force=False):
    cache_file = get_cache_file()
    fallback_file = _fallback_cache_file()
    read_candidates = [cache_file] + ([fallback_file] if fallback_file != cache_file else [])

    cache = {"sessions": {}, "last_sync": 0}
    if not force:
        for cf in read_candidates:
            if os.path.exists(cf):
                try:
                    with open(cf, 'r', encoding='utf-8') as f:
                        cache = json.load(f)
                    break
                except Exception:
                    cache = {"sessions": {}, "last_sync": 0}

    cached_sessions = cache.get("sessions", {})
    updated = False
    found_any_source = False

    for src in get_data_sources():
        root = src["root"]
        surface = src["name"]
        convos_dir = os.path.join(root, "conversations")
        brain_dir = os.path.join(root, "brain")
        if not os.path.exists(convos_dir):
            continue
        found_any_source = True

        db_files = glob.glob(os.path.join(convos_dir, "*.db"))
        for db_path in db_files:
            try:
                if not os.path.exists(db_path) or os.path.getsize(db_path) == 0:
                    continue
                convo_id = os.path.splitext(os.path.basename(db_path))[0]
                mtime = get_effective_db_mtime(db_path)
                
                # Check cache validity
                # Re-parse if: mtime changed, schema_version outdated, model name legacy, or crossed midnight
                cached_entry = cached_sessions.get(convo_id)
                if (
                    cached_entry
                    and cached_entry.get("mtime") == mtime
                    and cached_entry.get("surface")
                    and cached_entry.get("schema_version") == CACHE_SCHEMA_VERSION
                    and "avg_ttft_sec" in cached_entry
                    and "context" in cached_entry
                ):
                    old_m = cached_entry.get("model", "")
                    if any(dep in old_m for dep in ["1.5", "2.5", "ID:", "Thinking Exp", "Flash 8B"]):
                        pass  # re-parse for model name fix
                    elif cached_entry.get("date") != datetime.fromtimestamp(mtime).strftime('%Y-%m-%d'):
                        pass  # re-parse: session crossed midnight since last cache write
                    else:
                        continue
                    
                # Parse database
                session_info = parse_session_db(db_path, surface=surface, brain_dir=brain_dir)
                if session_info and session_info.get("turn_count", 0) > 0:
                    cached_sessions[convo_id] = session_info
                    updated = True
            except Exception as e:
                sys.stderr.write(f"Warning: skipped {db_path}: {e}\n")
            
    if updated or (not any(os.path.exists(cf) for cf in read_candidates) and found_any_source):
        cache["sessions"] = cached_sessions
        cache["last_sync"] = int(datetime.now().timestamp())
        wrote = False
        last_err = None
        for target_cf in read_candidates:
            tmp_file = f"{target_cf}.{os.getpid()}.{threading.get_ident()}.tmp"
            try:
                os.makedirs(os.path.dirname(target_cf), exist_ok=True)
                with open(tmp_file, 'w', encoding='utf-8') as f:
                    json.dump(cache, f)
                os.replace(tmp_file, target_cf)
                wrote = True
                break
            except Exception as e:
                last_err = e
                try:
                    if os.path.exists(tmp_file):
                        os.remove(tmp_file)
                except OSError:
                    pass
        if not wrote and last_err is not None:
            sys.stderr.write(f"Warning: Cache write failed: {last_err}\n")

    return cached_sessions

def generate_analytics(sessions, start_date=None, end_date=None, since_ts=None):
    """Calculates comprehensive time-range statistics with cost, streaks, TTFT, TPS, and hourly flow"""
    filtered_sessions = []
    
    for s in sessions.values():
        s_date = s.get("date")
        if not s_date:
            continue
        if start_date and s_date < start_date:
            continue
        if end_date and s_date > end_date:
            continue
        if since_ts is not None:
            steps_det = s.get("steps_detail")
            if steps_det:
                matching = [st for st in steps_det if st.get("timestamp", 0) >= since_ts]
                if not matching:
                    continue
                if len(matching) != len(steps_det):
                    s_copy = dict(s)
                    m_inp = sum(st.get("input_tokens", 0) for st in matching)
                    m_cached = sum(st.get("cached_tokens", 0) for st in matching)
                    m_out = sum(st.get("output_tokens", 0) for st in matching)
                    m_think = sum(st.get("thinking_tokens", 0) for st in matching)
                    m_ttfts = [st["ttft_sec"] for st in matching if st.get("ttft_sec") is not None]
                    m_stps = [st["stream_tps"] for st in matching if st.get("stream_tps") is not None]
                    m_thk_durs = [st["think_sec"] for st in matching if st.get("think_sec") is not None and st["think_sec"] > 0]
                    m_s_out = sum(st.get("stream_out", 0) for st in matching)
                    m_s_dur = sum(st.get("stream_dur", 0.0) for st in matching)
                    m_e_out = sum(st.get("e2e_out", 0) for st in matching)
                    m_e_dur = sum(st.get("e2e_dur", 0.0) for st in matching)
                    s_copy["steps_detail"] = matching
                    s_copy["turn_count"] = len(matching)
                    s_copy["input_tokens"] = m_inp
                    s_copy["cached_tokens"] = m_cached
                    s_copy["output_tokens"] = m_out
                    s_copy["thinking_tokens"] = m_think
                    s_copy["total_tokens"] = m_inp + m_cached + m_out
                    s_copy["cache_hit_rate_pct"] = round((m_cached / (m_cached + m_inp)) * 100, 1) if (m_cached + m_inp) > 0 else 0.0
                    s_copy["avg_ttft_sec"] = round(sum(m_ttfts) / len(m_ttfts), 3) if m_ttfts else None
                    s_copy["p50_ttft_sec"] = percentile(m_ttfts, 50)
                    s_copy["p90_ttft_sec"] = percentile(m_ttfts, 90)
                    s_copy["avg_stream_tps"] = round(m_s_out / m_s_dur, 1) if m_s_dur > 0 else None
                    s_copy["peak_stream_tps"] = round(max(m_stps), 1) if m_stps else None
                    s_copy["avg_e2e_tps"] = round(m_e_out / m_e_dur, 1) if m_e_dur > 0 else None
                    s_copy["total_think_sec"] = round(sum(m_thk_durs), 3) if m_thk_durs else 0.0
                    s_copy["avg_think_sec"] = round(s_copy["total_think_sec"] / len(m_thk_durs), 3) if m_thk_durs else None
                    s_copy["valid_stream_out"] = m_s_out
                    s_copy["valid_stream_dur"] = round(m_s_dur, 4)
                    s_copy["valid_e2e_out"] = m_e_out
                    s_copy["valid_e2e_dur"] = round(m_e_dur, 4)
                    s_copy["model"] = Counter(st.get("model", s.get("model", "")) for st in matching).most_common(1)[0][0]
                    s_copy["created_at"] = datetime.fromtimestamp(matching[0]["timestamp"]).strftime('%Y-%m-%d %H:%M:%S')
                    s_copy["date"] = datetime.fromtimestamp(matching[-1]["timestamp"]).strftime('%Y-%m-%d')
                    filtered_sessions.append(s_copy)
                    continue
            elif s.get("mtime", 0) < since_ts:
                continue
        filtered_sessions.append(s)
        
    total_input = sum(s.get("input_tokens", 0) for s in filtered_sessions)
    total_cached = sum(s.get("cached_tokens", 0) for s in filtered_sessions)
    total_output = sum(s.get("output_tokens", 0) for s in filtered_sessions)
    total_thinking = sum(s.get("thinking_tokens", 0) for s in filtered_sessions)
    total_tokens = total_input + total_cached + total_output
    total_turns = sum(s.get("turn_count", 0) for s in filtered_sessions)

    # Global TTFT, TPS, and Thinking Duration aggregation
    all_ttfts = []
    all_stream_tps = []
    all_think_durs = []
    tot_stream_out = 0
    tot_stream_dur = 0.0
    tot_e2e_out = 0
    tot_e2e_dur = 0.0

    for s in filtered_sessions:
        steps_det = s.get("steps_detail")
        if steps_det:
            for st in steps_det:
                if st.get("ttft_sec") is not None:
                    all_ttfts.append(st["ttft_sec"])
                if st.get("stream_tps") is not None:
                    all_stream_tps.append(st["stream_tps"])
                if st.get("think_sec") is not None and st["think_sec"] > 0:
                    all_think_durs.append(st["think_sec"])
                tot_stream_out += st.get("stream_out", 0)
                tot_stream_dur += st.get("stream_dur", 0.0)
                tot_e2e_out += st.get("e2e_out", 0)
                tot_e2e_dur += st.get("e2e_dur", 0.0)
        else:
            tot_stream_out += s.get("valid_stream_out", 0)
            tot_stream_dur += s.get("valid_stream_dur", 0.0)
            tot_e2e_out += s.get("valid_e2e_out", 0)
            tot_e2e_dur += s.get("valid_e2e_dur", 0.0)

    avg_ttft_sec = round(sum(all_ttfts) / len(all_ttfts), 3) if all_ttfts else None
    p50_ttft_sec = percentile(all_ttfts, 50)
    p90_ttft_sec = percentile(all_ttfts, 90)
    min_ttft_sec = round(min(all_ttfts), 3) if all_ttfts else None
    max_ttft_sec = round(max(all_ttfts), 3) if all_ttfts else None

    avg_stream_tps = round(tot_stream_out / tot_stream_dur, 1) if tot_stream_dur > 0 else None
    p50_stream_tps = round(percentile(all_stream_tps, 50), 1) if all_stream_tps else None
    peak_stream_tps = round(max(all_stream_tps), 1) if all_stream_tps else None
    avg_e2e_tps = round(tot_e2e_out / tot_e2e_dur, 1) if tot_e2e_dur > 0 else None

    total_think_sec = round(sum(all_think_durs), 2) if all_think_durs else 0.0
    avg_think_sec = round(total_think_sec / len(all_think_durs), 3) if all_think_durs else None
    
    # Cost & Savings Calculation
    est_spend = (total_input * RATE_INPUT + total_cached * RATE_CACHE + total_output * RATE_OUTPUT) / 1_000_000
    cost_without_cache = ((total_input + total_cached) * RATE_INPUT + total_output * RATE_OUTPUT) / 1_000_000
    dollars_saved = max(0.0, cost_without_cache - est_spend)
    savings_pct = (dollars_saved / cost_without_cache * 100) if cost_without_cache > 0 else 0.0

    # Daily aggregation (including TTFT / TPS / Cache Hit Rate)
    daily = defaultdict(lambda: {
        "input": 0, "cached": 0, "output": 0, "thinking": 0, "total": 0,
        "sessions": 0, "turns": 0, "_ttfts": [], "_s_out": 0, "_s_dur": 0.0, "_e_out": 0, "_e_dur": 0.0
    })
    for s in filtered_sessions:
        d = s["date"]
        daily[d]["input"] += s.get("input_tokens", 0)
        daily[d]["cached"] += s.get("cached_tokens", 0)
        daily[d]["output"] += s.get("output_tokens", 0)
        daily[d]["thinking"] += s.get("thinking_tokens", 0)
        daily[d]["total"] += s.get("total_tokens", 0)
        daily[d]["sessions"] += 1
        daily[d]["turns"] += s.get("turn_count", 0)
        if s.get("steps_detail"):
            for st in s["steps_detail"]:
                if st.get("ttft_sec") is not None:
                    daily[d]["_ttfts"].append(st["ttft_sec"])
                daily[d]["_s_out"] += st.get("stream_out", 0)
                daily[d]["_s_dur"] += st.get("stream_dur", 0.0)
                daily[d]["_e_out"] += st.get("e2e_out", 0)
                daily[d]["_e_dur"] += st.get("e2e_dur", 0.0)
        
    # Hourly Flow Distribution (24 hours)
    hourly = [{"hour": h, "sessions": 0, "turns": 0, "tokens": 0} for h in range(24)]
    for s in filtered_sessions:
        created_at = s.get("created_at", "")
        if created_at and len(created_at) >= 13:
            try:
                hr = int(created_at[11:13])
                if 0 <= hr < 24:
                    hourly[hr]["sessions"] += 1
                    hourly[hr]["turns"] += s.get("turn_count", 0)
                    hourly[hr]["tokens"] += s.get("total_tokens", 0)
            except Exception:
                pass

    # Streaks and consistency
    dates_list = sorted(list(set(s.get("date") for s in filtered_sessions if s.get("date"))))
    current_streak = 0
    longest_streak = 0
    if dates_list:
        date_objs = [datetime.strptime(d, '%Y-%m-%d').date() for d in dates_list]
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(date_objs)):
            if (date_objs[i] - date_objs[i-1]).days == 1:
                temp_streak += 1
                if temp_streak > longest_streak:
                    longest_streak = temp_streak
            else:
                temp_streak = 1
        today = datetime.now().date()
        date_set = set(date_objs)
        check = today if today in date_set else (today - timedelta(days=1) if (today - timedelta(days=1)) in date_set else None)
        if check:
            while check in date_set:
                current_streak += 1
                check -= timedelta(days=1)

    # Tool aggregation
    all_tools = defaultdict(int)
    total_tool_errors = 0
    for s in filtered_sessions:
        for t, c in s.get("tool_counts", {}).items():
            all_tools[t] += c
        total_tool_errors += s.get("tool_errors", 0)

    total_calls = sum(all_tools.values())
    tool_success_rate = ((total_calls - total_tool_errors) / total_calls * 100) if total_calls > 0 else 100.0

    # Model breakdown (step-level attribution when steps_detail is present)
    models = defaultdict(lambda: {
        "input": 0, "cached": 0, "output": 0, "thinking": 0, "total": 0,
        "turns": 0, "_sessions": set(), "_ttfts": [], "_s_tps": [],
        "_s_out": 0, "_s_dur": 0.0, "_e_out": 0, "_e_dur": 0.0, "_thk_durs": []
    })
    for s in filtered_sessions:
        cid = s.get("convo_id", "")
        steps_det = s.get("steps_detail")
        if steps_det:
            for st in steps_det:
                m = st.get("model", s.get("model", "Gemini 3.8 Flash"))
                models[m]["input"] += st.get("input_tokens", 0)
                models[m]["cached"] += st.get("cached_tokens", 0)
                models[m]["output"] += st.get("output_tokens", 0)
                models[m]["thinking"] += st.get("thinking_tokens", 0)
                models[m]["total"] += st.get("total_tokens", 0)
                models[m]["turns"] += 1
                models[m]["_sessions"].add(cid)
                if st.get("ttft_sec") is not None:
                    models[m]["_ttfts"].append(st["ttft_sec"])
                if st.get("stream_tps") is not None:
                    models[m]["_s_tps"].append(st["stream_tps"])
                models[m]["_s_out"] += st.get("stream_out", 0)
                models[m]["_s_dur"] += st.get("stream_dur", 0.0)
                models[m]["_e_out"] += st.get("e2e_out", 0)
                models[m]["_e_dur"] += st.get("e2e_dur", 0.0)
                if st.get("think_sec") is not None and st["think_sec"] > 0:
                    models[m]["_thk_durs"].append(st["think_sec"])
        else:
            m = s.get("model", "Gemini 3.8 Flash")
            models[m]["input"] += s.get("input_tokens", 0)
            models[m]["cached"] += s.get("cached_tokens", 0)
            models[m]["output"] += s.get("output_tokens", 0)
            models[m]["thinking"] += s.get("thinking_tokens", 0)
            models[m]["total"] += s.get("total_tokens", 0)
            models[m]["turns"] += s.get("turn_count", 0)
            models[m]["_sessions"].add(cid)

    models_clean = {}
    models_list = []
    for k, v in models.items():
        m_prompt = v["input"] + v["cached"]
        m_cache_pct = round((v["cached"] / m_prompt) * 100, 1) if m_prompt > 0 else 0.0
        m_avg_ttft = round(sum(v["_ttfts"]) / len(v["_ttfts"]), 3) if v["_ttfts"] else None
        m_p50_ttft = percentile(v["_ttfts"], 50)
        m_avg_stps = round(v["_s_out"] / v["_s_dur"], 1) if v["_s_dur"] > 0 else None
        m_peak_stps = round(max(v["_s_tps"]), 1) if v["_s_tps"] else None
        m_avg_etps = round(v["_e_out"] / v["_e_dur"], 1) if v["_e_dur"] > 0 else None
        m_avg_thk = round(sum(v["_thk_durs"]) / len(v["_thk_durs"]), 3) if v["_thk_durs"] else None
        entry = {
            "name": k,
            "total": v["total"],
            "input": v["input"],
            "cached": v["cached"],
            "output": v["output"],
            "thinking": v["thinking"],
            "turns": v["turns"],
            "sessions": len(v["_sessions"]),
            "share_pct": round((v["total"] / total_tokens * 100) if total_tokens > 0 else 0, 1),
            "cache_hit_rate_pct": m_cache_pct,
            "avg_ttft_sec": m_avg_ttft,
            "p50_ttft_sec": m_p50_ttft,
            "avg_stream_tps": m_avg_stps,
            "peak_stream_tps": m_peak_stps,
            "avg_e2e_tps": m_avg_etps,
            "avg_think_sec": m_avg_thk,
        }
        models_list.append(entry)
        models_clean[k] = entry
    models_list.sort(key=lambda x: x["total"], reverse=True)

    # Surface breakdown
    surfaces = defaultdict(lambda: {"total": 0, "sessions": 0, "input": 0, "cached": 0, "output": 0})
    for s in filtered_sessions:
        surf = s.get("surface", "IDE")
        surfaces[surf]["total"] += s.get("total_tokens", 0)
        surfaces[surf]["sessions"] += 1
        surfaces[surf]["input"] += s.get("input_tokens", 0)
        surfaces[surf]["cached"] += s.get("cached_tokens", 0)
        surfaces[surf]["output"] += s.get("output_tokens", 0)

    # Rolling 5-Hour Quota & Activity Window
    now_ts = int(datetime.now().timestamp())
    window_secs = 5 * 3600
    cutoff_5h = now_ts - window_secs
    recent_5h = [s for s in sessions.values() if s.get("mtime", 0) >= cutoff_5h]
    window_tokens = sum(s.get("total_tokens", 0) for s in recent_5h)
    window_turns = sum(s.get("turn_count", 0) for s in recent_5h)
    ACTIVE_WINDOW_SEC = 120
    RECENT_WINDOW_SEC = 900
    is_active = any((now_ts - s.get("mtime", 0)) < ACTIVE_WINDOW_SEC for s in sessions.values())
    is_recent = any((now_ts - s.get("mtime", 0)) < RECENT_WINDOW_SEC for s in sessions.values())

    if recent_5h:
        oldest_ts = min(s.get("mtime", 0) for s in recent_5h)
        next_reset_ts = oldest_ts + window_secs
        secs_left = max(0, int(next_reset_ts - now_ts))
    else:
        secs_left = window_secs

    h_left = secs_left // 3600
    m_left = (secs_left % 3600) // 60
    reset_str = f"{h_left}h {m_left}m" if h_left > 0 else f"{m_left}m"
    
    sorted_recent = sorted(recent_5h, key=lambda x: x.get("mtime", 0), reverse=True)
    active_model_name = sorted_recent[0].get("model", "Gemini 3.8 Flash") if sorted_recent else "Gemini 3.8 Flash"

    # Family breakdowns: Gemini vs Claude
    gemini_tokens = 0
    gemini_turns = 0
    gemini_sessions = 0
    gemini_active = None

    claude_tokens = 0
    claude_turns = 0
    claude_sessions = 0
    claude_active = None

    for s in sorted_recent:
        m = s.get("model", "")
        toks = s.get("total_tokens", 0)
        turns = s.get("turn_count", 0)
        if "claude" in m.lower():
            claude_tokens += toks
            claude_turns += turns
            claude_sessions += 1
            if not claude_active:
                claude_active = m
        else:
            gemini_tokens += toks
            gemini_turns += turns
            gemini_sessions += 1
            if not gemini_active:
                gemini_active = m

    # Standard 5-hour baseline limits in Google Antigravity ecosystem
    GEMINI_LIMIT = 100_000_000  # 100M tokens
    CLAUDE_LIMIT = 15_000_000   # 15M tokens

    gemini_pct = min(100.0, round((gemini_tokens / GEMINI_LIMIT) * 100, 1))
    claude_pct = min(100.0, round((claude_tokens / CLAUDE_LIMIT) * 100, 1))

    quota_info = {
        "rolling_window_hours": 5,
        "window_tokens": window_tokens,
        "window_turns": window_turns,
        "window_sessions": len(recent_5h),
        "seconds_to_reset": secs_left,
        "reset_countdown": reset_str,
        "is_active": is_active,
        "is_recent": is_recent,
        "active_model": active_model_name,
        "status": "High Usage" if window_tokens > 60_000_000 else ("Active Session" if is_active else ("Recent Activity" if is_recent else "Healthy")),
        "gemini": {
            "tokens": gemini_tokens,
            "turns": gemini_turns,
            "sessions": gemini_sessions,
            "limit_tokens": GEMINI_LIMIT,
            "pct": gemini_pct,
            "active_model": gemini_active or "Gemini 3.8 Flash"
        },
        "claude": {
            "tokens": claude_tokens,
            "turns": claude_turns,
            "sessions": claude_sessions,
            "limit_tokens": CLAUDE_LIMIT,
            "pct": claude_pct,
            "active_model": claude_active or "Claude Sonnet 4.6"
        }
    }

    # Sorted daily list with daily TTFT, TPS, and Cache Hit %
    daily_list = []
    for k, v in sorted(daily.items()):
        d_prompt = v["input"] + v["cached"]
        d_cache_pct = round((v["cached"] / d_prompt) * 100, 1) if d_prompt > 0 else 0.0
        d_avg_ttft = round(sum(v["_ttfts"]) / len(v["_ttfts"]), 3) if v["_ttfts"] else None
        d_avg_stps = round(v["_s_out"] / v["_s_dur"], 1) if v["_s_dur"] > 0 else None
        d_avg_etps = round(v["_e_out"] / v["_e_dur"], 1) if v["_e_dur"] > 0 else None
        daily_list.append({
            "date": k,
            "input": v["input"],
            "cached": v["cached"],
            "output": v["output"],
            "thinking": v["thinking"],
            "total": v["total"],
            "sessions": v["sessions"],
            "turns": v["turns"],
            "cache_hit_rate_pct": d_cache_pct,
            "avg_ttft_sec": d_avg_ttft,
            "avg_stream_tps": d_avg_stps,
            "avg_e2e_tps": d_avg_etps,
        })

    # Full historical daily activity for the annual/multi-month contribution heatmap
    all_daily = defaultdict(lambda: {"input": 0, "cached": 0, "output": 0, "thinking": 0, "total": 0, "sessions": 0, "turns": 0})
    for s in sessions.values():
        d = s.get("date")
        if d:
            all_daily[d]["input"] += s.get("input_tokens", 0)
            all_daily[d]["cached"] += s.get("cached_tokens", 0)
            all_daily[d]["output"] += s.get("output_tokens", 0)
            all_daily[d]["thinking"] += s.get("thinking_tokens", 0)
            all_daily[d]["total"] += s.get("total_tokens", 0)
            all_daily[d]["sessions"] += 1
            all_daily[d]["turns"] += s.get("turn_count", 0)
    all_daily_list = [{"date": k, **v} for k, v in sorted(all_daily.items())]

    # Project breakdown
    projects = defaultdict(lambda: {"input": 0, "cached": 0, "output": 0, "thinking": 0, "total": 0, "sessions": 0, "turns": 0})
    for s in filtered_sessions:
        p = s.get("project", "General")
        projects[p]["input"] += s.get("input_tokens", 0)
        projects[p]["cached"] += s.get("cached_tokens", 0)
        projects[p]["output"] += s.get("output_tokens", 0)
        projects[p]["thinking"] += s.get("thinking_tokens", 0)
        projects[p]["total"] += s.get("total_tokens", 0)
        projects[p]["sessions"] += 1
        projects[p]["turns"] += s.get("turn_count", 0)

    projects_list = sorted([{"name": k, **v} for k, v in projects.items()], key=lambda x: x["total"], reverse=True)

    total_prompt_requests = total_input + total_cached
    cache_hit_rate = (total_cached / total_prompt_requests * 100) if total_prompt_requests > 0 else 0

    # Most recent step across filtered sessions for live telemetry banner
    latest_step = None
    best_sort_key = None
    for s in filtered_sessions:
        s_mtime = s.get("mtime", 0)
        for st in s.get("steps_detail") or []:
            key = (st.get("timestamp", 0), s_mtime, st.get("idx", 0))
            if best_sort_key is None or key > best_sort_key:
                best_sort_key = key
                ts = st.get("timestamp", 0)
                latest_step = {
                    "convo_id": s.get("convo_id", ""),
                    "session_title": s.get("title", ""),
                    "project": s.get("project", "General"),
                    "idx": st.get("idx", 0),
                    "timestamp": ts,
                    "time_str": datetime.fromtimestamp(ts).strftime('%H:%M:%S') if ts else "",
                    "model": st.get("model", s.get("model", "")),
                    "input_tokens": st.get("input_tokens", 0),
                    "cached_tokens": st.get("cached_tokens", 0),
                    "output_tokens": st.get("output_tokens", 0),
                    "thinking_tokens": st.get("thinking_tokens", 0),
                    "total_tokens": st.get("total_tokens", 0),
                    "cache_hit_rate_pct": st.get("cache_hit_rate_pct", 0.0),
                    "ttft_sec": st.get("ttft_sec"),
                    "stream_sec": st.get("stream_sec"),
                    "e2e_sec": st.get("e2e_sec"),
                    "think_sec": st.get("think_sec"),
                    "stream_tps": st.get("stream_tps"),
                    "e2e_tps": st.get("e2e_tps"),
                }

    return {
        "time_range": {
            "start": start_date or (daily_list[0]["date"] if daily_list else ""),
            "end": end_date or (daily_list[-1]["date"] if daily_list else "")
        },
        "latest_step": latest_step,
        "summary": {
            "total_tokens": total_tokens,
            "total_input_tokens": total_input,
            "total_cached_tokens": total_cached,
            "total_output_tokens": total_output,
            "total_thinking_tokens": total_thinking,
            "total_sessions": len(filtered_sessions),
            "total_turns": total_turns,
            "cache_hit_rate_pct": round(cache_hit_rate, 1),
            "total_tool_calls": total_calls,
            "total_tool_errors": total_tool_errors,
            "tool_success_rate_pct": round(tool_success_rate, 1),
            "avg_ttft_sec": avg_ttft_sec,
            "p50_ttft_sec": p50_ttft_sec,
            "p90_ttft_sec": p90_ttft_sec,
            "min_ttft_sec": min_ttft_sec,
            "max_ttft_sec": max_ttft_sec,
            "avg_stream_tps": avg_stream_tps,
            "p50_stream_tps": p50_stream_tps,
            "peak_stream_tps": peak_stream_tps,
            "avg_e2e_tps": avg_e2e_tps,
            "avg_think_sec": avg_think_sec,
            "total_think_sec": total_think_sec,
        },
        "costs": {
            "est_spend": round(est_spend, 2),
            "cost_without_cache": round(cost_without_cache, 2),
            "dollars_saved": round(dollars_saved, 2),
            "savings_pct": round(savings_pct, 1)
        },
        "streaks": {
            "active_days": len(dates_list),
            "current_streak": current_streak,
            "longest_streak": longest_streak
        },
        "quota": quota_info,
        "hourly": hourly,
        "daily": daily_list,
        "all_daily": all_daily_list,
        "models": models_clean,
        "models_list": models_list,
        "surfaces": dict(surfaces),
        "projects": projects_list,
        "top_tools": sorted([{"name": k, "count": v} for k, v in all_tools.items()], key=lambda x: x["count"], reverse=True)[:15],
        "recent_sessions": sorted(
            [
                {
                    "convo_id": s["convo_id"],
                    "title": s["title"],
                    "project": s.get("project", "General"),
                    "workspace_path": s.get("workspace_path", ""),
                    "surface": s.get("surface", "IDE"),
                    "is_active": (now_ts - s.get("mtime", 0)) < ACTIVE_WINDOW_SEC,
                    "is_recent": (now_ts - s.get("mtime", 0)) < RECENT_WINDOW_SEC,
                    "date": s["date"],
                    "created_at": s["created_at"],
                    "duration_sec": s["duration_sec"],
                    "turn_count": s["turn_count"],
                    "total_tokens": s["total_tokens"],
                    "input_tokens": s["input_tokens"],
                    "cached_tokens": s["cached_tokens"],
                    "cache_hit_rate_pct": s.get("cache_hit_rate_pct", round((s["cached_tokens"] / (s["cached_tokens"] + s["input_tokens"]) * 100) if (s["cached_tokens"] + s["input_tokens"]) > 0 else 0, 1)),
                    "output_tokens": s["output_tokens"],
                    "thinking_tokens": s.get("thinking_tokens", 0),
                    "avg_ttft_sec": s.get("avg_ttft_sec"),
                    "p50_ttft_sec": s.get("p50_ttft_sec"),
                    "p90_ttft_sec": s.get("p90_ttft_sec"),
                    "avg_stream_tps": s.get("avg_stream_tps"),
                    "peak_stream_tps": s.get("peak_stream_tps"),
                    "avg_e2e_tps": s.get("avg_e2e_tps"),
                    "avg_think_sec": s.get("avg_think_sec"),
                    "total_think_sec": s.get("total_think_sec", 0.0),
                    "steps_detail": s.get("steps_detail", []),
                    "tool_counts": s.get("tool_counts", {}),
                    "tool_errors": s.get("tool_errors", 0),
                    "model": s["model"]
                }
                for s in filtered_sessions
            ],
            key=lambda x: x["created_at"],
            reverse=True
        )[:200]
    }

def build_demo_sessions():
    """Deterministic sample ledger for screenshots, UI testing, and first-run preview.
    Same schema as parse_session_db output; no real databases are touched.
    Token splits honor the calibrated semantics: out includes thinking, inp excludes cache."""
    base = datetime.now().replace(hour=10, minute=30, second=0, microsecond=0)
    specs = [
        # days_ago, project, model, surface, turns, fresh_in, cached, out, think, duration_min, tools
        (0, "Demo Shop", "Gemini 3.8 Flash", "IDE", 34, 41200, 812000, 18900, 5600, 95, {"run_command": 22, "view_file": 14, "replace_file_content": 9}),
        (0, "Demo API", "Claude Sonnet 4.6", "CLI", 12, 18500, 204000, 7600, 2300, 41, {"run_command": 9, "grep_search": 6}),
        (1, "Demo Shop", "Gemini 3.8 Flash", "IDE", 47, 52300, 1150000, 24100, 7100, 132, {"run_command": 31, "view_file": 19, "write_to_file": 7}),
        (1, "Demo API", "Gemini 3.7 Flash", "IDE", 8, 9400, 88000, 3200, 900, 22, {"view_file": 5, "run_command": 4}),
        (2, "Demo Shop", "Claude Sonnet 4.6", "CLI", 21, 27600, 402000, 11800, 3400, 64, {"run_command": 15, "grep_search": 8}),
        (3, "Demo API", "Gemini 3.8 Flash", "Core", 15, 15800, 231000, 6900, 2100, 48, {"view_file": 11, "run_command": 6}),
        (4, "Demo Shop", "Gemini 3.1 Pro", "IDE", 29, 38400, 689000, 16200, 4900, 88, {"replace_file_content": 13, "run_command": 17, "view_file": 10}),
        (5, "Demo API", "Claude Sonnet 4.6", "CLI", 6, 7200, 64000, 2400, 700, 18, {"run_command": 5}),
        (6, "Demo Shop", "Gemini 3.8 Flash", "IDE", 38, 44900, 934000, 20500, 6200, 110, {"run_command": 26, "view_file": 16, "write_to_file": 6}),
        (6, "Demo API", "Gemini 3.7 Flash", "Core", 11, 12400, 142000, 5100, 1500, 35, {"grep_search": 7, "view_file": 5}),
    ]
    sessions = {}
    for i, (ago, project, model, surface, turns, inp, cached, out, think, dur_min, tools) in enumerate(specs):
        start = base - timedelta(days=ago)
        end = start + timedelta(minutes=dur_min)
        mtime = int(end.timestamp())
        sessions[f"demo-session-{i:02d}"] = {
            "convo_id": f"demo-session-{i:02d}",
            "mtime": mtime,
            "surface": surface,
            "created_at": start.strftime('%Y-%m-%d %H:%M:%S'),
            "date": start.strftime('%Y-%m-%d'),
            "duration_sec": dur_min * 60,
            "model": model,
            "project": project,
            "workspace_path": "",
            "title": f"Demo: {project} task #{i + 1}",
            "turn_count": turns,
            "input_tokens": inp,
            "cached_tokens": cached,
            "output_tokens": out,
            "thinking_tokens": think,
            "total_tokens": inp + cached + out,
            "tool_counts": tools,
            "tool_errors": 1 if i % 4 == 0 else 0,
        }
    return sessions

if __name__ == "__main__":
    force_sync = "--force" in sys.argv or "--rebuild" in sys.argv
    if "--demo" in sys.argv:
        sessions = build_demo_sessions()
    else:
        sessions = sync_all_sessions(force=force_sync)
    
    # Check arguments
    if "--json" in sys.argv:
        start_date = None
        end_date = None
        for i, arg in enumerate(sys.argv):
            if arg == "--start" and i + 1 < len(sys.argv):
                start_date = sys.argv[i + 1]
            if arg == "--end" and i + 1 < len(sys.argv):
                end_date = sys.argv[i + 1]
        data = generate_analytics(sessions, start_date, end_date)
        print(json.dumps(data))
    else:
        data = generate_analytics(sessions)
        s = data["summary"]
        c = data["costs"]
        st = data["streaks"]
        fmt_s = lambda v: f"{v:.3f}s" if v is not None else "N/A"
        fmt_tps = lambda v: f"{v:.1f} tok/s" if v is not None else "N/A"
        print("==========================================================================")
        print("            ANTIGRAVITY USAGE & PERFORMANCE TELEMETRY REPORT              ")
        print("==========================================================================")
        print(f"Total Sessions:         {s['total_sessions']}")
        print(f"Total Agent Turns:      {s['total_turns']:,}")
        print(f"Non-Cached Input:       {s['total_input_tokens']:,}")
        print(f"Cached Input (Read):    {s['total_cached_tokens']:,}")
        print(f"Output Tokens:          {s['total_output_tokens']:,} (incl. Thinking: {s['total_thinking_tokens']:,})")
        print(f"Total Processed Tokens: {s['total_tokens']:,}")
        print(f"Cache Hit Rate:         {s['cache_hit_rate_pct']}%")
        print(f"Estimated Spend:        ${c['est_spend']:.2f} (Without Cache: ${c['cost_without_cache']:.2f})")
        print(f"Dollars Saved by Cache: ${c['dollars_saved']:.2f} ({c['savings_pct']}% saved)")
        print("--------------------------------------------------------------------------")
        print("Latency & Throughput (TTFT / TPS / Thinking):")
        print(f"  TTFT (Avg / P50 / P90):       {fmt_s(s.get('avg_ttft_sec'))} / {fmt_s(s.get('p50_ttft_sec'))} / {fmt_s(s.get('p90_ttft_sec'))}")
        print(f"  TTFT (Min / Max):             {fmt_s(s.get('min_ttft_sec'))} / {fmt_s(s.get('max_ttft_sec'))}")
        print(f"  Stream TPS (Avg / P50 / Peak):{fmt_tps(s.get('avg_stream_tps'))} / {fmt_tps(s.get('p50_stream_tps'))} / {fmt_tps(s.get('peak_stream_tps'))}")
        print(f"  End-to-End TPS (Weighted Avg):{fmt_tps(s.get('avg_e2e_tps'))}")
        print(f"  Thinking Time (Avg / Total):  {fmt_s(s.get('avg_think_sec'))} / {s.get('total_think_sec', 0):.1f}s")
        print("--------------------------------------------------------------------------")
        print(f"Coding Streak:          {st['current_streak']} days active (Best: {st['longest_streak']} days)")
        print(f"Tool Reliability:       {s['tool_success_rate_pct']}% ({s['total_tool_calls']:,} calls / {s['total_tool_errors']} retries)")
        print("\nPer-Model Breakdown:")
        print(f"  {'Model':<26} {'Turns':>6} {'Tokens':>11} {'Cache%':>7} {'TTFT':>8} {'StrmTPS':>9} {'E2ETPS':>8}")
        for m in data["models_list"]:
            ttft_s = f"{m['avg_ttft_sec']:.2f}s" if m.get("avg_ttft_sec") is not None else "-"
            stps_s = f"{m['avg_stream_tps']:.1f}" if m.get("avg_stream_tps") is not None else "-"
            etps_s = f"{m['avg_e2e_tps']:.1f}" if m.get("avg_e2e_tps") is not None else "-"
            print(f"  {m['name'][:25]:<26} {m.get('turns', 0):>6} {m['total']:>11,} {m.get('cache_hit_rate_pct', 0):>6.1f}% {ttft_s:>8} {stps_s:>9} {etps_s:>8}")
        print("\nRecent 10 Sessions:")
        print(f"  {'Created At':<19} {'Model':<22} {'Turns':>5} {'Cache%':>7} {'TTFT':>7} {'StrmTPS':>8} {'Tokens':>10}")
        for sess in data["recent_sessions"][:10]:
            ttft_s = f"{sess['avg_ttft_sec']:.2f}s" if sess.get("avg_ttft_sec") is not None else "-"
            stps_s = f"{sess['avg_stream_tps']:.1f}" if sess.get("avg_stream_tps") is not None else "-"
            print(f"  {sess['created_at']:<19} {sess['model'][:21]:<22} {sess['turn_count']:>5} {sess.get('cache_hit_rate_pct', 0):>6.1f}% {ttft_s:>7} {stps_s:>8} {sess['total_tokens']:>10,}")
        print("==========================================================================")
