"use client"

import { CreateMemeForm } from "@/features/create-meme"
import { MemeGallery } from "@/widgets/meme-gallery"
import { SidebarTrigger } from "@/shared/ui/sidebar"
import { Button } from "@/shared/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { SearchInput } from "@/features/search-memes"

export default function CreateMemePage() {
	return (
		<div className="bg-background min-h-screen">
			<header className="bg-background sticky top-0 z-10 flex items-center gap-4 border-b p-2">
				<SidebarTrigger className="size-12" />
				<h2 className="font-pixelify-sans text-2xl font-light">
					Создание мемов
				</h2>
			</header>
			<main className="bg-background relative mt-2 flex-1 overflow-hidden px-4">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="order-1">
						<CreateMemeForm />
					</div>
					<div className="order-2">
						<MemeGallery />
					</div>
				</div>
			</main>
		</div>
	)
}
