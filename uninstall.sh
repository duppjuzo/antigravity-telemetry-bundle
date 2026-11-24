#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

find_python() {
  local candidates=(
    "${ANTIGRAVITY_TELEMETRY_PYTHON:-}"
    "python3"
    "/opt/homebrew/bin/python3"
    "/usr/local/bin/python3"
    "/usr/bin/python3"
    "python"
  )
  for py in "${candidates[@]}"; do
    [ -z "$py" ] && continue
    if command -v "$py" >/dev/null 2>&1 || [ -x "$py" ]; then
      if "$py" -c "import sys; assert sys.version_info >= (3, 8)" >/dev/null 2>&1; then
        echo "$py"
        return 0
      fi
    fi
  done
  return 1
}

if ! PYTHON_BIN="$(find_python)"; then
  echo "ERROR: Python 3.8+ was not found." >&2
  exit 1
fi

exec "$PYTHON_BIN" "$SCRIPT_DIR/deploy.py" uninstall "$@"
