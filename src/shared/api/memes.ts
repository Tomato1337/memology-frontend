/**
 * Примеры использования API клиента
 *
 * Этот файл содержит функции-обёртки для работы с API мемов
 */

import { apiClient, ApiError } from "@/shared/api/client"
import { API_ROUTES } from "@/shared/config/routes"
import type {
	Meme,
	MemeListResponse,
	CreateMemeDto,
	UpdateMemeDto,
	GenerateMemeDto,
} from "@/entities/meme/model/meme.types"

/**
 * Получить список мемов с пагинацией и поиском
 */
export async function getMemes(params?: {
	page?: number
	pageSize?: number
	search?: string
}) {
	try {
		return await apiClient.get<MemeListResponse>(API_ROUTES.MEMES.LIST, {
			params: {
				page: params?.page || 1,
				pageSize: params?.pageSize || 10,
				...(params?.search && { search: params.search }),
			},
		})
	} catch (error) {
		if (error instanceof ApiError) {
			console.error("API Error:", error.message, error.status)
		}
		throw error
	}
}

/**
 * Получить мем по ID
 */
export async function getMemeById(id: string) {
	try {
		return await apiClient.get<Meme>(API_ROUTES.MEMES.DETAIL(id))
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 404) {
				throw new Error("Мем не найден")
			}
		}
		throw error
	}
}

/**
 * Создать новый мем
 */
export async function createMeme(data: CreateMemeDto) {
	try {
		return await apiClient.post<Meme>(API_ROUTES.MEMES.CREATE, data)
	} catch (error) {
		if (error instanceof ApiError) {
			console.error("Ошибка создания мема:", error.message)
		}
		throw error
	}
}

/**
 * Обновить существующий мем
 */
export async function updateMeme(id: string, data: UpdateMemeDto) {
	try {
		return await apiClient.patch<Meme>(API_ROUTES.MEMES.UPDATE(id), data)
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 404) {
				throw new Error("Мем не найден")
			}
		}
		throw error
	}
}

/**
 * Удалить мем
 */
export async function deleteMeme(id: string) {
	try {
		await apiClient.delete(API_ROUTES.MEMES.DELETE(id))
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 404) {
				throw new Error("Мем не найден")
			}
		}
		throw error
	}
}

/**
 * Генерация мема с помощью AI
 */
export async function generateMeme(data: GenerateMemeDto) {
	try {
		return await apiClient.post<Meme>(API_ROUTES.MEMES.GENERATE, data)
	} catch (error) {
		if (error instanceof ApiError) {
			console.error("Ошибка генерации мема:", error.message)
		}
		throw error
	}
}

/**
 * Получить текущего пользователя
 */
export async function getCurrentUser() {
	try {
		return await apiClient.get(API_ROUTES.USERS.ME)
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 401) {
				throw new Error("Не авторизован")
			}
		}
		throw error
	}
}

/**
 * Пример использования с обработкой ошибок
 */
export async function fetchMemesWithErrorHandling() {
	try {
		const memes = await getMemes({ page: 1, pageSize: 10 })
		return { success: true, data: memes }
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Неизвестная ошибка",
		}
	}
}

/**
 * Пример пакетной загрузки мемов
 */
export async function fetchMultiplePages(totalPages: number) {
	const promises = Array.from({ length: totalPages }, (_, i) =>
		getMemes({ page: i + 1, pageSize: 10 }),
	)

	try {
		const results = await Promise.all(promises)
		const allMemes = results.flatMap((result) => result.data)
		return { success: true, memes: allMemes }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Ошибка загрузки",
		}
	}
}
