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
import { useState } from "react"
import { Toaster } from "@/shared/ui/sonner"
import { customToast } from "@/shared/lib/utils"
import { ThemeProvider } from "next-themes"

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
						retry: 2,
					},
				},
			}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
			</ThemeProvider>
		</QueryClientProvider>
	)
}
