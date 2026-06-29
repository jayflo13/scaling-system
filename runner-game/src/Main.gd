extends Node2D
## Game root: builds the world + UI in code (robust for CLI/headless builds),
## runs a MENU -> PLAYING -> OVER state machine, and drives procedural spawning,
## scrolling, scoring, screen-shake "juice", daily streak, shop and revive.

# Player has `class_name Player`, so it's globally available without preload.
const Coin := preload("res://src/Coin.gd")
const Obstacle := preload("res://src/Obstacle.gd")

enum State { MENU, PLAYING, OVER }

var state: int = State.MENU
var base_speed := 900.0
var speed := 900.0
var distance := 0.0
var run_coins := 0
var score := 0
var spawn_timer := 0.0
var spawn_interval := 1.15
var revived := false
var rng := RandomNumberGenerator.new()

var vp: Vector2
var ground_y := 1500.0
var player: Player
var world: Node2D
var cam: Camera2D
var shake := 0.0

# UI
var hud: CanvasLayer
var score_label: Label
var coin_label: Label
var balance_label: Label
var menu: Control
var over_panel: Control
var shop_panel: Control

func _ready() -> void:
	rng.seed = int(Time.get_unix_time_from_system())
	_check_daily_streak()
	_build_world()
	_build_hud()
	Economy.balance_changed.connect(func(_c, _g): _refresh_balance())
	_show_menu()

# ---------------------------------------------------------------- world / juice
func _build_world() -> void:
	vp = get_viewport_rect().size
	ground_y = vp.y * 0.80

	var bg := ColorRect.new()
	bg.color = Config.color("background", Color("#101025"))
	bg.size = vp
	bg.z_index = -10
	add_child(bg)

	var ground := ColorRect.new()
	ground.color = Config.color("ground", Color("#2a2a40"))
	ground.size = Vector2(vp.x, vp.y - ground_y)
	ground.position = Vector2(0, ground_y)
	ground.z_index = -5
	add_child(ground)

	world = Node2D.new()
	add_child(world)

	cam = Camera2D.new()
	cam.position = vp / 2.0
	cam.make_current()
	add_child(cam)

	player = Player.new()
	player.position.x = vp.x * 0.25
	player.setup(ground_y)
	player.died.connect(_on_player_died)
	player.coin_collected.connect(_on_coin)
	add_child(player)

func _add_shake(amount: float) -> void:
	shake = min(shake + amount, 30.0)

# --------------------------------------------------------------------- main loop
func _process(delta: float) -> void:
	# Screen-shake decay (juice).
	if shake > 0.0:
		cam.offset = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake))
		shake = max(shake - 60.0 * delta, 0.0)
	else:
		cam.offset = Vector2.ZERO

	if state != State.PLAYING:
		return

	# Difficulty ramps with distance (variable, escalating challenge).
	distance += speed * delta
	speed = base_speed + distance * 0.018
	spawn_interval = max(0.55, 1.15 - distance * 0.00002)
	score = int(distance / 10.0) + run_coins * 5
	score_label.text = "%d" % score

	# Scroll + cull world objects.
	for child in world.get_children():
		child.position.x -= speed * delta
		if child.position.x < -200.0:
			child.queue_free()

	# Procedural spawning (seeded RNG => reproducible difficulty curve).
	spawn_timer -= delta
	if spawn_timer <= 0.0:
		spawn_timer = spawn_interval
		_spawn_wave()

func _spawn_wave() -> void:
	var roll := rng.randf()
	if roll < 0.7:
		var h := rng.randf_range(70.0, 220.0)
		var ob := Obstacle.new()
		ob.position = Vector2(vp.x + 100.0, ground_y)
		ob.setup(h)
		world.add_child(ob)
	# Coin arc (reward sprinkled through the run).
	if rng.randf() < 0.6:
		var n := rng.randi_range(3, 6)
		var base_x := vp.x + 100.0 + rng.randf_range(0.0, 120.0)
		var arc_h := rng.randf_range(180.0, 380.0)
		for i in n:
			var c := Coin.new()
			var t := float(i) / float(max(n - 1, 1))
			var y := ground_y - 120.0 - sin(t * PI) * arc_h
			c.position = Vector2(base_x + i * 80.0, y)
			c.setup(1)
			world.add_child(c)

# ------------------------------------------------------------------- input / flow
func _unhandled_input(event: InputEvent) -> void:
	var tapped := false
	if event is InputEventScreenTouch and event.pressed:
		tapped = true
	elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		tapped = true
	elif event is InputEventKey and event.pressed and event.keycode == KEY_SPACE:
		tapped = true
	if not tapped:
		return
	match state:
		State.PLAYING:
			player.jump()
		State.MENU:
			pass # menu uses buttons
		State.OVER:
			pass # over panel uses buttons

func _start_run() -> void:
	# Reset world.
	for c in world.get_children():
		c.queue_free()
	distance = 0.0
	run_coins = 0
	score = 0
	speed = base_speed
	spawn_timer = 0.0
	revived = false
	player.alive = true
	player.position.y = ground_y
	player.velocity_y = 0.0
	menu.visible = false
	over_panel.visible = false
	shop_panel.visible = false
	coin_label.text = "0"
	score_label.text = "0"
	state = State.PLAYING

func _on_coin(value: int) -> void:
	run_coins += value
	coin_label.text = "%d" % run_coins
	_add_shake(3.0)

func _on_player_died() -> void:
	_add_shake(24.0)
	# Bank the coins earned this run.
	Economy.add_coins(run_coins)
	if score > int(SaveManager.get_v("high_score", 0)):
		SaveManager.set_v("high_score", score)
	state = State.OVER
	Ads.maybe_show_interstitial(3)
	_show_over()

func _revive() -> void:
	# One ad-revive per run (classic rewarded-ad hook).
	revived = true
	over_panel.visible = false
	# Clear nearby obstacles so the player doesn't instantly die again.
	for c in world.get_children():
		if c.is_in_group("obstacles") and c.position.x < vp.x:
			c.queue_free()
	player.revive()
	state = State.PLAYING

# --------------------------------------------------------------------- daily meta
func _check_daily_streak() -> void:
	var today := Time.get_date_string_from_system()
	var last := String(SaveManager.get_v("last_login", ""))
	if last == today:
		return
	var streak := int(SaveManager.get_v("streak", 0))
	# Simple: any new calendar day increments; gaps reset to 1.
	streak = streak + 1 if last != "" else 1
	SaveManager.set_v("streak", streak)
	SaveManager.set_v("last_login", today)
	# Escalating daily reward.
	var reward := 100 + mini(streak, 7) * 50
	Economy.add_coins(reward)

# --------------------------------------------------------------------------- HUD
func _build_hud() -> void:
	hud = CanvasLayer.new()
	add_child(hud)

	score_label = _make_label("0", 72, Vector2(0, 60))
	score_label.size = Vector2(vp.x, 90)
	score_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hud.add_child(score_label)

	coin_label = _make_label("0", 44, Vector2(40, 60))
	coin_label.add_theme_color_override("font_color", Config.color("coin", Color("#ffd23f")))
	hud.add_child(coin_label)

	_build_menu()
	_build_over()
	_build_shop()

func _make_label(text: String, font_size: int, pos: Vector2) -> Label:
	var l := Label.new()
	l.text = text
	l.position = pos
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", Color.WHITE)
	return l

func _make_button(text: String, pos: Vector2, sz: Vector2 = Vector2(520, 130)) -> Button:
	var b := Button.new()
	b.text = text
	b.position = pos
	b.size = sz
	b.add_theme_font_size_override("font_size", 48)
	return b

func _panel(title: String) -> Control:
	var p := Control.new()
	p.set_anchors_preset(Control.PRESET_FULL_RECT)
	var dim := ColorRect.new()
	dim.color = Color(0, 0, 0, 0.55)
	dim.size = vp
	p.add_child(dim)
	var t := _make_label(title, 88, Vector2(0, vp.y * 0.18))
	t.size = Vector2(vp.x, 120)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	p.add_child(t)
	return p

func _refresh_balance() -> void:
	if balance_label:
		balance_label.text = "Coins: %d    Gems: %d" % [Economy.coins(), Economy.gems()]

# ---- Menu
func _build_menu() -> void:
	menu = _panel(String(Config.theme.get("title", "RESKIN RUNNER")))
	var cx := vp.x / 2.0 - 260.0
	var play := _make_button("PLAY", Vector2(cx, vp.y * 0.45))
	play.pressed.connect(_start_run)
	menu.add_child(play)
	var shop := _make_button("SHOP", Vector2(cx, vp.y * 0.45 + 160))
	shop.pressed.connect(func(): shop_panel.visible = true)
	menu.add_child(shop)
	balance_label = _make_label("", 40, Vector2(0, vp.y * 0.78))
	balance_label.size = Vector2(vp.x, 60)
	balance_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	menu.add_child(balance_label)
	hud.add_child(menu)
	_refresh_balance()

func _show_menu() -> void:
	state = State.MENU
	menu.visible = true
	_refresh_balance()

# ---- Game Over
func _build_over() -> void:
	over_panel = _panel("GAME OVER")
	over_panel.visible = false
	hud.add_child(over_panel)

func _show_over() -> void:
	# Rebuild dynamic buttons each death (score/labels change).
	for c in over_panel.get_children():
		if c is Button or (c is Label and c.position.y > vp.y * 0.3):
			c.queue_free()
	var cx := vp.x / 2.0 - 260.0
	var info := _make_label("Score %d   +%d coins" % [score, run_coins], 44, Vector2(0, vp.y * 0.34))
	info.size = Vector2(vp.x, 60)
	info.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	over_panel.add_child(info)

	if not revived:
		var rev := _make_button("REVIVE (Watch Ad)", Vector2(cx, vp.y * 0.45))
		rev.pressed.connect(func():
			rev.disabled = true
			Ads.rewarded_granted.connect(_revive, CONNECT_ONE_SHOT)
			Ads.show_rewarded(0))  # reward here is the revive itself
		over_panel.add_child(rev)

	var again := _make_button("PLAY AGAIN", Vector2(cx, vp.y * 0.45 + 160))
	again.pressed.connect(_start_run)
	over_panel.add_child(again)

	var menu_btn := _make_button("MENU", Vector2(cx, vp.y * 0.45 + 320))
	menu_btn.pressed.connect(func():
		over_panel.visible = false
		_show_menu())
	over_panel.add_child(menu_btn)
	over_panel.visible = true

# ---- Shop
func _build_shop() -> void:
	shop_panel = _panel("SHOP")
	shop_panel.visible = false
	var y := vp.y * 0.32
	var cx := vp.x / 2.0 - 320.0
	for id in Economy.COIN_PACKS.keys():
		var p: Dictionary = Economy.COIN_PACKS[id]
		var label := "%s  $%.2f  →  %d coins" % [String(id).capitalize(), p["price_usd"], p["coins"]]
		var b := _make_button(label, Vector2(cx, y), Vector2(640, 110))
		b.add_theme_font_size_override("font_size", 34)
		var pack_id := String(id)
		b.pressed.connect(func(): IAP.buy(pack_id))
		shop_panel.add_child(b)
		y += 130
	# Free coins via rewarded ad (path for non-payers).
	var free := _make_button("FREE 250 COINS (Watch Ad)", Vector2(cx, y), Vector2(640, 110))
	free.add_theme_font_size_override("font_size", 32)
	free.pressed.connect(func(): Ads.show_rewarded(250))
	shop_panel.add_child(free)
	y += 150
	var close := _make_button("CLOSE", Vector2(cx, y), Vector2(640, 110))
	close.pressed.connect(func(): shop_panel.visible = false)
	shop_panel.add_child(close)
	hud.add_child(shop_panel)
	IAP.purchase_succeeded.connect(func(_id): _refresh_balance())
