import { z } from "zod"

export const createMemeSchema = z.object({
	prompt: z
		.string()
		.min(1, "Введите текст для мема")
		.max(500, "Максимум 500 символов"),
	style: z.string().optional(),
	is_public: z.boolean(),
})

export type CreateMemeFormData = z.infer<typeof createMemeSchema>
