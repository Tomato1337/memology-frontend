/**
 * API функции для работы с пользователями
 * Используют типизированный клиент с автоматической генерацией типов
 */

import { typedApiClient } from "../typed-client"
import type { components } from "../api-schema"

export type User = components["schemas"]["models.User"]
export type UpdateProfileRequest =
	components["schemas"]["services.UpdateProfileRequest"]
export type ChangePasswordRequest =
	components["schemas"]["services.ChangePasswordRequest"]

/**
 * Получить профиль текущего пользователя
 *
 * @example
 * const result = await getUserProfile()
 *
 * if (result.data) {
 *   console.log("User profile:", result.data)
 * } else if (result.error) {
 *   console.error("Failed to get profile:", result.error)
 * }
 */
export async function getUserProfile() {
	return await typedApiClient.GET("/users/profile")
}

/**
 * Обновить профиль текущего пользователя
 *
 * @example
 * const result = await updateUserProfile({
 *   username: "johndoe_new",
 *   email: "john.new@example.com"
 * })
 *
 * if (result.data) {
 *   console.log("Profile updated:", result.data)
 * }
 */
export async function updateUserProfile(data: UpdateProfileRequest) {
	return await typedApiClient.PUT("/users/profile/update", {
		body: data,
	})
}

/**
 * Изменить пароль пользователя
 *
 * @example
 * const result = await changePassword({
 *   current_password: "oldpassword",
 *   new_password: "newpassword123"
 * })
 *
 * if (result.data) {
 *   console.log("Password changed:", result.data.message)
 * }
 */
export async function changePassword(data: ChangePasswordRequest) {
	return await typedApiClient.POST("/users/change-password", {
		body: data,
	})
}

/**
 * Получить список пользователей с пагинацией
 *
 * @example
 * const result = await getUsersList({ limit: 10, offset: 0 })
 *
 * if (result.data) {
 *   console.log("Users list:", result.data)
 * }
 */
export async function getUsersList(params?: {
	limit?: number
	offset?: number
}) {
	return await typedApiClient.GET("/users/list", {
		params: {
			query: params,
		},
	})
}
