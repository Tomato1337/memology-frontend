/**
 * Типизированный API клиент на основе openapi-fetch
 * Использует автоматически сгенерированные типы из api-schema.d.ts
 *
 * Поддерживает гибридный режим:
 * - Auth/Users эндпоинты → реальный бэкенд
 * - Остальные эндпоинты → MSW моки
 *
 * @see https://openapi-ts.dev/openapi-fetch/
 */

import createClient, { type Middleware } from "openapi-fetch"
import type { paths } from "./api-schema"
import { redirect } from "next/navigation"
import { env } from "../config/env"

// Базовый URL API (для реального бэкенда)
const API_BASE_URL = env.NEXT_PUBLIC_API_URL

let isRefreshing = false
let failedQueue: Array<{
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve()
		}
	})
	failedQueue = []
}

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		const modifiedRequest = new Request(request, {
			credentials: "include",
		})
		return modifiedRequest
	},
	async onResponse({ response, request }) {
		if (response.ok) {
			return response
		}

		if (response.status === 401) {
			const originalRequest = request.clone()

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then(() => {
						return fetch(originalRequest)
					})
					.catch((err) => {
						return Promise.reject(err)
					})
			}

			isRefreshing = true

			try {
				const refreshResponse = await fetch(
					`${API_BASE_URL}/auth/refresh`,
					{
						method: "POST",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					},
				)

				if (refreshResponse.ok) {
					processQueue(null)
					isRefreshing = false

					return fetch(originalRequest)
				} else {
					processQueue(new Error("Failed to refresh token"))
					isRefreshing = false

					return response
				}
			} catch (error) {
				processQueue(error as Error)
				isRefreshing = false

				return response
			}
		}

		return response
	},
}

// Создаём типизированный клиент
export const typedApiClient = createClient<paths>({
	baseUrl: API_BASE_URL,
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
	},
})

// Добавляем middleware
typedApiClient.use(authMiddleware)

/**
 * Примеры использования:
 *
 * // Регистрация пользователя
 * const { data, error } = await typedApiClient.POST("/auth/register", {
 *   body: {
 *     username: "johndoe",
 *     email: "john@example.com",
 *     password: "password123"
 *   }
 * })
 *
 * // Вход в систему
 * const { data, error } = await typedApiClient.POST("/auth/login", {
 *   body: {
 *     username: "johndoe",
 *     password: "password123"
 *   }
 * })
 *
 * // Получение профиля
 * const { data, error } = await typedApiClient.GET("/users/profile")
 *
 * // Обновление профиля
 * const { data, error } = await typedApiClient.PUT("/users/profile/update", {
 *   body: {
 *     username: "johndoe_new",
 *     email: "john.new@example.com"
 *   }
 * })
 *
 * // Получение списка пользователей с пагинацией
 * const { data, error } = await typedApiClient.GET("/users/list", {
 *   params: {
 *     query: {
 *       limit: 10,
 *       offset: 0
 *     }
 *   }
 * })
 */

export default typedApiClient
