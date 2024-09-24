import {https, logger} from 'firebase-functions'
import Stripe from 'stripe'
import {onStripeEvent, stripe} from '../../api/Stripe'
import {handleWebhooksEventsHandler} from './imported/ExtensionFunctions'
import {getAccountByStripeAccountId} from '../../db/StripeAccountsDAO'
import {trackEvent} from '../../api/tracking'


const onAccountUpdated = async (event: Stripe.AccountUpdatedEvent) => {
    const account = event.data.object
    logger.info(`Account ${account.id} updated.`)
    if (account.charges_enabled) {
        logger.info(`Account ${account.id} is fully enabled`)
        // Update account document in firestore to reflect that the account is fully enabled
        const querySnapshot = await getAccountByStripeAccountId(account.id).get()
        if (!querySnapshot.empty) {
            // Assuming there's only one document that matches
            const docRef = querySnapshot.docs[0].ref

            // Update the document to reflect that the account is fully enabled
            await docRef.update({
                chargesEnabled: true,
            })
            await trackEvent(docRef.id, 'Stripe connect account charges enabled', {
                accountId: account.id,
            })
            logger.info(`Firestore document for account ${account.id} updated to reflect charges enabled.`)
        } else {
            logger.error(`No Firestore document found for account ${account.id}.`)
        }
    }
}

export const stripeWebhookEvents = https.onRequest(async (req, res) => {
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers['stripe-signature']!,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )
    } catch (err: any) {
        logger.error(`Webhook Error: ${err.message}`)
        res.status(400).send('Error')
        return
    }

    logger.info('Received stripe webhook event:', event.id, event.type, event.data)

    const processed = await onStripeEvent(event, 'account.updated', onAccountUpdated)

    if (processed) {
        res.json({received: true})
    } else {
        await handleWebhooksEventsHandler(req, res)
    }
})

