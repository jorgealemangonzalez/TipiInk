import {useCollection} from '@/firebase/hooks/useCollection.ts'
import {ChatMessage} from '../../../../backend/functions/src/types/ChatBotConfig'

export const useChat = ({id}: { id: string }) => {
    const {results: messages} = useCollection<ChatMessage>({
        path: `/chats/${id}/messages`,
        orderBy: ['createdAt'],
    })

    return {messages}
}
