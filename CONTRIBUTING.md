# Contributing to Melearn

Thanks for your interest in contributing! This guide covers local setup, our
conventions, and the pull-request process. By participating you agree to follow
our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Development setup

Melearn is a monorepo with three packages: `frontend/` (Next.js), `backend/`
(Payload CMS), and `infra/` (Terraform). See the root [`README.md`](./README.md)
for the full quickstart.

```bash
# Use Node 22 (required by both apps)
nvm install 22 && nvm use 22

# Frontend
cd frontend
cp .env.example .env.local   # fill in Clerk / Supabase / Mux values
npm install
npm run dev                  # http://localhost:3000

# Backend (separate terminal)
cd backend
nvm use 22
cp .env.example .env         # fill in Supabase DATABASE_URL, PAYLOAD_SECRET
npm install
npm run dev                  # http://localhost:3001 (admin at /admin)
```

Never commit real secrets — all `.env*` files are gitignored. Reference each
package's `.env.example` for the variables it expects.

### Caveats

- **Node 22 is required.** Both `frontend` and `backend` target Node 22
  (`nvm use 22`). Other major versions are not supported.
- **Spaces in the repo path can break tooling.** The project may live in a path
  containing a space (e.g. `melearn starter/`). Some Node/Next/Payload tooling
  mishandles spaces in absolute paths. If you hit odd build, watcher, or CLI
  errors, clone into a space-free path (e.g. `~/code/melearn`) and retry.

## Branch and commit conventions

- **Branches:** `feat/<short-desc>`, `fix/<short-desc>`, `docs/<short-desc>`,
  `chore/<short-desc>`, or `refactor/<short-desc>`.
- **Commit messages:** write the subject line in the **imperative mood**
  ("Add course filter", not "Added"/"Adds"), and keep it **under 72 characters**.
  Add a blank line and a body when more context helps.

  ```
  Add Solana wallet sign-in fallback redirect

  Clerk's Sign-In with Solana needs an explicit fallback URL on the
  Pages Router; wire it through the env-driven config.
  ```

- Keep commits focused; one logical change per commit where practical.

## Running tests and lint

Before opening a PR, make sure the relevant package's tests and lint pass.

```bash
# Frontend
cd frontend
npm run lint
npm test           # Vitest unit/component
npm run test:e2e   # Playwright (optional locally; runs in CI)

# Backend
cd backend
npm run lint
npm run test:unit  # Vitest unit + contract
npm run test:int   # Vitest integration
npm run test:e2e   # Playwright

# Infra
cd infra/terraform
terraform fmt -check -recursive
```

## Pull request process

1. Fork (or branch) and create a topic branch from `main`.
2. Make your change with tests where it makes sense.
3. Run lint and tests for the affected package(s).
4. If you changed backend collections or config, generate and **commit a
   migration** (`npm run migrate:create <name>` in `backend/`) — schema changes
   are never auto-applied on boot.
5. Open a PR using the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md),
   describe the change, and link any related issues.
6. Ensure CI is green. A maintainer will review; address feedback by pushing
   follow-up commits to the same branch.

## Reporting bugs and requesting features

Use the issue templates under [`.github/ISSUE_TEMPLATE/`](./.github/ISSUE_TEMPLATE).
For security vulnerabilities, **do not** open a public issue — follow the
[Security Policy](./SECURITY.md).
