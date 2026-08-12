# Duobrew — Folder Structure Guide

Industry-standard layout for this Next.js 16 (App Router) + Supabase + Zustand project. This is a **reference guide** — the app ignores it at runtime. Build the tree phase by phase; empty folders can wait.

---

## Full tree (end state)

```
duobrew/
├── .github/
│   └── pull_request_template.md
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── proxy.ts                    # Next 16 guard: session refresh + role redirect
│   ├── app/
│   │   ├── layout.tsx              # root layout (fonts, metadata, globals)
│   │   ├── error.tsx               # root error boundary
│   │   ├── loading.tsx             # root loading state
│   │   ├── not-found.tsx           # 404 page
│   │   ├── globals.css
│   │   ├── (auth)/                 # public route group (no protected shell)
│   │   │   └── login/
│   │   │       └── page.tsx        # /login
│   │   ├── (app)/                  # protected route group (shared auth shell)
│   │   │   ├── layout.tsx          # auth check + role-gated nav/sidebar
│   │   │   ├── page.tsx            # / → redirect to /pos
│   │   │   ├── pos/
│   │   │   │   └── page.tsx        # /pos — tabs, grid, cart, checkout, receipt
│   │   │   ├── menu/
│   │   │   │   ├── page.tsx        # /menu — item list + CRUD
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # /menu/new
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # /menu/:id — edit item
│   │   │   ├── categories/
│   │   │   │   └── page.tsx        # /categories
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx        # /reports — dashboard KPIs + charts
│   │   │   │   └── history/
│   │   │   │       └── page.tsx    # /reports/history — date filters + order list
│   │   │   └── settings/
│   │   │       └── staff/
│   │   │           └── page.tsx    # /settings/staff — admin only
│   ├── components/
│   │   ├── ui/                     # primitives: button input dialog select table
│   │   ├── layout/                 # sidebar header mobile-nav
│   │   ├── pos/                    # product-grid product-card cart cart-item checkout-dialog receipt
│   │   ├── menu/                   # menu-table menu-form
│   │   ├── categories/             # category-form
│   │   ├── reports/                # kpi-card revenue-chart top-items splits order-list
│   │   └── staff/                  # staff-form staff-table
│   ├── lib/
│   │   ├── supabase/               # client.ts server.ts middleware.ts
│   │   ├── auth/                   # get-user.ts require-role.ts
│   │   ├── schemas/                # order.ts menu.ts staff.ts (Zod validation)
│   │   ├── actions/                # orders.ts menu.ts staff.ts (server actions)
│   │   ├── hooks/                  # use-cart.ts (Zustand hook wrapper)
│   │   ├── currency.ts             # ₱ formatter
│   │   ├── utils.ts                # cn() etc.
│   │   └── constants.ts            # shared constants
│   ├── stores/
│   │   └── cart-store.ts           # Zustand cart store
│   └── types/
│       ├── database.types.ts       # Supabase generated types
│       ├── product.ts
│       ├── cart.ts
│       ├── order.ts
│       ├── payment.ts
│       └── user.ts
├── supabase/
│   ├── migrations/                 # timestamped SQL, one file per change
│   └── seed.sql
├── .env.local                      # local secrets (gitignored)
├── .env.example                    # documented env keys (committed)
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── README.md
└── FOLDER-STRUCTURE.md             # this guide
```

---

## Where things go — the rules

### `app/` (in `src/`) — routes ONLY
The App Router maps every folder inside `app/` to a URL. **Never** put components, utils, or styles here — only `page.tsx`, `layout.tsx`, route segments, and special files (`error.tsx`, `loading.tsx`, `not-found.tsx`). If it isn't a URL, it doesn't live in `app/`.

### Route groups `(auth)` / `(app)`
Parentheses make a folder **group** — it organizes layouts without adding to the URL.
- `(auth)/login` → URL `/login`, public, no shell.
- `(app)/pos` → URL `/pos`, wrapped in the protected shell (`(app)/layout.tsx` does the auth check + role-gated nav).
`login` sits outside `(app)` so it never inherits the auth shell. This is how the industry splits public vs protected routes.

### `components/` — everything visual that isn't a page
Lives at `src/` root, **not** in `app/`, so Next never treats it as a route and it can be shared across pages. Group by feature (`pos/`, `menu/`, `reports/`), with a `ui/` folder for reusable primitives (button, input, dialog, select, table) and `layout/` for shell pieces (sidebar, header, mobile-nav).

### `lib/` — everything non-visual
- `lib/supabase/` — the three Supabase clients (browser, server, middleware session helper).
- `lib/auth/` — role helpers (`getUser`, `requireRole`).
- `lib/schemas/` — Zod validators, one per domain, mirroring the actions.
- `lib/actions/` — **server actions** (checkout, menu CRUD, staff). Mutations that touch the DB go here, not in an `app/api/` route, so role checks happen server-side before any write.
- `lib/hooks/` — custom React hooks (`use-cart` wraps the Zustand store).
- `lib/currency.ts`, `lib/utils.ts`, `lib/constants.ts` — small shared helpers.

### `stores/` — global client state
Zustand stores for state shared across screens. Cart is the one for v1. Client-only global state goes here, separate from server-side data (which the server owns).

### `types/` — shared TypeScript types
`database.types.ts` (generated from Supabase) plus your own domain types (product, cart, order, payment, user).

### `src/proxy.ts`, not `middleware.ts`
Next 16 renamed middleware → **proxy**. It runs before requests, refreshing the Supabase session and redirecting users by role. It lives beside `src/app/`.

### `supabase/migrations/` — timestamped SQL
One file per schema change: `20260812000000_create_profiles.sql`. Timestamps keep migrations in order and match Supabase CLI conventions (vs a single `001_init.sql`). `seed.sql` holds sample data.

### `public/` — static assets
Images/icons served at the root URL (`/images/logo.png`). No code, no processing.

### Config at the root
`next.config.ts`, `tsconfig.json`, `package.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.env.local` (gitignored) + `.env.example` (committed, documented keys).

---

## Cut from v1 (build these later)

| Piece | Why it's deferred |
|---|---|
| `inventory/` | No stock tables in the schema — only `menu_items.available`. No inventory feature yet. |
| `orders/[id]/` | Receipt is a checkout **modal**; the order list lives in `reports/history`. |
| `app/api/` | v1 mutations are server actions. Route Handlers come later (external clients/mobile). |
| `e2e/` + `tests/` + `playwright.config.ts` | Playwright/Vitest are a Phase 8 stretch — learn testing when the app is stable. |
| `lib/services/` + `lib/queries/` | A 3-layer split (action → service → query) is overkill here. Fold into `lib/actions/`; add layers only if actions get fat. |

---

## Phase mapping

| Phase | Builds |
|---|---|
| 1 | `src/app` skeleton, `(auth)/login`, `(app)/layout.tsx` + `(app)/page.tsx`, `components/layout/`, root special files, `src/proxy.ts` |
| 2 | `supabase/migrations/*.sql`, `seed.sql`, `lib/supabase/types.ts` |
| 3 | `lib/supabase/client.ts` `server.ts` `middleware.ts`, `lib/auth/`, login form |
| 4 | role gates in `proxy.ts` + `(app)/layout.tsx`, `components/layout/` nav gating |
| 5 | `stores/cart-store.ts`, `lib/hooks/use-cart.ts`, `components/pos/`, `lib/actions/orders.ts`, `lib/schemas/order.ts` |
| 6 | `app/menu/**`, `app/categories/**`, `components/menu/`, `components/categories/`, `lib/actions/menu.ts`, `lib/schemas/menu.ts` |
| 7 | `app/reports/**`, `components/reports/`, `lib/actions/reports.ts` (dashboard, charts, filters) |
| 8 | `app/settings/staff/**`, `components/staff/`, `lib/actions/staff.ts`, receipts, void flow, polish, deploy |
