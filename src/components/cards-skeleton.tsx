import React from 'react'
import { Skeleton } from './ui/skeleton'

const pickRandomTailwindHeight = () => {
    const heights = ['h-56', 'h-64', 'h-72', 'h-96']
    return heights[Math.floor(Math.random() * heights.length)]
}

const CardsSkeleton = () => {
    const skeletonData = Array.from({ length: 30 })
        .fill(0)
        .map((_, index) => (
            <Skeleton
                key={index}
                className={`${pickRandomTailwindHeight()} w-full mb-2 relative break-inside-avoid`}
            />
        ))

    return (
        <div className="2xl:columns-4 xl:columns-3 lg:columns-2 md:columns-1 w-full gap-2">
            {skeletonData}
        </div>
    )
}

export default CardsSkeleton
