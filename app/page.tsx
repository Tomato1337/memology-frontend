// Next.js App Router page - thin wrapper over FSD structure
import HomePage, { metadata } from "@/pages/home"
import type { SearchParams } from "nuqs/server"

// Re-export metadata for Next.js
export { metadata }

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	return <HomePage searchParams={searchParams} />
}
