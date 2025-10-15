# 🎯 Архитектура типизированного API

## Схема работы

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend App                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  React Components                                                 │
│  ├── LoginForm                                                    │
│  ├── ProfilePage                                                  │
│  └── MemesListWidget                                              │
│          │                                                         │
│          ↓                                                         │
│  React Query Hooks (@/shared/api/hooks.ts)                       │
│  ├── useLogin() ────────────────────┐                            │
│  ├── useUserProfile() ───────────────┤                            │
│  └── useMemes() (через legacy)       │                            │
│                                       │                            │
│                                       ↓                            │
│  API Functions Layer                                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Typed API (openapi-fetch)        Legacy API (custom)        │ │
│  │                                                              │ │
│  │ @/shared/api/auth.ts            @/shared/api/memes.ts       │ │
│  │ - registerUser()                - getMemes()                │ │
│  │ - loginUser()                   - createMeme()              │ │
│  │                                                              │ │
│  │ @/shared/api/users.ts                                       │ │
│  │ - getUserProfile()                                          │ │
│  │ - updateUserProfile()                                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│          │                                │                        │
│          │                                │                        │
│          ↓                                ↓                        │
│  ┌───────────────────┐        ┌──────────────────────┐           │
│  │ typedApiClient    │        │ apiClient (legacy)   │           │
│  │ (openapi-fetch)   │        │                      │           │
│  │                   │        │                      │           │
│  │ base: localhost:  │        │ routes через config  │           │
│  │       8080        │        │                      │           │
│  └───────────────────┘        └──────────────────────┘           │
│          │                                │                        │
└──────────┼────────────────────────────────┼────────────────────────┘
           │                                │
           │                                │
           ↓                                ↓
  ┌────────────────────┐          ┌─────────────────────┐
  │  REAL BACKEND      │          │   MSW HANDLERS      │
  │  localhost:8080    │          │   (Browser Mock)    │
  ├────────────────────┤          ├─────────────────────┤
  │                    │          │                     │
  │ ✅ /auth/login     │          │ 🎭 /api/memes      │
  │ ✅ /auth/register  │          │ 🎭 /api/memes/:id  │
  │ ✅ /auth/logout    │          │ 🎭 /api/memes/      │
  │ ✅ /auth/refresh   │          │    generate         │
  │                    │          │                     │
  │ ✅ /users/profile  │          │ (Faker.js data)     │
  │ ✅ /users/list     │          │                     │
  │ ✅ /users/update   │          │                     │
  └────────────────────┘          └─────────────────────┘
           ↑                                ↑
           │                                │
           │     OpenAPI Schema             │
           │            ↓                   │
           │    ┌───────────────────┐      │
           └────┤ api-schema.d.ts   │──────┘
                │ (Auto-generated)   │
                │                    │
                │ Types:             │
                │ - paths            │
                │ - components       │
                │ - operations       │
                └────────────────────┘
```

## Потоки данных

### Auth/Users (Реальный бэкенд)

```
Component
   ↓
useLogin() hook
   ↓
loginUser() function (auth.ts)
   ↓
typedApiClient.POST("/auth/login", {...})
   ↓
HTTP Request → localhost:8080/auth/login
   ↓
Real Backend Response
   ↓
Typed Response (AuthResponse)
   ↓
React Query Cache Update
   ↓
Component Re-render
```

### Memes (MSW Моки)

```
Component
   ↓
getMemes() function (memes.ts)
   ↓
apiClient.get("/api/memes")
   ↓
HTTP Request
   ↓
MSW Interceptor (handlers.ts)
   ↓
Faker.js Generated Data
   ↓
Mock Response (MemeListResponse)
   ↓
Component Re-render
```

## Конфигурация

### config.ts

Определяет, какие эндпоинты реальные:

```typescript
export const REAL_BACKEND_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/users/profile",
  // ...
]
```

### Логика выбора

```typescript
function getBaseUrlForEndpoint(path: string): string {
  return isRealBackendEndpoint(path) 
    ? BACKEND_URL       // localhost:8080
    : MOCK_URL          // localhost:3000/api
}
```

## Типизация

### Источник истины: api-schema.d.ts

```typescript
// Автогенерируется из OpenAPI
export interface paths {
  "/auth/login": {
    post: {
      requestBody: { ... }
      responses: { ... }
    }
  }
}
```

### Использование в коде

```typescript
import type { components } from "./api-schema"

export type User = components["schemas"]["models.User"]
export type LoginRequest = components["schemas"]["services.LoginRequest"]

// TypeScript знает структуру!
const { data, error } = await typedApiClient.POST("/auth/login", {
  body: {
    username: "john",  // ← autocomplete
    password: "123"    // ← type-checked
  }
})

// data имеет тип AuthResponse
console.log(data?.user.username)  // ← autocomplete
```

## Миграция эндпоинта

### 1. Сейчас (в моках)

```typescript
// handlers.ts
http.get("/api/memes", async () => {
  return HttpResponse.json(fakeMemes)
})

// memes.ts
export async function getMemes() {
  return apiClient.get("/api/memes")  // ← идёт через MSW
}
```

### 2. После готовности бэкенда

```bash
# Обновляем схему
npm run generate:api
```

```typescript
// config.ts - добавляем эндпоинт
export const REAL_BACKEND_ENDPOINTS = [
  "/auth/login",
  "/memes",      // ← добавили
]

// memes-typed.ts - создаём типизированную функцию
export async function getMemesList() {
  return typedApiClient.GET("/memes")  // ← идёт на бэкенд
}

// handlers.ts - удаляем мок
// http.get("/api/memes", ...) ← удалили

// components - обновляем импорт
import { getMemesList } from "@/shared/api/memes-typed"
```

## Преимущества

1. **Постепенная миграция** — не нужно ждать готовности всего бэкенда
2. **Типобезопасность** — ошибки на этапе компиляции
3. **Автообновление** — схема синхронизируется с бэкендом
4. **DX** — autocomplete и type hints
5. **Тестирование** — легко переключаться между моками и реальным API

## Чеклист перед коммитом

- [ ] `npm run generate:api` выполнен
- [ ] Нет ошибок компиляции TypeScript
- [ ] `config.ts` обновлён для новых эндпоинтов
- [ ] Удалены неиспользуемые моки из `handlers.ts`
- [ ] Обновлены импорты в компонентах
- [ ] Проверена работа в браузере
