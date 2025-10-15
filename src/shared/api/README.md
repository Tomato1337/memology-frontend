# Типизированный API клиент

> **🚀 Быстрый старт:** См. [QUICKSTART.md](./QUICKSTART.md)  
> **📖 Полный гайд:** См. [HYBRID_API_GUIDE.md](./HYBRID_API_GUIDE.md)  
> **🏗️ Архитектура:** См. [ARCHITECTURE.md](./ARCHITECTURE.md)

Интеграция OpenAPI TypeScript схемы с использованием `openapi-fetch` для полной типобезопасности.

## 🎯 Концепция

Проект использует **гибридный подход**:
- **Auth и Users** → реальный бэкенд (типизированный через OpenAPI)
- **Memes и прочее** → MSW моки (локальная имитация)

При обновлении бэкенда просто регенерируем `api-schema.d.ts`, и все типы автоматически обновятся.

## Структура

```
src/shared/api/
├── api-schema.d.ts      # Автогенерированные типы из OpenAPI спецификации
├── typed-client.ts      # Типизированный клиент на основе openapi-fetch
├── client.ts            # Legacy клиент (для обратной совместимости)
├── auth.ts              # API функции для аутентификации
├── users.ts             # API функции для пользователей
├── memes.ts             # API функции для мемов (legacy)
└── index.ts             # Публичный API
```

## Использование

### Аутентификация

```typescript
import { registerUser, loginUser, logoutUser } from "@/shared/api"

// Регистрация
const { data, error } = await registerUser({
  username: "johndoe",
  email: "john@example.com",
  password: "password123"
})

if (data) {
  console.log("User registered:", data.user)
  console.log("Access token:", data.access_token)
}

// Вход
const loginResult = await loginUser({
  username: "johndoe",
  password: "password123"
})

if (loginResult.data) {
  console.log("Login successful:", loginResult.data.user)
}

// Выход
const logoutResult = await logoutUser({
  refresh_token: "your_refresh_token"
})
```

### Работа с пользователями

```typescript
import { getUserProfile, updateUserProfile, getUsersList } from "@/shared/api"

// Получить профиль
const { data, error } = await getUserProfile()

if (data) {
  console.log("User profile:", data)
}

// Обновить профиль
const updateResult = await updateUserProfile({
  username: "johndoe_new",
  email: "john.new@example.com"
})

// Получить список пользователей
const usersResult = await getUsersList({ limit: 10, offset: 0 })

if (usersResult.data) {
  console.log("Users:", usersResult.data)
}
```

### Прямое использование типизированного клиента

```typescript
import { typedApiClient } from "@/shared/api"

// Все методы полностью типизированы
const { data, error } = await typedApiClient.GET("/users/profile")

if (data) {
  // TypeScript знает точную структуру data
  console.log(data.username)
}

// Автокомплит для путей и параметров
const usersResult = await typedApiClient.GET("/users/list", {
  params: {
    query: {
      limit: 10,
      offset: 0
    }
  }
})
```

## Типы

Все типы экспортируются из API модулей:

```typescript
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/shared/api"

// Или напрямую из схемы
import type { components, paths } from "@/shared/api"

type User = components["schemas"]["models.User"]
type AuthResponse = components["schemas"]["services.AuthResponse"]
```

## Преимущества

1. **Полная типобезопасность** - TypeScript знает все доступные эндпоинты, параметры и типы ответов
2. **Автокомплит** - IDE подсказывает доступные пути, параметры и поля
3. **Валидация на этапе компиляции** - ошибки в параметрах обнаруживаются до выполнения
4. **Автоматическая синхронизация** - типы обновляются при изменении OpenAPI спецификации
5. **Обратная совместимость** - старый `apiClient` продолжает работать

## Обновление типов

Когда меняется OpenAPI спецификация, обновите типы:

```bash
# Если у вас есть скрипт генерации (добавьте в package.json)
npm run generate:api

# Или вручную через openapi-typescript
npx openapi-typescript path/to/openapi.yaml -o src/shared/api/api-schema.d.ts
```

## Middleware

Типизированный клиент поддерживает middleware для обработки запросов и ответов:

```typescript
import { typedApiClient } from "@/shared/api/typed-client"

// Middleware уже настроен для:
// - Автоматического обновления токена при 401
// - Добавления credentials: "include"
// - Установки Content-Type: application/json
```

## Migration Guide

Для миграции с legacy `apiClient`:

### Было:
```typescript
import { apiClient } from "@/shared/api/client"

const response = await apiClient.get<User>("/users/profile")
```

### Стало:
```typescript
import { getUserProfile } from "@/shared/api"

const { data, error } = await getUserProfile()
```

Или с типизированным клиентом:

```typescript
import { typedApiClient } from "@/shared/api"

const { data, error } = await typedApiClient.GET("/users/profile")
```
