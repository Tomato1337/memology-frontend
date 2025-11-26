import { Card, CardContent, CardFooter } from "@/shared/ui/card"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Badge } from "@/shared/ui/badge"
import { IMemeDTO } from "../model/types"

interface MemeCardProps {
	meme: IMemeDTO
	onClick?: (meme: IMemeDTO) => void
}

export function MemeCard({ meme, onClick }: MemeCardProps) {
	const isProcessing =
		meme.status.toLowerCase() === "pending" ||
		meme.status.toLowerCase() === "processing"
	const isFailed = meme.status.toLowerCase() === "failed"

	return (
		<Card
			className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
			onClick={() => onClick?.(meme)}
		>
			<CardContent className="relative aspect-square p-0">
				{meme.imageUrl && meme.status === "completed" ? (
					<Image
						src={meme.imageUrl}
						alt={meme.title || "Meme"}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				) : (
					<div className="bg-muted flex h-full w-full items-center justify-center">
						<Badge variant={isFailed ? "destructive" : "secondary"}>
							{isProcessing ? "Генерация..." : "Ошибка"}
						</Badge>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex flex-col items-start gap-2 p-4">
				<p className="font-montserrat line-clamp-2 text-sm font-medium">
					{meme.title || "Без текста"}
				</p>
				<div className="flex w-full items-center justify-between">
					<p className="text-muted-foreground font-montserrat text-xs">
						{formatDistanceToNow(
							new Date(meme.createdAt || new Date()),
							{
								addSuffix: true,
								locale: ru,
							},
						)}
					</p>
					{meme.style && (
						<Badge variant="outline" className="text-xs">
							{meme.style}
						</Badge>
					)}
				</div>
			</CardFooter>
		</Card>
	)
}
