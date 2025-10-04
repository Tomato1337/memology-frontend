"use client"

import useIntersectionObserver from "@/hooks/use-intersection-observer"
import {
	useContainerPosition,
	usePositioner,
	useResizeObserver,
	useMasonry,
	useScroller,
} from "masonic"
import { API_ROUTES, apiClient, type MemeListResponse } from "@/shared"
import { useInfiniteQuery } from "@tanstack/react-query"
import Image from "next/image"
import React, { useDeferredValue, useEffect, useRef, useState } from "react"
import CardsSkeleton from "./cards-skeleton"
import { useElementSize, useWindowSize } from "@/hooks"
import { Masonry } from "react-plock"
interface AllMemesCardsProps {
	initialData: MemeListResponse
	search: string
}

const sleep = (time: number) =>
	new Promise((resolve) => {
		setTimeout(() => resolve(true), time)
	})

function AllMemesCards({ initialData, search }: AllMemesCardsProps) {
	const containerRef = useRef(null)
	const { data, isFetching, error, fetchNextPage, hasNextPage } =
		useInfiniteQuery<MemeListResponse>({
			queryKey: ["memes", search],
			queryFn: async ({ pageParam = 1 }) => {
				// await sleep(3000)
				return apiClient.get<MemeListResponse>(API_ROUTES.MEMES.LIST, {
					params: {
						page: pageParam,
						pageSize: 30,
						search,
					},
				})
			},
			staleTime: 0,
			gcTime: 0,
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

	// const { width: windowWidth, height: windowHeight } = useWindowSize()
	// const { value } = useElementSize(containerRef)
	// const [viewContainerSize, setViewContainerSize] = useState<
	// 	| {
	// 			elemWidth: number
	// 			elemHeight: number
	// 			windowWidth: number
	// 			windowHeight: number
	// 	  }
	// 	| undefined
	// >()

	// console.log(
	// 	`Window width = ${windowWidth}; Window height = ${windowHeight} \n\n Elem width = ${value.width}; Elem height = ${value.height}`,
	// )

	// useEffect(() => {
	// 	if (
	// 		(value && value.width && value.height) ||
	// 		(windowWidth && windowHeight)
	// 	) {
	// 		const timeout = setTimeout(() => {
	// 			setViewContainerSize({
	// 				elemWidth: value.width,
	// 				elemHeight: value.height,
	// 				windowWidth,
	// 				windowHeight,
	// 			})
	// 		}, 100)
	// 		return () => clearTimeout(timeout)
	// 	}
	// }, [value, windowWidth, windowHeight])

	// const { offset, width } = useContainerPosition(containerRef, [
	// 	viewContainerSize?.windowHeight,
	// 	viewContainerSize?.windowWidth,
	// ])

	// const positioner = usePositioner({
	// 	width,
	// 	columnWidth: 400,
	// 	columnGutter: 8,
	// })

	// const { scrollTop, isScrolling } = useScroller(offset)

	// const resizeObserver = useResizeObserver(positioner)

	const dividerForInfScroll = useRef(null)

	// const masonryGrid = useMasonry({
	// 	positioner,
	// 	resizeObserver,
	// 	items: allMemes,
	// 	height: viewContainerSize?.elemHeight || 800,
	// 	scrollTop,
	// 	isScrolling,
	// 	overscanBy: 5,
	// 	render: ({ data: meme }) => (
	// 		<div className="content-auto relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-2xl">
	// 			<Image
	// 				src={meme.imageUrl}
	// 				alt={meme.title}
	// 				width={320}
	// 				height={400}
	// 				sizes="320px"
	// 				className="h-auto w-full transition-transform duration-300 hover:scale-105"
	// 			/>
	// 		</div>
	// 	),
	// })

	useIntersectionObserver((entries) => {
		if (entries[0].isIntersecting && hasNextPage && !isFetching) {
			fetchNextPage()
		}
	}, dividerForInfScroll)

	if (isFetching && !data) {
		return <CardsSkeleton />
	}

	return (
		<>
			{/* <Masonry
				items={allMemes}
				// Adds 8px of space between the grid cells
				columnGutter={8}
				// Sets the minimum column width to 172px
				columnWidth={400}
				// // Pre-renders 5 windows worth of content
				// overscanBy={5}
				render={({ data: meme }) => (
					<div className="content-auto relative max-h-96 cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-2xl">
						<Image
							src={meme.imageUrl}
							alt={meme.title}
							width={320}
							height={400}
							sizes="320px"
							className="h-auto w-full transition-transform duration-300 hover:scale-105"
						/>
					</div>
				)}
			/> */}
			<Masonry
				items={allMemes}
				className="gap-2"
				config={{
					columns: [1, 2, 3, 4, 5],
					gap: [24, 12, 6],
					media: [640, 768, 1024, 1280, 1440],
					useBalancedLayout: true,
				}}
				render={(meme, idx) => (
					<div
						className="content-auto relative mb-2 max-h-96 cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-2xl"
						style={{ containIntrinsicSize: "auto 400px" }}
					>
						<Image
							src={meme.imageUrl}
							alt={meme.title}
							width={320}
							height={400}
							sizes="320px"
							className="h-auto w-full transition-transform duration-300 hover:scale-105"
						/>
					</div>
				)}
			/>
			{/* <div ref={containerRef}>
			</div> */}
			{isFetching && hasNextPage && (
				<div className="mt-4 w-full">
					<CardsSkeleton />
				</div>
			)}
			<div className="h-1 w-full" ref={dividerForInfScroll}></div>
		</>
	)
}

export default AllMemesCards
