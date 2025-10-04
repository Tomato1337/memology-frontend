/**
 * Публичный API для shared модулей
 */

// API клиент
export { apiClient, ApiError } from './api/client'
export type { RequestOptions } from './api/client'

// Роуты
export { API_ROUTES, APP_ROUTES } from './config/routes'

// Типы
export type {
    Meme,
    CreateMemeDto,
    UpdateMemeDto,
    MemeListResponse,
    GenerateMemeDto,
} from './types/meme'
