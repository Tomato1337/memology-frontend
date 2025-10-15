import { env } from "@/shared/config/env"
import { worker } from "@/shared/mocks/browser"

if (
	env.NEXT_PUBLIC_API_MODE === "mock" ||
	env.NEXT_PUBLIC_API_MODE === "hybrid"
) {
	worker.start({ onUnhandledRequest: "bypass" })
}
