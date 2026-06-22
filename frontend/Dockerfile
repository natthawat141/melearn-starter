# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Melearn frontend (Next.js) — multi-stage production image.
#
# Requires Next.js standalone output. The app owner must set the following in
# frontend/next.config.mjs (this Dockerfile does NOT modify app source):
#
#     const nextConfig = { output: 'standalone', reactStrictMode: true };
#
# Without `output: 'standalone'`, the final stage's COPY of /.next/standalone
# will not exist and the build will fail. See infra/README.md.
# ---------------------------------------------------------------------------

FROM node:22-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: install production + build dependencies from the lockfile ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder: compile the Next.js app ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner: minimal runtime image ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Run as a non-root user.
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone output bundles only the files needed to run the server.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# server.js is emitted by `next build` when output: 'standalone' is set.
CMD ["node", "server.js"]
