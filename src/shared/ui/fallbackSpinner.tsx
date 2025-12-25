import { Loader2 } from "lucide-react"
import React from "react"

export default function FallbackSpinner() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Loader2 className="size-12 animate-spin" />
		</div>
	)
}
