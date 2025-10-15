/**
 * Публичный API для работы с бэкендом
 * Экспортирует типизированные клиенты и функции
 */

// Типизированный клиент на основе openapi-fetch
export { typedApiClient, default as apiTyped } from "./typed-client"

// Legacy клиент (для обратной совместимости)
export { apiClient, apiFetch, ApiError } from "./client"

// API функции для аутентификации
export * from "./user/auth"

// API функции для пользователей
export * from "./user/users"

// React Query хуки
export * from "./hooks"

// API схемы и типы
export type { paths, components } from "./api-schema"
