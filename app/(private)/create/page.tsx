// Next.js App Router page - thin wrapper over FSD structure
import CreateMemePage from "@/pages/create-meme"
import { requireAuth } from "@/shared/lib/auth"
import FallbackSpinner from "@/shared/ui/fallbackSpinner"
import { Suspense } from "react"

export const metadata = {
	title: "Создать мем - AI Meme Generator",
	description: "Создавай уникальные мемы с помощью искусственного интеллекта",
}

export default function CreatePage() {
	return (
		<Suspense fallback={<FallbackSpinner />}>
			<CreateMemePage />
		</Suspense>
	)
}
