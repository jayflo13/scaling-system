extends Node
## Persistent, purchasable upgrades — the meta-progression / pay-to-win lever.
## Levels are stored in SaveManager; gameplay reads the effect helpers each run.
## Costs grow geometrically so deeper levels drive coin demand (and coin packs).

signal upgrade_changed(id: String, level: int)

const DEFS := {
	"coin_doubler": {"name": "Coin Multiplier",  "max": 5, "base_cost": 500,  "growth": 2.0, "per_level": 0.5},
	"head_start":   {"name": "Head Start Shield", "max": 5, "base_cost": 400,  "growth": 1.8, "per_level": 1.0},
	"extra_revive": {"name": "Extra Revive",      "max": 3, "base_cost": 1500, "growth": 2.5, "per_level": 1.0},
}

func level(id: String) -> int:
	var ups: Dictionary = SaveManager.get_v("upgrades", {})
	return int(ups.get(id, 0))

func cost(id: String) -> int:
	if not DEFS.has(id):
		return 0
	var d: Dictionary = DEFS[id]
	return int(round(float(d["base_cost"]) * pow(float(d["growth"]), level(id))))

func is_max(id: String) -> bool:
	return DEFS.has(id) and level(id) >= int(DEFS[id]["max"])

## Spend coins to add one level. Returns false if maxed or unaffordable.
func try_buy(id: String) -> bool:
	if not DEFS.has(id) or is_max(id):
		return false
	if not Economy.spend_coins(cost(id)):
		return false
	var ups: Dictionary = SaveManager.get_v("upgrades", {})
	ups[id] = level(id) + 1
	SaveManager.set_v("upgrades", ups)
	upgrade_changed.emit(id, int(ups[id]))
	return true

# ---- Effect helpers (read by Main each run) ----
func coin_multiplier() -> float:
	return 1.0 + level("coin_doubler") * float(DEFS["coin_doubler"]["per_level"])

func head_start_seconds() -> float:
	return level("head_start") * float(DEFS["head_start"]["per_level"])

func extra_revives() -> int:
	return level("extra_revive")
