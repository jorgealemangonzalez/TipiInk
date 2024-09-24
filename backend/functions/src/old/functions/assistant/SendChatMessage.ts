import {https, logger} from 'firebase-functions/v2'
import {throwIfUnauthenticatedRequest} from '../../auth/throwIfUnauthenticated'
import {SendChatMessageRequest} from '../../types/TestAssistant'
import {addMessage, getOrThrowChat} from '../../db/ChatDAO'
import {getOrThrowChatbotConfig} from '../../db/ChatBotConfigDAO'
import {limitChatMessagesUsage} from '../../usage/UsageLimits'
import {getNextMessageStream} from '../../api/openai'
import * as cors from 'cors'

export const sendChatMessage = https.onRequest(async (req, res) => {
    cors({origin: Boolean(process.env.IS_LOCAL)})(req, res, async () => {
        try {
            const {uid} = await throwIfUnauthenticatedRequest(req)
            const data: SendChatMessageRequest = req.body

            await limitChatMessagesUsage(uid, data.message)
            if (data.message.length > 1000) {
                throw new Error('Message is too long')
            }

            const chat = await getOrThrowChat(data.chatId)
            logger.info('Chat:', chat)
            await addMessage(data.chatId, data.message, 'user')

            const assistantId = chat.isTest ?
                chat.testAssistantId :
                (await getOrThrowChatbotConfig(chat.chatBotConfigId)).deployedAssistantId!

            const stream = await getNextMessageStream(assistantId, chat.threadId, data.message)
            logger.info('Stream started')

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            })
            logger.debug('Response headers written')

            let fullResponse = ''

            await stream.on('textDelta', (data) => {
                fullResponse += data.value
                res.write(`data: ${JSON.stringify({content: data.value})}\n\n`)
            }).done()

            res.write('data: [DONE]\n\n')

            // Store the complete message in the database
            await addMessage(data.chatId, fullResponse, 'assistant')
        } catch (error) {
            logger.error('Error in sendChatMessage:', error)
            res.status(500).json({error: 'An error occurred while processing the request'})
        }
    })
})
