# Monetization & store-compliance checklist

The economy, ads, and IAP are built in — but shipping them on the stores has
hard requirements. Work through this before submitting. Skipping these is the
most common reason monetized games get rejected or pulled.

## Economy design (already done this way — keep it)

- **Deterministic coin packs.** Each pack gives a fixed amount of coins/gems for
  its price (`Economy.COIN_PACKS`). They are **not** randomized reward boxes.
  This deliberately keeps you clear of **loot-box regulation** (Belgium, the
  Netherlands, and a growing list) and the **paid-odds-disclosure** rules Apple
  and Google require for randomized purchases. If you ever add randomized paid
  rewards, you must publish the odds.
- **Pay-to-win is single-player / leaderboard-scoped.** Boosts affect your own
  run and score, not other players' experience — normal and accepted for this
  genre.

## Ads (AdMob)

- [ ] Ship the **Google UMP consent SDK** and request consent **before** loading
      ads (GDPR / ePrivacy in the EU, CCPA in California).
- [ ] Set the app's **ad content rating** to match the store age rating.
- [ ] Keep interstitials **frequency-capped** (`Ads.maybe_show_interstitial`) —
      over-showing triggers AdMob policy strikes and kills retention.
- [ ] Don't place ads on unexpected taps or app-open without a natural break.
- [ ] Mark the app as **not** primarily child-directed (it's 18+).

## In-app purchases

- [ ] Use official billing (**Google Play Billing** / **StoreKit**) — sideloaded
      payment for digital goods violates store policy.
- [ ] **Verify** purchases (server-side or via the billing library) before
      `Economy.grant_pack()` — never trust the client alone.
- [ ] Acknowledge/consume consumable purchases so they can be re-bought.
- [ ] Show real localized prices from the store, not hardcoded USD, at runtime.

## Privacy & listing

- [ ] Publish a **privacy policy** URL (required by AdMob and both stores).
- [ ] Fill the Play **Data safety** form and Apple **App Privacy** labels
      accurately (AdMob collects device/ad identifiers).
- [ ] Set content rating to **18+ / adult** via the IARC questionnaire.
- [ ] Disclose that the app contains ads and in-app purchases in the listing.

## Regional

- [ ] Some jurisdictions require **spending limits / disclosures** on IAP. Check
      your launch markets (EU Digital Services / consumer-protection rules on
      "dark patterns", UK, South Korea, etc.).
