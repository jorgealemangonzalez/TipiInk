import {firestore} from '../../FirebaseInit'
import {Subscription} from '@invertase/firestore-stripe-payments'

const CUSTOMERS_COLLECTION = 'stripe_customers'
// const PRODUCTS_COLLECTION = 'stripe_products'

const getSubscriptions = async (uid: string): Promise<Subscription[]> => {
    const subscriptions = await firestore.collection(CUSTOMERS_COLLECTION).doc(uid).collection('subscriptions').get()

    return subscriptions.docs.map((subscription) => subscription.data()) as Subscription[]
}


export const getActiveSubscription = async (uid: string): Promise<Subscription> => {
    const subscriptions = await getSubscriptions(uid)
    const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === 'active')
    if (activeSubscriptions.length === 0) {
        throw new Error(`No active subscriptions found for customer: ${uid}`)
    }

    // Assuming there's only one subscription
    return activeSubscriptions[0]
}

export const getActiveSubscriptionFeeCents = async (): Promise<number> => {
    return 5 * 100 // Converting to cents
}
//
// export const getActiveSubscriptionFeeCents = async (uid: string): Promise<number> => {
//     logger.log(`Getting active subscription fee for user [${uid}]`)
//     const subscription = await getActiveSubscription(uid)
//     const product = await (subscription.product as unknown as DocumentReference<StripeProduct, StripeProduct>).get()
//     return Number(product.data()!.stripe_metadata_fee) * 100 // Converting to cents
// }
