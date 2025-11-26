"use client"

import useIntersectionObserver from "@/shared/hooks/use-intersection-observer"
import { apiClient } from "@/shared/api/client"
import { API_ROUTES } from "@/shared/config/routes"
import { useInfiniteQuery } from "@tanstack/react-query"
import Image from "next/image"
import React, { useEffect, useRef } from "react"
import CardsSkeleton from "@/widgets/memes-list/ui/cards-skeleton"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useElementSize } from "@/shared/hooks"
import { MemeCard } from "./MemeCard"
import { IMemeListDTO, MemesListDTO } from "@/entities/meme"
import { MemeListResponse } from "@/entities/meme/model/types"

interface MemesListProps {
	initialData: IMemeListDTO
	search: string
}

export function MemesList({ initialData, search }: MemesListProps) {
	const { data, isFetching, isLoading, fetchNextPage, hasNextPage } =
		useInfiniteQuery<IMemeListDTO>({
			queryKey: ["memes", search],
			queryFn: async (context) => {
				const signal = context.signal

				const data = await apiClient.get<MemeListResponse>(
					API_ROUTES.MEMES.LIST,
					{
						params: {
							page: context.pageParam as number,
							limit: 30,
							...(search && { search }),
						},
						signal,
					},
				)
				const transformedData = MemesListDTO.fromApi(data)
				return transformedData
			},
			initialData: {
				pages: [initialData],
				pageParams: [1],
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				const morePagesExist =
					lastPage.page * lastPage.limit < lastPage.total
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
		if (width < 768) return 1 // tablet
		if (width < 1024) return 2 // small desktop
		if (width < 1280) return 3 // medium desktop
		if (width < 1536) return 4 // large desktop
		return 5 // xl desktop (>= 1536px)
	}, [delayWindowSize.width])

	useIntersectionObserver((entries) => {
		const entry = entries[0]
		if (entry?.isIntersecting && hasNextPage && !isFetching) {
			fetchNextPage()
		}
	}, dividerForInfScroll)

	const GAP = 8 // gap between cards in pixels
	const rowVirtualizer = useVirtualizer({
		count:
			data?.pages.reduce((acc, page) => acc + page.data.length, 0) || 0,
		getScrollElement: () => parentRef.current,
		estimateSize: (i: number) => {
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
	}, [LANES, delayWindowSize, rowVirtualizer])

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
				{rowVirtualizer.getVirtualItems().map((virtualRow: any) => {
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
						<MemeCard
							virtualRow={virtualRow}
							leftPosition={leftPosition}
							columnWidth={columnWidth}
							scaledHeight={scaledHeight}
							GAP={GAP}
							meme={meme}
							key={virtualRow.index}
						/>
					)
				})}
			</div>

			{((isFetching && hasNextPage) || isLoading) && (
				<div className="mt-4 w-full">
					<CardsSkeleton columns={LANES} />
				</div>
			)}
			<div className="h-1 w-full" ref={dividerForInfScroll}></div>
		</div>
	)
}
