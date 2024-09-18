import {ChatBotConfig} from './ChatBotConfig'

export type SendChatMessageRequest = {
    chatId: string
    message: string
}

export type SendChatMessageResponse = void

export interface InitTestAssistantResponse {
    config: ChatBotConfig
}

export interface InitTestAssistantRequest {
    assistantPrompt: string
}

