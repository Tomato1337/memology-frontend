"use client"

import useIntersectionObserver from "@/hooks/use-intersection-observer"
import { API_ROUTES, apiClient, type MemeListResponse } from "@/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
import Image from "next/image"
import React, { useEffect, useRef } from "react"
import CardsSkeleton from "./cards-skeleton"
import { useVirtualizer } from "@tanstack/react-virtual"
import { getImageDimensions } from "@/lib/utils"
import { useElementSize } from "@/hooks"

interface AllMemesCardsProps {
	initialData: MemeListResponse
	search: string
}

function AllMemesCards({ initialData, search }: AllMemesCardsProps) {
	const { data, isFetching, fetchNextPage, hasNextPage } =
		useInfiniteQuery<MemeListResponse>({
			queryKey: ["memes", search],
			queryFn: async (context) => {
				const data = await apiClient.get<MemeListResponse>(
					API_ROUTES.MEMES.LIST,
					{
						params: {
							page: context.pageParam as number,
							pageSize: 30,
							search,
						},
					},
				)
				const transformedData = await getImageDimensions(data, false)
				return transformedData
			},
			initialData: {
				pages: [initialData],
				pageParams: [1],
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				const morePagesExist =
					lastPage.page * lastPage.pageSize < lastPage.total
				if (!morePagesExist) return undefined
				return allPages.length + 1
			},
		})

	const allMemes = data ? data.pages.flatMap((page) => page.data) : []

	const dividerForInfScroll = useRef<HTMLDivElement>(null)
	const parentRef = useRef<HTMLDivElement>(null)
	const { value } = useElementSize(parentRef)
	const [delayWindowSize, setDelayWindowSize] = React.useState(value)

	useEffect(() => {
		setDelayWindowSize(value)
	}, [value])

	const LANES = React.useMemo(() => {
		const width = delayWindowSize.width || 1200
		if (width < 640) return 1 // mobile
		if (width < 768) return 2 // tablet
		if (width < 1024) return 3 // small desktop
		if (width < 1280) return 4 // medium desktop
		if (width < 1536) return 5 // large desktop
		return 6 // xl desktop (>= 1536px)
	}, [delayWindowSize.width])

	useIntersectionObserver((entries) => {
		if (entries[0].isIntersecting && hasNextPage && !isFetching) {
			fetchNextPage()
		}
	}, dividerForInfScroll)

	const GAP = 8 // отступ между карточками в пикселях
	console.log("parentRef =", parentRef.current)
	const rowVirtualizer = useVirtualizer({
		count:
			data?.pages.reduce((acc, page) => acc + page.data.length, 0) || 0,
		getScrollElement: () => parentRef.current,
		estimateSize: (i) => {
			const meme = allMemes[i]
			if (!meme?.width || !meme?.height) return 400
			const aspectRatio = meme.width / meme.height
			const containerWidth = parentRef.current?.clientWidth || 1200
			const totalGapWidth = GAP * (LANES + 1)
			const columnWidth = (containerWidth - totalGapWidth) / LANES
			return columnWidth / aspectRatio + GAP
		},
		overscan: 5,
		lanes: LANES,
	})

	React.useEffect(() => {
		rowVirtualizer.measure()
	}, [LANES, delayWindowSize])

	if (isFetching && !data) {
		return <CardsSkeleton />
	}

	return (
		<div className="mt-4 h-screen w-full overflow-auto" ref={parentRef}>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: "100%",
					position: "relative",
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const meme = allMemes[virtualRow.index]
					if (!meme) return null

					const containerWidth =
						parentRef.current?.clientWidth || 1200
					const totalGapWidth = GAP * (LANES + 1)
					const columnWidth = (containerWidth - totalGapWidth) / LANES
					const aspectRatio = meme.width / meme.height
					const scaledHeight = columnWidth / aspectRatio

					const leftPosition =
						GAP + virtualRow.lane * (columnWidth + GAP)

					return (
						<div
							key={virtualRow.index}
							style={{
								position: "absolute",
								top: 0,
								left: `${leftPosition}px`,
								width: `${columnWidth}px`,
								height: `${scaledHeight}px`,
								transform: `translateY(${virtualRow.start}px)`,
								padding: `0 0 ${GAP}px 0`, // нижний отступ для gap между строками
							}}
							className="relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-2xl"
						>
							<div className="h-full w-full">
								<Image
									src={meme.imageUrl}
									alt={meme.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
									className="object-cover transition-transform duration-300 hover:scale-105"
								/>
							</div>
						</div>
					)
				})}
			</div>

			{isFetching && hasNextPage && (
				<div className="mt-4 w-full">
					<CardsSkeleton columns={LANES} />
				</div>
			)}
			<div className="h-1 w-full" ref={dividerForInfScroll}></div>
		</div>
	)
}

export default AllMemesCards
