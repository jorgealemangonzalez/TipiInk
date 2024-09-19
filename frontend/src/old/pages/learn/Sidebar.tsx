import { useTranslation } from 'react-i18next'
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { LiveChat } from "../../../../../backend/functions/src/types/ChatBotConfig"
import { getColorForId } from './utils/colorUtils.ts'
import { useWindowBreakpoint } from '@/old/react/breakpoints.ts'

interface SidebarProps {
    chats: LiveChat[]
    onChatClick: (chatId: string) => void
    selectedChatId: string | null
}

const getLastActive = (chat: LiveChat) => {
    return chat.updatedAt?.toDate().toLocaleString() ||
        chat.createdAt.toDate().toLocaleString()
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onChatClick, selectedChatId }) => {
    const { t } = useTranslation()
    const { isLgOrBigger } = useWindowBreakpoint()

    console.log({
        selectedChatId,
        isLgOrBigger
    })

    return (
        <div className={`flex flex-col p-4 ${isLgOrBigger ? 'w-80' : 'w-full'} bg-main-200 rounded-2xl overflow-y-auto hide-scrollbar`}>
            <h2 className="text-lg font-bold mb-4">{t('learn.sidebar.title', 'Clients')}</h2>
            <ul className="space-y-2">
                {chats.map(chat => (
                    <li
                        key={chat.id}
                        className={`p-2 rounded-lg cursor-pointer flex flex-row items-center justify-between ${
                            selectedChatId === chat.id && isLgOrBigger ? 'bg-main-400' : 'hover:bg-main-300 active:bg-main-400'
                        }`}
                        onClick={() => onChatClick(chat.id)}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className={`size-8 rounded-full flex items-center justify-center ${getColorForId(chat.id)}`}>
                                <span className="text-white font-semibold">{chat.id[0].toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm ${selectedChatId === chat.id && isLgOrBigger ? 'text-base-100' : 'text-secondary'}`}>{chat.id}</span>
                                <span className={`text-xs ${selectedChatId === chat.id && isLgOrBigger ? 'text-base-200' : 'text-gray-700'}`}>{getLastActive(chat)}</span>
                            </div>
                        </div>
                        <ChatBubbleOvalLeftEllipsisIcon className={`size-6 ${selectedChatId === chat.id && isLgOrBigger ? 'text-white' : ''}`}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar
