# Raindear — Phase 3 Test Report (Real Photos + Testimonial Marquee)

**Scope:** delta in commit `6761436` only (real Raindear photos + looping
testimonial marquee). Phase 1 SPA/API flows already proven separately.

**Result:** **3 / 3 tests PASSED.**

---

## Summary (one line per test)

- **Test 1 — Real photos render in hero + ambience.** PASSED. `interior-dark-deer-wall.jpg` loads at 1600×1200 in the hero section, `interior-arches.jpg` loads at 780×430 in the ambience section.
- **Test 2 — Testimonial marquee auto-scrolls in opposite directions, looping continuously.** PASSED. Two rows mount; over 2.5s the top row drifts **−63.2px** (left) and the bottom row drifts **+52.0px** (right). Real review text from `TestimonialSeeder` renders in cards with 5-star ratings and `TAMU RAINDEAR · GOOGLE` attribution.
- **Test 3 — `prefers-reduced-motion: reduce` halts the marquee.** PASSED. Over the same 2.5s window, |Δ top| = 0.00px and |Δ bot| = 0.00px while 16 cards remain rendered. The animation is fully suppressed without hiding content.

No escalations.

---

## Test 1 — Real photos render

**Path:** `GET http://127.0.0.1:8000/`, then scroll to ambience section.

**Pass criteria & observed:**

| Check | Expected | Observed | Result |
|---|---|---|---|
| `HEAD /images/interior/interior-dark-deer-wall.jpg` | 200 + `image/*` | 200 + `image/jpeg` | PASS |
| Hero `<img>` with `src` ending in `interior-dark-deer-wall.jpg` | exists | found, `naturalWidth=1600`, `naturalHeight=1200` | PASS |
| Ambience `<img>` referencing `/images/interior/...` | ≥ 2 with naturalWidth > 0 | `interior-dark-deer-wall.jpg` 1600×1200 + `interior-arches.jpg` 780×430 | PASS |

![Hero with real Raindear interior backdrop](attachment:final-hero.png)

![Ambience section — 2 real photos rendered after scroll](attachment:t1-ambience-loaded.png)

The hero shows the headline `Where Bogor meets coffee, kitchen & warm moments.`
layered over the `interior-dark-deer-wall.jpg` photo (heavily darkened so
typography stays legible). The ambience section renders both real interior
photos at their natural resolutions — no gradient placeholders.

---

## Test 2 — Marquee opposite-direction looping (the user's explicit ask)

**Path:** Scroll to the section with heading **"Real reviews, real warmth."**.

This is the most important test for this push: the user asked for reviews that
"bergerak ke kiri dan kekanan looping" (move left and right, looping).

**Pass criteria & observed:**

| Check | Expected | Observed | Result |
|---|---|---|---|
| `GET /api/v1/testimonials?featured=true` | 8 items, all `Tamu Raindear`, source `google` | 8 items, all anonymized correctly | PASS |
| `.flex.w-max.gap-6` row count | exactly 2 | 2 | PASS |
| Top row Δtx over 2.5s | `< -30px` (left drift) | **−63.2px** | PASS |
| Bottom row Δtx over 2.5s | `> +30px` (right drift) | **+52.0px** | PASS |
| Opposite directions | yes | yes (signs differ) | PASS |
| First card text | matches one of 8 seeded reviews | "One of recent hangout spot in Bogor with good ambience. The coffee taste great…" | PASS |
| 5-star cards | 5 `svg.fill-gold` per 5-star card | 5 stars on every 5-star card | PASS |
| Attribution text | `TAMU RAINDEAR · GOOGLE` | `Tamu Raindear · google` (rendered uppercase by CSS) | PASS |

![Testimonial marquee — 2 rows with real reviews and 5-star ratings](attachment:final-marquee.png)

**Programmatic motion measurement (the part you can't see in a still):**

```
t=0     tx: [-207.412, -1605.190]
t=2.5s  tx: [-270.586, -1553.160]
Δ top = -63.174 px   →  left drift  ✓
Δ bot = +52.030 px   →  right drift ✓
opposite directions? True
```

The mask fade at the section edges and the duplicated-list seam handling are
both visible — no flicker at the loop boundary, cards fade in/out gracefully
at the edges.

---

## Test 3 — `prefers-reduced-motion: reduce` halts the marquee

**Path:** Reload `/` with Chrome emulating reduced motion.

| Check | Expected | Observed | Result |
|---|---|---|---|
| Top row Δtx over 2.5s | exactly 0 | **0.00px** | PASS |
| Bottom row Δtx over 2.5s | exactly 0 | **0.00px** | PASS |
| Cards still rendered | ≥ 6 | **16** (8 reviews × 2 looped copies × 2 rows) | PASS |

![Marquee under prefers-reduced-motion: animation halted, content visible](attachment:t3-reduced-motion.png)

`useReducedMotion()` correctly disables the framer transition: the rows snap
to their initial transforms and stay there. Reviews are still readable — the
a11y gate isn't implemented as "hide everything", it's implemented as
"freeze the animation".

---

## Methodology notes

- All measurements use Playwright `page.evaluate(() => getComputedStyle(row).transform)` on the actual rendered element, not on Framer Motion's internal state. This is exactly what the browser paints.
- The motion test is deliberately designed so that a broken single-direction marquee, or one where both rows go the same way, would visibly fail (the sign / magnitude assertions).
- The reduced-motion test is the contrapositive of test 2 — same measurement, opposite expectation.
- No setup/login was required for this scope. The Laravel server was already running locally; the SQLite DB was already seeded via `php artisan migrate:refresh --seed` in a previous step.

## Local quality gates (re-confirmed before push)

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run build` | clean (built in 4.21s) |
| `./vendor/bin/pest` | 7 / 7 passing (18 assertions) |
| `./vendor/bin/pint --test` | passed |

No CI is configured on the repo, so there is no remote pipeline to wait on.
