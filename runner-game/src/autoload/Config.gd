extends Node
## Loads the active theme + global config.
## Everything player-facing (colors, characters, names) is data-driven so the
## game can be reskinned by editing JSON only — no engine/code changes.

const THEMES_DIR := "res://themes/"
const GLOBAL_CONFIG := "res://config/game_config.json"

var active_theme := "default"
var theme: Dictionary = {}
var characters: Array = []
var config: Dictionary = {}

func _ready() -> void:
	_load_global()
	load_theme(active_theme)

func _load_global() -> void:
	config = _read_json(GLOBAL_CONFIG, {})
	if config.has("active_theme"):
		active_theme = String(config["active_theme"])

## Swap the entire look of the game by loading a different theme folder.
func load_theme(name: String) -> void:
	active_theme = name
	theme = _read_json(THEMES_DIR + name + "/theme.json", {})
	characters = _read_json(THEMES_DIR + name + "/characters.json", [])

## Read a color from the active theme palette, with a safe fallback.
func color(key: String, fallback: Color = Color.WHITE) -> Color:
	var pal: Dictionary = theme.get("palette", {})
	if pal.has(key):
		return Color(pal[key])
	return fallback

## Read a tuning value from the global config (difficulty, economy, etc.).
func tune(key: String, fallback):
	return config.get(key, fallback)

func _read_json(path: String, fallback):
	if not FileAccess.file_exists(path):
		push_warning("Config missing: %s" % path)
		return fallback
	var f := FileAccess.open(path, FileAccess.READ)
	var txt := f.get_as_text()
	f.close()
	var data = JSON.parse_string(txt)
	if data == null:
		push_error("Invalid JSON: %s" % path)
		return fallback
	return data
