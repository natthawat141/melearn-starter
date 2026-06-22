# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Melearn backend (Next.js + Payload CMS) — multi-stage production image.
#
# ONE image serves TWO purposes:
#   * Cloud Run SERVICE  -> `npm start` (next start)  -- runs the app, NO migrations
#   * Cloud Run JOB      -> `npm run payload -- migrate` -- one-shot DB migrations
#
# Because the migration Job invokes the Payload CLI, this image keeps the full
# production node_modules + built .next + source (Payload config/migrations).
# It deliberately does NOT use Next.js `output: standalone`, which would strip
# node_modules and break the `payload` CLI used by the migration Job.
#
# Migrations are NEVER run here on container start. The app start command is
# `next start` only. The migration command is supplied by the Cloud Run Job.
#
# NOTE FOR THE BACKEND OWNER (do not need to edit this file): for GCP/prod,
# switch the Payload adapter from @payloadcms/db-sqlite to
# @payloadcms/db-postgres and generate migrations (NOT push mode) so the Job
# can apply them. See infra/README.md ("Backend owner action items").
# ---------------------------------------------------------------------------

FROM node:22-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
# sharp (image processing used by Payload) needs these at runtime on slim.
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---- deps: full install (incl. dev deps) for the build ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder: compile the Next.js + Payload app ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time placeholders so `next build` doesn't fail on missing env. Real
# values are injected at runtime from Secret Manager.
ENV PAYLOAD_SECRET=build-placeholder-secret
ENV DATABASE_URL=postgres://placeholder
RUN npm run build

# ---- prod-deps: production-only node_modules for a lean runtime ----
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- runner: minimal runtime image (used by BOTH service and migration Job) ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nodejs

# Production dependencies + built app + source (Payload config + migrations).
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/.next ./.next
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nodejs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nodejs:nodejs /app/src ./src

USER nodejs
EXPOSE 3000

# Default command = run the app (NO migrations). The migration Cloud Run Job
# overrides this with `npm run payload -- migrate`.
CMD ["npm", "run", "start"]
