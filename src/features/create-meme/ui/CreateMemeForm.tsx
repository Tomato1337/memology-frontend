"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGenerateMeme } from "../model/mutations"
import { createMemeSchema, type CreateMemeFormData } from "../model/schema"
import { useMemeStyles, useMemeStatus, memeKeys } from "@/entities/meme"
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
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"

export function CreateMemeForm() {
	const [generatedMemeId, setGeneratedMemeId] = useState<string | null>(null)
	const queryClient = useQueryClient()

	// Fetches
	const { data: styles, isLoading: stylesLoading } = useMemeStyles()

	// Mutations
	const { mutate: generate, isPending: isGenerating } = useGenerateMeme()

	const MEME_GENERATION_ID_KEY = "meme_generation_id"

	// Restore from localStorage on mount
	useEffect(() => {
		const savedId = localStorage.getItem(MEME_GENERATION_ID_KEY)
		if (savedId) {
			setGeneratedMemeId(savedId)
		}
	}, [])

	// Save to localStorage when ID changes
	useEffect(() => {
		if (generatedMemeId) {
			localStorage.setItem(MEME_GENERATION_ID_KEY, generatedMemeId)
		} else {
			localStorage.removeItem(MEME_GENERATION_ID_KEY)
		}
	}, [generatedMemeId])

	// Status polling (only when meme is generated)
	const {
		data: generatedMeme,
		isLoading: isPolling,
		isError: isPollingError,
	} = useMemeStatus(generatedMemeId || "", !!generatedMemeId)

	// Handle polling errors (e.g. 404 if ID is invalid/expired)
	useEffect(() => {
		if (isPollingError) {
			setGeneratedMemeId(null)
			localStorage.removeItem(MEME_GENERATION_ID_KEY)
			toast.error("Не удалось восстановить статус генерации")
		}
	}, [isPollingError])

	// React Hook Form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<CreateMemeFormData>({
		resolver: zodResolver(createMemeSchema),
		defaultValues: {
			prompt: "",
			style: undefined,
			is_public: true,
		},
	})

	const selectedStyle = watch("style")
	const isPublic = watch("is_public")

	// Submit handler
	const onSubmit = (data: CreateMemeFormData) => {
		const payload = {
			...data,
			style: data.style || undefined,
		}

		generate(payload, {
			onSuccess: (meme) => {
				toast.success("Генерация начата!")
				setGeneratedMemeId(meme.id || null)
			},
			onError: (error) => {
				toast.error("Ошибка генерации: " + error.message)
			},
		})
	}

	// Reset when meme is completed
	useEffect(() => {
		if (generatedMeme?.status === "completed") {
			toast.success("Мем успешно создан!")
			setGeneratedMemeId(null)
			queryClient.invalidateQueries({
				queryKey: memeKeys.my(),
			})
			reset()
		} else if (generatedMeme?.status === "failed") {
			toast.error("Ошибка при генерации мема")
			setGeneratedMemeId(null)
		}
	}, [generatedMeme?.status, reset, queryClient])

	const isLoading = isGenerating || isPolling

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
							disabled={isLoading}
							className="font-montserrat"
						/>
						{errors.prompt && (
							<p className="text-destructive text-sm">
								{errors.prompt.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="style">Стиль (опционально)</Label>
						<Select
							value={selectedStyle}
							onValueChange={(value) => setValue("style", value)}
							disabled={isLoading || stylesLoading}
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

					<div className="flex items-center space-x-2">
						<Checkbox
							id="is_public"
							checked={isPublic}
							onCheckedChange={(checked) =>
								setValue("is_public", Boolean(checked))
							}
							disabled={isLoading}
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
						disabled={isLoading || !!generatedMemeId}
						className="font-pixelify w-full cursor-pointer"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isPolling ? "Создаём мем..." : "Отправка..."}
							</>
						) : (
							"Создать мем"
						)}
					</Button>

					{generatedMeme &&
						generatedMeme.image_url &&
						generatedMeme.status === "completed" && (
							<div className="mt-6 space-y-4">
								<h3 className="font-pixelify text-lg">
									Результат:
								</h3>
								<div className="relative aspect-square w-full overflow-hidden rounded-lg border">
									<Image
										src={generatedMeme.image_url}
										alt="Сгенерированный мем"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						)}
				</form>
			</CardContent>
		</Card>
	)
}
