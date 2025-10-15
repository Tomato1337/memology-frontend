# 🚀 Быстрый старт: Типизированный API

## Текущее состояние

✅ **Готово на бэкенде:**
- Auth (login, register, logout, refresh)
- Users (profile, update, list, change password)

🎭 **В моках (MSW):**
- Memes (list, create, update, delete, generate)

## Использование

### Auth & Users (реальный бэкенд)

```typescript
import { useLogin, useRegister, useUserProfile } from "@/shared/api"

// Регистрация
const { mutate: register } = useRegister()
register({ username: "john", email: "john@example.com", password: "123" })

// Вход
const { mutate: login } = useLogin()
login({ username: "john", password: "123" })

// Профиль
const { data: user } = useUserProfile()
console.log(user?.username)
```

### Memes (MSW моки)

```typescript
import { getMemes } from "@/shared/api/memes"

const memes = await getMemes({ page: 1, pageSize: 10 })
```

## Обновление OpenAPI схемы

Когда бэкенд обновился:

```bash
# Если бэкенд запущен
npm run generate:api

# Если есть файл openapi.yaml
npm run generate:api:file
```

## Миграция эндпоинта с мока на реальный API

1. **Обновите схему**: `npm run generate:api`
2. **Создайте типизированные функции** в `src/shared/api/`
3. **Обновите `config.ts`** — добавьте эндпоинт в `REAL_BACKEND_ENDPOINTS`
4. **Удалите мок** из `handlers.ts`

Готово! TypeScript проверит всё автоматически.

## Структура файлов

```
src/shared/api/
├── typed-client.ts     ← Типизированный клиент (openapi-fetch)
├── auth.ts             ← API функции auth (реальный бэкенд)
├── users.ts            ← API функции users (реальный бэкенд)
├── hooks.ts            ← React Query хуки
├── config.ts           ← Конфигурация (какие эндпоинты реальные)
└── api-schema.d.ts     ← Автогенерируемые типы из OpenAPI
```

## Переменные окружения

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_MODE=hybrid
NEXT_PUBLIC_MSW_ENABLED=true
```

## Полный гайд

См. `HYBRID_API_GUIDE.md` для подробной документации.
