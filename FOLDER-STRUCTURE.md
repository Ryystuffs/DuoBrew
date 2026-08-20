# Duobrew — Folder Structure Guide

Industry-standard layout for this Next.js 16 (App Router) + Supabase project. This is a **reference guide** — the app ignores it at runtime. Build the tree phase by phase; empty folders can wait. The project keeps `app/`, `components/`, `lib/` and `proxy.ts` at the project **root** (no `src/` folder) — Next 16 supports both; this repo chose root for simplicity.

---

## Full tree (end state)

```
duobrew/
├── .github/
│   └── pull_request_template.md
├── public/
│   ├── images/
│   └── icons/
├── app/
│   ├── layout.tsx              # root layout (fonts, metadata, globals)
│   ├── error.tsx               # root error boundary
│   ├── loading.tsx             # root loading state
│   ├── not-found.tsx           # 404 page
│   ├── globals.css
│   ├── (auth)/                 # public route group (no protected shell)
│   │   └── login/
│   │       └── page.tsx        # /login
│   ├── (app)/                  # protected route group (shared auth shell)
│   │   ├── layout.tsx          # auth check + role-gated nav/sidebar
│   │   ├── page.tsx            # / → redirect to /pos
│   │   ├── pos/
│   │   │   └── page.tsx        # /pos — tabs, grid, cart, checkout, receipt
│   │   ├── menu/
│   │   │   ├── page.tsx        # /menu — item list + CRUD
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # /menu/new
│   │   │   └── [id]/
│   │   │       └── page.tsx    # /menu/:id — edit item
│   │   ├── categories/
│   │   │   └── page.tsx        # /categories
│   │   ├── reports/
│   │   │   ├── page.tsx        # /reports — dashboard KPIs + charts
│   │   │   └── history/
│   │   │       └── page.tsx    # /reports/history — date filters + order list
│   │   └── settings/
│   │       ├── roles/
│   │       │   └── page.tsx    # /settings/roles — permission grid (admin only)
│   │       └── staff/
│   │           └── page.tsx    # /settings/staff — admin only
├── components/
│   ├── ui/                     # primitives: button input dialog select table
│   ├── layout/                 # sidebar header mobile-nav
│   ├── pos/                    # product-grid product-card cart cart-item checkout-dialog receipt
│   ├── menu/                   # menu-table menu-form
│   ├── categories/             # category-form
│   ├── reports/                # kpi-card revenue-chart top-items splits order-list
│   └── staff/                  # staff-form staff-table
├── lib/
│   ├── supabase/               # client.ts server.ts proxy.ts (updateSession helper — not a Next.js file)
│   ├── auth/                   # get-user.ts require-role.ts permissions.ts (dynamic RBAC)
│   ├── schemas/                # auth.ts order.ts menu.ts staff.ts (Zod validation)
│   ├── actions/                # orders.ts menu.ts staff.ts (server actions)
│   ├── hooks/                  # use-cart.ts (plain React cart state)
│   ├── currency.ts             # ₱ formatter
│   ├── utils.ts                # cn() etc.
│   └── constants.ts            # shared constants
├── types/
│   ├── database.types.ts       # Supabase generated types
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── payment.ts
│   └── user.ts
├── proxy.ts                    # Next 16 guard: getClaims() session refresh + role redirect (optimistic)
├── supabase/
│   ├── migrations/             # timestamped SQL, one file per change
│   └── seed.sql
├── .env.local                  # local secrets (gitignored)
├── .env.example                # documented env keys (committed)
├── .gitignore
├── next.config.ts              # cacheComponents on by default in Next 16
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── README.md
└── FOLDER-STRUCTURE.md         # this guide
```

---

## Where things go — the rules

### `app/` — routes ONLY
The App Router maps every folder inside `app/` to a URL. **Never** put components, utils, or styles here — only `page.tsx`, `layout.tsx`, route segments, and special files (`error.tsx`, `loading.tsx`, `not-found.tsx`). If it isn't a URL, it doesn't live in `app/`. This repo keeps `app/` at the project root (no `src/` folder); Next 16 also supports `src/app/` — pick one and stay consistent.

### Route groups `(auth)` / `(app)`
Parentheses make a folder **group** — it organizes layouts without adding to the URL.
- `(auth)/login` → URL `/login`, public, no shell.
- `(app)/pos` → URL `/pos`, wrapped in the protected shell (`(app)/layout.tsx` does the auth check + role-gated nav).
`login` sits outside `(app)` so it never inherits the auth shell. This is how the industry splits public vs protected routes.

### `components/` — everything visual that isn't a page
Lives at the project root, **not** in `app/`, so Next never treats it as a route and it can be shared across pages. Group by feature (`pos/`, `menu/`, `reports/`), with a `ui/` folder for reusable primitives (button, input, dialog, select, table) and `layout/` for shell pieces (sidebar, header, mobile-nav).

### `lib/` — everything non-visual
- `lib/supabase/` — **the official Supabase-docs location** for the client utilities: `client.ts` (browser client), `server.ts` (server client), `proxy.ts` (the `updateSession()` helper imported by the root `proxy.ts` — **not** a Next.js file).
- `lib/auth/` — role helpers (`getUser`, `requireRole`).
- `lib/schemas/` — Zod validators, one per domain, mirroring the actions.
- `lib/actions/` — **server actions** (checkout, menu CRUD, staff). Mutations that touch the DB go here, not in an `app/api/` route, so role checks happen server-side before any write.
- `lib/hooks/` — custom React hooks (`use-cart` holds the cart state in plain React — no external state library).
- `lib/currency.ts`, `lib/utils.ts`, `lib/constants.ts` — small shared helpers.

### No global state library in v1
Cart state is plain React (`useState`/`useReducer`, possibly React context) inside `lib/hooks/use-cart.ts`. There is **no Redux / TanStack Query** in v1 — Server Components and Server Actions cover server data, and the cart is only shared between the POS grid and cart panel. Add a global store later only if client state genuinely spans unrelated screens.

### `types/` — shared TypeScript types
`database.types.ts` (generated from Supabase) plus your own domain types (product, cart, order, payment, user).

### Dynamic RBAC (planned — Phase 4+)
The fixed 3-role matrix is planned to become **dynamic**: an admin toggles each role's
capabilities from the UI, instead of capabilities being hardcoded into RLS/server/UI. The
matrix in the duobrew-pos skill is the **default seed**. Scope: edit permissions on the
fixed 3 roles only — no creating/renaming/deleting roles.

- **Schema** (replaces `profiles.role` check constraint):
  - `roles` (id, name, description)
  - `permissions` (id, unique `code`, label, description)
  - `role_permissions` (role_id FK, permission_id FK, PK on both)
  - `profiles.role` → FK to `roles.name`
  - Seeds: 3 roles × 5 permissions — `run_pos`, `view_reports`, `manage_menu`,
    `void_orders`, `manage_staff` — per the RBAC matrix. **Admin bypass** (super
    permission) so an admin can never be locked out.
- **RLS**: `has_permission(code)` SECURITY DEFINER function
  (`auth.uid()` → `profiles.role` → `role_permissions` → `permissions`). Policies call it
  instead of hardcoded `role = 'manager'` checks. `role_permissions` read = authenticated
  (so the grid renders), write = admin.
- **Server**: `lib/auth/permissions.ts` — `getPermissions()`, `requirePermission(...codes)`
  replacing `requireRole('manager')`. Used in Server Components + Server Actions (real
  authorization per request); `proxy.ts` keeps its optimistic role redirect.
- **UI**: `app/settings/roles/` — admin-only roles × permissions checkbox grid +
  `togglePermission` server action in `lib/actions/` (updates `role_permissions`,
  `revalidatePath`).

### `proxy.ts` at the root, not `middleware.ts`
Next 16 renamed middleware → **proxy**. The single `proxy.ts` lives at the project root beside `app/` (Next 16 also allows `src/proxy.ts` if the project uses `src/`). It runs before requests: it refreshes the Supabase session via `supabase.auth.getClaims()` (JWT signature validation — **never** `getSession()`) and redirects by role. Proxy is an **optimistic** check — Next 16 explicitly says it is not full session management or authorization, so Server Components and Server Actions re-check `profiles.role` per request. The `updateSession()` helper it imports lives in `lib/supabase/proxy.ts`.

### `supabase/migrations/` — timestamped SQL
One file per schema change: `20260812000000_create_profiles.sql`. Timestamps keep migrations in order and match Supabase CLI conventions (vs a single `001_init.sql`). `seed.sql` holds sample data.

### `public/` — static assets
Images/icons served at the root URL (`/images/logo.png`). No code, no processing.

### Config at the root
`next.config.ts`, `tsconfig.json`, `package.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.env.local` (gitignored) + `.env.example` (committed, documented keys).

Next 16 runs on the Cache Components model (`cacheComponents` on by default). Responses that `setAll` writes auth cookies to **must not be cached** by CDNs or reverse proxies — `lib/supabase/server.ts` and `proxy.ts` apply the cache headers Supabase passes to `setAll(cookiesToSet, headers)` (`Cache-Control: private, no-store`, `Expires`, `Pragma`) to the HTTP response, so one user's session is never served to another user.

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
| 1 | `app` skeleton, `(auth)/login`, `(app)/layout.tsx` + `(app)/page.tsx`, `components/layout/`, root special files, `proxy.ts` |
| 2 | `supabase/migrations/*.sql`, `seed.sql`, `lib/supabase/types.ts` |
| 3 | `lib/supabase/client.ts` `server.ts` `proxy.ts` (session refresh via `getClaims()`), `lib/auth/`, login form, `lib/schemas/auth.ts` (zod-validated login) |
| 4 | role gates in `proxy.ts` + `(app)/layout.tsx`, `components/layout/` nav gating, dynamic RBAC rework (roles/permissions junction, `has_permission()`, `/settings/roles`) |
| 5 | `lib/hooks/use-cart.ts` (plain React cart), `components/pos/`, `lib/actions/orders.ts`, `lib/schemas/order.ts` |
| 6 | `app/menu/**`, `app/categories/**`, `components/menu/`, `components/categories/`, `lib/actions/menu.ts`, `lib/schemas/menu.ts` |
| 7 | `app/reports/**`, `components/reports/`, `lib/actions/reports.ts` (dashboard, charts, filters) |
| 8 | `app/settings/staff/**`, `components/staff/`, `lib/actions/staff.ts`, receipts, void flow, polish, deploy |
