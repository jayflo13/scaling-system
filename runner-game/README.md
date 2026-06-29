# Reskin Runner (Godot 4)

A config-driven endless runner built to be **reskinned by editing JSON**, with
in-game currency, an IAP shop, and rewarded-ad hooks already wired up. The whole
thing builds and ships from the command line — no GUI editor required.

> Target audience: **adults (18+)**. Keep the store age rating at 18+ so
> child-protection rules (COPPA, UK Age Appropriate Design Code, etc.) don't
> apply. See `MONETIZATION.md` for the store-compliance checklist.

## What's here

| Area | Where |
|------|-------|
| Game loop / state machine | `src/Main.gd` |
| Player, coins, obstacles | `src/Player.gd`, `src/Coin.gd`, `src/Obstacle.gd` |
| Theme + config loader | `src/autoload/Config.gd` |
| Save / progression | `src/autoload/SaveManager.gd` |
| Two-currency economy + unlocks | `src/autoload/Economy.gd` |
| AdMob rewarded/interstitial hooks | `src/autoload/Ads.gd` (stubbed) |
| IAP / billing hooks | `src/autoload/IAP.gd` (stubbed) |
| Reskins | `themes/<name>/theme.json` + `characters.json` |
| Global tuning | `config/game_config.json` |
| CLI tools | `tools/new-theme.sh`, `tools/build.sh`, `tools/release.sh` |
| CI/CD | `../.github/workflows/runner-game-build.yml`, `fastlane/` |

The game runs out-of-the-box with **colored-rectangle placeholders** so it's
playable with zero binary assets. Drop real sprites/audio into
`themes/<name>/assets/` and point the theme JSON at them to ship art.

## Run it locally

```bash
# Open in the Godot 4 editor:
godot --path runner-game

# Or run headless-ish (needs a display) / build from CLI — see below.
```

Controls: **tap / click / Space** to jump (double-jump enabled).

## Reskin in 30 seconds

```bash
tools/new-theme.sh halloween          # clones the default theme
# edit themes/halloween/theme.json  -> palette + title
# edit themes/halloween/characters.json -> roster
# set "active_theme": "halloween" in config/game_config.json
```

Nothing in `src/` changes — that's the point.

## Build from the CLI

```bash
tools/build.sh debug      # -> build/runner-debug.apk  (unsigned, for testing)
tools/build.sh release    # -> build/runner.aab        (signed; needs keystore env)
```

Requires Godot 4 with Android export templates + the Android SDK/NDK. See
`tools/build.sh` for the signing env vars.

## Ship from the CLI (CI)

`../.github/workflows/runner-game-build.yml` builds a debug APK on every push and
can build a **signed AAB and upload to Google Play** via Fastlane on
`workflow_dispatch`, once you add these repo secrets:

- `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASS`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASS`
- `PLAY_SERVICE_ACCOUNT` (Play Console service-account JSON)

**Credentials never live in the repo or pass through chat** — they're GitHub
Actions encrypted secrets, read only at build time. That satisfies the
"give the platform credentials to upload" goal the secure way.

## Going live: replace the stubs

`Ads.gd` and `IAP.gd` are deliberately stubbed (`test_mode = true`) so the game
is fully playable now. To monetize for real:

1. Add the **Godot AdMob** plugin; set `Ads.test_mode = false`; plug your unit IDs.
2. Add the **Google Play Billing** plugin; set `IAP.test_mode = false`.
3. Verify purchases (server-side or via the billing lib) before `grant_pack`.
4. Work through `MONETIZATION.md` before submitting.
