"use client"

import { AppSidebar } from "@/widgets/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next"
import { useEffect, useState } from "react"
import { Toaster } from "@/shared/ui/sonner"
import { customToast } from "@/shared/lib/utils"

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: (error, query) => {
						if (query.state.data !== undefined) {
							customToast(
								`Ошибка обновления: ${error.message}`,
								"error",
							)
							return
						}

						// 2. Не показываем ошибки для запроса user (его обрабатываем локально для авторизации)
						if (query.queryKey[0] === "user") {
							return
						}
					},
				}),
				mutationCache: new MutationCache({
					onError: (error, _variables, _context, mutation) => {
						// Можно использовать meta для условной обработки
						if (mutation.meta?.hideErrorToast) {
							return
						}

						customToast(`Ошибка: ${error.message}`, "error")
					},
				}),
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 минута
						refetchOnWindowFocus: false,
						retry: 2, // Повторять неудачные запросы 1 раз
					},
				},
			}),
	)

	useEffect(() => {
		// Функция для применения темы
		const applyTheme = (isDark: boolean) => {
			if (isDark) {
				document.documentElement.classList.add("dark")
			} else {
				document.documentElement.classList.remove("dark")
			}
		}

		// Проверяем системную тему при монтировании
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		applyTheme(mediaQuery.matches)

		// Слушаем изменения системной темы
		const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
		mediaQuery.addEventListener("change", handler)

		return () => mediaQuery.removeEventListener("change", handler)
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<div className="bg-primary-foreground dark:bg-foreground/1 h-full w-full">
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
			</NuqsAdapter>
			<Toaster />
		</QueryClientProvider>
	)
}
