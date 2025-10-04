import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Providers } from "@/components/providers"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "AI Memes - Create and Share Funny Memes",
	description: "Create, share, and discover funny memes powered by AI",
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { server } = await import("@/mocks/server")
		server.listen({ onUnhandledRequest: "bypass" })
	}
	console.log(process.env.NEXT_RUNTIME)
	return (
		<html lang="ru">
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
                            (function() {
                                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                                if (mediaQuery.matches) {
                                    document.documentElement.classList.add('dark');
                                }
                            })();
                        `,
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<div className="w-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
								{children}
							</div>
						</SidebarInset>
					</SidebarProvider>
				</Providers>
			</body>
		</html>
	)
}
