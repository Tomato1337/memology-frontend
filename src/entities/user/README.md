# User Entity

Сущность пользователя с типизированным API и React Query интеграцией.

## Архитектура авторизации

### 🔐 Как работает авторизация

1. **Бэкенд использует HTTP-Only Cookies**
   - Access token хранится в cookie
   - Автоматически отправляется с каждым запросом
   - Защищён от XSS атак

2. **typedApiClient настроен с credentials: "include"**
   ```typescript
   const typedApiClient = createClient<paths>({
     baseUrl: API_BASE_URL,
     credentials: "include", // ← отправляет cookies
   })
   ```

3. **Нет необходимости в localStorage**
   - ❌ Не нужно: `localStorage.getItem("access_token")`
   - ✅ Используем: React Query кэш + cookies

## Использование

### Получение профиля пользователя

```typescript
import { userQueries } from "@/entities/user"

function ProfilePage() {
  const { data: user, isLoading, error } = userQueries.useGetUser()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Not authorized</div>
  if (!user) return <div>Please login</div>
  
  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Вход в систему

```typescript
import { useLogin } from "@/pages/login/api/useLogin"
import { useRouter } from "next/navigation"

function LoginForm() {
  const { mutate: login, isPending } = useLogin()
  const router = useRouter()
  
  const handleSubmit = (data) => {
    login(data, {
      onSuccess: (auth) => {
        console.log("Logged in:", auth.user)
        router.push("/")
      },
      onError: (error) => {
        console.error("Login failed:", error.message)
      }
    })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### Регистрация

```typescript
import { useRegister } from "@/pages/login/api/useLogin"

function RegisterForm() {
  const { mutate: register, isPending } = useRegister()
  
  const handleSubmit = (data) => {
    register(data, {
      onSuccess: (auth) => {
        console.log("Registered:", auth.user)
      }
    })
  }
}
```

## React Query интеграция

### Query Keys

```typescript
["user", "profile"]  // Профиль текущего пользователя
```

### Кэширование

- **staleTime**: 5 минут - данные считаются свежими
- **Автоматическое обновление** после логина/регистрации
- **Повторные запросы**: только при сетевых ошибках

### Обновление кэша после логина

```typescript
// В useLogin
onSuccess: (authResponse) => {
  // Сразу устанавливаем данные в кэш
  queryClient.setQueryData(["user", "profile"], authResponse.user)
  
  // Инвалидируем связанные запросы
  queryClient.invalidateQueries({ queryKey: ["user"] })
}
```

## Типы

```typescript
import type { User } from "@/shared/api"

// Пользователь из бэкенда
const user: User = {
  id: "uuid",
  username: "johndoe",
  email: "john@example.com",
  // ... другие поля из api-schema.d.ts
}
```

## Обработка ошибок

### 401 Unauthorized

```typescript
const { data: user, error } = useGetUser()

if (error?.message.includes("401")) {
  // Пользователь не авторизован
  return <Navigate to="/auth/login" />
}
```

### Автоматический retry

```typescript
retry: (failureCount, error) => {
  // Не повторять при ошибках авторизации
  if (error.message.includes("401") || error.message.includes("Unauthorized")) {
    return false
  }
  // Повторить до 2 раз при сетевых ошибках
  return failureCount < 2
}
```

## Best Practices

### ✅ Правильно

```typescript
// Использовать cookies (автоматически)
const { data: user } = useGetUser()

// Обновлять кэш после логина
queryClient.setQueryData(["user", "profile"], authResponse.user)

// Проверять авторизацию через React Query
if (!user) return <Navigate to="/login" />
```

### ❌ Неправильно

```typescript
// НЕ использовать localStorage для токенов
const token = localStorage.getItem("access_token") // ❌

// НЕ проверять enabled через localStorage
enabled: !!localStorage.getItem("access_token") // ❌

// НЕ дублировать данные
localStorage.setItem("user", JSON.stringify(user)) // ❌
```

## Почему cookies, а не localStorage?

1. **Безопасность**
   - HTTP-Only cookies недоступны для JavaScript
   - Защита от XSS атак
   
2. **Автоматизация**
   - Браузер автоматически отправляет cookies
   - Не нужно вручную добавлять заголовки
   
3. **SSR совместимость**
   - Cookies работают на сервере
   - localStorage только в браузере

## Миграция с localStorage

### Было (неправильно)

```typescript
export const useGetUser = () => {
  const token = localStorage.getItem("access_token")

  return useQuery({
    queryKey: ["user"],
    enabled: !!token, // ❌ Проблема с SSR
    queryFn: async () => {
      const { data } = await getUserProfile()
      return data
    },
  })
}
```

### Стало (правильно)

```typescript
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const { data, error } = await getUserProfile()
      
      if (error) {
        throw new Error(error.error || "Failed to fetch user profile")
      }
      
      return data
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("401")) {
        return false
      }
      return failureCount < 2
    },
  })
}
```

## Debugging

### Проверить cookies

```javascript
// В DevTools Console
document.cookie
```

### Проверить React Query кэш

```javascript
// В DevTools React Query panel
// Должен быть query key: ["user", "profile"]
```

### Проверить Network запросы

```
Request Headers:
Cookie: access_token=...  ← должен быть!
```
