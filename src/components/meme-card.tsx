import type { Meme } from '@/shared/types/meme'

interface MemeCardProps {
    meme: Meme
    onClick?: () => void
}

/**
 * Компонент карточки мема
 */
export function MemeCard({ meme, onClick }: MemeCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
        >
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    🖼️ {meme.title}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white line-clamp-1">
                    {meme.title}
                </h3>

                {meme.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {meme.description}
                    </p>
                )}

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                        {meme.author.avatar ? '👤' : '🤖'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {meme.author.name}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {meme.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full"
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
