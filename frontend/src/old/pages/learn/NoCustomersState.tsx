import { useTranslation } from 'react-i18next'
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"

const NoCustomersState: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <ChatBubbleLeftRightIcon className="size-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-700">{t('learn.noCustomers', 'You don\'t have any customers yet')}</h1>
        </div>
    )
}

export default NoCustomersState