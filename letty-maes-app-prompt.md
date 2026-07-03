# Emergent.sh Build Prompt — Letty Mae's Tea Room Online Ordering App

Copy everything below the line into emergent.sh.

---

Build a beautiful, production-quality online ordering web app for **Letty Mae's Tea Room**, a charming, highly-rated (4.8★, 339 reviews) tea room and café at **112 E Washington St, Morris, IL 60450** — phone **(815) 416-1370**. The app lets customers browse a mouth-watering photo menu, add items to a cart, **pay in the app**, and then simply **walk in and pick up** their order. Dine-in, takeout, and delivery are offered at the restaurant, but this app is focused on **order-ahead pickup**.

## 1. Brand, Look & Feel

The design should feel like stepping into a cozy, elegant small-town tea room — vintage charm meets modern polish:

- **Color palette:** soft cream / ivory background (#FAF6EF), dusty rose (#D8A0A7), sage green (#9CAF88), warm gold accents (#C9A227), deep charcoal text (#3A3532).
- **Typography:** an elegant serif for headings (e.g., Playfair Display or Cormorant Garamond) paired with a clean, readable sans-serif for body text (e.g., Lato or Inter). Script accent font (e.g., Great Vibes) for the logo wordmark "Letty Mae's".
- **Texture & details:** subtle floral/botanical line-art flourishes, delicate divider ornaments, soft drop shadows, rounded cards, gentle fade/slide micro-animations on scroll and hover. Think "tea party invitation," not corporate.
- Fully **responsive and mobile-first** — most customers will order from their phones.
- Accessible: proper contrast, alt text on all food images, keyboard-navigable checkout.

## 2. Food Photography (very important)

Every menu item must have a large, **appetizing, professional-quality photo** — bright natural window light, shallow depth of field, styled on vintage china, floral tablecloths, and tiered serving trays to match the tea room aesthetic. Photos should make the food look irresistible: steam rising from soup, glistening fresh strawberries, flaky golden scones with clotted cream, condensation on iced strawberry lemonade. Use AI-generated or high-quality stock food photography matching each item's description. Show photos:

- As large hero imagery on the landing page (rotating showcase of 3–4 signature dishes).
- On every menu card (edge-to-edge image, ~4:3, with a subtle zoom-on-hover effect).
- Enlarged in an item detail view/modal when a dish is tapped.

## 3. Pages & Structure

**Landing page**
- Full-width hero: gorgeous food photo collage or slideshow, the Letty Mae's wordmark, tagline ("Homemade goodness, steeped in charm"), star rating badge (4.8 ★ · 339 reviews), and a prominent **"Order for Pickup"** call-to-action button.
- "Local favorites" strip featuring the Strawberry Lemonade, Summer Salad, Quiche of the Day, and fresh-baked Scones.
- Short "About" section: all-homemade food, creative menu, beloved small-town tea room in historic downtown Morris; a photo of the cozy interior.
- Testimonials carousel with 3–4 real-style review quotes (e.g., "The best all homemade food, great service — can't beat the atmosphere.").
- Hours, address with embedded map, phone number, and social link in a graceful footer.

**Menu page**
- Sticky category navigation: **Teas & Drinks · Soups · Salads · Sandwiches · Quiche · Afternoon Tea · Desserts & Scones**.
- Grid of photo cards: image, item name, one-line description, price, and an "Add to Order" button with a quantity stepper.
- Tapping a card opens a detail modal: large photo, full description, options (e.g., muffin choice with soup, dressing choice with salad, tea flavor), special-instructions text box, add-to-cart.
- Dietary badges where relevant (vegetarian, gluten-friendly).

**Cart & Checkout**
- Slide-out cart drawer accessible from a persistent cart icon showing item count and running total.
- Checkout page: order summary, **pickup time picker** (ASAP or scheduled in 15-minute slots within business hours), customer name + phone + email, optional tip (10/15/20%/custom), Illinois sales tax line, and total.
- **Payment:** integrate **Stripe** (card, Apple Pay, Google Pay) so customers pay fully in-app. Use Stripe test mode keys until real keys are provided.
- Confirmation screen + email/SMS-style confirmation with a friendly **order number and pickup instructions** ("Show this at the counter at 112 E Washington St — we'll have it ready!").

**Order status**
- Simple order lookup page (order number + phone) showing status: Received → Being Prepared → Ready for Pickup.

**Admin (lightweight)**
- Password-protected `/admin` dashboard for staff: incoming orders list with status buttons (mark Preparing / Ready / Picked Up), daily order history, and the ability to mark menu items as sold out (sold-out items show grayed-out with a "Sold out today" ribbon).

## 4. Menu & Prices

Use this menu with these prices. *(Prices are realistic placeholders in the restaurant's $10–20 range — the owner will confirm/adjust exact items and prices before launch.)*

**Teas & Drinks**
- Fresh-Brewed Hot Tea (pot for one, choice of loose-leaf flavors) — $4.25
- Summer Strawberry Green Tea — $4.75
- Signature Strawberry Lemonade — $4.50
- Classic Lemonade — $3.75
- Iced Tea (sweet or unsweet) — $3.25
- Coffee (bottomless cup) — $3.00

**Soups** *(cup $4.95 / bowl $6.95; served with choice of muffin)*
- Chilled Strawberry Soup — cup $5.50 / bowl $7.50
- Cold Peach Soup (seasonal) — cup $5.50 / bowl $7.50
- Soup of the Day (homemade daily) — cup $4.95 / bowl $6.95

**Salads**
- Summer Salad — mixed greens, fresh strawberries, candied walnuts, feta, poppyseed dressing — $12.95
- Letty Mae's Chicken Salad Plate — on a bed of greens with fresh fruit and a muffin — $13.50
- Garden Salad — $9.95 (add chicken salad scoop +$3.50)

**Sandwiches** *(served with fresh fruit and choice of side)*
- Chicken Salad Croissant — signature chicken salad with strawberries & walnuts on a buttery croissant — $13.95
- Turkey, Bacon & Swiss on Croissant — $13.50
- Classic Tea Sandwich Trio — cucumber-dill, egg salad, chicken salad on soft bread — $12.95
- Grilled Ham & Cheddar — $11.95

**Quiche** *(served with fresh fruit and a muffin)*
- Quiche of the Day — flaky crust, baked fresh each morning — $12.95
- Quiche & Soup Combo — slice of quiche with a cup of soup — $14.95

**Afternoon Tea**
- Letty Mae's Afternoon Tea for One — tiered tray with tea sandwiches, scone with clotted cream & jam, petite desserts, pot of tea — $19.95
- Tea Party for Two — full tiered service for two — $38.00

**Desserts & Scones**
- Fresh-Baked Scone with Clotted Cream & Jam — $4.95
- Whoopie Pie — $4.50
- Oreo Cake Slice — $5.95
- Muffin of the Day — $3.50
- Dessert of the Day — $5.95

## 5. Business Rules

- **Hours:** show real hours and only allow pickup times within them (e.g., opens 10:30 AM; closed Sundays/Mondays — make hours easily editable in one config file). If the restaurant is closed, show "We're currently closed — schedule a pickup for when we open" and allow future-day scheduling.
- Pickup only through the app — no delivery or dine-in reservations in v1 (link the phone number for those).
- Order minimum: none. Sales tax: use a configurable rate (default 8.25%).
- Friendly, warm copywriting throughout — like a note from Letty Mae herself.

## 6. Tech Expectations

- Modern stack (e.g., React frontend + FastAPI/Node backend + MongoDB/Postgres — whatever emergent's default full-stack template is), Stripe Checkout or Payment Intents for payments, and seeded database with the full menu above including image URLs.
- Clean, well-organized code; menu items, prices, hours, and tax rate stored in the database/config so the owner can update them without code changes.
- Fast page loads; images lazy-loaded and optimized.

Make it feel special — this is a beloved local tea room, and the app should be as delightful as the place itself.
