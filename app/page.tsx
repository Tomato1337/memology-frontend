import HomePage, { metadata } from "@/pages/home"
import type { SearchParams } from "nuqs/server"

export { metadata }

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	return <HomePage searchParams={searchParams} />
}
