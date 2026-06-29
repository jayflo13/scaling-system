extends Node
## Persists player progression to user:// (survives app restarts).

const SAVE_PATH := "user://save.json"

var data: Dictionary = {
	"coins": 0,
	"gems": 0,
	"high_score": 0,
	"unlocked": ["runner_default"],
	"selected": "runner_default",
	"purchased_once": [],   # one-time SKUs already bought (e.g. starter pack)
	"last_login": "",
	"streak": 0,
}

func _ready() -> void:
	load_game()

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var d = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(d) == TYPE_DICTIONARY:
		for k in d.keys():
			data[k] = d[k]

func save_game() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	f.store_string(JSON.stringify(data))
	f.close()

func get_v(key: String, fallback = null):
	return data.get(key, fallback)

func set_v(key: String, value) -> void:
	data[key] = value
	save_game()
