import Stripe from 'stripe'
import {onFunctionsInit} from '../../functions/OnFunctionsInit'

export let stripe: Stripe

onFunctionsInit(async () => {
    stripe = new Stripe(
        // This is your test secret API key.
        process.env.STRIPE_API_KEY as string,
        {
            apiVersion: '2024-06-20',
        },
    )
})

export const onStripeEvent = async <T extends Stripe.Event>(
    event: Stripe.Event,
    type: Stripe.Event.Type,
    callback: (event: T) => Promise<void>,
): Promise<boolean> => {
    if (event.type === type) {
        await callback(event as T)
        return true
    }

    return false
}
