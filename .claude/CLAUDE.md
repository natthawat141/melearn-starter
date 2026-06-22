# Melearn — Claude Code Project Instructions

## Project overview

E-learning landing site for Thai university students and young professionals. Teaches blockchain, Web3, and career skills. Built for a **Solana hackathon** — wallet sign-in + future on-chain credentials.

**Frontend stack:** Next.js 16 (Pages Router) · Tailwind CSS 3 (**raw utility classes — NO daisyUI**) · TypeScript (strict) · React 19 · Framer Motion
**Auth:** Clerk (identity, incl. native **Sign-in with Solana**) — NOT Bitkub/MetaMask (removed)
**Web3:** `@solana/wallet-adapter` (Phantom/Solflare) for on-chain actions
**Data:** Supabase (Postgres + storage) · **Mux** (course video — `MUX_TOKEN_SECRET` is server-side only)
**Backend:** Payload CMS v3 (`/backend`) on Supabase Postgres; migrations run as a separate job
**Infra:** GCP Cloud Run + Terraform (`/infra`)

Frontend root: `./frontend/`

> History: daisyUI was tried then **removed** by decision — the UI is raw Tailwind in a sky/blue palette. Do NOT reintroduce daisyUI or `data-theme`.

---

## UI Quality Standard

**Reference:** https://impeccable.style/ — every UI element must earn its place; remove decoration that isn't information.

### Hierarchy & layout
- One focal point per section — no two elements competing at equal visual weight
- Container always `max-w-6xl mx-auto px-4`, never bare `container`
- Section padding: `py-16` standard, `py-20`/`py-24` for hero/featured
- Card padding: minimum `p-6`

### Color — raw Tailwind sky/blue palette
Use Tailwind utility colors directly. The project palette:

| Purpose | Classes |
|---------|---------|
| Brand / headings / accents | `text-sky-600` / `text-sky-700` / `text-sky-800` |
| Primary button | `bg-blue-500 text-white hover:bg-blue-600` |
| Accent / CTA button | `bg-sky-600 text-white hover:bg-sky-500` |
| Page background | `bg-white`, `bg-sky-50`, or `bg-gradient-to-b from-sky-50 to-white` |
| Body text | `text-gray-800` / `text-gray-600` / `text-gray-700` |
| Success / error | `text-green-700 bg-green-50` / `text-red-700 bg-red-50` |
| Cards | `bg-white rounded-xl shadow-lg` |

### Typography
- Headings → `font-display` (Sora 600–700) via `next/font`
- Body/UI → `font-sans` (Source Sans 3 400/600)
- Scale: h1 `text-4xl md:text-5xl lg:text-6xl`, h2 `text-3xl`, body `text-base`

### Interaction states (mandatory on every interactive element)
1. Default
2. Hover (`hover:`)
3. **Focus-visible** — `focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none` (NEVER bare `outline-none` without a replacement ring)
4. Disabled (`disabled:opacity-50 disabled:cursor-not-allowed`)

### Motion
```tsx
className="transition-transform duration-200 motion-reduce:transition-none"
```
Animate `transform`/`opacity` only. Respect `prefers-reduced-motion`.

### Accessibility
- `alt` on all images (empty string for decorative); prefer `next/image`
- `aria-label` on icon-only buttons; `aria-expanded` on toggles
- Color is never the sole state indicator
- Minimum touch target 44×44px
- Visible keyboard focus everywhere

### Component patterns (raw Tailwind)
```tsx
// Primary button
<button className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-medium
  focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none
  disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150">
  Action
</button>

// Card
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <figure><img src="/img/..." alt="..." className="w-full object-cover" /></figure>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-sky-600">Title</h3>
    <p className="mt-2 text-gray-600">Description</p>
  </div>
</div>

// Alert
<div role="alert" className="bg-green-50 text-green-700 border border-green-200 rounded-md px-4 py-2">
  Message
</div>
```

### Anti-patterns (banned)
- Purple gradient heroes · Glassmorphism (`backdrop-blur` + transparent card bg)
- "Empower your journey" filler copy
- Identical icon-heading-text grids in every section
- daisyUI classes (`btn`, `card`, `badge`, semantic tokens like `bg-base-100`) — removed from this project

---

## Bilingual UI
- Nav labels: English · Wallet/auth actions + errors: Thai (`เชื่อมต่อกระเป๋าเงิน`, `ยกเลิก`, `เกิดข้อผิดพลาด`) · Course content: English w/ Thai subtitle

## Brand personality
**Grounded · Clear · Forward-looking** — education trust first; wallet connect is a feature, not the headline.

## Working in this repo
- Node 22 required (`nvm use 22`); default Node 16 fails. Project path has a space (`melearn starter`) — a known ESM footgun (Ledger patch in place).
- TypeScript: no `any`, return types on exported functions
- Auth = Clerk; identity and on-chain (`@solana/wallet-adapter`) are separate concerns — keep them separate
- Tests exist: Vitest + React Testing Library (unit/component/integration), Playwright (e2e). Run `npm test` / `npm run test:e2e`
- Commits: imperative present tense, < 72 chars, no trailing period
