interface LoadingSpinnerProps {
    message?: string
}

/**
 * Компонент спиннера загрузки
 */
export function LoadingSpinner({
    message = 'Загрузка...',
}: LoadingSpinnerProps) {
    return (
        <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        </div>
    )
}
