import { SidebarTrigger } from "@/shared/ui/sidebar"
import { MemeGallery } from "@/widgets/meme-gallery"

export default function GalleryPage() {
	return (
		<div className="bg-background min-h-screen">
			<header className="bg-background sticky top-0 z-10 flex items-center gap-4 border-b p-2">
				<SidebarTrigger className="size-12" />
				<h2 className="font-pixelify-sans text-2xl font-light">
					Галерея
				</h2>
			</header>
			<main className="bg-background relative mt-2 h-[calc(100vh-5rem)] flex-1 overflow-hidden px-4">
				<MemeGallery isGalleryPage={true} />
			</main>
		</div>
	)
}
