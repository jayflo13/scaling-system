extends Node
## Two-currency economy (soft Coins + hard Gems) and character unlocks.
##
## Coin packs are DETERMINISTIC (fixed coins/gems per price) — not randomized
## reward boxes — which keeps the game clear of loot-box regulation and store
## odds-disclosure requirements. Keep it that way.

signal balance_changed(coins: int, gems: int)
signal character_unlocked(id: String)

const COIN_PACKS := {
	"starter": {"price_usd": 0.99, "coins": 1200, "gems": 5, "once": true},
	"small":   {"price_usd": 1.99, "coins": 2500, "gems": 0},
	"medium":  {"price_usd": 4.99, "coins": 7000, "gems": 10},
	"large":   {"price_usd": 9.99, "coins": 16000, "gems": 25},
	"mega":    {"price_usd": 49.99, "coins": 90000, "gems": 150},
}

func coins() -> int: return int(SaveManager.get_v("coins", 0))
func gems() -> int: return int(SaveManager.get_v("gems", 0))

func add_coins(n: int) -> void:
	SaveManager.set_v("coins", coins() + n)
	balance_changed.emit(coins(), gems())

func add_gems(n: int) -> void:
	SaveManager.set_v("gems", gems() + n)
	balance_changed.emit(coins(), gems())

func spend_coins(n: int) -> bool:
	if coins() < n:
		return false
	SaveManager.set_v("coins", coins() - n)
	balance_changed.emit(coins(), gems())
	return true

func spend_gems(n: int) -> bool:
	if gems() < n:
		return false
	SaveManager.set_v("gems", gems() - n)
	balance_changed.emit(coins(), gems())
	return true

## Credit a purchased coin pack. Called by IAP after a verified transaction.
func grant_pack(id: String) -> void:
	if not COIN_PACKS.has(id):
		push_warning("Unknown pack: %s" % id)
		return
	var p: Dictionary = COIN_PACKS[id]
	add_coins(int(p.get("coins", 0)))
	add_gems(int(p.get("gems", 0)))
	if p.get("once", false):
		var bought: Array = SaveManager.get_v("purchased_once", [])
		if not bought.has(id):
			bought.append(id)
			SaveManager.set_v("purchased_once", bought)

func is_unlocked(char_id: String) -> bool:
	var u: Array = SaveManager.get_v("unlocked", [])
	return u.has(char_id)

## Attempt to unlock a character by paying its configured cost.
func try_unlock(char_id: String) -> bool:
	var def := _character_def(char_id)
	if def.is_empty() or is_unlocked(char_id):
		return false
	var cost_coins := int(def.get("cost_coins", 0))
	var cost_gems := int(def.get("cost_gems", 0))
	if cost_gems > 0:
		if not spend_gems(cost_gems):
			return false
	elif cost_coins > 0:
		if not spend_coins(cost_coins):
			return false
	var u: Array = SaveManager.get_v("unlocked", [])
	u.append(char_id)
	SaveManager.set_v("unlocked", u)
	character_unlocked.emit(char_id)
	return true

func _character_def(char_id: String) -> Dictionary:
	for c in Config.characters:
		if typeof(c) == TYPE_DICTIONARY and c.get("id", "") == char_id:
			return c
	return {}
