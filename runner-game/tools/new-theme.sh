#!/usr/bin/env bash
# Scaffold a new reskin: copies the default theme to themes/<name>/ so you can
# edit colors/characters/audio without touching engine code.
#
# Usage: tools/new-theme.sh <theme-name>
set -euo pipefail

cd "$(dirname "$0")/.."

NAME="${1:-}"
if [[ -z "$NAME" ]]; then
  echo "Usage: tools/new-theme.sh <theme-name>" >&2
  exit 1
fi

DEST="themes/$NAME"
if [[ -e "$DEST" ]]; then
  echo "Theme '$NAME' already exists at $DEST" >&2
  exit 1
fi

cp -r themes/default "$DEST"
# Update the human-readable name/title fields in the new theme.json.
python3 - "$DEST/theme.json" "$NAME" <<'PY'
import json, sys
path, name = sys.argv[1], sys.argv[2]
with open(path) as f:
    data = json.load(f)
data["name"] = name
data["title"] = name.upper()
with open(path, "w") as f:
    json.dump(data, f, indent=2)
    f.write("\n")
PY

echo "Created $DEST"
echo "Next: edit $DEST/theme.json + characters.json, then set"
echo "      \"active_theme\": \"$NAME\" in config/game_config.json"
