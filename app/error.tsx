"use client"

import { Button } from "@/shared/ui/button"
import { FrownIcon } from "lucide-react"

export default function Error({ error }: { error: Error }) {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-2">
			<FrownIcon className="size-32" />
			<h1 className="font-pixelify-sans text-2xl font-bold">Ошибка</h1>
			<p className="text-xl">{error.message}</p>
			<Button
				className="cursor-pointer"
				onClick={() => window.location.reload()}
			>
				Обновить
			</Button>
		</div>
	)
}
