"use client"

import Image from "next/image"
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Download, FrownIcon, Loader2Icon, X } from "lucide-react"
import { IMemeDTO } from "../model/types"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Badge } from "@/shared/ui/badge"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"

interface ImageViewerProps {
	meme: IMemeDTO | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ImageViewer({ meme, open, onOpenChange }: ImageViewerProps) {
	const [imageError, setImageError] = useState(false)

	useEffect(() => {
		if (open) {
			setImageError(false)
		}
	}, [open, meme])

	if (!meme) return null

	const handleDownload = async () => {
		if (!meme.imageUrl) return

		try {
			const response = await fetch(meme.imageUrl)
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `meme-${meme.id}.jpg`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error("Failed to download image:", error)
		}
	}

	const isProcessing =
		meme.status === "pending" ||
		meme.status === "started" ||
		meme.status === "processing"

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-h-[90vh] w-auto max-w-[90vw] min-w-[25vw] gap-2 overflow-y-auto p-0"
				showCloseButton={false}
			>
				<VisuallyHidden>
					<DialogTitle>{meme.title || "Мем"}</DialogTitle>
					<DialogDescription>Просмотр мема</DialogDescription>
				</VisuallyHidden>

				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
					onClick={() => onOpenChange(false)}
				>
					<X className="size-4" />
				</Button>

				<div className="bg-accent flex w-full items-center justify-center">
					{isProcessing ? (
						<div className="bg-muted flex h-[50vh] w-full flex-col items-center justify-center gap-2">
							<Loader2Icon className="text-muted-foreground size-12 animate-spin" />
							<p className="text-muted-foreground font-montserrat text-xl">
								Генерация...
							</p>
						</div>
					) : meme.imageUrl && !imageError ? (
						<img
							src={meme.imageUrl}
							alt={meme.title || "Meme"}
							className="max-h-[70vh] max-w-full object-contain"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="bg-muted flex h-[50vh] w-full flex-col items-center justify-center gap-2">
							<FrownIcon className="text-muted-foreground size-32" />
							<p className="text-muted-foreground font-montserrat text-xl">
								Изображение не доступно
							</p>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between gap-4 p-4">
					<Avatar>
						<AvatarFallback>
							{meme.author.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-2 flex-col gap-1">
						<p className="font-montserrat text-sm font-medium">
							{meme.title || "Без текста"}
						</p>
						<div className="flex items-center gap-2">
							<p className="text-muted-foreground text-xs">
								{formatDistanceToNow(
									new Date(meme.createdAt || new Date()),
									{
										addSuffix: true,
										locale: ru,
									},
								)}
							</p>
						</div>
						{meme.style && (
							<Badge variant="outline" className="w-fit text-xs">
								{meme.style}
							</Badge>
						)}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={handleDownload}
						disabled={!meme.imageUrl}
						className="gap-2"
					>
						<Download className="size-4" />
						Скачать
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
