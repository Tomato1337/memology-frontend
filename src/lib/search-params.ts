import { parseAsInteger, parseAsString } from "nuqs/server"
import { createSearchParamsCache } from "nuqs/server"

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const memesSearchParams = {
	search: parseAsString.withDefault(""),
	page: parseAsInteger.withDefault(1),
} as const

export const searchParamsCache = createSearchParamsCache(memesSearchParams)
