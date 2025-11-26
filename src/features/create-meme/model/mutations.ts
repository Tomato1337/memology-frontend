import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateMeme } from "@/shared/api/memes"
import { memeKeys } from "@/entities/meme"
import type { CreateMemeFormData } from "./schema"

export function useGenerateMeme() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateMemeFormData) => generateMeme(data),
		onSuccess: () => {
			// Invalidate user memes to refetch the list
			queryClient.invalidateQueries({
				queryKey: memeKeys.my(),
			})
		},
	})
}
