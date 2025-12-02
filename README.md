# AI Memes Frontend (Memology) 🎭

Фронтенд приложение для платформы генерации и обмена мемами с использованием ИИ. Разработано на современном стеке технологий с применением архитектуры Feature-Sliced Design.

## 🛠 Технологии

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### UI & Styling
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)

### State & Data Management
- **Server State**: [TanStack Query v5](https://tanstack.com/query/latest)
- **URL State**: [Nuqs](https://nuqs.47ng.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Architecture & Quality
- **Architecture**: [Feature-Sliced Design (FSD)](https://feature-sliced.design/)
- **Linting**: ESLint
- **API Types**: [OpenAPI TypeScript](https://openapi-ts.pages.dev/)

## 📂 Структура проекта (FSD)

Проект строго следует методологии Feature-Sliced Design:

```
src/
├── app/          # Инициализация (провайдеры, глобальные стили, layout)
├── pages/        # Страницы приложения (композиция виджетов)
├── widgets/      # Крупные самостоятельные блоки (Header, Sidebar, Gallery)
├── features/     # Обработка пользовательских сценариев (Auth, Like, Search)
├── entities/     # Бизнес-сущности (User, Meme)
└── shared/       # Переиспользуемые модули (UI-kit, API, конфиги, хуки)
```

## 🚀 Запуск проекта

### Предварительные требования
- Node.js 20+
- npm, yarn или [Bun](https://bun.sh/)

### Локальный запуск

1. **Установите зависимости:**
   ```bash
   npm install
   # или
   bun install
   ```

2. **Запустите режим разработки:**
   ```bash
   npm run dev
   # или
   bun dev
   ```
   Приложение откроется на [http://localhost:3000](http://localhost:3000).

### Запуск в Docker

```bash
docker-compose up --build
```

## 📜 Доступные скрипты

- `npm run dev` — Запуск сервера разработки.
- `npm run build` — Сборка приложения для продакшена.
- `npm run start` — Запуск собранного приложения.
- `npm run lint` — Проверка кода линтером.
- `npm run generate:api` — Генерация TypeScript типов на основе удаленной OpenAPI схемы.
- `npm run generate:api:file` — Генерация типов из локального `openapi.yaml`.

## 🌐 Переменные окружения

Основные переменные окружения (можно настроить в `.env` или `.env.local`):

| Переменная | Описание | Дефолтное значение |
|------------|----------|--------------------|
| `NEXT_PUBLIC_API_URL` | URL API бэкенда | `https://memology.pixel-team.ru/api/v1` |

## 🔗 Бэкенд

Бэкенд часть проекта написана на Go по ссылке [https://github.com/lDizil/memology-backend](https://github.com/lDizil/memology-backend).
