import {https} from 'firebase-functions'
import {StartEndUserChatRequest, StartEndUserChatResponse} from '../../types/Chat'
import {throwIfUnauthenticated} from '../../auth/throwIfUnauthenticated'
import {getOrThrowChatbotConfig} from '../../db/ChatBotConfigDAO'
import {addMessageToThread, createThread} from '../../api/openai'
import {addEndUserChat, addMessage, existsLiveChatForUser} from '../../db/ChatDAO'

export const startEndUserChat = https.onCall(
    async (data: StartEndUserChatRequest, context): Promise<StartEndUserChatResponse> => {
        const {uid} = throwIfUnauthenticated(context)

        if (await existsLiveChatForUser(uid, data.chatBotId)) {
            throw new Error('User already has an active chat')
        }

        const config = await getOrThrowChatbotConfig(data.chatBotId)

        if (!config.initialAssistantMessage) {
            throw new Error(`Initial assistant message not found for account: ${data.chatBotId}`)
        }

        const thread = await createThread()
        await addMessageToThread(thread.id, config.initialAssistantMessage, 'assistant')
        const chatId = await addEndUserChat(uid, thread.id, config.id)
        await addMessage(chatId, config.initialAssistantMessage, 'assistant')
        return {chatId: chatId}
    },
)
