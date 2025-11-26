"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

export default function ThemeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return <SunIcon className="size-6 cursor-pointer" />
	}

	const isDark = theme === "dark"

	return (
		<Button
			variant={"ghost"}
			size="icon"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={cn(
				"cursor-pointer rounded-full transition-transform hover:scale-110",
				className,
			)}
			title={isDark ? "Светлая тема" : "Тёмная тема"}
		>
			{isDark ? (
				<SunIcon className="size-6" />
			) : (
				<MoonIcon className="size-6" />
			)}
		</Button>
	)
}
