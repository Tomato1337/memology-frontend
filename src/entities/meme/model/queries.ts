import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import {
	getMyMemes,
	getMemeStatus,
	getAvailableStyles,
} from "@/shared/api/memes"
import { MemesListDTO } from "./dto"
import type { IMemeListDTO } from "./types"

export const memeKeys = {
	all: ["memes"] as const,
	my: () => [...memeKeys.all, "my"] as const,
	styles: () => [...memeKeys.all, "styles"] as const,
	status: (id: string) => [...memeKeys.all, "status", id] as const,
}

export function useMyMemesInfinite(limit = 20) {
	return useInfiniteQuery<IMemeListDTO>({
		queryKey: memeKeys.my(),
		queryFn: async ({ pageParam = 0 }) => {
			const data = await getMyMemes({
				limit,
				offset: (pageParam as number) * limit,
			})
			return MemesListDTO.fromApi(data)
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			const totalFetched = allPages.reduce(
				(acc, page) => acc + page.data.length,
				0,
			)
			if (totalFetched >= lastPage.total) return undefined
			return allPages.length
		},
	})
}

export function useMemeStyles() {
	return useQuery({
		queryKey: memeKeys.styles(),
		queryFn: getAvailableStyles,
		staleTime: 1000 * 60 * 5, // 5 минут
	})
}

export function useMemeStatus(id: string, enabled = false) {
	return useQuery({
		queryKey: memeKeys.status(id),
		queryFn: () => getMemeStatus(id),
		enabled,
		refetchInterval: (query) => {
			const meme = query.state.data
			if (meme?.status === "completed" || meme?.status === "failed") {
				return false
			}
			return 2000 // Poll every 2s
		},
	})
}
