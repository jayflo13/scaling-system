extends Node
## In-app purchase integration point (Google Play Billing / Apple StoreKit).
##
## STUB by default so the store flow is testable without the native billing SDK.
## To go live: add the Godot Google Play Billing plugin (Android) / a StoreKit
## bridge (iOS), set test_mode = false, and on a VERIFIED purchase call
## Economy.grant_pack(product_id). Always verify the purchase token server-side
## or via the billing library before granting — never trust the client alone.

signal purchase_succeeded(product_id: String)
signal purchase_failed(product_id: String)

@export var test_mode := true

func buy(product_id: String) -> void:
	if not Economy.COIN_PACKS.has(product_id):
		purchase_failed.emit(product_id)
		return
	if test_mode:
		await get_tree().create_timer(0.3).timeout
		Economy.grant_pack(product_id)
		purchase_succeeded.emit(product_id)
	else:
		# TODO: plugin.purchase(product_id); on verified purchase ->
		# Economy.grant_pack(product_id); then acknowledge/consume the purchase.
		push_warning("Wire Play Billing / StoreKit here.")
		purchase_failed.emit(product_id)
