#!/usr/bin/env bash
# Build a signed AAB and upload it to Google Play via Fastlane supply.
# Intended to run in CI where secrets are available as env vars.
#
# Env:
#   PLAY_TRACK                   internal | alpha | beta | production (default: internal)
#   SUPPLY_JSON_KEY              path to Play service-account JSON (from CI secret)
#   (plus the ANDROID_KEYSTORE_* vars used by tools/build.sh)
set -euo pipefail

cd "$(dirname "$0")/.."

./tools/build.sh release

TRACK="${PLAY_TRACK:-internal}"
echo "==> Uploading build/runner.aab to Play track: $TRACK"
bundle exec fastlane android deploy track:"$TRACK"
