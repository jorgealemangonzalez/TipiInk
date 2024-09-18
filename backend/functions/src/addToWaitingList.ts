import {https, logger} from 'firebase-functions'
import {AddToWaitingListRequest} from './types/AddToWaitingList'
import {getOrThrowChatbotConfig, updateChatbotConfig} from './db/ChatBotConfigDAO'

export const addToWaitingList = https.onCall(async (data: AddToWaitingListRequest) => {
    const {email, chatBotConfigId} = data
    if (!email || !chatBotConfigId) {
        throw new https.HttpsError('invalid-argument', 'Email and chatBotConfigId are required')
    }
    logger.info('Adding end user to waiting list', {email, chatBotConfigId})

    try {
        logger.debug('Checking if chat bot config exists', {chatBotConfigId})
        const config = await getOrThrowChatbotConfig(chatBotConfigId)
        const waitingList = config.waitingList || []

        logger.debug('Checking if email is already in the waiting list', {email, chatBotConfigId})
        if (waitingList.includes(email)) {
            logger.warn('Email already in the waiting list', {email, chatBotConfigId})
            return // Email already in the list, succeed without adding
        }

        logger.debug('Adding email to waiting list', {email, chatBotConfigId})

        await updateChatbotConfig(chatBotConfigId, {
            waitingList: [...waitingList, email],
        })

        logger.info('Added end user to waiting list', {email, chatBotConfigId})
        return {success: true}
    } catch (error) {
        logger.error('Failed to add to waiting list', {email, chatBotConfigId, error})
        throw new https.HttpsError('unknown', 'Failed to add to waiting list')
    }
})
