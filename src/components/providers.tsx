'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    // Создаём QueryClient внутри клиентского компонента
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 минута
                    },
                },
            })
    )

    useEffect(() => {
        // Функция для применения темы
        const applyTheme = (isDark: boolean) => {
            if (isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }

        // Проверяем системную тему при монтировании
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        applyTheme(mediaQuery.matches)

        // Слушаем изменения системной темы
        const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
        mediaQuery.addEventListener('change', handler)

        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>{children}</NuqsAdapter>
        </QueryClientProvider>
    )
}
