import { z } from "zod"

export const envSchema = z.object({
	NEXT_PUBLIC_API_URL: z.string().default("http://localhost:3000/api/v1"),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
	const config = {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	}

	try {
		return envSchema.parse(config)
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues
				.map((err) => `  - ${err.path.join(".")}: ${err.message}`)
				.join("\n")

			console.error(
				`❌ Ошибка валидации переменных окружения:\n${errorMessages}`,
			)
			console.error("Доступные переменные:", config)

			throw new Error(
				`❌ Ошибка валидации переменных окружения:\n${errorMessages}`,
			)
		}
		throw error
	}
}

export const env = validateEnv()
