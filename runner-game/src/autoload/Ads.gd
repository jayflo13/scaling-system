extends Node
## AdMob integration point.
##
## This is a STUB so the game is fully playable and testable without the native
## SDK. To go live, add the Godot AdMob plugin (e.g. Poing-Studios
## godot-admob-android / -ios), set test_mode = false, and route the calls below
## into the plugin's load/show methods. Keep the same signals so callers don't
## change.
##
## Policy notes (don't skip — these get apps pulled):
##  - Frequency-cap interstitials (see maybe_show_interstitial) so you don't
##    spam users — it tanks retention AND risks AdMob policy strikes.
##  - Ship the Google UMP consent SDK (GDPR/CCPA) before requesting ads.
##  - Set the app's ad content rating to match your store age rating (18+).

signal rewarded_granted
signal rewarded_failed
signal interstitial_closed

@export var test_mode := true

# Replace with your real AdMob unit IDs (kept out of code in production — inject
# via export env / build config).
var rewarded_unit_id := "ca-app-pub-3940256099942544/5224354917"   # Google test ID
var interstitial_unit_id := "ca-app-pub-3940256099942544/1033173712" # Google test ID

var _interstitial_counter := 0

## Show a rewarded video; on completion, grant the reward.
func show_rewarded(reward_coins: int = 250) -> void:
	if test_mode:
		await get_tree().create_timer(0.4).timeout
		Economy.add_coins(reward_coins)
		rewarded_granted.emit()
	else:
		# TODO: call plugin.load_rewarded(rewarded_unit_id) then show(); on the
		# plugin's "rewarded_user_earned_reward" signal -> Economy.add_coins().
		push_warning("Wire AdMob rewarded SDK here.")
		rewarded_failed.emit()

## Show an interstitial only every Nth call (frequency cap).
func maybe_show_interstitial(every: int = 3) -> void:
	_interstitial_counter += 1
	if _interstitial_counter % every != 0:
		return
	if test_mode:
		interstitial_closed.emit()
	else:
		# TODO: call plugin.load_interstitial(interstitial_unit_id) then show().
		push_warning("Wire AdMob interstitial SDK here.")
		interstitial_closed.emit()
