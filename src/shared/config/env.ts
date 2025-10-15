import { z } from "zod"

export const envSchema = z.object({
	NEXT_PUBLIC_API_MODE: z.enum(["mock", "hybrid", "real"]).default("hybrid"),
	NEXT_PUBLIC_API_URL: z.url(),
	NEXT_PUBLIC_MSW_ENABLED: z.enum(["true", "false"]).default("true"),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
	const config = {
		NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_MSW_ENABLED: process.env.NEXT_PUBLIC_MSW_ENABLED,
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
