# MSW + Faker.js Setup

Это приложение настроено с **Mock Service Worker (MSW)** для перехвата API запросов и **Faker.js** для генерации фейковых данных.

## 📦 Установленные пакеты

- `msw` - Mock Service Worker для API mocking
- `@faker-js/faker` - Генератор фейковых данных

## 📁 Структура проекта

```
src/
├── app/
│   ├── layout.tsx          # Root layout с MSWProvider
│   └── page.tsx            # Главная страница с примерами
├── mocks/
│   ├── browser.ts          # Инициализация MSW worker
│   └── handlers.ts         # API handlers с faker данными
├── shared/
│   ├── api/
│   │   └── client.ts       # API клиент для запросов
│   ├── config/
│   │   └── routes.ts       # Константы роутов API и приложения
│   ├── providers/
│   │   └── msw-provider.tsx # Provider для инициализации MSW
│   └── types/
│       └── meme.ts         # TypeScript типы
```

## 🚀 Использование

### API Клиент

```typescript
import { apiClient } from '@/shared/api/client';
import { API_ROUTES } from '@/shared/config/routes';

// GET запрос
const memes = await apiClient.get(API_ROUTES.MEMES.LIST, {
  params: { page: 1, pageSize: 10 }
});

// POST запрос
const newMeme = await apiClient.post(API_ROUTES.MEMES.CREATE, {
  title: 'Мой мем',
  imageUrl: 'https://example.com/image.jpg'
});

// DELETE запрос
await apiClient.delete(API_ROUTES.MEMES.DELETE('meme-id'));
```

### Доступные API эндпоинты (Mock)

#### Мемы
- `GET /api/memes` - Список мемов (поддерживает пагинацию и поиск)
- `GET /api/memes/:id` - Получить мем по ID
- `POST /api/memes` - Создать новый мем
- `PATCH /api/memes/:id` - Обновить мем
- `DELETE /api/memes/:id` - Удалить мем
- `POST /api/memes/generate` - Сгенерировать мем с помощью AI

#### Пользователи
- `GET /api/users/me` - Получить текущего пользователя

### Добавление новых handlers

Откройте `src/mocks/handlers.ts` и добавьте новый handler:

```typescript
import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

// Добавьте в массив handlers:
http.get('/api/new-endpoint', async () => {
  await delay(200); // Имитация задержки сети
  
  return HttpResponse.json({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    // ... другие поля
  });
});
```

## 🎨 Faker.js примеры

```typescript
import { faker } from '@faker-js/faker';

// Личные данные
faker.person.fullName()
faker.person.firstName()
faker.internet.email()
faker.image.avatar()

// Контент
faker.lorem.sentence()
faker.lorem.paragraph()
faker.lorem.words(5)

// Числа и даты
faker.number.int({ min: 0, max: 100 })
faker.date.past({ years: 1 })
faker.date.recent({ days: 7 })

// ID и UUID
faker.string.uuid()
faker.string.alphanumeric(10)

// Массивы
faker.helpers.arrayElements(['a', 'b', 'c'], { min: 1, max: 2 })
faker.helpers.multiple(() => generateItem(), { count: 5 })
```

## 🔧 Конфигурация

### Отключение MSW

MSW работает только в development режиме. Для production он автоматически отключается.

Чтобы полностью отключить MSW в development, закомментируйте `MSWProvider` в `layout.tsx`.

### Настройка MSW

В `src/mocks/browser.ts` можно изменить настройки:

```typescript
await worker.start({
  onUnhandledRequest: 'bypass', // 'bypass' | 'warn' | 'error'
  quiet: false, // true - скрыть логи MSW
});
```

## 📝 Типизация

Все API типы находятся в `src/shared/types/`:

```typescript
import type { Meme, MemeListResponse } from '@/shared/types/meme';

const memes = await apiClient.get<MemeListResponse>(API_ROUTES.MEMES.LIST);
```

## 🌐 Роуты

### API роуты

```typescript
import { API_ROUTES } from '@/shared/config/routes';

API_ROUTES.MEMES.LIST           // '/api/memes'
API_ROUTES.MEMES.DETAIL('123')  // '/api/memes/123'
API_ROUTES.AUTH.LOGIN           // '/api/auth/login'
```

### Роуты приложения

```typescript
import { APP_ROUTES } from '@/shared/config/routes';

APP_ROUTES.HOME                 // '/'
APP_ROUTES.MEME_DETAIL('123')   // '/memes/123'
```

## 🐛 Отладка

1. Откройте DevTools в браузере
2. В консоли вы увидите `🎭 MSW initialized`
3. MSW логирует все перехваченные запросы
4. В Network tab запросы будут помечены как `(from service worker)`

## 📚 Дополнительные ресурсы

- [MSW Documentation](https://mswjs.io/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
