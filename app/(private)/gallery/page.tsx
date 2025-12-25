import { GalleryPage } from "@/pages/gallery"
import { requireAuth } from "@/shared/lib/auth"
import { Suspense } from "react"
import FallbackSpinner from "@/shared/ui/fallbackSpinner"

export default async function Gallery() {
	return (
		<Suspense fallback={<FallbackSpinner />}>
			<GalleryPage />
		</Suspense>
	)
}
