/**
 * Конфигурация API клиента
 * Определяет, какие эндпоинты идут на реальный бэкенд, а какие через моки
 */

import { env } from "../config/env"

// Базовый URL для реального бэкенда
export const BACKEND_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Базовый URL для моков (локальный)
export const MOCK_URL = "http://localhost:3000/api"

/**
 * Эндпоинты, которые должны идти на реальный бэкенд
 * Всё остальное будет обрабатываться через MSW моки
 */
export const REAL_BACKEND_ENDPOINTS = [
	"/auth/login",
	"/auth/logout",
	"/auth/logout-all",
	"/auth/refresh",
	"/auth/register",
	"/users/profile",
	"/users/profile/update",
	"/users/change-password",
	"/users/list",
] as const

/**
 * Проверяет, должен ли эндпоинт идти на реальный бэкенд
 */
export function isRealBackendEndpoint(path: string): boolean {
	return REAL_BACKEND_ENDPOINTS.some((endpoint) => path.startsWith(endpoint))
}

/**
 * Возвращает правильный базовый URL в зависимости от эндпоинта
 */
export function getBaseUrlForEndpoint(path: string): string {
	return isRealBackendEndpoint(path) ? BACKEND_URL : MOCK_URL
}

/**
 * Режим работы API
 * - 'hybrid': реальный бэкенд для auth/users, моки для остального
 * - 'mock': все запросы через моки
 * - 'real': все запросы на реальный бэкенд
 */
export type ApiMode = "hybrid" | "mock" | "real"

export const API_MODE: ApiMode =
	(env.NEXT_PUBLIC_API_MODE as ApiMode) || "hybrid"

/**
 * Включены ли MSW моки
 */
export const MSW_ENABLED =
	env.NEXT_PUBLIC_MSW_ENABLED !== "false" &&
	(API_MODE === "hybrid" || API_MODE === "mock")
