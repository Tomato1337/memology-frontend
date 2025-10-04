# Примеры использования

Этот файл содержит практические примеры использования API, MSW и Faker.js в приложении.

## 📌 Содержание

1. [Использование API клиента](#использование-api-клиента)
2. [Работа с Mock Handlers](#работа-с-mock-handlers)
3. [Генерация данных с Faker.js](#генерация-данных-с-fakerjs)
4. [React компоненты с API](#react-компоненты-с-api)

---

## Использование API клиента

### Базовый GET запрос

```typescript
import { apiClient } from '@/shared/api/client';
import { API_ROUTES } from '@/shared/config/routes';

// Получение списка мемов
const memes = await apiClient.get(API_ROUTES.MEMES.LIST);

// С параметрами
const pagedMemes = await apiClient.get(API_ROUTES.MEMES.LIST, {
  params: {
    page: 1,
    pageSize: 20,
    search: 'funny',
  },
});
```

### POST запрос для создания

```typescript
const newMeme = await apiClient.post(API_ROUTES.MEMES.CREATE, {
  title: 'Мой новый мем',
  imageUrl: 'https://example.com/meme.jpg',
  description: 'Очень смешной мем',
  tags: ['funny', 'cats'],
});
```

### PATCH для обновления

```typescript
const updated = await apiClient.patch(
  API_ROUTES.MEMES.UPDATE('meme-id'),
  {
    title: 'Обновленное название',
    tags: ['funny', 'updated'],
  }
);
```

### Обработка ошибок

```typescript
import { ApiError } from '@/shared/api/client';

try {
  const meme = await apiClient.get(API_ROUTES.MEMES.DETAIL('123'));
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Ошибка ${error.status}: ${error.message}`);
    
    if (error.status === 404) {
      // Мем не найден
    } else if (error.status === 500) {
      // Ошибка сервера
    }
  }
}
```

---

## Работа с Mock Handlers

### Добавление нового handler

Откройте `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';

// Добавьте в массив handlers
http.get('/api/categories', async () => {
  await delay(200);
  
  const categories = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    }),
    { count: 10 }
  );
  
  return HttpResponse.json(categories);
}),
```

### Handler с динамическим параметром

```typescript
http.get('/api/users/:userId/posts', async ({ params }) => {
  await delay(300);
  
  const { userId } = params;
  
  const posts = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      createdAt: faker.date.recent().toISOString(),
    }),
    { count: 5 }
  );
  
  return HttpResponse.json(posts);
}),
```

### Handler с ошибкой

```typescript
http.post('/api/payments', async ({ request }) => {
  await delay(500);
  
  const data = await request.json();
  
  // Симуляция случайной ошибки
  if (faker.datatype.boolean()) {
    return HttpResponse.json(
      { message: 'Недостаточно средств' },
      { status: 400 }
    );
  }
  
  return HttpResponse.json({
    id: faker.string.uuid(),
    status: 'success',
  });
}),
```

---

## Генерация данных с Faker.js

### Создание сложного объекта

```typescript
import { faker } from '@faker-js/faker';

function generateBlogPost() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    slug: faker.helpers.slugify(faker.lorem.words(3)),
    author: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
    },
    content: faker.lorem.paragraphs(5, '\n\n'),
    excerpt: faker.lorem.paragraph(),
    tags: faker.helpers.arrayElements(
      ['tech', 'lifestyle', 'travel', 'food', 'coding'],
      { min: 1, max: 3 }
    ),
    publishedAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    views: faker.number.int({ min: 100, max: 10000 }),
    likes: faker.number.int({ min: 10, max: 500 }),
    comments: faker.number.int({ min: 0, max: 50 }),
    featured: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
  };
}
```

### Генерация массива с заданным количеством

```typescript
const posts = faker.helpers.multiple(generateBlogPost, { count: 20 });
```

### Воспроизводимая генерация (с seed)

```typescript
faker.seed(12345);
const user1 = generateUser();

faker.seed(12345);
const user2 = generateUser();

// user1 и user2 будут идентичными
```

---

## React компоненты с API

### Компонент списка с загрузкой

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getMemes } from '@/shared/api/memes';
import type { MemeListResponse } from '@/shared/types/meme';

export function MemeList() {
  const [data, setData] = useState<MemeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMemes() {
      try {
        setLoading(true);
        const result = await getMemes({ page: 1, pageSize: 10 });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    }

    loadMemes();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Мемы ({data.total})</h2>
      <ul>
        {data.data.map((meme) => (
          <li key={meme.id}>{meme.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Компонент с формой создания

```typescript
'use client';

import { useState } from 'react';
import { createMeme } from '@/shared/api/memes';

export function CreateMemeForm() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await createMeme({
        title,
        imageUrl: 'https://example.com/image.jpg',
      });
      alert('Мем создан!');
      setTitle('');
    } catch (error) {
      alert('Ошибка создания мема');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название мема"
      />
      <button disabled={loading}>
        {loading ? 'Создание...' : 'Создать'}
      </button>
    </form>
  );
}
```

### Пагинация

```typescript
'use client';

import { useState } from 'react';
import { getMemes } from '@/shared/api/memes';

export function PaginatedMemes() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    getMemes({ page, pageSize: 10 }).then(setData);
  }, [page]);

  return (
    <div>
      {/* Список мемов */}
      
      <div className="pagination">
        <button 
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          Назад
        </button>
        <span>Страница {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Вперед
        </button>
      </div>
    </div>
  );
}
```

---

## Полезные паттерны

### Кастомный хук для API запросов

```typescript
function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetcher()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Использование
const { data, loading, error } = useApi(() => getMemes());
```

### Дебаунс для поиска

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// В компоненте
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  getMemes({ search: debouncedSearch }).then(setMemes);
}, [debouncedSearch]);
```
