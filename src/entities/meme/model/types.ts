import type { components } from "@/shared/api/api-schema"

// Тип статуса мема
export type MemeStatus = "pending" | "processing" | "completed" | "failed"

// Запрос на создание мема
export type CreateMemeRequest =
	components["schemas"]["services.CreateMemeRequest"]

export interface IMemeDTO {
	id: string
	title: string
	imageUrl: string
	author: string
	style: string
	status: string
	likes: number
	views: number
	width: number
	height: number
	createdAt: string
	updatedAt: string
	downloadCount: number
	otherInteractions: number
}

export interface IMemeListDTO {
	data: IMemeDTO[]
	total: number
	page: number
	limit: number
}
export type MemeListResponse =
	components["schemas"]["handlers.MemeHistoryResponse"]

export interface CreateMemeDto {
	title: string
	imageUrl: string
	description?: string
	tags?: string[]
}

export interface UpdateMemeDto {
	title?: string
	description?: string
	tags?: string[]
}

export interface GenerateMemeDto {
	user_input: string
	style?: string
}
