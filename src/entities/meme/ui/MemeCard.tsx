import type { Meme } from "@/entities/meme/model/meme.types"

interface MemeCardProps {
	meme: Meme
	onClick?: () => void
}

/**
 * MemeCard Entity - displays a single meme with metadata
 * FSD Layer: entities/meme
 */
export function MemeCard({ meme, onClick }: MemeCardProps) {
	return (
		<div
			onClick={onClick}
			className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-800"
		>
			<div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
				<div className="absolute inset-0 flex items-center justify-center text-gray-400">
					🖼️ {meme.title}
				</div>
			</div>

			<div className="p-4">
				<h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-800 dark:text-white">
					{meme.title}
				</h3>

				{meme.description && (
					<p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
						{meme.description}
					</p>
				)}

				<div className="mb-3 flex items-center gap-2">
					<span className="text-2xl">
						{meme.author.avatar ? "👤" : "🤖"}
					</span>
					<span className="text-sm text-gray-600 dark:text-gray-400">
						{meme.author.name}
					</span>
				</div>

				<div className="mb-3 flex flex-wrap gap-2">
					{meme.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
						>
							#{tag}
						</span>
					))}
				</div>

				<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
					<span>❤️ {meme.likes.toLocaleString()}</span>
					<span>👁️ {meme.views.toLocaleString()}</span>
				</div>
			</div>
		</div>
	)
}
