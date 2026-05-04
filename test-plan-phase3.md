# Raindear — Phase 3 Test Plan (Real Photos + Testimonial Marquee)

Focus: the delta in commit `6761436` only. The earlier SPA/API flows (home theme,
menu filter+modal, reservation → DB, admin login + status flip) were already
proven in Phase 1 — see `test-plan.md` / `test-report.md`. This plan does NOT
re-run those.

Runs against the local Laravel server at `http://127.0.0.1:8000` with the seeded
SQLite DB. Recording starts after setup.

Code references that informed the plan:
- `resources/js/components/common/TestimonialMarquee.tsx` (lines 17–47 — row
  animates `x` from `0%` to `-50%` or mirror at linear infinite)
- `resources/js/features/home/TestimonialSection.tsx` (lines 21–52 — renders
  `<TestimonialMarquee testimonials={items} />` after API fetch)
- `resources/js/features/home/HeroSection.tsx` (lines 42–51 — new
  `motion.img src="/images/interior/interior-dark-deer-wall.jpg"` backdrop)
- `resources/js/features/home/AmbienceSection.tsx` (lines 24–37 — `ImageWithFallback`
  pointed at `/images/interior/interior-dark-deer-wall.jpg` and `/images/interior/interior-arches.jpg`)
- `database/seeders/TestimonialSeeder.php` (all 8 entries `customer_name => 'Tamu Raindear'`,
  `is_featured => true`, `source => 'google'`)
- `database/seeders/GallerySeeder.php` (10 entries, all `image_path` under `/images/...`)

---

## Test 1 — Real hero + ambience photos actually render (not gradients)

**Path:** Navigate to `http://127.0.0.1:8000/`.

**Pass criteria — every one must hold:**
1. `HEAD /images/interior/interior-dark-deer-wall.jpg` returns HTTP **200** and
   `Content-Type` starts with `image/`. Fail signal = 404 or 0 bytes → the
   image didn't actually get committed.
2. In the rendered DOM, there is at least one `<img>` whose `src` attribute
   ends with `/images/interior/interior-dark-deer-wall.jpg` that is a
   *descendant of the hero section* (the one containing the headline "Bogor").
   This is the new real-photo backdrop layered under the spotlight. Fail
   signal = no such `<img>` found → hero reverted to pure gradient.
3. Scroll to the **Ambience** section (the one with heading that contains
   "Where time slows down" or similar — check actual copy). The DOM contains
   ≥ **2** `<img>` elements whose `src` ends with `/images/interior/...jpg`
   AND whose `naturalWidth > 0` when inspected (i.e., browser actually
   loaded them). Fail signal = natural width 0 → image URL was wrong / file
   missing.

**Assertion method:** Playwright evaluates document + `HEAD` request. Take a
screenshot showing the rendered hero + ambience section.

**Fail signal a broken implementation would emit:** Pure gradient placeholder
panels, 404s in network tab, blank image frames.

---

## Test 2 — Testimonial marquee renders real reviews and auto-scrolls both directions (continuously, looping)

This is the single most important assertion for this push, because it's the one
thing the user explicitly asked for: reviews "bergerak ke kiri dan kekanan
looping" (move left and right, looping).

**Path:** On `/`, scroll down to the section with heading containing
**"Real reviews, real warmth."** (rendered by `TestimonialSection.tsx`).

**Pass criteria — every one must hold:**

1. **API returns real reviews:** `GET /api/v1/testimonials?featured=true` returns
   JSON with `data.length === 8` and every item's `customer_name === 'Tamu Raindear'`
   and `source === 'google'`. Fail signal = old dummy names like "Aulia P.",
   "Rayhan W." → seeder never re-ran / old data.

2. **Two rows render:** `document.querySelectorAll('section .flex.w-max.gap-6')`
   returns exactly **2** elements (one per row). Fail signal = 0 rows (marquee
   never mounted) or 1 row (only one direction implemented).

3. **Both rows have a non-identity `transform` at t=0:** each row's computed
   style `transform` is something other than `none` / `matrix(1, 0, 0, 1, 0, 0)`.
   This proves Framer Motion actually applied the initial state.

4. **Motion over 2.5s — both rows move, in OPPOSITE directions.** Capture the
   `matrix(a, b, c, d, tx, ty)` transform of each row at `t=0` and
   `t=2500ms`. Let `dx_top = tx_top(t=2500) - tx_top(t=0)` and
   `dx_bottom = tx_bottom(t=2500) - tx_bottom(t=0)`.

   Required:
   - `|dx_top| >= 30px` (row 1 moved measurably)
   - `|dx_bottom| >= 30px` (row 2 moved measurably)
   - `dx_top < 0` (top row drifts **left** — tx becomes more negative)
   - `dx_bottom > 0` (bottom row drifts **right** — tx becomes less negative)
   - `sign(dx_top) != sign(dx_bottom)` (they move in opposite directions)

   Fail signal a broken impl would emit: both rows move the same direction,
   one row static, or neither moves (animation never started). This assertion
   is deliberately designed so that a broken single-direction marquee would
   fail visibly.

5. **Review card content matches real seeded data:** the first visible card in
   row 1 contains the phrase **"One of recent hangout spot in Bogor"** OR
   **"Nice place with a great taste"** (one of the 8 real seeded reviews).
   A 5-star rating SVG group is visible on the card (`svg[class*="fill-gold"]`
   count === 5 for a 5-star review). Fail signal = dummy lorem ipsum text
   → seeder didn't run.

6. **Attribution shows `TAMU RAINDEAR · GOOGLE`** in all-caps tracked mono
   font on every visible card (figcaption content). Fail signal = "Anonymous"
   or old names → seeder regression.

**Assertion method:** Playwright `page.evaluate()` to read computed transforms
at two timestamps, query the DOM for card text + star count, + API fetch
validated via `curl`. Screenshot of the section for visual record.

---

## Test 3 — `prefers-reduced-motion: reduce` halts the marquee (a11y gate)

**Path:** Reload `/` with Chrome emulating
`prefers-reduced-motion: reduce` (Playwright `emulateMedia({ reducedMotion: 'reduce' })`).

**Pass criteria:**
1. Capture the marquee rows' `transform` at t=0 and t=2500ms with reduced motion
   emulated. Required: `tx_top(t=2500) === tx_top(t=0)` and
   `tx_bottom(t=2500) === tx_bottom(t=0)` (exact equality — no drift at all).
2. Reviews are still visible (not hidden by the a11y gate) — the DOM still
   contains ≥ 6 cards total across the two rows.

**Fail signal a broken impl would emit:** Transforms change anyway (the
`useReducedMotion()` hook was ignored), or cards disappear entirely (reduced
motion implemented as "hide instead of animate" — wrong behaviour for a
review section).

---

## Regression (label-only, not a gate)

Not going to re-run Phase 1 flows (menu/reservation/admin) unless something
suspicious shows up. Those were already green in Phase 1.

## Exit criteria

All three tests pass. If Test 2.4 fails (motion not in opposite directions or
not continuous), this push is broken.
