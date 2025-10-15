import { Suspense } from "react"
import { apiClient } from "@/shared/api/client"
import { API_ROUTES } from "@/shared/config/routes"
import type { MemeListResponse } from "@/shared/types/meme"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { searchParamsCache } from "@/lib/search-params"
import AllMemesCards from "@/components/all-memes-cards"
import CardsSkeleton from "@/components/cards-skeleton"
import { SearchInput } from "@/components/search-input"
import type { SearchParams } from "nuqs/server"

async function GetAllMemes() {
	const { page, search } = searchParamsCache.all()

	const data = await apiClient.get<MemeListResponse>(API_ROUTES.MEMES.LIST, {
		params: {
			page,
			pageSize: 30,
			...(search && { search }),
		},
	})

	// ✅ БЕЗ getImageDimensions - размеры будут загружены на клиенте асинхронно
	return <AllMemesCards initialData={data} search={search} />
}

export default async function Home({
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
