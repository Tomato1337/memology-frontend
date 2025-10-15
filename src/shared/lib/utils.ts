import type { MemeListResponse } from "@/entities/meme/model/meme.types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import sizeOf from "image-size"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getImageDimensions = async (
	items: MemeListResponse,
	server = false,
) => {
	const transformedData = (await Promise.all(
		items.data.map(async (item) => {
			try {
				if (server) {
					const resImg = await fetch(item.imageUrl)
					const arrayBuffer = await resImg.arrayBuffer()
					const buffer = Buffer.from(arrayBuffer)

					const dimensions = sizeOf(buffer)

					return {
						...item,
						width: dimensions.width || 300,
						height: dimensions.height || 500,
					}
				} else {
					const resImg = await fetch(item.imageUrl)
					const data = await resImg.blob()
					const img = new Image()
					img.src = URL.createObjectURL(data)
					return new Promise((resolve) => {
						img.onload = () => {
							const { width, height } = img
							URL.revokeObjectURL(img.src)
							resolve({
								...item,
								width,
								height,
							})
						}
						img.onerror = () => {
							URL.revokeObjectURL(img.src)
							throw new Error("Error loading image")
						}
					})
				}
			} catch (err) {
				console.error("Error loading image:", err)
				return { ...item, width: 0, height: 0 }
			}
		}),
	)) as unknown as MemeListResponse["data"]

	return {
		...items,
		data: transformedData,
	}
}

export const customToast = (
	message: string,
	type: "success" | "error" | "info",
) => {
	const colors = {
		success: {
			background: "#34A200",
			text: "white",
		},
		error: {
			background: "#FF3333",
			text: "white",
		},
		info: {
			background: "#0095BE",
			text: "black",
		},
	}

	return toast(message, {
		duration: 4000,
		style: {
			background: colors[type].background,
			color: colors[type].text,
		},
	})
}
