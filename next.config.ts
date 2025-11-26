import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// ✅ Standalone режим для Docker (оптимизирует размер образа)
	output: "standalone",

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "memology.pixel-team.ru",
			},
		],
		// ✅ Отключаем оптимизацию для dev режима (ускоряет разработку)
		unoptimized: process.env.NODE_ENV === "development",
	},

	// Прокси для API запросов (решает проблему с cookies в dev режиме)
	async rewrites() {
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
