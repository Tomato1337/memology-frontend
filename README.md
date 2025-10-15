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

- ✅ **Типизированный API** - OpenAPI TypeScript схема с автогенерацией
- ✅ **Гибридный режим** - Auth/Users на реальный бэкенд, остальное через MSW моки
- ✅ **MSW (Mock Service Worker)** - Перехват и мокирование API запросов
- ✅ **Faker.js** - Генерация реалистичных фейковых данных
- ✅ **TypeScript** - Полная типизация
- ✅ **React Query** - Умное кэширование и управление состоянием
- ✅ **Next.js 15** - App Router, Server Components
- ✅ **Tailwind CSS** - Стилизация

## 📁 Структура проекта

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout с MSW provider
│   └── page.tsx           # Главная страница
├── shared/
│   ├── api/               # 🎯 Типизированный API (OpenAPI)
│   │   ├── typed-client.ts    # openapi-fetch клиент
│   │   ├── auth.ts            # Auth API (реальный бэкенд)
│   │   ├── users.ts           # Users API (реальный бэкенд)
│   │   ├── hooks.ts           # React Query хуки
│   │   ├── config.ts          # Гибридная конфигурация
│   │   ├── api-schema.d.ts    # Автогенерируемые типы
│   │   └── README.md          # Документация API
│   ├── config/
│   │   └── routes.ts      # API и app роуты
│   ├── mocks/             # MSW конфигурация (только для мемов!)
│   │   ├── browser.ts    # MSW worker setup
│   │   └── handlers.ts   # API mock handlers
│   └── types/
│       └── meme.ts        # TypeScript типы
├── entities/              # FSD: Бизнес сущности
├── features/              # FSD: Пользовательские действия
├── widgets/               # FSD: Композитные блоки
└── pages/                 # FSD: Страницы
```

## 🔧 Технологии

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Mocking**: MSW (Mock Service Worker)
- **Fake Data**: Faker.js
- **UI Components**: shadcn/ui (частично)

## 📚 Документация

### API (Типизированный, с OpenAPI)

- 📖 [API README](./src/shared/api/README.md) - Обзор
- 🚀 [Быстрый старт](./src/shared/api/QUICKSTART.md) - Примеры использования
- 📘 [Полный гайд](./src/shared/api/HYBRID_API_GUIDE.md) - Гибридный режим
- 🏗️ [Архитектура](./src/shared/api/ARCHITECTURE.md) - Диаграммы и схемы
- ✅ [Что готово](./src/shared/api/INTEGRATION_COMPLETE.md) - Статус интеграции

### Остальное

- 🎭 [MSW Setup](./MSW_SETUP.md) - Настройка Mock Service Worker

### Быстрый пример использования API

```typescript
// ✅ Новый способ (типизированный, реальный бэкенд)
import { useLogin, useRegister, useUserProfile } from '@/shared/api'

function LoginForm() {
  const { mutate: login, isPending } = useLogin()
  
  const handleSubmit = (credentials) => {
    login(credentials, {
      onSuccess: (auth) => console.log("Logged in!", auth.user)
    })
  }
}

function ProfilePage() {
  const { data: user, isLoading } = useUserProfile()
  
  if (isLoading) return <div>Loading...</div>
  return <div>Hello, {user?.username}</div>
}

// ⚠️ Старый способ (MSW моки, для мемов)
import { getMemes } from '@/shared/api/memes';

const memes = await getMemes({ page: 1, pageSize: 10 });
```

## 🎨 API эндпоинты

### ✅ Реальный бэкенд (localhost:8080)
- `POST /auth/login` - Вход
- `POST /auth/register` - Регистрация
- `POST /auth/logout` - Выход
- `POST /auth/refresh` - Обновление токена
- `GET /users/profile` - Профиль пользователя
- `PUT /users/profile/update` - Обновление профиля
- `GET /users/list` - Список пользователей
- `POST /users/change-password` - Изменение пароля

### 🎭 MSW Моки (localhost:3000)
- `GET /api/memes` - Список мемов
- `GET /api/memes/:id` - Мем по ID
- `POST /api/memes` - Создать мем
- `PATCH /api/memes/:id` - Обновить мем
- `DELETE /api/memes/:id` - Удалить мем
- `POST /api/memes/generate` - Генерация мема с AI

## 🛠️ Скрипты

```bash
npm run dev            # Запуск dev сервера с Turbopack
npm run build          # Сборка для production
npm run start          # Запуск production сервера
npm run lint           # Проверка кода с ESLint
npm run generate:api   # Обновить OpenAPI схему с бэкенда
```

## ⚙️ Конфигурация

Скопируйте `.env.example` в `.env.local`:

```bash
cp .env.example .env.local
```

Основные переменные:

```env
# URL реального бэкенда
NEXT_PUBLIC_API_URL=http://localhost:8080

# Режим: hybrid (рекомендуется) | mock | real
NEXT_PUBLIC_API_MODE=hybrid

# Включить MSW моки
NEXT_PUBLIC_MSW_ENABLED=true
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
