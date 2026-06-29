#!/usr/bin/env bash
# Headless CLI build — no GUI editor required.
#
# Requires:
#   - Godot 4 with the matching export templates installed
#   - For Android: Android SDK/NDK + a release keystore (for signed release)
#
# Env (for signed Android release; injected from CI secrets):
#   GODOT_BIN                 path to godot binary (default: "godot")
#   ANDROID_KEYSTORE_PATH     path to release .keystore
#   ANDROID_KEYSTORE_PASS     keystore password
#   ANDROID_KEY_ALIAS         key alias
#   ANDROID_KEY_PASS          key password
#
# Usage:
#   tools/build.sh debug      # unsigned debug APK -> build/runner-debug.apk
#   tools/build.sh release    # signed AAB        -> build/runner.aab
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p build

GODOT_BIN="${GODOT_BIN:-godot}"
MODE="${1:-debug}"

# Import resources first so a headless export has the asset DB ready.
echo "==> Importing project resources"
"$GODOT_BIN" --headless --path . --import || true

if [[ "$MODE" == "release" ]]; then
  echo "==> Exporting signed Android release (AAB)"
  # Signing values are read by Godot's Android exporter from these env vars
  # when set via the editor settings file CI writes (see workflow). The keystore
  # path/passwords never live in the repo.
  "$GODOT_BIN" --headless --path . --export-release "Android" build/runner.aab
  echo "==> build/runner.aab"
else
  echo "==> Exporting debug Android APK"
  "$GODOT_BIN" --headless --path . --export-debug "Android" build/runner-debug.apk
  echo "==> build/runner-debug.apk"
fi
