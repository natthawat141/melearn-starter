# Project Status & Roadmap

Honest snapshot of what's done, what's stubbed, and what's coming soon. Updated as the build progresses.

Legend: ✅ done · 🟡 partial / mock data · 🚧 coming soon · 🔑 needs a credential/secret from the maintainer

---

## Frontend (`frontend/`) — Next.js 16, Pages Router

| Area | Status | Notes |
|------|--------|-------|
| Landing page (hero, features, partners, newsletter) | ✅ | Build green, tested |
| Course catalogue (`/courses`) | 🟡 | UI done; course data is **mock fixtures** in `src/data` — `TODO: fetch from CMS API` |
| About / Contact pages | 🟡 | Being added (component-refactor pass in progress) |
| Auth — Clerk sign-in | ✅ code / 🔑 | Code wired; requires Clerk keys (`clerk env pull`) + enabling **Solana** & **Google** strategies in Clerk Dashboard |
| Sign-in with Solana | ✅ code / 🔑 | Works once the Solana Web3 strategy is enabled in Clerk Dashboard |
| Connect wallet (Phantom/Solflare/MetaMask-Solana) | ✅ | via `@solana/wallet-adapter` (Wallet Standard auto-detect) |
| Clerk ↔ Supabase RLS | 🟡 | `useSupabaseClient` hook ready; wire to real tables once CMS data lands |
| Newsletter / Contact forms | 🚧 | UI + success state done; **post nowhere yet** — `TODO: POST /api/newsletter` and `/api/contact` |
| Unified logo-blue theme | 🚧 | Pending — primary `#4571E8`, accent `#38BDF8` (sky-400) |

## Backend (`backend/`) — Payload CMS v3, port 3001

| Area | Status | Notes |
|------|--------|-------|
| Collections (Users, Media, Categories, Instructors, Courses, Partners) | ✅ | Config compiles; access control reviewed |
| Database — Supabase Postgres | 🔑 | **`DATABASE_URL` is a placeholder** — admin & API won't run until the real Supabase connection string is set (Settings → Database; use port 5432 for migrations/admin) |
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
| Secret audit (`SECURITY-AUDIT.md`, gitignored) | ✅ |
| Clean git history before publishing | 🚧 | Recommended: fresh root repo (Option A) — old Bitkub IDs live in `frontend/.git` history |
| Rotate previously-committed Bitkub IDs | 🚧 / 🔑 | Now unused; deactivate in Bitkub console |

---

## 🔑 Maintainer action checklist (before a real run / launch)
1. `cd frontend && npx clerk env pull` — pull Clerk keys; enable **Solana** + **Google** strategies in Clerk Dashboard
2. Fill Supabase keys in `frontend/.env.local`; set real `DATABASE_URL` in `backend/.env`; run `npm run migrate`
3. Add Mux `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` (server-side only)
4. For deploy: create GCP project + billing + GCS state bucket, then `terraform plan`
5. For OSS: fresh root git repo (clean history), replace placeholder emails/URLs in docs, rotate the credentials listed in `SECURITY-AUDIT.md`

## 🚧 Coming soon (tracked as `TODO:` in code)
- Course data from CMS API (replace mock fixtures)
- `/api/newsletter` and `/api/contact` endpoints
- On-chain course-completion credentials (Solana)
- Email adapter for Payload
- User dashboard (`/user`) beyond the auth gate
