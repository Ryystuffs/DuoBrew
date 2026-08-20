# DuoBrew POS

A cashier-operated point of sale for a drinks & food stall. ₱ PHP currency, Supabase Auth, 3-role RBAC (admin / manager / cashier), menu management, checkout (Cash + QR/GCash), dashboard & reports.

This is a **learning project** — the learning track (phases 0–8) lives in `.opencode/skills/duobrew-pos/SKILL.md`; the folder conventions live in `FOLDER-STRUCTURE.md`.

## Stack

- **Next.js 16** (App Router, `proxy.ts` instead of `middleware.ts`)
- **React 19** — Server Actions + `useActionState`
- **Supabase** — Auth + Postgres (RLS), `@supabase/ssr` cookie sessions
- **Tailwind CSS v4**, TypeScript 5, Zod for server-action validation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in the values from your Supabase project:

| Key | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API (publishable key, `sb_publishable_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (service role, **server-only** — staff management) |

## Migrations

SQL lives in `supabase/migrations/`, one file per change, timestamped. Apply with the Supabase CLI:

```bash
supabase db push
```

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```

## Docs

- `FOLDER-STRUCTURE.md` — folder layout, RBAC design, phase mapping
- `.opencode/skills/duobrew-pos/SKILL.md` — verified stack facts, schema, learning track