import { Suspense } from "react"
import type { Metadata } from "next"
import { apiClient } from "@/shared/api/client"
import { API_ROUTES } from "@/shared/config/routes"
import type { MemeListResponse } from "@/entities/meme/model/meme.types"
import { SidebarTrigger } from "@/shared/ui/sidebar"
import { Button } from "@/shared/ui/button"
import { PlusCircle } from "lucide-react"
import { searchParamsCache } from "@/shared/lib/search-params"
import { MemesList } from "@/widgets/memes-list"
import CardsSkeleton from "@/widgets/memes-list/ui/cards-skeleton"
import { SearchInput } from "@/features/search-memes"
import type { SearchParams } from "nuqs/server"
import { getImageDimensions } from "@/shared/lib/utils"

export const metadata: Metadata = {
	title: "Мемы - AI Memes",
	description: "Просматривайте и создавайте смешные мемы с помощью ИИ",
}

async function GetAllMemes() {
	const { page, search } = searchParamsCache.all()

	const data = await apiClient.get<MemeListResponse>(API_ROUTES.MEMES.LIST, {
		params: {
			page,
			pageSize: 30,
			...(search && { search }),
		},
	})

	const transformedData = await getImageDimensions(data, true)
	return <MemesList initialData={transformedData} search={search} />
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
				<h2 className="text-xl font-bold">Memes</h2>
				<SearchInput />
				<Button>
					<PlusCircle />
				</Button>
			</header>
			<main className="bg-background relative flex-1 overflow-hidden px-4">
				<Suspense
					key={suspenseKey}
					fallback={<CardsSkeleton columns={4} />}
				>
					<GetAllMemes />
				</Suspense>
			</main>
		</div>
	)
}
