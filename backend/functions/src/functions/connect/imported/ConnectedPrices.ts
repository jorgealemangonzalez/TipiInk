import Stripe from 'stripe'
import {stripe} from '../../../api/Stripe'
import {Price} from './interfaces'
import {prefixMetadata} from './PrefixMetadata'
import * as admin from 'firebase-admin'
import config from './config'
import * as logs from './logs'

/*
 * Create a price (billing price plan) and insert it into a subcollection in Products.
 */
export const createConnectedPrice = async (price: Stripe.Price, stripeAccountId: string): Promise<void> => {
    // Tiers aren't included by default, we need to retrieve and expand.
    if (price.billing_scheme === 'tiered') {
        price = await stripe.prices.retrieve(
            price.id,
            {
                expand: ['tiers'],
            },
            {
                stripeAccount: stripeAccountId,
            },
        )
    }

    const priceData: Price = {
        active: price.active,
        billing_scheme: price.billing_scheme,
        tiers_mode: price.tiers_mode,
        tiers: price.tiers ?? null,
        currency: price.currency,
        description: price.nickname,
        type: price.type,
        unit_amount: price.unit_amount!,
        recurring: price.recurring,
        interval: price.recurring?.interval ?? null,
        interval_count: price.recurring?.interval_count ?? null,
        trial_period_days: price.recurring?.trial_period_days ?? null,
        transform_quantity: price.transform_quantity,
        tax_behavior: price.tax_behavior ?? null,
        metadata: price.metadata,
        product: price.product,
        ...prefixMetadata(price.metadata),
    }
    const dbRef = admin
        .firestore()
        .collection(config.productsCollectionPath)
        .doc(price.product as string)
        .collection('prices')
    await dbRef.doc(price.id).set(priceData, {merge: true})
    logs.firestoreDocCreated('prices', price.id)
}

