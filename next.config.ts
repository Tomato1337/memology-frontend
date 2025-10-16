import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// ✅ Standalone режим для Docker (оптимизирует размер образа)
	output: "standalone",

	images: {
		remotePatterns: [
			// !FIXME: ограничить список доменов
			{
				protocol: "https",
				hostname: "**",
			},
		],
		// ✅ Отключаем оптимизацию для dev режима (ускоряет разработку)
		unoptimized: process.env.NODE_ENV === "development",
	},

	// Прокси для API запросов (решает проблему с cookies в dev режиме)
	async rewrites() {
		// В production прокси не нужен - используем прямой URL бэкенда
		if (process.env.NODE_ENV === "production") {
			return []
		}

		return [
			{
				source: "/api/v1/:path*",
				destination: "https://memology.pixel-team.ru/api/v1/:path*",
			},
		]
	},
}

export default nextConfig
