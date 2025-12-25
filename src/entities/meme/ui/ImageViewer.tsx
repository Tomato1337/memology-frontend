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

interface ImageViewerProps {
	meme: IMemeDTO | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ImageViewer({ meme, open, onOpenChange }: ImageViewerProps) {
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-h-[90vh] max-w-4xl overflow-hidden p-0"
				showCloseButton={false}
			>
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
					onClick={() => onOpenChange(false)}
				>
					<X className="size-4" />
				</Button>

				<div className="relative flex items-center justify-center bg-black">
					{meme.status === "pending" ||
					meme.status === "started" ||
					meme.status === "processing" ? (
						<div className="flex h-[50vh] w-full flex-col items-center justify-center gap-2">
							<Loader2Icon className="text-muted-foreground size-24 animate-spin" />
							<p className="text-muted-foreground font-montserrat text-xl">
								Генерация...
							</p>
						</div>
					) : meme.imageUrl ? (
						<Image
							src={meme.imageUrl}
							alt={meme.title || "Meme"}
							width={1200}
							height={1200}
							className="max-h-[70vh] w-auto object-contain"
							priority
						/>
					) : (
						<div className="flex h-[50vh] w-full flex-col items-center justify-center gap-2">
							<FrownIcon className="text-muted-foreground size-32" />
							<p className="text-muted-foreground font-montserrat text-xl">
								Изображение не доступно
							</p>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between gap-4 p-4">
					<div className="flex flex-col gap-1">
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
							{meme.style && (
								<Badge variant="outline" className="text-xs">
									{meme.style}
								</Badge>
							)}
						</div>
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
