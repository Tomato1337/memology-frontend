"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGenerateMeme } from "../model/mutations"
import {
	createMemeSchema,
	type CreateMemeFormData,
	GenerationModel,
} from "../model/schema"
import { useMemeStyles, usePendingMemes, memeKeys } from "@/entities/meme"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

export function CreateMemeForm() {
	const [pendingMemeIds, setPendingMemeIds] = useState<string[]>([])
	const queryClient = useQueryClient()

	// Track which memes we've already shown notifications for
	const notifiedMemeIds = useRef<Set<string>>(new Set())

	const PENDING_MEME_IDS_KEY = "pending_meme_ids"

	// Restore pending IDs from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(PENDING_MEME_IDS_KEY)
			if (saved) {
				const ids = JSON.parse(saved)
				if (Array.isArray(ids) && ids.length > 0) {
					setPendingMemeIds(ids)
				}
			}
		} catch {
			// Invalid JSON, ignore
		}
	}, [])

	// Save to localStorage when pending IDs change
	useEffect(() => {
		if (pendingMemeIds.length > 0) {
			localStorage.setItem(
				PENDING_MEME_IDS_KEY,
				JSON.stringify(pendingMemeIds),
			)
		} else {
			localStorage.removeItem(PENDING_MEME_IDS_KEY)
		}
	}, [pendingMemeIds])

	// Fetches
	const { data: styles, isLoading: stylesLoading } = useMemeStyles()

	// Mutations
	const { mutate: generate, isPending: isGenerating } = useGenerateMeme()

	// Poll all pending memes status
	const pendingMemesQueries = usePendingMemes(pendingMemeIds)

	// Handle completed/failed memes
	useEffect(() => {
		pendingMemesQueries.forEach((query, index) => {
			const meme = query.data
			const memeId = pendingMemeIds[index]

			if (!meme || !memeId) return
			if (notifiedMemeIds.current.has(memeId)) return

			if (meme.status === "completed") {
				notifiedMemeIds.current.add(memeId)
				toast.success("Мем успешно создан!")
				setPendingMemeIds((prev) => prev.filter((id) => id !== memeId))
				queryClient.invalidateQueries({
					queryKey: memeKeys.my(),
				})
			} else if (meme.status === "failed") {
				notifiedMemeIds.current.add(memeId)
				toast.error("Ошибка при генерации мема")
				setPendingMemeIds((prev) => prev.filter((id) => id !== memeId))
			}
		})
	}, [pendingMemesQueries, pendingMemeIds, queryClient])

	// React Hook Form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CreateMemeFormData>({
		resolver: zodResolver(createMemeSchema),
		defaultValues: {
			prompt: "",
			style: undefined,
			is_public: true,
			generationModel: GenerationModel.AI,
		},
	})

	const selectedStyle = watch("style")
	const isPublic = watch("is_public")
	const selectedModel = watch("generationModel")

	// Submit handler
	const onSubmit = (data: CreateMemeFormData) => {
		const payload = {
			...data,
			style: data.style || undefined,
		}

		generate(payload, {
			onSuccess: (meme) => {
				toast.success("Генерация начата!")
				if (meme.id) {
					setPendingMemeIds((prev) => [...prev, meme.id!])
				}
			},
			onError: (error) => {
				toast.error("Ошибка генерации: " + error.message)
			},
		})
	}

	return (
		<Card className="w-full">
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="prompt">Текст мема</Label>
						<Input
							id="prompt"
							{...register("prompt")}
							placeholder="Введите текст для мема..."
							disabled={isGenerating}
							className="font-montserrat"
						/>
						{errors.prompt && (
							<p className="text-destructive text-sm">
								{errors.prompt.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="generationModel">
							Модель генерации
						</Label>
						<Select
							value={selectedModel}
							onValueChange={(value: "ai" | "template") =>
								setValue("generationModel", value)
							}
							disabled={isGenerating}
						>
							<SelectTrigger id="generationModel">
								<SelectValue placeholder="Выберите модель" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ai">AI генерация</SelectItem>
								<SelectItem value="template">
									Шаблоны
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{selectedModel === GenerationModel.AI && (
						<div className="space-y-2">
							<Label htmlFor="style">Стиль (опционально)</Label>
							<Select
								value={selectedStyle}
								onValueChange={(value) =>
									setValue("style", value)
								}
								disabled={isGenerating || stylesLoading}
							>
								<SelectTrigger id="style">
									<SelectValue placeholder="Выберите стиль" />
								</SelectTrigger>
								<SelectContent>
									{styles?.map((style) => (
										<SelectItem key={style} value={style}>
											{style}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="flex items-center space-x-2">
						<Checkbox
							id="is_public"
							checked={isPublic}
							onCheckedChange={(checked) =>
								setValue("is_public", Boolean(checked))
							}
							disabled={isGenerating}
						/>
						<Label
							htmlFor="is_public"
							className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Публичный мем
						</Label>
					</div>

					<Button
						type="submit"
						disabled={isGenerating}
						className="font-pixelify w-full cursor-pointer"
					>
						{isGenerating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Отправка...
							</>
						) : (
							"Создать мем"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
