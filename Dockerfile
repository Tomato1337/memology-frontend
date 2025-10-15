# ============================================
# Stage 1: Base
# ============================================
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps

# Копируем файлы зависимостей
COPY package.json bun.lockb* ./

# Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN bun install --frozen-lockfile

# ============================================
# Stage 3: Builder
# ============================================
FROM base AS builder

WORKDIR /app

# Копируем node_modules из предыдущего stage
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Переменные окружения для production сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Создаём .env.production для сборки
# В production MSW должен быть отключён
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.production && \
    echo "NEXT_PUBLIC_API_MODE=real" >> .env.production && \
    echo "NEXT_PUBLIC_MSW_ENABLED=false" >> .env.production

# Собираем приложение с Bun
RUN bun run build

# ============================================
# Stage 4: Production Dependencies
# ============================================
FROM base AS prod-deps

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json bun.lockb* ./

# Устанавливаем ТОЛЬКО production зависимости
RUN bun install --frozen-lockfile --production

# ============================================
# Stage 5: Runner (Production)
# ============================================
FROM base AS runner

WORKDIR /app

# Создаём пользователя для безопасности
RUN addgroup -S nodejs && \
    adduser -S nextjs -G nodejs

# Переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Копируем production зависимости
COPY --from=prod-deps /app/node_modules ./node_modules

# Копируем необходимые файлы из builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app

# Переключаемся на пользователя nextjs
USER nextjs

# Expose порт
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение через Bun (быстрее чем Node.js)
CMD ["bun", "run", "server.js"]
