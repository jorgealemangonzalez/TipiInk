import {firestore} from '../FirebaseInit'
import {ChatBotConfig} from '../types/ChatBotConfig'
import {getDocumentData} from './GetDocumentData'
import {logger} from 'firebase-functions'

export const CHATBOT_CONFIGS_COLLECTION = 'chatbot_configs'

export const getChatBotConfigRef = (uid: string) => firestore.collection(CHATBOT_CONFIGS_COLLECTION).doc(uid)

export const getOrThrowChatbotConfig = async (uid: string): Promise<ChatBotConfig> => {
    const config = await getChatBotConfigRef(uid).get()
    if (!config.exists) {
        throw new Error(`Chatbot config not found for account: ${uid}`)
    }
    return getDocumentData<ChatBotConfig>(config)
}

export const updateChatbotConfig = async (uid: string, config: Partial<ChatBotConfig>) => {
    logger.info('Updating chatbot config', {
        uid,
        config,
    })
    return await getChatBotConfigRef(uid).update(config)
}
