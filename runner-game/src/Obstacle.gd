extends Area2D
## An obstacle the player must jump. Themed ColorRect placeholder.

func setup(height: float) -> void:
	add_to_group("obstacles")
	var w := 64.0
	var r := ColorRect.new()
	r.color = Config.color("obstacle", Color("#3a86ff"))
	r.size = Vector2(w, height)
	r.position = Vector2(-w / 2.0, -height)
	add_child(r)
	var shape := CollisionShape2D.new()
	var rs := RectangleShape2D.new()
	rs.size = Vector2(w * 0.8, height)
	shape.shape = rs
	shape.position = Vector2(0, -height / 2.0)
	add_child(shape)
