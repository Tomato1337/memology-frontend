# AI Memes Frontend 🎭

Приложение для создания и обмена мемами, созданными с помощью ИИ. Построено на Next.js 15 с использованием MSW для API mocking и Faker.js для генерации тестовых данных.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## ✨ Возможности

- ✅ **MSW (Mock Service Worker)** - Перехват и мокирование API запросов
- ✅ **Faker.js** - Генерация реалистичных фейковых данных
- ✅ **TypeScript** - Полная типизация
- ✅ **Единая структура API** - Централизованные роуты и клиент
- ✅ **Next.js 15** - App Router, Server Components
- ✅ **Tailwind CSS** - Стилизация

## 📁 Структура проекта

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout с MSW provider
│   └── page.tsx           # Главная страница
├── mocks/                 # MSW конфигурация
│   ├── browser.ts        # MSW worker setup
│   └── handlers.ts       # API mock handlers
├── shared/
│   ├── api/
│   │   └── client.ts     # API клиент
│   ├── config/
│   │   └── routes.ts     # API и app роуты
│   ├── providers/
│   │   └── msw-provider.tsx
│   └── types/
│       └── meme.ts       # TypeScript типы
```

## 🔧 Технологии

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Mocking**: MSW (Mock Service Worker)
- **Fake Data**: Faker.js
- **UI Components**: shadcn/ui (частично)

## 📚 Документация

Подробная документация по настройке MSW и Faker.js: [MSW_SETUP.md](./MSW_SETUP.md)

### Быстрый пример использования API

```typescript
import { apiClient } from '@/shared/api/client';
import { API_ROUTES } from '@/shared/config/routes';

// Получить список мемов
const memes = await apiClient.get(API_ROUTES.MEMES.LIST, {
  params: { page: 1, pageSize: 10 }
});

// Создать новый мем
const newMeme = await apiClient.post(API_ROUTES.MEMES.CREATE, {
  title: 'Мой мем',
  imageUrl: 'https://example.com/image.jpg'
});
```

## 🎨 Доступные API эндпоинты (Mock)

- `GET /api/memes` - Список мемов
- `GET /api/memes/:id` - Мем по ID
- `POST /api/memes` - Создать мем
- `PATCH /api/memes/:id` - Обновить мем
- `DELETE /api/memes/:id` - Удалить мем
- `POST /api/memes/generate` - Генерация мема с AI
- `GET /api/users/me` - Текущий пользователь

## 🛠️ Скрипты

```bash
npm run dev      # Запуск dev сервера с Turbopack
npm run build    # Сборка для production
npm run start    # Запуск production сервера
npm run lint     # Проверка кода с ESLint
```

## 📖 Дополнительно

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Полезные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [MSW Documentation](https://mswjs.io/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚢 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
