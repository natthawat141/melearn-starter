# Security Policy

We take the security of Melearn seriously. Thank you for helping keep the project
and its users safe.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** Public
disclosure before a fix is available puts users at risk.

Instead, report it privately to:

- **bill.natthawat@gmail.com**

Please include, where possible:

- A description of the vulnerability and its impact.
- Steps to reproduce (proof of concept, affected endpoints, or configuration).
- The package affected (`frontend`, `backend`, or `infra`) and version/commit.
- Any suggested remediation.

We aim to acknowledge reports within a few business days and will keep you updated
on remediation progress. We are happy to credit reporters once a fix has shipped,
unless you prefer to remain anonymous.

## Supported versions

Melearn is in active early-stage development. Security fixes are applied to the
latest `main` branch only. There are no long-term-support branches yet.

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ |
| Older commits / tags | ❌ |

## Secrets and configuration

- **All secrets are environment-based.** Credentials (Clerk keys, Supabase
  `DATABASE_URL`, `PAYLOAD_SECRET`, Mux tokens, etc.) are supplied via environment
  variables and never hardcoded in source.
- **All `.env*` files are gitignored** and must never be committed. Each package
  ships a `.env.example` documenting the required variables with placeholder values.
- In production, secrets are stored in **Google Secret Manager** and injected at
  runtime; Terraform creates the secret *containers* but never the *values*, so
  plaintext never lands in Terraform state or git (see [`infra/README.md`](./infra/README.md)).
- Never prefix server-side secrets (e.g. `CLERK_SECRET_KEY`, `MUX_TOKEN_SECRET`)
  with `NEXT_PUBLIC_` — that would expose them to the browser.

If you discover a committed secret, treat it as compromised: rotate the credential
immediately and report it through the channel above.
