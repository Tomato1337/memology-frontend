import { IMemeDTO } from "@/entities/meme"
import { useGetUser } from "@/entities/user/api/useGetUser"
import { cn } from "@/shared/lib/utils"
import { AvatarFallback, AvatarImage, Avatar } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { FrownIcon, Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface MemeCardProps extends React.HTMLAttributes<HTMLDivElement> {
	virtualRow: any
	leftPosition: number
	columnWidth: number
	scaledHeight: number
	GAP: number
	meme: IMemeDTO
}

export const MemeCard = ({
	virtualRow,
	leftPosition,
	columnWidth,
	scaledHeight,
	GAP,
	className,
	meme,
	...props
}: MemeCardProps) => {
	const [imageError, setImageError] = useState(!meme.imageUrl)
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: `${leftPosition}px`,
				width: `${columnWidth}px`,
				height: `${scaledHeight}px`,
				transform: `translateY(${virtualRow.start}px)`,
				padding: `0 0 ${GAP}px 0`,
			}}
			className={cn(
				"group relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-2xl",
				className,
			)}
			{...props}
		>
			{!imageError && meme.imageUrl ? (
				<div className="h-full w-full">
					<Image
						src={meme.imageUrl}
						alt={meme.title}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						priority={virtualRow.index < 6}
						loading={virtualRow.index < 6 ? undefined : "lazy"}
						onError={() => setImageError(true)}
					/>
				</div>
			) : (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<FrownIcon className="text-muted-foreground/50 size-12" />
					<p className="text-muted-foreground/50 mt-2 text-center text-sm">
						Изображение не загрузилось
					</p>
				</div>
			)}

			<div className="absolute right-0 bottom-0 left-0 flex max-h-[35%] flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-all group-hover:opacity-100">
				<div className="flex items-center gap-4">
					<Avatar>
						<AvatarFallback>
							{meme.author.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					<h3 className="line-clamp-3 text-lg font-bold text-white">
						{meme.title}
					</h3>
				</div>
			</div>
		</div>
	)
}
