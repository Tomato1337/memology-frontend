import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // !FIXME: ограничить список доменов
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // ✅ Отключаем оптимизацию для dev режима (ускоряет разработку)
        unoptimized: process.env.NODE_ENV === 'development',
    },
}

export default nextConfig
