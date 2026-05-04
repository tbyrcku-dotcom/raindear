# Raindear SPA — End-to-End Test Plan

Tests the four flows that prove the new SPA + REST API actually works (not just renders).
All tests run against the local Laravel server at `http://127.0.0.1:8000` with the seeded
SQLite DB. Recording starts after setup.

Code references that informed the plan:
- `resources/js/pages/public/HomePage.tsx`, `features/home/HeroSection.tsx`
- `resources/js/pages/public/MenuPage.tsx`
- `resources/js/pages/public/ReservationPage.tsx` (zod schema lines 14–22, submit POST `/api/v1/reservations`)
- `resources/js/pages/admin/AdminLogin.tsx` (POST `/admin/login`)
- `resources/js/pages/admin/AdminReservations.tsx` (status select → PATCH `/admin/reservations/{id}`)
- `routes/api.php`, `app/Http/Controllers/Api/V1/ReservationController.php`,
  `app/Http/Controllers/Api/V1/Admin/AdminReservationController.php`

---

## Test 1 — Home page renders the dark editorial theme (not the old Inertia scaffold)

**Path:** Navigate to `http://127.0.0.1:8000/`.

**Pass criteria (every one must hold):**
1. Background computes to near-black (RGB close to `rgb(10, 9, 7)` — the `--color-ink` token). A pure-white or default gray means the SPA failed to mount or CSS didn't load.
2. The hero contains the headline word **"Bogor"** rendered in a serif display font (Cormorant Garamond), not in Inter/system serif. Verify by checking computed `font-family` includes `Cormorant`.
3. At least one of the CTA buttons reads exactly **"Explore Menu"**, **"Reserve Table"**, or **"Get Direction"**.
4. The DOM contains an `<svg>` with the deer mark line-art (an element with `data-deer-mark` or, failing that, a path inside an SVG of >100 chars in the navbar) — confirms the brand identity component rendered, not a fallback.

**Fail signal a broken implementation would emit:** Old Laravel welcome page, blank screen, light theme, or sans-serif headline.

---

## Test 2 — Menu filter + detail modal end-to-end

**Path:** From `/`, click the **Menu** nav link (or navigate to `/menu`).

**Steps & assertions:**
1. The page lists multiple menu items including **"Es Kopi Bogor Original"** at IDR price `28,000` (seeded). Pass = both the name and the formatted price are visible in the DOM.
2. Click the **"Coffee"** category chip in the sticky filter. Pass = at least one item is shown and **"Nasi Goreng Hitam"** (a non-Coffee seeded item) is NOT in the visible list.
3. Click the **"All"** filter, then click the menu card for **"Es Kopi Bogor Original"**. Pass = a modal opens with both the name "Es Kopi Bogor Original" and a close affordance (× button or Escape closes it).
4. Press Escape. Pass = the modal closes (the name no longer appears outside its card position).

**Fail signal a broken implementation would emit:** Filter button does nothing; modal doesn't open; non-Coffee items still visible after filtering.

---

## Test 3 — Reservation form persists to the database (PRIMARY proof)

**Path:** Navigate to `/reservation`.

**Steps & assertions:**
1. Submit the form with the following exact values:
   - Name: `E2E Devin Test`
   - Phone: `+6282111789089`
   - Email: `e2e@devin.test`
   - Date: tomorrow (`YYYY-MM-DD`)
   - Time: `19:30`
   - Guests: `4`
2. Pass = a success state is shown (the page replaces the form with confirmation copy).
3. Pass = `php artisan tinker --execute='echo App\Models\Reservation::where("name","E2E Devin Test")->first()->status;'` prints `pending`. (This is the assertion that distinguishes a working from a broken implementation — the row must exist with status pending.)

**Fail signal a broken implementation would emit:** No DB row created; non-200 response; form does not transition to success state.

---

## Test 4 — Admin login + status change persists

**Path:** Navigate to `/admin/login`.

**Steps & assertions:**
1. Sign in with `admin@raindear.test` / `password`. Pass = redirected to `/admin` and the dashboard heading **"Overview"** appears.
2. Click the **"Reservations"** nav item.
3. Locate the row for **"E2E Devin Test"** (created in Test 3).
4. Change its status select from `pending` to `confirmed`.
5. Pass = `php artisan tinker --execute='echo App\Models\Reservation::where("name","E2E Devin Test")->first()->status;'` now prints `confirmed` (proves PATCH endpoint persists, not just optimistic UI).

**Fail signal a broken implementation would emit:** Login fails despite correct creds; reservations table empty after login; DB still says `pending` after the status change (UI-only update with no API write).

---

## Out of scope (intentionally not tested)

- Gallery lightbox image source (uses placeholder gradients — known per PR description).
- Mobile breakpoints below 375px (CSS-only, low risk for the rebuild milestone).
- Event inquiry + contact-message flows (same architecture as reservation; one form proven covers the pattern).
- Lighthouse perf scores (separate measurement task).
