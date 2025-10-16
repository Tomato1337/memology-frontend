"use client"

import { env } from "@/shared/config/env"

// ✅ Проверяем и API_MODE и MSW_ENABLED
const shouldEnableMSW =
	typeof window !== "undefined" &&
	env.NEXT_PUBLIC_MSW_ENABLED === "true" &&
	(env.NEXT_PUBLIC_API_MODE === "mock" ||
		env.NEXT_PUBLIC_API_MODE === "hybrid")

if (shouldEnableMSW) {
	import("@/shared/mocks/browser").then(({ worker }) => {
		worker.start({
			onUnhandledRequest: "bypass", // Пропускаем запросы без хэндлеров
		})
	})
}
