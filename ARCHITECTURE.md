# 🏗️ Архитектура приложения

## Схема потока данных

```
┌─────────────────────────────────────────────────────────────┐
│                      React Component                         │
│                                                              │
│  'use client'                                               │
│  import { apiClient, API_ROUTES } from '@/shared'           │
│                                                              │
│  const data = await apiClient.get(API_ROUTES.MEMES.LIST)    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Client Layer                           │
│                  (src/shared/api/client.ts)                  │
│                                                              │
│  • apiClient.get()                                          │
│  • apiClient.post()                                         │
│  • apiClient.patch()                                        │
│  • apiClient.delete()                                       │
│  • Error handling (ApiError)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Fetch API (Browser)                          │
│                                                              │
│  fetch('/api/memes', { ... })                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MSW Service Worker Layer                        │
│               (public/mockServiceWorker.js)                  │
│                                                              │
│  🔍 Перехватывает запросы к /api/*                          │
│  ⚡ Только в development режиме                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   MSW Handlers                               │
│                 (src/mocks/handlers.ts)                      │
│                                                              │
│  http.get('/api/memes', async () => {                       │
│    await delay(300);  // Имитация сети                      │
│    return HttpResponse.json(memes);                         │
│  })                                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Faker.js Layer                            │
│                                                              │
│  faker.person.fullName()                                    │
│  faker.lorem.sentence()                                     │
│  faker.image.avatar()                                       │
│  faker.date.past()                                          │
│                                                              │
│  ➜ Генерирует реалистичные фейковые данные                 │
└─────────────────────────────────────────────────────────────┘
```

## Структура модулей

```
┌──────────────────────────────────────────────────────────────┐
│                          App Layer                            │
│                        (src/app/)                            │
│                                                              │
│  • layout.tsx  ← Инициализирует MSWProvider                 │
│  • page.tsx    ← Использует API клиент                      │
└──────────────────┬──────────────────────┬────────────────────┘
                   │                      │
                   ▼                      ▼
┌──────────────────────────┐  ┌─────────────────────────────┐
│   Shared Layer           │  │   Components Layer          │
│   (src/shared/)          │  │   (src/components/)         │
│                          │  │                             │
│  • api/                  │  │  • meme-card.tsx            │
│    - client.ts           │  │  • loading-spinner.tsx      │
│    - memes.ts            │  │                             │
│  • config/               │  └─────────────────────────────┘
│    - routes.ts           │
│  • types/                │
│    - meme.ts             │
│  • providers/            │
│    - msw-provider.tsx    │
└──────────────┬───────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│                        Mocks Layer                            │
│                      (src/mocks/)                            │
│                                                              │
│  • browser.ts     ← setupWorker()                           │
│  • handlers.ts    ← http.get(), http.post(), etc.          │
│  • faker-utils.ts ← Утилиты для генерации данных            │
└──────────────────────────────────────────────────────────────┘
```

## Паттерны взаимодействия

### 1. Клиент → API

```typescript
// Компонент делает запрос
const memes = await apiClient.get(API_ROUTES.MEMES.LIST);

// ↓ Проходит через

// API клиент → форматирует запрос
fetch('/api/memes', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})

// ↓ Перехватывается

// MSW Service Worker → находит handler
http.get('/api/memes', ...)

// ↓ Возвращает

// Mock данные из Faker.js
```

### 2. Типизация (End-to-End)

```typescript
// Определение типа
interface Meme { ... }  // src/shared/types/meme.ts

// ↓ Используется в

// Handler
http.get('/api/memes', (): Meme[] => ...)

// ↓ И в

// API функции
async function getMemes(): Promise<MemeListResponse>

// ↓ И в

// Компонентах
const [memes, setMemes] = useState<Meme[]>([]);
```

### 3. Конфигурация роутов

```typescript
// Определение
export const API_ROUTES = {
  MEMES: {
    LIST: '/api/memes',
    DETAIL: (id) => `/api/memes/${id}`,
  }
}

// ↓ Используется в

// Handlers
http.get(API_ROUTES.MEMES.LIST, ...)

// ↓ И в

// API запросах
apiClient.get(API_ROUTES.MEMES.LIST)

// Результат: Единый источник истины для URL
```

## Жизненный цикл приложения

```
1. Приложение стартует
   ↓
2. RootLayout рендерится
   ↓
3. MSWProvider инициализируется
   ↓
4. Проверка: NODE_ENV === 'development'?
   ├─ Нет → MSW не загружается
   └─ Да → worker.start()
       ↓
5. Service Worker регистрируется
   ↓
6. Handlers загружаются
   ↓
7. MSW готов (консоль: "🎭 MSW initialized")
   ↓
8. Страница рендерится
   ↓
9. Компоненты делают API запросы
   ↓
10. MSW перехватывает → возвращает mock данные
    ↓
11. Компоненты отображают данные
```

## Преимущества архитектуры

✅ **Разделение ответственности**
- API клиент не знает про моки
- Компоненты не знают про MSW
- Handlers изолированы

✅ **Типобезопасность**
- TypeScript на всех уровнях
- Автодополнение везде
- Ошибки на этапе компиляции

✅ **Переиспользуемость**
- API клиент универсальный
- Типы переиспользуются
- Роуты централизованы

✅ **Тестируемость**
- MSW можно использовать в тестах
- Handlers легко модифицировать
- Изоляция компонентов

✅ **Developer Experience**
- Быстрая разработка без backend
- Реалистичные данные из Faker.js
- Имитация задержек сети
- Легко добавлять новые endpoints

## Расширение

### Добавление нового feature

```
1. Создайте типы
   src/shared/types/feature.ts

2. Добавьте роуты
   src/shared/config/routes.ts

3. Создайте handlers
   src/mocks/handlers.ts

4. Создайте API функции
   src/shared/api/feature.ts

5. Используйте в компонентах
   src/app/feature/page.tsx
```

Всё!
