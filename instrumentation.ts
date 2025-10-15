import { env } from "@/shared/config/env"

export async function register() {
	if (
		process.env.NEXT_RUNTIME === "nodejs" &&
		(env.NEXT_PUBLIC_API_MODE === "mock" ||
			env.NEXT_PUBLIC_API_MODE === "hybrid")
	) {
		const { server } = await import("@/shared/mocks/server")
		server.listen()
	}
}
