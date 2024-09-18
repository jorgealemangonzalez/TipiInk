import { useTranslation } from 'react-i18next'

const LoadingState: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">{t('learn.loading', 'Loading chats...')}</h2>
        </div>
    )
}

export default LoadingState