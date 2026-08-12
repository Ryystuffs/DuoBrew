---
name: duobrew-pos
description: Use when working on Duobrew, the food-stall POS app. Trigger on keywords like duobrew, POS, food stall, menu, cart, checkout, orders, RBAC, roles, Supabase auth, dashboard, sales report, or any Phase 0-8 learning task in this repo. This is a LEARNING project — apply the collaboration workflow and never build features outright without teaching.
---

# Duobrew POS — Food Stall Point of Sale

A cashier-operated POS for a drinks & food stall. ₱ PHP currency, Supabase Auth,
3-role RBAC, menu management, checkout (Cash + QR/GCash), dashboard & reports.

**IMPORTANT**: This is a learning project. The user knows React but is new to
TypeScript and wants project-based learning. Follow the "How we work" rules
below. Do NOT write feature code for them — teach, guide, review, and verify.

## Verified stack facts (check before coding)

- Next.js **16.3.0** — `middleware.ts` is now **`proxy.ts`**
  (`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`). The
  root `AGENTS.md` Next.js block is auto-managed by `next dev`; keep it intact.
- `@supabase/ssr` 0.12.4 / `@supabase/supabase-js` 2.112.3 — use
  `createServerClient`/`createBrowserClient` with `getAll`/`setAll` cookie
  methods. Env uses `sb_publishable_...` key format (already in `.env.local`).
- Tailwind v4, React 19.2.8, App Router, TypeScript 5.
- **Zod** for all server-action input validation. **dayjs** for date filters.
  **Recharts** for dashboard charts.
- UI is hand-rolled with Tailwind — NO component library (no shadcn/ui).
- Cart state in v1 = plain React state — NO Zustand. NO TanStack Query
  (Server Components / Server Actions cover its role in the App Router).
- Need to add server-only env var: `SUPABASE_SERVICE_ROLE_KEY` (for
  `auth.admin.createUser` when creating staff accounts).

## Product decisions (locked)

- Currency: **₱ PHP** — use a `lib/currency.ts` formatter.
- Payments v1: record Cash / QR / GCash method + amount received + change. NO
  real payment gateway.
- No shift tracking in v1 (orders store `cashier_id` FK only).
- Receipt: on-screen modal after checkout (order no, items, total, method,
  change). No printer in v1.
- Staff accounts: created by admin via `auth.admin.createUser`, assigned a
  role, can be deactivated (`profiles.active = false`).
- Dashboard access: manager + admin only.

## RBAC model

Roles in `profiles.role`: `admin`, `manager`, `cashier`.

| Permission               | cashier | manager | admin |
|--------------------------|:-------:|:-------:|:-----:|
| Run POS, create orders   | ✅      | ✅      | ✅    |
| Dashboard & reports      | ❌      | ✅      | ✅    |
| Manage menu              | ❌      | ✅      | ✅    |
| Void orders              | ❌      | ✅      | ✅    |
| Manage staff accounts    | ❌      | ❌      | ✅    |

Enforcement (3 layers):
1. **RLS policies** — read for authenticated; `menu_items`/`categories` write
   = manager/admin; order void update = manager/admin.
2. **Next.js route guards** — `proxy.ts` + server components read
   `profiles.role` per request; `/reports` and staff settings block by role;
   void actions re-check role server-side.
3. **UI gating** — nav items, void buttons, staff section only for allowed
   roles.

## Database schema (migration `001_init.sql`)

- `categories` (id, name, sort_order)
- `menu_items` (id, category_id FK, name, price numeric, available bool,
  image_url nullable)
- `orders` (id, created_at, cashier_id FK→auth.users, total, payment_method
  cash|qr|gcash, amount_received, change, status paid|voided, voided_by FK
  nullable, voided_at nullable)
- `order_items` (id, order_id FK, menu_item_id FK, name_snapshot, unit_price,
  qty)
- `profiles` (id FK→auth.users, full_name, role check admin|manager|cashier,
  active bool)
- Trigger: auto-create `profiles` row on `auth.users` insert.
- RLS policies per the RBAC matrix.
- Revenue excludes `voided` orders; voided orders remain visible and flagged.

## Planned file layout

- `lib/supabase/client.ts` — `createBrowserClient`
- `lib/supabase/server.ts` — `createServerClient` (getAll/setAll cookies)
- `lib/supabase/middleware.ts` — session-refresh helper
- `lib/supabase/types.ts` — Database types
- `lib/auth/` — `getCurrentUser()`, `getRole()`, `requireRole(...roles)`
- `lib/currency.ts` — ₱ formatter
- `proxy.ts` (root) — session refresh + route protection + role-aware redirect
- `app/login/page.tsx` — email/password sign-in
- `app/(app)/layout.tsx` — protected shell with role-gated nav
- `app/(app)/pos/` — category tabs, item grid, cart, checkout, receipt
- `app/(app)/reports/` — dashboard (KPI cards, 7-day trend chart, top items,
  category & payment splits, recent orders)
- `app/(app)/reports/history/` — date filters (Today/7-day/This month/Custom),
  items-sold table, order list with status filter
- `app/(app)/menu/` — category & item CRUD (manager/admin)
- `app/(app)/settings/staff/` — staff management (admin)

## Learning track (each phase = one deliverable)

| # | Phase | Concept | User builds |
|---|-------|---------|-------------|
| 0 | TypeScript primer | types, interfaces, strict mode | annotated component until `tsc` passes |
| 1 | App Router | routes, layouts, server vs client components | `/login`, shared layout, nav |
| 2 | Database & Supabase | tables, FKs, RLS | apply migration, write RLS policy |
| 3 | Auth | SSR cookies, createServerClient, session flow | login form + sign out + `proxy.ts` guard |
| 4 | RBAC | roles, server checks, UI gating | route gate + role-aware nav/buttons |
| 5 | POS core | server actions, form state, atomic inserts | category tabs, item grid, cart, checkout |
| 6 | Menu CRUD | revalidation, mutations | add/edit/delete items, toggle available |
| 7a | Dashboard | SQL aggregation → KPI cards | revenue totals, AOV, orders count |
| 7b | Charts | Recharts trend/split/top-items | revenue trend, category & payment splits |
| 7c | Filters | dayjs date ranges | Today/7-day/This month/Custom, items-sold |
| 8 | Polish | currency format, edge cases, deploy | receipts, void flow, deployment |

**Progress tracker** (update as phases complete):
- [ ] Phase 0 — TypeScript primer
- [ ] Phase 1 — App Router
- [ ] Phase 2 — Database & Supabase
- [ ] Phase 3 — Auth
- [ ] Phase 4 — RBAC
- [ ] Phase 5 — POS core
- [ ] Phase 6 — Menu CRUD
- [ ] Phase 7a — Dashboard
- [ ] Phase 7b — Charts
- [ ] Phase 7c — Filters
- [ ] Phase 8 — Polish

## How we work (learning collaboration rules)

1. **Teach first** — short concept explainer with a tiny working example.
2. **User builds** — they write the real feature code, not the assistant.
3. **Verify together** — run it, debug, iterate.
4. **User explains back** — they teach the assistant what they wrote.
5. Assistant only writes the fiddly foundation (migration, Supabase client
   layer, `proxy.ts`) and then walks through every line.
6. Give hints before answers. Pause to dissect instructive mistakes.
7. Each phase ends with a definition of done.
8. Adjust difficulty on the fly — too easy or too hard, change it.
