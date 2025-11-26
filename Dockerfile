# ============================================
# Stage 1: Base
# ============================================
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

# ============================================
# Stage 3: Builder
# ============================================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.production
RUN bun run build

# ============================================
# Stage 4: Production Dependencies
# ============================================
FROM base AS prod-deps

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile --production

# ============================================
# Stage 5: Runner (Production)
# ============================================
FROM base AS runner

WORKDIR /app

RUN addgroup -S nodejs && \
    adduser -S nextjs -G nodejs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "server.js"]
