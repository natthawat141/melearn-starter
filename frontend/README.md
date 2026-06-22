# Melearn

E-learning platform landing site for Thai university students and young professionals. Covers Blockchain, Web3, and career skills — with Web3 wallet sign-in and on-chain credential support planned.

> **Status: POC in progress** — landing site and wallet connect are functional. CMS backend and on-chain credentials are next.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 · Pages Router · TypeScript (strict) |
| UI | daisyUI 4 · Tailwind CSS 3 · Framer Motion |
| Fonts | Sora (display) · Source Sans 3 (body) via `next/font` |
| Web3 | ethers.js 6 · Bitkub Chain SDK · MetaMask |

---

## Getting started

```bash
cp .env.example .env.local   # fill in Bitkub SDK credentials
npm install
npm run dev                  # → http://localhost:3000
```

---

## Project structure

```
src/
  components/
    layout/
      Navbar.tsx             ← sticky nav with wallet dropdown
      Footer.tsx
    sections/
      HeroSection.tsx        ← parallax hero + mission cards
      FeaturedCoursesSection.tsx
      FeaturesSection.tsx
      PartnersSection.tsx
      NewsletterSection.tsx
      CoursesSection.tsx     ← full catalogue (/courses page)
  hooks/
    useWallet.ts             ← MetaMask + Bitkub Next connection state
  lib/
    bitkub.ts                ← Bitkub Chain SDK initialisation
  types/
    index.ts                 ← shared interfaces (Course, Partner, WalletState …)
  pages/                     ← Next.js Pages Router
    index.tsx                ← landing page
    courses.tsx              ← course catalogue
    oauth/callback.tsx       ← Bitkub Next OAuth callback handler
```

---

## Wallet support

| Wallet | Network | Status |
|--------|---------|--------|
| MetaMask | any EVM | ✅ working |
| Bitkub Next | BKC Testnet | ✅ working |

Connection state (address, type, error, loading) is managed in `useWallet` — components never touch the SDK directly.

---

## Environment variables

```bash
NEXT_PUBLIC_BITKUB_CLIENT_ID=      # Bitkub Chain developer console
NEXT_PUBLIC_BITKUB_PROJECT_ID=     # Bitkub Chain developer console
NEXT_PUBLIC_BITKUB_NETWORK=BKC_TESTNET
```

---

## Roadmap

### v0.2 — Content CMS
- [ ] REST API for courses, instructors, categories
- [ ] Admin panel (protected routes in `/admin`)
- [ ] Database: PostgreSQL + Drizzle ORM

### v0.3 — On-chain credentials
- [ ] Issue course completion certificates on BKC Mainnet
- [ ] Verifiable credential display on user profile
- [ ] Partner institution co-signatures

### v0.4 — User accounts
- [ ] Email/password auth alongside wallet login
- [ ] Course progress tracking
- [ ] Subscription and payment flow
