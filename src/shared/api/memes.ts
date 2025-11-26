/**
 * API методы для работы с мемами
 * Использует типизированный клиент из typed-client.ts
 */

import { typedApiClient } from "./typed-client"

/**
 * Получить список мемов текущего пользователя
 */
export async function getMyMemes(params?: { limit?: number; offset?: number }) {
	const { data, error } = await typedApiClient.GET("/memes/my", {
		params: {
			query: params,
		},
	})

	if (error) throw new Error(error.error || "Failed to fetch user memes")

	return data
}

/**
 * Получить мем по ID
 */
export async function getMemeById(id: string) {
	const { data, error } = await typedApiClient.GET("/memes/{id}", {
		params: {
			path: { id },
		},
	})

	if (error) throw new Error(error.error || "Failed to fetch meme")
	return data
}

/**
 * Генерация мема через нейросеть
 */
export async function generateMeme(params: {
	prompt: string
	style?: string
	is_public?: boolean
}) {
	const { data, error } = await typedApiClient.POST("/memes/generate", {
		body: params,
	})

	if (error) throw new Error(error.error || "Failed to generate meme")
	return data
}

/**
 * Проверить статус генерации мема
 */
export async function getMemeStatus(id: string) {
	const { data, error } = await typedApiClient.GET("/memes/{id}/status", {
		params: {
			path: { id },
		},
	})

	if (error) throw new Error(error.error || "Failed to get meme status")
	return data
}

/**
 * Получить доступные стили для генерации
 */
export async function getAvailableStyles() {
	const { data, error } = await typedApiClient.GET("/memes/styles")

	if (error) throw new Error(error.error || "Failed to fetch styles")
	return data
}

/**
 * Удалить мем
 */
export async function deleteMeme(id: string) {
	const { data, error } = await typedApiClient.DELETE("/memes/{id}", {
		params: {
			path: { id },
		},
	})

	if (error) throw new Error(error.error || "Failed to delete meme")
	return data
}
