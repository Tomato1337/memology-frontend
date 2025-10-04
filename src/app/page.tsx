import { Suspense, useEffect, useState } from "react"
import { apiClient } from "@/shared/api/client"
import { API_ROUTES } from "@/shared/config/routes"
import type { MemeListResponse } from "@/shared/types/meme"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { loadSearchParams } from "@/lib/search-params"
import AllMemesCards from "@/components/all-memes-cards"
import CardsSkeleton from "@/components/cards-skeleton"

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>
}) {
	const { page, search = "" } = await searchParams

	console.log(page, search)
	const data = await apiClient.get<MemeListResponse>(API_ROUTES.MEMES.LIST, {
		params: {
			page: page || 1,
			pageSize: 30,
		},
	})

	return (
		<div className="flex min-h-screen max-w-full flex-col">
			<header className="bg-background sticky top-0 z-10 flex items-center gap-4 border-b p-2">
				<SidebarTrigger className="size-12" />
				<Input className="flex-1" />
				<Button>
					<PlusCircle />
				</Button>
			</header>
			<main className="bg-background relative flex-1 overflow-x-hidden p-4">
				<h1 className="mb-4 text-2xl font-bold">Memes</h1>
				<Suspense fallback={<CardsSkeleton />}>
					<AllMemesCards initialData={data} search={search} />
				</Suspense>
			</main>
		</div>
	)
}
