import {createContext, ReactNode, useContext} from 'react'
import {useUser} from './auth.tsx'
import {ChatBotConfig} from '@monorepo/functions/src/types/ChatBotConfig'
import {useDocument} from '../firebase/hooks/useDocument.ts'

export type ChatBotConfigContextType = {
    config: ChatBotConfig
    setConfig: (config: Partial<ChatBotConfig>) => void
    setConfigSync: (config: Partial<ChatBotConfig>) => Promise<void>
    setConfigState: (config: ChatBotConfig) => void
}

export const ChatBotConfigContext = createContext<ChatBotConfigContextType | undefined>(undefined)

export const useChatBotConfig = () => {
    const context = useContext(ChatBotConfigContext)
    if (context === undefined) {
        throw new Error('useChatBotConfig must be used within a ChatBotConfigProvider')
    }
    return context
}

export const CHATBOT_CONFIG_COLLECTION = 'chatbot_configs'

export const ChatBotConfigProvider = ({children}: { children: ReactNode }) => {
    const user = useUser()
    const {document: config, setDocument: setConfig, setDocumentSync: setConfigSync, setDocumentState: setConfigState} =
        useDocument<ChatBotConfig>({
            collectionName: CHATBOT_CONFIG_COLLECTION,
            id: user.uid,
            defaultValue: {
                id: user.uid,
                draftPrompt: '',
            },
        })
    console.log({config})

    const value: ChatBotConfigContextType = {config, setConfig, setConfigSync, setConfigState}
    return <ChatBotConfigContext.Provider value={value}>
        {children}
    </ChatBotConfigContext.Provider>
}
