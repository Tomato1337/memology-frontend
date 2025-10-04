/**
 * Константы для API роутов приложения
 */

// Базовый URL API
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

/**
 * API эндпоинты
 */
export const API_ROUTES = {
    // Мемы
    MEMES: {
        LIST: `${API_BASE_URL}/memes`,
        DETAIL: (id: string) => `${API_BASE_URL}/memes/${id}`,
        CREATE: `${API_BASE_URL}/memes`,
        UPDATE: (id: string) => `${API_BASE_URL}/memes/${id}`,
        DELETE: (id: string) => `${API_BASE_URL}/memes/${id}`,
        GENERATE: `${API_BASE_URL}/memes/generate`,
    },

    // Пользователи
    USERS: {
        ME: `${API_BASE_URL}/users/me`,
        PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
        UPDATE: `${API_BASE_URL}/users/me`,
    },

    // Аутентификация
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        REFRESH: `${API_BASE_URL}/auth/refresh`,
    },
} as const

/**
 * Роуты страниц приложения
 */
export const APP_ROUTES = {
    HOME: '/',
    MEMES: '/memes',
    MEME_DETAIL: (id: string) => `/memes/${id}`,
    CREATE_MEME: '/memes/create',
    PROFILE: '/profile',
    LOGIN: '/login',
    REGISTER: '/register',
} as const
