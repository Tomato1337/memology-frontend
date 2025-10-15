/**
 * API функции для работы с аутентификацией
 * Используют типизированный клиент с автоматической генерацией типов
 */

import { typedApiClient } from "../typed-client"
import type { components } from "../api-schema"

export type AuthResponse = components["schemas"]["services.AuthResponse"]
export type LoginRequest = components["schemas"]["services.LoginRequest"]
export type RegisterRequest = components["schemas"]["services.RegisterRequest"]
export type RefreshTokenRequest =
	components["schemas"]["handlers.RefreshTokenRequest"]

/**
 * Регистрация нового пользователя
 *
 * @example
 * const result = await registerUser({
 *   username: "johndoe",
 *   email: "john@example.com",
 *   password: "password123"
 * })
 *
 * if (result.data) {
 *   console.log("User registered:", result.data.user)
 *   console.log("Access token:", result.data.access_token)
 * } else if (result.error) {
 *   console.error("Registration failed:", result.error)
 * }
 */
export async function registerUser(data: RegisterRequest) {
	return await typedApiClient.POST("/auth/register", {
		body: data,
	})
}

/**
 * Вход в систему
 *
 * @example
 * const result = await loginUser({
 *   username: "johndoe",
 *   password: "password123"
 * })
 *
 * if (result.data) {
 *   console.log("Login successful:", result.data.user)
 * }
 */
export async function loginUser(data: LoginRequest) {
	return await typedApiClient.POST("/auth/login", {
		body: data,
	})
}

/**
 * Выход из системы
 *
 * @example
 * const result = await logoutUser({ refresh_token: "..." })
 *
 * if (result.data) {
 *   console.log("Logout successful:", result.data.message)
 * }
 */
export async function logoutUser() {
	return await typedApiClient.POST("/auth/logout")
}

/**
 * Выход из всех устройств
 *
 * @example
 * const result = await logoutAllDevices()
 *
 * if (result.data) {
 *   console.log("Logged out from all devices:", result.data.message)
 * }
 */
export async function logoutAllDevices() {
	return await typedApiClient.POST("/auth/logout-all")
}

/**
 * Обновление access токена
 *
 * @example
 * const result = await refreshAccessToken({ refresh_token: "..." })
 *
 * if (result.data) {
 *   console.log("New access token:", result.data.access_token)
 * }
 */
export async function refreshAccessToken(data: RefreshTokenRequest) {
	return await typedApiClient.POST("/auth/refresh", {
		body: data,
	})
}
