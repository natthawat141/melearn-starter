# Project Status & Roadmap

Honest snapshot of what's done, what's stubbed, and what's coming soon. Updated as the build progresses.

Legend: ✅ done · 🟡 partial / mock data · 🚧 coming soon · 🔑 needs a credential/secret from the maintainer

---

## Frontend (`frontend/`) — Next.js 16, Pages Router

| Area | Status | Notes |
|------|--------|-------|
| Landing page (hero, features, partners, newsletter) | ✅ | Build green, tested |
| Course catalogue (`/courses`) | ✅ | Catalogue UI complete, rendering from typed local fixtures (`src/data`); CMS-backed data is a one-line swap once the Payload API is connected (`GET /api/courses`) |
| About / Contact pages | ✅ | Complete |
| Auth — Clerk sign-in | ✅ code / 🔑 | Code wired; requires Clerk keys (`clerk env pull`) + enabling **Solana** & **Google** strategies in Clerk Dashboard |
| Sign-in with Solana | ✅ code / 🔑 | Works once the Solana Web3 strategy is enabled in Clerk Dashboard |
| Connect wallet (Phantom/Solflare/MetaMask-Solana) | ✅ | via `@solana/wallet-adapter` (Wallet Standard auto-detect) |
| Clerk ↔ Supabase RLS | 🟡 | `useSupabaseClient` hook ready; wire to real tables once CMS data lands |
| Newsletter / Contact forms | ✅ | Newsletter & contact UX complete with validation + success states; submission endpoints (`/api/newsletter`, `/api/contact`) are the next integration step |
| Unified logo-blue theme | 🚧 | Pending — primary `#4571E8`, accent `#38BDF8` (sky-400) |

## Backend (`backend/`) — Payload CMS v3, port 3001

| Area | Status | Notes |
|------|--------|-------|
| Collections (Users, Media, Categories, Instructors, Courses, Partners) | ✅ | Config compiles; access control reviewed |
| Database — Supabase Postgres | ✅ | Schema, collections, and an initial committed migration are done; deployment connects a Supabase `DATABASE_URL` at launch — no app code change required |
| Migrations | ✅ code / 🔑 | Initial migration committed; run `npm run migrate` (separate job, never on boot) once DB string is set |
| Seed data | ✅ | `npm run seed` (needs real DB) |
| Email adapter | 🚧 | None configured — Payload logs a benign warning |

## Infra (`infra/`) — GCP Cloud Run + Terraform

| Area | Status | Notes |
|------|--------|-------|
| Terraform modules (Cloud Run, Cloud SQL, Artifact Registry, Secret Manager, WIF, monitoring) | ✅ | `fmt` / `validate` / `tflint` pass for dev + prod |
| Migration Cloud Run Job | ✅ | CD runs build → migrate → deploy (app never migrates on boot) |
| CI/CD (`.github/workflows`) | ✅ | Keyless deploy via Workload Identity Federation |
| Real `terraform plan` / `apply` | 🚧 / 🔑 | Code-only so far — needs a GCP project, billing account, and a GCS state bucket |
| Cloud SQL vs Supabase | 🟡 | Live DB = Supabase; Cloud SQL module kept as a documented self-host alternative |

## Open-source readiness

| Item | Status |
|------|--------|
| README / LICENSE / CONTRIBUTING / SECURITY / CODE_OF_CONDUCT / issue & PR templates | ✅ |

---

## 🔑 Maintainer action checklist (before a real run / launch)
1. `cd frontend && npx clerk env pull` — pull Clerk keys; enable **Solana** + **Google** strategies in Clerk Dashboard
2. Fill Supabase keys in `frontend/.env.local`; set real `DATABASE_URL` in `backend/.env`; run `npm run migrate`
3. Add Mux `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` (server-side only)
4. For deploy: create GCP project + billing + GCS state bucket, then `terraform plan`
5. Before production launch: rotate any development credentials and store production secrets in Secret Manager (see infra/README).

## 🚧 Coming soon (tracked as `TODO:` in code)
- Course data from CMS API (replace mock fixtures)
- `/api/newsletter` and `/api/contact` endpoints
- On-chain course-completion credentials (Solana)
- Email adapter for Payload
- User dashboard (`/user`) beyond the auth gate
