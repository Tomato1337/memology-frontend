# Гибридный API: Реальный бэкенд + MSW моки

## 🎯 Концепция

Проект использует **гибридный подход** к API:
- **Auth и Users** → реальный бэкенд (типизированный через OpenAPI)
- **Memes и прочее** → MSW моки (локальная имитация)

При обновлении бэкенда просто регенерируем `api-schema.d.ts`, и все типы автоматически обновятся.

## 📁 Структура

```
src/shared/api/
├── api-schema.d.ts       # 🔄 Автогенерируемые типы из OpenAPI (обновляется автоматически)
├── typed-client.ts       # ✅ Типизированный клиент для реального бэкенда
├── auth.ts               # ✅ API функции для аутентификации (реальный бэкенд)
├── users.ts              # ✅ API функции для пользователей (реальный бэкенд)
├── hooks.ts              # 🪝 React Query хуки
├── config.ts             # ⚙️ Конфигурация (какие эндпоинты реальные)
├── client.ts             # ⚠️ Legacy клиент (для обратной совместимости)
└── memes.ts              # ⚠️ Legacy функции для мемов (будут удалены)

src/shared/mocks/
└── handlers.ts           # 🎭 MSW моки для мемов (НЕ для auth/users!)
```

## 🚀 Использование

### 1. Аутентификация (реальный бэкенд)

```typescript
import { registerUser, loginUser, useLogin } from "@/shared/api"

// Прямой вызов
const { data, error } = await registerUser({
  username: "johndoe",
  email: "john@example.com", 
  password: "password123"
})

// С React Query
function LoginForm() {
  const { mutate: login, isPending } = useLogin()
  
  const handleSubmit = (credentials) => {
    login(credentials, {
      onSuccess: (authResponse) => {
        console.log("Logged in:", authResponse.user)
      }
    })
  }
}
```

### 2. Работа с пользователями (реальный бэкенд)

```typescript
import { getUserProfile, useUserProfile } from "@/shared/api"

// Прямой вызов
const { data: user } = await getUserProfile()

// С React Query хуком
function ProfilePage() {
  const { data: user, isLoading } = useUserProfile()
  
  if (isLoading) return <Loading />
  return <div>Hello, {user?.username}</div>
}
```

### 3. Работа с мемами (MSW моки)

```typescript
import { getMemes } from "@/shared/api/memes"

// Эти запросы перехватываются MSW и возвращают моковые данные
const memes = await getMemes({ page: 1, pageSize: 10 })
```

## ⚙️ Конфигурация

### Файл `src/shared/api/config.ts`

```typescript
// Какие эндпоинты идут на реальный бэкенд
export const REAL_BACKEND_ENDPOINTS = [
  "/auth/login",
  "/auth/logout",
  "/auth/register",
  "/users/profile",
  "/users/list",
  // ... добавляйте сюда новые реальные эндпоинты
] as const
```

### Переменные окружения

```env
# .env.local

# URL реального бэкенда
NEXT_PUBLIC_API_URL=http://localhost:8080

# Режим работы API
NEXT_PUBLIC_API_MODE=hybrid  # hybrid | mock | real

# Включить MSW
NEXT_PUBLIC_MSW_ENABLED=true
```

## 🔄 Обновление OpenAPI схемы

Когда бэкенд обновляется:

```bash
# 1. Получите новый OpenAPI файл от бэкенда
# (например, http://localhost:8080/api/docs/openapi.yaml)

# 2. Регенерируйте типы
npx openapi-typescript http://localhost:8080/api/docs/openapi.yaml -o src/shared/api/api-schema.d.ts

# 3. Проверьте ошибки компиляции
npm run build

# 4. Обновите config.ts при необходимости
# Добавьте новые эндпоинты в REAL_BACKEND_ENDPOINTS если они готовы на бэкенде
```

### Скрипт автообновления (добавьте в `package.json`)

```json
{
  "scripts": {
    "generate:api": "openapi-typescript http://localhost:8080/api/docs/openapi.yaml -o src/shared/api/api-schema.d.ts"
  }
}
```

Теперь просто запускайте `npm run generate:api` при обновлении бэкенда!

## 📊 Как это работает

### Реальный бэкенд

1. Клиент `typedApiClient` настроен на `BACKEND_URL` (localhost:8080)
2. Все функции в `auth.ts` и `users.ts` используют `typedApiClient`
3. Типы автоматически синхронизированы с OpenAPI схемой
4. MSW НЕ перехватывает эти запросы

```typescript
// typed-client.ts
export const typedApiClient = createClient<paths>({
  baseUrl: "http://localhost:8080",  // ← реальный бэкенд
  credentials: "include"
})
```

### MSW моки

1. MSW настроен в `src/shared/mocks/`
2. Handlers перехватывают ТОЛЬКО эндпоинты мемов
3. Auth/Users запросы проходят мимо MSW

```typescript
// handlers.ts
export const handlers = [
  http.get("/api/memes", ...), // ← мокируется
  // Auth НЕ мокируется!
]
```

## 🔧 Миграция эндпоинтов с моков на реальный бэкенд

Когда бэкенд готов для новых эндпоинтов (например, memes):

### Шаг 1: Обновите OpenAPI схему

```bash
npm run generate:api
```

### Шаг 2: Создайте типизированные функции

```typescript
// src/shared/api/memes-typed.ts
import { typedApiClient } from "./typed-client"

export async function getMemesList(params?: { page?: number; limit?: number }) {
  return await typedApiClient.GET("/memes", {
    params: { query: params }
  })
}

export async function getMemeById(id: string) {
  return await typedApiClient.GET("/memes/{id}", {
    params: { path: { id } }
  })
}
```

### Шаг 3: Добавьте в конфигурацию

```typescript
// config.ts
export const REAL_BACKEND_ENDPOINTS = [
  "/auth/login",
  "/users/profile",
  "/memes",        // ← добавили
  "/memes/{id}",   // ← добавили
] as const
```

### Шаг 4: Удалите моки

```typescript
// handlers.ts - удалите соответствующие http.get/post для memes
```

### Шаг 5: Обновите импорты

```typescript
// Было:
import { getMemes } from "@/shared/api/memes"

// Стало:
import { getMemesList } from "@/shared/api/memes-typed"
```

## ✅ Преимущества подхода

1. **Типобезопасность** — TypeScript знает все типы из OpenAPI
2. **Автообновление** — регенерация при изменении бэкенда
3. **Гибкость** — можно работать до готовности всего бэкенда
4. **Тестирование** — легко переключаться между моками и реальным API
5. **Независимость команд** — фронтенд и бэкенд работают параллельно

## 🎨 Примеры

### Полный пример с регистрацией

```typescript
import { useRegister } from "@/shared/api"
import { useState } from "react"

export function RegisterPage() {
  const { mutate: register, isPending, error } = useRegister()
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(formData, {
      onSuccess: (authResponse) => {
        console.log("Registered!", authResponse.user)
        // Редирект на главную
      },
      onError: (error) => {
        console.error("Registration failed:", error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.username}
        onChange={e => setFormData({...formData, username: e.target.value})}
        placeholder="Username"
      />
      <input 
        type="email"
        value={formData.email}
        onChange={e => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
      />
      <input 
        type="password"
        value={formData.password}
        onChange={e => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  )
}
```

### Пример с профилем пользователя

```typescript
import { useUserProfile, useUpdateProfile } from "@/shared/api"

export function ProfileSettings() {
  const { data: user, isLoading } = useUserProfile()
  const { mutate: updateProfile } = useUpdateProfile()

  if (isLoading) return <div>Loading...</div>

  const handleUpdateUsername = (newUsername: string) => {
    updateProfile(
      { username: newUsername },
      {
        onSuccess: (updatedUser) => {
          console.log("Profile updated:", updatedUser)
        }
      }
    )
  }

  return (
    <div>
      <h1>{user?.username}</h1>
      <p>{user?.email}</p>
      {/* ... форма редактирования */}
    </div>
  )
}
```

## 🐛 Отладка

### Проверка, куда идёт запрос

```typescript
// Добавьте в typed-client.ts
typedApiClient.use({
  async onRequest({ request }) {
    console.log('API Request:', request.url)
    return request
  }
})
```

### Проверка MSW

Откройте DevTools Console, должны видеть:

```
[MSW] Mocking enabled.
[MSW] Request matched: GET /api/memes
```

Если видите перехват auth запросов — это ошибка!

## 📚 Дополнительные ресурсы

- [OpenAPI TypeScript](https://openapi-ts.dev/)
- [openapi-fetch](https://openapi-ts.dev/openapi-fetch/)
- [MSW Documentation](https://mswjs.io/)
- [TanStack Query](https://tanstack.com/query/latest)
