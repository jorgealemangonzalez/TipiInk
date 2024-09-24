import {Timestamp} from 'firebase-admin/firestore'
import {firestore} from '../../FirebaseInit'
import {Chat, ChatMessage, LiveChat, TestChat} from '../types/ChatBotConfig'
import {AssistantInitialization} from '../api/openai'
import {getDocumentData} from './GetDocumentData'

const getChatsRef = () => firestore.collection('chats')

const getChatRef = (chatId: string) => getChatsRef().doc(chatId)

export const addEndUserChat = async (
    uid: string,
    threadId: string,
    chatBotConfigId: string,
) => {
    const createdAt = Timestamp.now()
    const data: Omit<LiveChat, 'id' | 'messages'> = {
        uid,
        isTest: false,
        threadId,
        createdAt,
        updatedAt: createdAt,
        chatBotConfigId,
    }
    const liveChatRef = await getChatsRef().add(data)

    return liveChatRef.id
}

export const addTestAssistantChat = async (
    uid: string,
    prompt: string,
    firstAssistantMessage: AssistantInitialization,
) => {
    const createdAt = Timestamp.now()
    const data: Omit<TestChat, 'id' | 'messages'> = {
        uid,
        isTest: true,
        assistantPrompt: prompt,
        threadId: firstAssistantMessage.threadId,
        testAssistantId: firstAssistantMessage.assistantId,
        createdAt,
        updatedAt: createdAt,
    }
    const testChatRef = await getChatsRef().add(data)

    const messagesCollection = testChatRef.collection('messages')

    const firstAssistantChatMessage: Omit<ChatMessage, 'id'> = {
        role: 'assistant',
        content: firstAssistantMessage.initialMessage,
        createdAt,
    }

    await messagesCollection.add(firstAssistantChatMessage)

    return testChatRef.id
}

export const getOrThrowChat = async (chatId: string) => {
    const chatSnapshot = await getChatRef(chatId).get()
    if (!chatSnapshot.exists) {
        throw new Error(`Test chat not found: ${chatId}`)
    }

    return getDocumentData<Chat>(chatSnapshot)
}

export const existsLiveChatForUser = async (uid: string, chatBotConfigId: string) => {
    const chatSnapshot = await getChatsRef()
        .where('uid', '==', uid)
        .where('isTest', '==', false)
        .where('chatBotConfigId', '==', chatBotConfigId)
        .get()

    return !chatSnapshot.empty
}

export const getInitialAssistantMessage = async (chatId: string) => {
    const chatRef = getChatRef(chatId)
    const chatSnapshot = await chatRef.get()
    if (!chatSnapshot.exists) {
        throw new Error(`Test chat not found for chatId: ${chatId}`)
    }

    const initialAssistantMessage = await chatRef.collection('messages')
        .where('role', '==', 'assistant')
        .orderBy('createdAt', 'asc')
        .limit(1)
        .get()

    if (initialAssistantMessage.empty) {
        throw new Error(`Initial assistant message not found for chat: ${chatId}`)
    }

    return getDocumentData<ChatMessage>(initialAssistantMessage.docs[0])
}

export const getChatWithLastMessages =
    async (uid: string, chatId: string, maxMessages: number) => {
        const chatRef = getChatRef(chatId)
        const chatSnapshot = await chatRef.get()
        if (!chatSnapshot.exists) {
            throw new Error(`Test chat not found for account: ${uid}`)
        }

        const messages = await chatRef.collection('messages')
            .orderBy('createdAt', 'desc')
            .limit(maxMessages)
            .get()
            .then((snapshot) => snapshot.empty ?
                [] : snapshot.docs.map((doc) => getDocumentData<ChatMessage>(doc)))
        return {...getDocumentData<Chat>(chatSnapshot), messages} as Chat
    }

export const addMessage = async (
    chatId: string,
    message: string,
    role: 'system' | 'user' | 'assistant',
) => {
    const createdAt = Timestamp.now()
    const chatRef = getChatRef(chatId)
    const messagesCollection = chatRef.collection('messages')

    const userChatMessage: Omit<ChatMessage, 'id'> = {
        role: role,
        content: message,
        createdAt,
    }

    await messagesCollection.add(userChatMessage)
    await chatRef.update({updatedAt: createdAt})
}
