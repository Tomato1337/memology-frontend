import { components } from "@/shared/api"
import { IMemeDTO, IMemeListDTO } from "./types"

type ApiMeme = components["schemas"]["models.Meme"]
type ApiMemesList = components["schemas"]["handlers.MemeHistoryResponse"]

export class MemeDTO {
	static fromApi(apiMeme: ApiMeme): IMemeDTO {
		return {
			id: apiMeme.id ?? "",
			title: apiMeme.prompt ?? "Untitled",
			imageUrl: apiMeme.image_url ?? "",
			author: apiMeme.user_id ?? "",
			style: apiMeme.style ?? "",
			status: (apiMeme.status ?? "").toLowerCase(),
			likes: apiMeme.metrics?.rating_score ?? 0,
			views: apiMeme.metrics?.click_count ?? 0,
			width: apiMeme.width ?? 300,
			height: apiMeme.height ?? 400,
			createdAt: apiMeme.created_at ?? new Date().toISOString(),
			updatedAt: apiMeme.updated_at ?? new Date().toISOString(),
			downloadCount: apiMeme.metrics?.download_count ?? 0,
			otherInteractions: apiMeme.metrics?.other_interactions ?? 0,
		}
	}
}

export class MemesListDTO {
	static fromApi(apiMemes: ApiMemesList): IMemeListDTO {
		return {
			data: apiMemes.memes?.map((meme) => MemeDTO.fromApi(meme)) ?? [],
			total: apiMemes.total ?? 0,
			page: apiMemes.page ?? 1,
			limit: apiMemes.limit ?? 30,
		}
	}
}
