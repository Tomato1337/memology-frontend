import { SidebarTrigger } from "@/shared/ui/sidebar"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="relative h-full w-full">
			<SidebarTrigger className="absolute top-4 left-4 size-8" />
			{children}
		</div>
	)
}
