extends Area2D
## Collectible coin. Themed ColorRect placeholder; swap for a Sprite2D + anim.

var _value := 1

func setup(val: int) -> void:
	_value = val
	add_to_group("coins")
	var c := ColorRect.new()
	c.color = Config.color("coin", Color("#ffd23f"))
	c.size = Vector2(40, 40)
	c.position = Vector2(-20, -20)
	add_child(c)
	var shape := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(40, 40)
	shape.shape = rs
	add_child(shape)

func value() -> int:
	return _value
