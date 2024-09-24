import {https, logger} from 'firebase-functions'
import axios, {isAxiosError} from 'axios'


const VERIFY_TOKEN = 'e47f54ee-7553-436e-9f4b-f88b471cd5ef'
const PAGE_ACCESS_TOKEN = 'EAANoXgvl23kBOZCURDRPwrxoAmchiZCiNDXMlw84OlbeF84HL8T7JpeAHqy89yDrm0ElhkPZALGKTVtb22awPPmms8lo7O0Gqi7qMKOSPLzHd2wzIDf7aobNcjFmvLCKrottxvC7ZCiOtZACKeXmTMvNMPifXACo5kmADUfY2muVWqm1xsCZCFtVavJIBKPaDMwQZDZD'

// Verify the webhook
export const facebookWebhook = https.onRequest(async (req, res) => {
    if (req.method === 'GET') {
        const mode = req.query['hub.mode']
        const token = req.query['hub.verify_token']
        const challenge = req.query['hub.challenge']

        if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
            logger.info('WEBHOOK_VERIFIED')
            res.status(200).send(challenge)
        } else {
            res.sendStatus(403)
        }
    } else if (req.method === 'POST') {
        const body: WebhookEvent = req.body

        if (body.object === 'page') {
            for (const entry of body.entry) {
                const webhookEvent = entry.messaging[0]
                logger.info('New fb webhook event', webhookEvent)

                const senderId = webhookEvent.sender.id
                const messageText = webhookEvent.message.text

                await sendFacebookMessage(senderId, `You said: ${messageText}`)
            }

            res.status(200).send('EVENT_RECEIVED')
        } else {
            res.sendStatus(404)
        }
    }
})

// Function to send messages
const sendFacebookMessage = async (recipientId: string, messageText: string) => {
    const url = `https://graph.facebook.com/v20.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`

    const messageData = {
        recipient: {id: recipientId},
        message: {text: messageText},
    }

    try {
        const response = await axios.post(url, messageData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.info('Message sent:', response.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (isAxiosError(error)) {
            const facebookError = error.response?.data.error
            console.error('Error sending message:', facebookError ? `${facebookError.type}: ${facebookError.message} (Code: ${facebookError.code}, Subcode: ${facebookError.error_subcode})` : error.message)
        } else {
            // Handle non-Axios errors
            console.error('Error sending message:', error.message)
        }
    }
}
