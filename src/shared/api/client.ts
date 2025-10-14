/**
 * API клиент (фронтенд-слой) для работы поверх канонических типов из `src/shared/api/api-schema.d.ts`.
 * NOTE: Backend не реализуем; используем моки/MSW и тонкую прослойку.
 * MCP: use context7
 */

export interface RequestOptions extends RequestInit {
	params?: Record<string, string | number | boolean>
}

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public data?: unknown,
	) {
		super(message)
		this.name = "ApiError"
	}
}

// Перехватчик refresh: одна попытка обновления при 401
let refreshing = false
let refreshPromise: Promise<void> | null = null

async function tryRefresh(): Promise<void> {
	if (refreshing && refreshPromise) return refreshPromise
	refreshing = true
	refreshPromise = fetch("/auth/refresh", {
		method: "POST",
		credentials: "include",
	})
		.then(async (res) => {
			if (!res.ok) throw new Error("refresh_failed")
		})
		.finally(() => {
			refreshing = false
			refreshPromise = null
		})
	return refreshPromise
}

// Универсальная обёртка вокруг fetch; совместима с типами из `api-schema.d.ts`
export async function apiFetch<T = unknown>(
	url: string,
	options: RequestOptions = {},
): Promise<T> {
	const { params, headers, ...rest } = options
	let fullUrl = url
	if (params) {
		const sp = new URLSearchParams()
		Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
		fullUrl = `${url}?${sp.toString()}`
	}

	const config: RequestInit = {
		credentials: "include",
		headers: { "Content-Type": "application/json", ...headers },
		...rest,
	}

	const res = await fetch(fullUrl, config)
	if (res.status === 401) {
		try {
			await tryRefresh()
		} catch {
			// редирект на /auth на стороне вызова
			throw new ApiError("Unauthorized", 401)
		}
		const retry = await fetch(fullUrl, config)
		if (!retry.ok) {
			const data = await retry.json().catch(() => null)
			throw new ApiError(
				data?.message || `HTTP ${retry.status}`,
				retry.status,
				data,
			)
		}
		return retry.status === 204 ? ({} as T) : ((await retry.json()) as T)
	}
	if (!res.ok) {
		const data = await res.json().catch(() => null)
		throw new ApiError(
			data?.message || `HTTP ${res.status}`,
			res.status,
			data,
		)
	}
	return res.status === 204 ? ({} as T) : ((await res.json()) as T)
}

// Сохранить прежний экспортный интерфейс для существующих вызовов
export const apiClient = {
	get: <T = unknown>(url: string, options?: RequestOptions) =>
		apiFetch<T>(url, { ...options, method: "GET" }),
	post: <T = unknown>(
		url: string,
		data?: unknown,
		options?: RequestOptions,
	) =>
		apiFetch<T>(url, {
			...options,
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		}),
	put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
		apiFetch<T>(url, {
			...options,
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		}),
	patch: <T = unknown>(
		url: string,
		data?: unknown,
		options?: RequestOptions,
	) =>
		apiFetch<T>(url, {
			...options,
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		}),
	delete: <T = unknown>(url: string, options?: RequestOptions) =>
		apiFetch<T>(url, { ...options, method: "DELETE" }),
}

export default apiClient
