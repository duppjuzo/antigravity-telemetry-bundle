from __future__ import annotations

import json
import os
import sys
from pathlib import Path

PLUGIN_DIR = Path(__file__).resolve().parent
SERVER_DIR = PLUGIN_DIR / "server"
LEGACY_DIR = Path.home() / ".gemini" / "antigravity" / "scratch" / "antigravity-usage-intelligence"

for candidate in (SERVER_DIR, LEGACY_DIR):
    if candidate.exists() and str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

try:
    import collector
except Exception:
    collector = None


def get_gemini_home() -> Path:
    env_home = os.environ.get("GEMINI_HOME", "").strip()
    if env_home:
        return Path(os.path.expanduser(env_home)).resolve()
    return Path.home() / ".gemini"


def _surface_roots() -> list[tuple[str, Path]]:
    g_home = get_gemini_home()
    return [
        ("Core", g_home / "antigravity"),
        ("IDE", g_home / "antigravity-ide"),
        ("CLI", g_home / "antigravity-cli"),
    ]


def read_db_step_telemetry(
    conv_id: str | None,
    step_idx: int | None,
    transcript_file: Path | None = None,
) -> dict:
    empty = {
        "model": "Unknown",
        "thinking_tokens": 0,
        "ttft_sec": None,
        "stream_tps": None,
        "e2e_tps": None,
        "think_sec": None,
        "argon_steps": 0,
        "argon_tokens": 0,
    }
    if not collector or not conv_id:
        return empty

    try:
        candidates: list[tuple[str, Path]] = []
        if (
            transcript_file is not None
            and len(transcript_file.parents) >= 5
            and transcript_file.parents[3].name == "brain"
        ):
            app_root = transcript_file.parents[4]
            surf_name = (
                "IDE"
                if app_root.name == "antigravity-ide"
                else ("CLI" if app_root.name == "antigravity-cli" else "Core")
            )
            candidates.append((surf_name, app_root))
        for surf_name, root in _surface_roots():
            if all(root != r for _, r in candidates):
                candidates.append((surf_name, root))

        db_path = None
        surface = "Core"
        for surf_name, app_root in candidates:
            p = app_root / "conversations" / f"{conv_id}.db"
            if p.exists():
                db_path = p
                surface = surf_name
                break

        if db_path is None:
            return empty

        parsed = collector.parse_session_db(str(db_path), surface=surface)
        if not parsed:
            return empty

        steps_detail = parsed.get("steps_detail") or []
        if not steps_detail:
            return empty

        matched = None
        if step_idx is not None:
            for st in steps_detail:
                if st.get("idx") == step_idx:
                    matched = st
                    break
        if matched is None:
            matched = steps_detail[-1]

        argon_steps = 0
        argon_tokens = 0
        for st in steps_detail:
            if "argon" in (st.get("model") or "").lower():
                argon_steps += 1
                argon_tokens += int(st.get("total_tokens") or 0)

        return {
            "model": matched.get("model") or "Unknown",
            "thinking_tokens": int(matched.get("thinking_tokens") or 0),
            "ttft_sec": matched.get("ttft_sec"),
            "stream_tps": matched.get("stream_tps"),
            "e2e_tps": matched.get("e2e_tps"),
            "think_sec": matched.get("think_sec"),
            "argon_steps": argon_steps,
            "argon_tokens": argon_tokens,
        }
    except Exception:
        return empty


def find_transcript(conv_id: str | None = None) -> Path | None:
    if not conv_id:
        candidates: list[Path] = []
        for _, root in _surface_roots():
            brain_dir = root / "brain"
            if brain_dir.exists():
                candidates.extend(brain_dir.glob("*/.system_generated/logs/transcript.jsonl"))
        if candidates:
            candidates.sort(key=lambda p: p.stat().st_mtime, reverse=True)
            return candidates[0]
        return None

    for _, root in _surface_roots():
        p = root / "brain" / conv_id / ".system_generated" / "logs" / "transcript.jsonl"
        if p.exists():
            return p
    return None


def calc_rate(cache_read: int, uncached_input: int) -> float:
    total = cache_read + uncached_input
    return round((cache_read / total) * 100, 2) if total > 0 else 0.0


def make_bar(rate: float, width: int = 10) -> str:
    filled = max(0, min(width, int(round(rate / (100 / width)))))
    return "█" * filled + "░" * (width - filled)


def _fmt_sec(val: float | None) -> str:
    return f"{float(val):.2f}s" if val is not None else "-"


def _fmt_tps(val: float | None) -> str:
    return f"{float(val):.1f} tok/s" if val is not None else "-"


def generate_card(transcript_file: Path, conv_id: str | None = None) -> dict:
    records = []
    with open(transcript_file, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except Exception:
                continue

    planner_steps = [r for r in records if r.get("type") == "PLANNER_RESPONSE"]
    if not planner_steps:
        return {"markdown": "> ⚡ **Telemetry Monitor**：暂无数据", "data": {}}

    latest_step = planner_steps[-1]
    step_idx = latest_step.get("step_index", 0)

    # 找出最后一条 USER_INPUT 之后的本轮所有 PLANNER_RESPONSE
    turn_planner_steps = []
    for r in reversed(records):
        if r.get("type") == "USER_INPUT":
            break
        if r.get("type") == "PLANNER_RESPONSE":
            turn_planner_steps.append(r)
    turn_planner_steps.reverse()
    if not turn_planner_steps:
        turn_planner_steps = [latest_step]

    # 1. 最新单步指标
    last_cache = int(latest_step.get("cache_read_tokens") or 0)
    last_input = int(latest_step.get("input_tokens") or 0)
    last_output = int(latest_step.get("output_tokens") or 0)
    last_rate = calc_rate(last_cache, last_input)

    # 2. 本轮累计指标
    turn_cache = sum(int(s.get("cache_read_tokens") or 0) for s in turn_planner_steps)
    turn_input = sum(int(s.get("input_tokens") or 0) for s in turn_planner_steps)
    turn_output = sum(int(s.get("output_tokens") or 0) for s in turn_planner_steps)
    turn_rate = calc_rate(turn_cache, turn_input)
    turn_count = len(turn_planner_steps)

    # 3. 全会话累计指标
    sess_cache = sum(int(s.get("cache_read_tokens") or 0) for s in planner_steps)
    sess_input = sum(int(s.get("input_tokens") or 0) for s in planner_steps)
    sess_output = sum(int(s.get("output_tokens") or 0) for s in planner_steps)
    sess_rate = calc_rate(sess_cache, sess_input)

    # 4. 单会话 DB 实时遥测 (model / TTFT / TPS / thinking / Argon session totals)
    if not conv_id and len(transcript_file.parents) >= 3:
        conv_id = transcript_file.parents[2].name
    tel = read_db_step_telemetry(conv_id, step_idx, transcript_file)

    bar = make_bar(last_rate)
    icon = "🟢" if last_rate >= 80 else ("🟡" if last_rate >= 50 else "⚪")

    model_name = tel.get("model") or "Unknown"
    ttft_str = _fmt_sec(tel.get("ttft_sec"))
    stps_str = _fmt_tps(tel.get("stream_tps"))
    etps_str = _fmt_tps(tel.get("e2e_tps"))
    think_sec_str = _fmt_sec(tel.get("think_sec"))
    think_tok = int(tel.get("thinking_tokens") or 0)
    argon_steps = int(tel.get("argon_steps") or 0)
    argon_tokens = int(tel.get("argon_tokens") or 0)

    card_md = (
        f"> ⚡ **Telemetry Monitor (Step {step_idx})** · 模型 `{model_name}` · 命中率 **{last_rate:.2f}%** {icon} `[{bar}]`  \n"
        f"> ⏱️ **TTFT**：`{ttft_str}` │ **Stream TPS**：`{stps_str}` │ **E2E TPS**：`{etps_str}` │ **思考**：`{think_sec_str}`  \n"
        f"> 📦 **缓存读取**：`{last_cache:,}` │ 🆕 **新增输入**：`{last_input:,}` │ ✍️ **输出**：`{last_output:,}` *(含思考 `{think_tok:,}`)*  \n"
        f"> 📊 **本轮** *({turn_count} 步)*：**{turn_rate:.2f}%** │ **会话** *({len(planner_steps)} 步)*：**{sess_rate:.2f}%** │ **Argon 会话用量**：`{argon_steps}` 步 / `{argon_tokens:,}` tok"
    )

    return {
        "markdown": card_md,
        "data": {
            "step_index": step_idx,
            "model": model_name,
            "last_cache": last_cache,
            "last_input": last_input,
            "last_output": last_output,
            "thinking_tokens": think_tok,
            "last_rate": last_rate,
            "ttft_sec": tel.get("ttft_sec"),
            "stream_tps": tel.get("stream_tps"),
            "e2e_tps": tel.get("e2e_tps"),
            "think_sec": tel.get("think_sec"),
            "argon_steps": argon_steps,
            "argon_tokens": argon_tokens,
            "turn_cache": turn_cache,
            "turn_input": turn_input,
            "turn_output": turn_output,
            "turn_rate": turn_rate,
            "turn_steps": turn_count,
            "sess_cache": sess_cache,
            "sess_input": sess_input,
            "sess_output": sess_output,
            "sess_rate": sess_rate,
            "total_steps": len(planner_steps),
        },
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    if len(sys.argv) > 1 and sys.argv[1] not in ("--hook", "-h"):
        conv_id = sys.argv[1]
        tf = find_transcript(conv_id)
        if tf:
            res = generate_card(tf, conv_id=conv_id)
            print(res["markdown"])
        else:
            print("Transcript not found.")
        return

    if not sys.stdin.isatty():
        if sys.stdin.read().strip():
            print("{}")
            return

    tf = find_transcript()
    if tf:
        res = generate_card(tf)
        print(res["markdown"])
    else:
        print(json.dumps({"injectSteps": []}))


if __name__ == "__main__":
    main()
