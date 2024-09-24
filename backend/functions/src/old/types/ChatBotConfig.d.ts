import {Timestamp} from 'firebase-admin/firestore'

export type ChtBotConfigFile = {
    name: string
    path: string // Complete path in the bucket, including file name
    openaiId?: string
}

export type ChatBotConfig = {
    id: string // User ID
    price?: number
    draftPrompt?: string
    testChatId?: string
    deployedAssistantId?: string
    initialAssistantMessage?: string
    stripeProductId?: string
    stripePriceId?: string
    files?: ChtBotConfigFile[]
    testingOpenaiVectorStoreId?: string | null
    waitingList? : string[]
}

export type ChatMessage = {
    id: string
    role: 'system' | 'user' | 'assistant'
    content: string
    createdAt: Timestamp
}

type BaseChat = {
    id: string
    threadId: string
    uid: string
    isTest: boolean
    createdAt: Timestamp
    updatedAt?: Timestamp
    messages: ChatMessage[]
}

export type TestChat = BaseChat & {
    isTest: true
    testAssistantId: string
    assistantPrompt: string
}

export type LiveChat = BaseChat & {
    isTest: false
    chatBotConfigId: string
}

export type Chat = TestChat | LiveChat
