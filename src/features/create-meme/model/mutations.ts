import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateMeme, generateTemplateMeme } from "@/shared/api/memes"
import { memeKeys } from "@/entities/meme"
import type { CreateMemeFormData } from "./schema"

export function useGenerateMeme() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateMemeFormData) => {
			if (data.generationModel === "template") {
				return generateTemplateMeme({
					context: data.prompt,
					is_public: data.is_public,
				})
			}
			return generateMeme({
				prompt: data.prompt,
				style: data.style,
				is_public: data.is_public,
			})
		},
		onSuccess: () => {
			// Invalidate user memes to refetch the list
			queryClient.invalidateQueries({
				queryKey: memeKeys.my(),
			})
		},
	})
}
