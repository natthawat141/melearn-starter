# Melearn Backend (Payload CMS v3)

Headless CMS / API backend for the **Melearn** e-learning platform POC.
Built with [Payload CMS v3](https://payloadcms.com) running on Next.js (App Router),
using **Supabase Postgres** as the single live database.

> **Migrated from SQLite → Supabase Postgres.** The backend previously used
> `@payloadcms/db-sqlite` against a local `melearn.db` file. It now uses
> `@payloadcms/db-postgres` against Supabase. Schema changes are applied via
> explicit **migration files run as a separate job — never on app boot** (see
> [Database](#database) and [Migrations](#migrations)).

## Stack

- Payload CMS `3.85.x`
- Next.js `16.x` (App Router)
- React `19.x`
- Database: `@payloadcms/db-postgres` → **Supabase Postgres**
- Rich text: `@payloadcms/richtext-lexical`
- Image processing: `sharp`

## Requirements

- Node 22 (`nvm use 22`)

## Setup

```bash
nvm use 22
cp .env.example .env   # then paste your real Supabase DATABASE_URL (see below)
npm install
```

## Run (development)

```bash
npm run dev
```

> **Port note:** The backend dev server runs on **port 3001** (pinned in the
> `dev` script), so it runs alongside the frontend (port 3000) with no conflict.

- **Admin panel:** http://localhost:3001/admin
  (first visit prompts you to create the initial admin user)
- **REST API base:** http://localhost:3001/api
- **GraphQL:** http://localhost:3001/api/graphql (playground at `/api/graphql-playground`)

## Database

**Supabase Postgres**, configured via a single `DATABASE_URL` env var passed to
the Postgres adapter's connection pool. Get the string from the Supabase
dashboard → **Project Settings → Database → Connection string**
(project `https://<your-project-ref>.supabase.co`).

**SSL is required by Supabase** — append `?sslmode=require` to the connection
string (the adapter passes it straight through to `node-postgres`).

### Two connection strings (pooled vs direct)

Supabase exposes several connection modes. Pick based on the context:

| Use case | Mode | Port | Notes |
| --- | --- | --- | --- |
| **App runtime** (serverless / Cloud Run, many short-lived connections) | Transaction pooler (Supavisor) | `6543` | IPv4-friendly. **Does NOT support prepared statements.** |
| **Migrations** (the separate migration job) + admin tooling | **Direct** connection | `5432` | IPv6; supports prepared statements. |
| Migrations on an IPv4-only network | **Session** pooler (Supavisor) | `5432` | IPv4; supports prepared statements. |

```
# App runtime (transaction pooler, 6543):
postgres://postgres.<project-ref>:<PASSWORD>@aws-<region>.pooler.supabase.com:6543/postgres?sslmode=require

# Migrations — direct (5432):
postgresql://postgres:<PASSWORD>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require

# Migrations — session pooler (5432, IPv4):
postgres://postgres.<project-ref>:<PASSWORD>@aws-<region>.pooler.supabase.com:5432/postgres?sslmode=require
```

Set `DATABASE_URL` to the transaction-pooler string for the running app, and to
the direct/session string in the **migration job's** environment. See
`.env.example` for the full annotated reference.

> The schema is **not** auto-synced on boot. Drizzle's `push` is hard-disabled
> in production and is opt-in only for local dev (`PAYLOAD_DB_PUSH=true`). All
> schema changes go through migration files (next section).

## Migrations

This backend runs in **migration mode**, not dev "push" mode, so every schema
change is an explicit, reviewable, committed migration file. Migrations live in
[`src/migrations/`](src/migrations) (the default Payload location) and are
committed to the repo. An initial migration covering all 6 collections is
already generated.

### Commands

```bash
npm run migrate:create [name]   # generate a new migration from config changes
npm run migrate                 # apply all un-run migrations (the separate job runs this)
npm run migrate:status          # show which migrations have / haven't run
```

### Workflow

1. Change a collection / config locally.
2. `npm run migrate:create my_change` → review the generated file under `src/migrations/`.
3. Commit the migration file(s).
4. The **separate migration service/job applies them** before/independently of
   the app rollout.

### Migrations run as a separate step (critical — never on boot)

For horizontal scaling, **the app start command does NOT run migrations.**
`npm start` (→ `next start`) only boots the server; it never mutates the schema.

A dedicated Cloud Run **Job** (separate from the app service) runs:

```bash
npm run migrate
```

This job should use the **direct or session** connection string (port 5432,
prepared-statement support), runs once per deploy, applies pending migrations,
and exits. The app service then starts with the schema already in place — so
multiple app instances can scale out without racing to alter the schema.

> Applying migrations requires a **real Supabase `DATABASE_URL`**. The committed
> initial migration was scaffolded offline; running `npm run migrate` against
> Supabase requires the connection string to be filled in first.

## Collections

| Collection    | Notes                                                                 |
| ------------- | --------------------------------------------------------------------- |
| `users`       | Auth-enabled admin login (default Payload auth collection)            |
| `media`       | Upload collection (images), stored on local disk under `backend/media/`; required `alt` |
| `categories`  | `name`, `slug` (unique)                                               |
| `instructors` | `name`, `bio`, `photo` (→ media)                                      |
| `courses`     | `title`, `slug` (unique), `description`, `thumbnail` (→ media), `category` (→ categories), `instructor` (→ instructors), `level` (beginner/intermediate/advanced), `price`, `durationWeeks`, `tags[]`, `published` |
| `partners`    | `name`, `logo` (→ media), `url`                                       |

These shapes mirror the frontend's `src/types/index.ts` (`Course`, `Partner`).

## REST endpoints

Payload auto-generates REST endpoints per collection at `/api/{collection}`:

- `GET    /api/courses` · `GET /api/courses/:id` · `POST /api/courses` · `PATCH /api/courses/:id` · `DELETE /api/courses/:id`
- `GET    /api/categories` (+ `/:id`, POST/PATCH/DELETE)
- `GET    /api/instructors` (+ `/:id`, POST/PATCH/DELETE)
- `GET    /api/partners` (+ `/:id`, POST/PATCH/DELETE)
- `GET    /api/media` (+ `/:id`, upload via POST)
- `GET    /api/users/me`, `POST /api/users/login`, `POST /api/users/logout`, etc.

Useful query params: `?depth=1` (populate relationships), `?limit=`, `?page=`,
`?where[published][equals]=true`, `?sort=-createdAt`.

Example:

```bash
curl "http://localhost:3001/api/courses?depth=1&where[published][equals]=true"
```

CORS and CSRF are configured to allow `http://localhost:3000` (the frontend dev
origin) — override with `FRONTEND_URL` in `.env`.

## Seed (optional)

Inserts a few sample categories, instructors, courses, and partners:

```bash
npm run seed
```

(Media/uploads are not seeded since they need real image files.)

## Type generation

```bash
npm run generate:types   # regenerates src/payload-types.ts
```
