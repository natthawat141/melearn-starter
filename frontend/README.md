# Melearn — Frontend

The web client for **Melearn**, a Solana-hackathon e-learning platform for Blockchain, Web3, and career skills. Identity is handled by Clerk (including Sign-in with Solana); on-chain actions use the Solana wallet adapter.

> For the full architecture, monorepo layout, and deployment story, see the [root README](../README.md).

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 · Pages Router · TypeScript (strict) |
| UI | Tailwind CSS 3 (raw utilities) · Framer Motion |
| Fonts | Sora (display) · Source Sans 3 (body) via `next/font` |
| Auth | Clerk (email/social + Sign-in with Solana) |
| Web3 | `@solana/wallet-adapter` (Phantom, Solflare) on devnet |
| Data | Supabase JS client · Mux (course video) |

---

## Getting started

```bash
nvm use 22                   # Node 22 required
cp .env.example .env.local   # fill in Clerk / Supabase / Mux (see below)
npm install
npm run dev                  # → http://localhost:3000
```

> Pull Clerk keys automatically with `npx clerk env pull`.

---

## Project structure

```
src/
  components/
    layout/        Navbar (Clerk auth + Solana wallet), Footer
    sections/      Hero, FeaturedCourses, Features, Partners, Newsletter,
                   Courses, HowItWorks, Stats, CTA
    providers/     SolanaProvider (connection + wallet adapters)
    ui/            Container, SectionHeading, Button, Badge, CourseCard
  hooks/
    useWallet.ts          wraps @solana/wallet-adapter (on-chain actions)
    useClerkSolanaSync.ts bridges a Clerk Solana sign-in to the wallet adapter
  lib/
    supabase.ts           public Supabase client
    useSupabaseClient.ts  Clerk-authenticated client for RLS
  data/            typed course/partner fixtures (swapped for the CMS API)
  types/           shared interfaces (Course, Partner …)
  pages/           Pages Router (index, courses, about, contact, sign-in, sign-up)
  proxy.ts         Clerk middleware (protects /user)
```

Identity (Clerk) and on-chain wallet (`@solana/wallet-adapter`) are intentionally separate concerns — a user signs in with Clerk, then optionally connects a wallet for on-chain operations.

---

## Environment variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=   # Clerk dashboard → API Keys
CLERK_SECRET_KEY=                    # server-side only
NEXT_PUBLIC_SUPABASE_URL=            # Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
MUX_TOKEN_ID=                        # Mux → Access Tokens
MUX_TOKEN_SECRET=                    # server-side only — never NEXT_PUBLIC_
```

See [`.env.example`](.env.example) for the annotated reference.

---

## Testing

```bash
npm test          # Vitest + React Testing Library (unit / component / integration)
npm run test:e2e  # Playwright (critical user journeys)
```

---

## Roadmap

- **CMS-backed content** — replace the typed `src/data` fixtures with the Payload `/api/courses` API (one-line swap; types already match).
- **Form endpoints** — wire the newsletter and contact forms to `/api/newsletter` and `/api/contact`.
- **On-chain credentials** — issue verifiable course-completion credentials on Solana.
- **User dashboard** — enrollments, credentials, and profile under `/user`.
