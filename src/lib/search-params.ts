import { parseAsInteger, parseAsString } from 'nuqs'
import { parseAsFloat, createLoader } from 'nuqs/server'

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
}

export const loadSearchParams = createLoader(coordinatesSearchParams)
