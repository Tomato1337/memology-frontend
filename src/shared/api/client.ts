/**
 * API клиент для работы с backend
 */

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>
}

class ApiError extends Error {
    constructor(message: string, public status: number, public data?: unknown) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Базовая функция для выполнения API запросов
 */
async function request<T = unknown>(
    url: string,
    options: RequestOptions = {}
): Promise<T> {
    const { params, ...fetchOptions } = options

    // Добавляем query параметры
    let fullUrl = url
    if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value))
        })
        fullUrl = `${url}?${searchParams.toString()}`
    }

    // Настройки по умолчанию
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers: {
            ...defaultHeaders,
            ...fetchOptions.headers,
        },
    }

    try {
        const response = await fetch(fullUrl, config)

        // Проверяем успешность запроса
        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new ApiError(
                errorData?.message || `HTTP Error: ${response.status}`,
                response.status,
                errorData
            )
        }

        // Возвращаем JSON или пустой объект для 204
        if (response.status === 204) {
            return {} as T
        }

        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error',
            0
        )
    }
}

/**
 * API клиент с методами для разных HTTP запросов
 */
export const apiClient = {
    get: <T = unknown>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'GET' }),

    post: <T = unknown>(
        url: string,
        data?: unknown,
        options?: RequestOptions
    ) =>
        request<T>(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
        request<T>(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T = unknown>(
        url: string,
        data?: unknown,
        options?: RequestOptions
    ) =>
        request<T>(url, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T = unknown>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'DELETE' }),
}

export { ApiError }
export type { RequestOptions }
