# Raindear Coffee & Kitchen — Bogor

Premium website for **Raindear Coffee & Kitchen Bogor**: company profile, digital
menu, reservation & event inquiry, gallery, contact, and a small CMS admin —
built as a single Laravel 12 application that serves a React 19 + Vite + TypeScript
SPA from `/` and a versioned REST API from `/api/v1`.

The visual direction is **Dark Editorial Coffee Lounge**: espresso-black
canvas, warm gold accents, editorial serif display type, generous negative
space, and restrained motion. See `.claude/skills/frontend-design/SKILL.md` for
the design rules this implementation follows.

> Heads up — gallery, hero, and signature menu currently use *placeholder*
> imagery (gradient panels generated client-side, plus a few `/img/...`
> filenames not yet committed to `public/`). Replace these with licensed,
> official Raindear assets before going to production. Search the codebase for
> `licensed/official Raindear assets` to see every spot that needs replacing.

---

## Stack

**Backend**
- Laravel 12, PHP 8.3
- Laravel Sanctum (SPA cookie auth) for the admin
- MySQL 8 / SQLite for local
- Redis (optional) for cache + queue
- Form Request validation + API Resources + Policies

**Frontend**
- React 19, Vite 6, TypeScript 5.7
- Tailwind CSS 4 (with `@tailwindcss/vite`)
- React Router 7
- TanStack Query 5
- Framer Motion 11
- React Hook Form + Zod
- Embla Carousel, Lucide React, `class-variance-authority`, `tailwind-merge`

**Database**
- 12 tables: `users`, `outlets`, `opening_hours`, `menu_categories`, `menu_items`,
  `gallery_assets`, `testimonials`, `promotions`, `reservations`,
  `event_inquiries`, `contact_messages`, `site_settings`.

---

## Local setup

### Option A — Docker (recommended)

```bash
cp .env.example .env
docker compose up -d
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

The site is then available at:
- Site (Laravel + SPA shell): http://localhost:8000
- Vite dev server (HMR): http://localhost:5173

### Option B — Native

Requirements: PHP 8.3, Composer 2.x, Node 20+, MySQL 8 (or SQLite).

```bash
# 1. Install deps
composer install
npm install

# 2. Configure
cp .env.example .env
php artisan key:generate

# 3. Database
php artisan migrate --seed

# 4. Run
php artisan serve            # http://localhost:8000
npm run dev                  # http://localhost:5173 (Vite HMR)
```

For a production-style local build (no Vite dev server):

```bash
npm run build
php artisan serve
```

---

## Default admin credentials

Seeded by `UserSeeder`:

| Role          | Email                  | Password   |
|---------------|------------------------|------------|
| `super_admin` | `admin@raindear.test`  | `password` |
| `admin`       | `staff@raindear.test`  | `password` |

Sign in at `/admin/login` — Sanctum issues a session cookie scoped to the SPA.

> **Change these credentials before deploying anywhere public.** They exist
> only to make local development immediately usable.

---

## Useful commands

```bash
# Backend
php artisan migrate:fresh --seed      # rebuild local DB with seed data
php artisan route:list --path=api     # browse API
composer lint                         # Laravel Pint formatter
composer test                         # Pest test suite

# Frontend
npm run dev                           # Vite + HMR
npm run build                         # tsc --noEmit + vite build
npm run typecheck                     # TypeScript only
npm run lint                          # ESLint
npm run format                        # Prettier
```

---

## API surface (v1)

Public read endpoints — no auth:
```
GET  /api/v1/health
GET  /api/v1/outlets
GET  /api/v1/outlets/{slug}
GET  /api/v1/menu-categories
GET  /api/v1/menu-items?category=&search=&popular=&signature=&new=
GET  /api/v1/menu-items/{slug}
GET  /api/v1/gallery?category=
GET  /api/v1/testimonials?featured=true
GET  /api/v1/promotions
GET  /api/v1/site-settings
```

Public form submissions — rate limited (`6,1`):
```
POST /api/v1/reservations
POST /api/v1/event-inquiries
POST /api/v1/contact-messages
```

Admin (Sanctum cookie auth):
```
POST   /api/v1/admin/login
POST   /api/v1/admin/logout
GET    /api/v1/admin/me
GET    /api/v1/admin/dashboard

# CRUD
{GET,POST,PUT,DELETE} /api/v1/admin/menu-categories
{GET,POST,PUT,DELETE} /api/v1/admin/menu-items
{GET,POST,PUT,DELETE} /api/v1/admin/gallery-assets
{GET,POST,PUT,DELETE} /api/v1/admin/testimonials
{GET,POST,PUT,DELETE} /api/v1/admin/promotions
{GET,POST,PUT,DELETE} /api/v1/admin/outlets
{GET,POST,PUT,DELETE} /api/v1/admin/opening-hours
{GET,POST,PUT,DELETE} /api/v1/admin/site-settings

# Status only
GET  /api/v1/admin/reservations?status=
GET  /api/v1/admin/reservations/{id}
PATCH /api/v1/admin/reservations/{id}     # body: { status, notes? }

GET  /api/v1/admin/event-inquiries
PATCH /api/v1/admin/event-inquiries/{id}

GET  /api/v1/admin/contact-messages
PATCH /api/v1/admin/contact-messages/{id}
```

---

## Frontend routes

```
/                  Home
/menu              Menu (sticky filter, search, detail modal)
/about             About (brand values)
/gallery           Gallery (masonry, lightbox, category filter)
/reservation       Reservation form + WhatsApp prefill
/contact           Contact form + map
/admin/login       Admin sign-in
/admin             Admin overview (dashboard stats)
/admin/menu-items  Menu CRUD
/admin/gallery     Gallery list
/admin/reservations
/admin/event-inquiries
/admin/messages
```

---

## Project layout

```
app/
├── Http/
│   ├── Controllers/Api/V1/         # public controllers
│   │   └── Admin/                  # admin controllers
│   ├── Requests/Api/               # public form requests
│   └── Requests/Admin/             # admin form requests
├── Http/Resources/                 # API resources (JSON shaping)
└── Models/                         # 12 Eloquent models

database/
├── migrations/                     # 12 + opening hours
└── seeders/                        # realistic Raindear data

resources/
├── css/app.css                     # Tailwind + design tokens
├── js/
│   ├── app.tsx                     # SPA entrypoint
│   ├── app/router.tsx              # React Router definitions
│   ├── components/{layout,common,deer,ui}
│   ├── features/                   # home/, menu/, etc.
│   ├── pages/{public,admin}
│   ├── lib/                        # api client, utils, animations, seo
│   └── types/                      # shared TS types
└── views/app.blade.php             # SPA shell (only blade view)

routes/
├── api.php                         # /api/v1 surface
└── web.php                         # SPA catch-all
```

---

## Replacing placeholder assets

Before deploying:

1. Drop licensed Raindear photography into `public/img/{gallery,hero,menu,promo}/`.
   Match the filenames referenced in `database/seeders/GallerySeeder.php`,
   `PromotionSeeder.php`, and `resources/js/features/home/AmbienceSection.tsx`.
2. For images uploaded through the admin instead, run
   `php artisan storage:link` once and use the gallery/menu CRUD endpoints.
3. Replace the brand wordmark with the official `Raindear` logo (the
   `DeerMark` SVG component currently uses an inline line-art glyph).

---

## Notes on motion & accessibility

- All non-essential motion is gated by `prefers-reduced-motion` (the intro
  loader does not appear, parallax is suppressed, transitions collapse).
- Focus rings are visible (gold outline). Keyboard navigation works on all
  routes.
- Color contrast was tuned for AA on dark backgrounds (off-white `#f4ecdc`
  body text on near-black `#0a0907`).
