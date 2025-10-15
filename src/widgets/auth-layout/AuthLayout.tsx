import { SidebarTrigger } from "@/shared/ui/sidebar"

export default function Layout({ children }) {
	return (
		<div className="relative h-full w-full">
			<SidebarTrigger className="absolute top-4 left-4 size-8" />
			{children}
		</div>
	)
}
