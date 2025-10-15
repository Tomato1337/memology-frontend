import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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

	// Прокси для API запросов (решает проблему с cookies)
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: "http://213.165.42.243:8082/api/v1/:path*",
			},
		]
	},
}

export default nextConfig
