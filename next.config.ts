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
    },
}

export default nextConfig
