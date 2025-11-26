import { Suspense } from "react"
import type { Metadata } from "next"
import { typedApiClient } from "@/shared/api/typed-client"
import { SidebarTrigger } from "@/shared/ui/sidebar"
import { Button } from "@/shared/ui/button"
import { PlusCircle } from "lucide-react"
import { searchParamsCache } from "@/shared/lib/search-params"
import { MemesList } from "@/widgets/memes-list"
import CardsSkeleton from "@/widgets/memes-list/ui/cards-skeleton"
import { SearchInput } from "@/features/search-memes"
import type { SearchParams } from "nuqs/server"
import Link from "next/link"
import { MemesListDTO } from "@/entities/meme/model/dto"

export const metadata: Metadata = {
	title: "Мемы - AI Memes",
	description: "Просматривайте и создавайте смешные мемы с помощью ИИ",
}

async function GetAllMemes() {
	const { page, search } = searchParamsCache.all()

	const { data: memes, error } = await typedApiClient.GET("/memes/public", {
		params: {
			query: {
				limit: 30,
				offset: ((page || 1) - 1) * 30,
			},
		},
	})

	if (error || !memes) {
		console.error("Error fetching memes:", error)
		return <div className="p-4">Ошибка загрузки мемов</div>
	}

	const transformedData = MemesListDTO.fromApi(memes)

	return <MemesList initialData={transformedData} search={search || ""} />
}

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	const parsed = await searchParamsCache.parse(searchParams)
	const { page, search } = parsed

	const suspenseKey = `memes-${page}-${search}`

	return (
		<div className="flex min-h-screen max-w-full flex-col">
			<header className="bg-background sticky top-0 z-10 flex items-center gap-4 border-b p-2">
				<SidebarTrigger className="size-12" />
				<h2 className="font-pixelify-sans text-2xl font-light">
					Главная
				</h2>
				<SearchInput />
				<Button className="" size={"icon"} asChild>
					<Link href="/create">
						<PlusCircle />
					</Link>
				</Button>
			</header>
			<main className="bg-background relative flex-1 overflow-hidden px-4">
				<Suspense
					key={suspenseKey}
					fallback={
						<div className="mt-4">
							<CardsSkeleton columns={4} />
						</div>
					}
				>
					<GetAllMemes />
				</Suspense>
			</main>
		</div>
	)
}
