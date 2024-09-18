import {useEffect, useState} from "react"
import {useCollection} from '../../firebase/hooks/useCollection'
import {useUser} from "../../contexts/auth.tsx"
import {LiveChat} from "../../../../backend/functions/src/types/ChatBotConfig"
import Sidebar from './Sidebar'
import ChatDisplay from './ChatDisplay'
import LoadingState from './LoadingState'
import NoCustomersState from './NoCustomersState'
import {useWindowBreakpoint} from '../../react/breakpoints.ts'
import {FullPageModal} from '../../react/modal.tsx'

export const LearnPage: React.FC = () => {
    const {uid} = useUser()
    const {results: chats, isLoading} = useCollection<LiveChat>({
        path: 'chats',
        where: [
            ['isTest', '==', false],
            ['chatBotConfigId', '==', uid]
        ],
        orderBy: ['createdAt', 'desc']
    })
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    const [openSection, setOpenSection] = useState<'sidebar' | 'chat'>('sidebar')
    const {isLgOrBigger} = useWindowBreakpoint()

    useEffect(() => {
        if (chats.length > 0 && !selectedChatId) {
            setSelectedChatId(chats[0].id)
        }
    }, [chats, selectedChatId])

    if (isLoading) {
        return <LoadingState/>
    }

    if (chats.length === 0) {
        return <NoCustomersState/>
    }

    return (
        <div className="flex h-full flex-row gap-4 px-4 pb-4">
            {isLgOrBigger ? (
                <>
                    <Sidebar
                        chats={chats}
                        onChatClick={setSelectedChatId}
                        selectedChatId={selectedChatId}
                    />
                    <ChatDisplay selectedChatId={selectedChatId}/>
                </>
            ) : (
                openSection === 'sidebar' ? (
                    <Sidebar
                        chats={chats}
                        onChatClick={(chatId) => {
                            setSelectedChatId(chatId)
                            setOpenSection('chat')
                        }}
                        selectedChatId={selectedChatId}
                    />
                ) : (
                    <FullPageModal onClose={() => setOpenSection('sidebar')}>
                        <ChatDisplay selectedChatId={selectedChatId}/>
                    </FullPageModal>
                )
            )}
        </div>
    )
}
