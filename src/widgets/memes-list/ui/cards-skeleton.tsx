import React from "react"
import { Skeleton } from "../../../shared/ui/skeleton"
import { cn } from "@/shared/lib/utils"

const pickRandomTailwindHeight = () => {
	const heights = ["h-56", "h-64", "h-72", "h-96"]
	return heights[Math.floor(Math.random() * heights.length)]
}

const CardsSkeleton = ({ columns }: { columns?: number }) => {
	const skeletonData = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => (
			<Skeleton
				key={index}
				className={`${pickRandomTailwindHeight()} relative mb-2 w-full break-inside-avoid`}
			/>
		))

	return (
		<div
			// tailwind не поддерживает динамические классы, поэтому используем cn
			className={cn(`w-full gap-2`, {
				"columns-1": columns === 1,
				"columns-2": columns === 2,
				"columns-3": columns === 3,
				"columns-4": columns === 4,
				"columns-5": columns === 5,
				"columns-6": columns === 6,
			})}
		>
			{skeletonData}
		</div>
	)
}

export default CardsSkeleton
