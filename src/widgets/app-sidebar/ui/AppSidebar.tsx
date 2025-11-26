"use client"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shared/ui/sidebar"
import UserWidget from "./UserWidget"
import ThemeToggle from "./ThemeToggle"
import Link from "next/link"
import {
	ImageIcon,
	LayoutDashboardIcon,
	GalleryVerticalEndIcon,
} from "lucide-react"
import Logo from "@/shared/ui/logo"

const navItems = [
	{
		title: "Главная",
		url: "/",
		icon: LayoutDashboardIcon,
	},
	{
		title: "Создать мем",
		url: "/create",
		icon: ImageIcon,
	},
	{
		title: "Галерея",
		url: "/gallery",
		icon: GalleryVerticalEndIcon,
	},
]

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="">
				<Link
					href="/"
					className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4"
				>
					<Logo className="size-4 shrink-0 scale-150" />
					<h1 className="font-pixelify-sans text-2xl transition-all group-data-[collapsible=icon]:hidden">
						Memelogy
					</h1>
				</Link>
				<div className="border-b-2 border-white/10" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon className="h-4 w-4" />
											<span className="font-pixelify-sans text-lg font-light">
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserWidget />
				<div className="flex w-full items-center justify-center">
					<ThemeToggle />
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
