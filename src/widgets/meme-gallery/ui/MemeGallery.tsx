"use client"

import { useMyMemesInfinite } from "@/entities/meme"
import { MemeCard } from "@/entities/meme"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Skeleton } from "@/shared/ui/skeleton"
import { groupMemesByDate } from "@/shared/lib/group-by-date"
import { useRef } from "react"
import useIntersectionObserver from "@/shared/hooks/use-intersection-observer"
import { cn } from "@/shared/lib/utils"

export function MemeGallery({
	isGalleryPage = false,
}: {
	isGalleryPage?: boolean
}) {
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useMyMemesInfinite(20)

	const loadMoreRef = useRef<HTMLDivElement>(null)

	// Infinity scroll observer
	useIntersectionObserver(
		(entries) => {
			const entry = entries[0]
			if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage()
			}
		},
		loadMoreRef,
		{ threshold: 0.1 },
	)

	// Объединяем все мемы из всех страниц
	const allMemes = data?.pages.flatMap((page) => page.data) ?? []

	// Группируем по датам
	const groupedMemes = groupMemesByDate(allMemes)

	return (
		<Card className="h-full w-full">
			{!isGalleryPage && (
				<CardHeader>
					<CardTitle className="font-pixelify text-2xl">
						Мои мемы
					</CardTitle>
				</CardHeader>
			)}
			<CardContent className="h-full p-0">
				<ScrollArea className="h-full rounded-lg px-6">
					{isLoading ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton
									key={i}
									className="aspect-square rounded-lg"
								/>
							))}
						</div>
					) : allMemes.length > 0 ? (
						<div className="space-y-8">
							{groupedMemes.map((group) => (
								<div key={group.label} className="space-y-4">
									<h3 className="font-pixelify text-muted-foreground text-lg font-semibold">
										{group.label}
									</h3>
									<div
										className={cn(
											"grid gap-4",
											isGalleryPage
												? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
												: "grid-cols-1 md:grid-cols-2",
										)}
									>
										{group.memes.map((meme) => (
											<MemeCard
												key={meme.id}
												meme={meme}
											/>
										))}
									</div>
								</div>
							))}

							{/* Infinity scroll trigger */}
							<div ref={loadMoreRef} className="h-4 w-full" />

							{/* Loading indicator */}
							{isFetchingNextPage && (
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{Array.from({ length: 4 }).map((_, i) => (
										<Skeleton
											key={i}
											className="aspect-square rounded-lg"
										/>
									))}
								</div>
							)}
						</div>
					) : (
						<div className="flex h-64 items-center justify-center">
							<p className="text-muted-foreground font-montserrat">
								У вас пока нет созданных мемов
							</p>
						</div>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
