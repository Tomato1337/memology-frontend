# 🚀 Быстрый старт

## Запуск приложения

```bash
npm run dev
```

Откройте http://localhost:3000

## ✅ Что работает

В консоли браузера вы увидите:
```
🎭 MSW initialized
[MSW] Mocking enabled
```

На главной странице отобразятся **фейковые мемы**, сгенерированные с помощью Faker.js.

## 🔍 Проверка

1. **Откройте DevTools → Network**
2. **Обновите страницу**
3. **Найдите запрос** к `/api/memes`
4. **Статус:** `200 OK (from service worker)`

Это означает, что MSW перехватывает запросы!

## 📝 Быстрый пример

### Использовать API в своём компоненте

```typescript
'use client';

import { useEffect, useState } from 'react';
import { apiClient, API_ROUTES } from '@/shared';

export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiClient.get(API_ROUTES.MEMES.LIST)
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

### Добавить новый handler

В `src/mocks/handlers.ts`:

```typescript
http.get('/api/my-endpoint', () => {
  return HttpResponse.json({
    message: 'Hello from MSW!',
    data: faker.person.fullName(),
  });
}),
```

## 📚 Документация

- **README.md** - Обзор проекта
- **MSW_SETUP.md** - Детальная настройка
- **EXAMPLES.md** - Примеры кода
- **PROJECT_SUMMARY.md** - Полная структура

## 🎯 Основные файлы

| Файл | Описание |
|------|----------|
| `src/shared/api/client.ts` | API клиент |
| `src/shared/config/routes.ts` | Роуты |
| `src/mocks/handlers.ts` | Mock handlers |
| `src/shared/types/meme.ts` | Типы |

## 💡 Советы

1. **Все API запросы** должны идти через `apiClient`
2. **Все URL** должны использовать константы из `API_ROUTES`
3. **MSW работает** только в development режиме
4. **Faker.js** используется для генерации тестовых данных

---

**Готово! Начинайте разработку! 🎨**
