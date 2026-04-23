# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page internal tool for managing 엠바고(embargo) requests. Spec is the source of truth — read it before changing behavior:

- `documents/1) PRD.md` — product requirements (must / nice-to-have / out-of-scope)
- `documents/2) IA.md` — information architecture, navigation, URL contract, status colors
- `documents/3) ERD.md` — `embargo_requests` schema, constraints, indexes, trigger

The Supabase project is already provisioned with the table, indexes, `set_updated_at` trigger, RLS disabled, and 10 sample rows. Schema changes belong in `documents/3) ERD.md` first, then applied via Supabase MCP migration — not via ad hoc SQL.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # tsc -b && vite build (typecheck is part of build)
npm run preview    # serve the production build
npx tsc -b         # typecheck only (no emit)
```

No test runner and no linter are configured. Do not invent `npm test` / `npm run lint`.

## Stack

Vite 8 (Rolldown) · React 19 · TypeScript 5 · Tailwind CSS v4 · @supabase/supabase-js v2 · date-fns v4 · lucide-react. No router, no state-management library — intentional for MVP scope (PRD §10).

## Architecture

**Data flow is a single loop**: `useEmbargoRequests` (in `src/hooks/`) is the only place that talks to Supabase. It owns the full row list and exposes `create / update / remove / refetch`. Mutations are **optimistic with rollback** — `update` and `remove` mutate local state first, snapshot the previous state, and restore it on error. Do not bypass this hook with raw `supabase.from(...)` calls in components; add a method to the hook instead.

**Filtering is client-side**. The hook fetches the full table once (volume is tiny per PRD §1) and `App.tsx` derives the visible rows via `resolveRange` (in `src/utils/date.ts`) + status/tag predicates. Don't push filter logic into the Supabase query unless the dataset grows materially.

**URL is the filter state contract** (IA §8). `src/utils/filters.ts` is the only place that translates between `Filters` and `URLSearchParams` — keep `filtersFromSearch` / `filtersToSearch` symmetric. `App.tsx` syncs both directions: filter changes call `history.replaceState`; `popstate` re-reads the URL.

**Status is centralized**. `src/utils/status.ts` owns the canonical mapping of `EmbargoStatus` → label, dot color, badge classes. New status-aware UI must read from these maps; do not hardcode `"requested" | "in_progress" | "completed"` strings or color classes anywhere else. The DB CHECK constraint and the IA §5.1 color spec must stay in sync with this file.

**Modal contract**. `src/components/ui/Modal.tsx` handles focus trap, Esc-to-close, overlay-click-to-close, body scroll lock, and focus restoration. New modals must use it (do not reimplement) — `EmbargoFormModal` and `ConfirmDialog` are the reference consumers.

## Styling

Tailwind v4 CSS-first config: `@import "tailwindcss"` in `src/index.css`, design tokens declared in `@theme`. No `tailwind.config.js`, no `postcss.config.js`. The Vite plugin (`@tailwindcss/vite`) discovers content automatically.

Design tone: light / neutral / mono-accent. Cards use `bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-sm`. Primary button is `slate-900`. Status colors come from `STATUS_BADGE` / `STATUS_DOT`. 24h-임박 rows get `border-l-4 border-l-amber-400` (set in `EmbargoTable`). Pretendard Variable is loaded via CDN `<link>` in `index.html`.

## Environment

`.env.local` holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable key, format `sb_publishable_...`). `lib/supabase.ts` throws at startup if either is missing. The Supabase project ref is in `.mcp.json`; use the Supabase MCP server (already configured) for schema introspection, migrations, and key rotation rather than the dashboard UI when possible.

## Things not to add

PRD §10 and IA §12 explicitly exclude: auth, notifications, i18n, activity logs, file uploads, Realtime subscriptions, routing libraries, state-management libraries, test scaffolding. Treat any request that touches these as a scope decision the user must confirm first.
