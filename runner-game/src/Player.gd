extends Area2D
class_name Player
## The runner. Stays at a fixed X; the world scrolls past. Double-jump enabled.
## Visual is a themed ColorRect placeholder — drop a real Sprite2D here and load
## the character's texture from its theme/character def to ship art.

signal died
signal coin_collected(value: int)

@export var fall_gravity := 2600.0   # 'gravity' is reserved by Area2D
@export var jump_force := -1150.0
@export var max_jumps := 2

var velocity_y := 0.0
var ground_y := 0.0
var jumps_used := 0
var alive := true
var size := Vector2(96, 96)

func setup(gy: float) -> void:
	ground_y = gy
	position.y = ground_y
	add_to_group("player")

	var rect := ColorRect.new()
	rect.color = Config.color("player", Color("#ff5a5f"))
	rect.size = size
	rect.position = -size / 2.0
	add_child(rect)

	var shape := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = size * 0.85
	shape.shape = rs
	add_child(shape)

	area_entered.connect(_on_area_entered)

func _physics_process(delta: float) -> void:
	if not alive:
		return
	velocity_y += fall_gravity * delta
	position.y += velocity_y * delta
	if position.y >= ground_y:
		position.y = ground_y
		velocity_y = 0.0
		jumps_used = 0

func jump() -> void:
	if not alive:
		return
	if jumps_used < max_jumps:
		velocity_y = jump_force
		jumps_used += 1

## Used by Revive: lift the player back up and resume.
func revive() -> void:
	alive = true
	velocity_y = jump_force
	jumps_used = 0
	position.y = ground_y - 300.0

func _on_area_entered(a: Area2D) -> void:
	if not alive:
		return
	if a.is_in_group("coins"):
		var v := 1
		if a.has_method("value"):
			v = a.value()
		coin_collected.emit(v)
		a.queue_free()
	elif a.is_in_group("obstacles"):
		alive = false
		died.emit()
