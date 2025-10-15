import type { Metadata } from "next"
import { Montserrat_Alternates, Pixelify_Sans } from "next/font/google"
import "@/app/globals.css"
import { Providers } from "@/app/providers"

const montserrat = Montserrat_Alternates({
	variable: "--font-montserrat",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700"],
})

const pixelify = Pixelify_Sans({
	variable: "--font-pixelify-sans",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700"],
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
		const { server } = await import("@/shared/mocks/server")
		server.listen({ onUnhandledRequest: "bypass" })
	}
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
				suppressHydrationWarning
				className={`${pixelify.variable} ${montserrat.variable} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
