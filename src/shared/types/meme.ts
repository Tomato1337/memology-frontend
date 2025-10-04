/**
 * Типы данных для мемов
 */

export interface Meme {
    id: string
    title: string
    imageUrl: string
    description?: string
    author: {
        id: string
        name: string
        avatar?: string
    }
    tags: string[]
    likes: number
    views: number
    createdAt: string
    updatedAt: string
}

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

export interface MemeListResponse {
    data: Meme[]
    total: number
    page: number
    pageSize: number
}

export interface GenerateMemeDto {
    prompt: string
    style?: 'funny' | 'sarcastic' | 'wholesome' | 'dark'
}
