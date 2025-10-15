"use client"

import { useQueryState, parseAsString } from "nuqs"
import { Input } from "@/components/ui/input"
import { debounce } from "nuqs/server"
import { useEffect, useState } from "react"

export function SearchInput() {
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault("").withOptions({
			shallow: false,
			// limitUrlUpdates: debounce(1000),
		}),
	)
	const [viewSearch, setViewSearch] = useState(search)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setSearch(viewSearch)
		}, 1000)

		return () => clearTimeout(timeout)
	}, [viewSearch])

	return (
		<Input
			className="flex-1"
			placeholder="Поиск мемов..."
			value={viewSearch}
			onChange={(e) => {
				setViewSearch(e.target.value)
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					setSearch(e.currentTarget.value || null, {
						throttleMs: 0,
					})
				}
			}}
		/>
	)
}
