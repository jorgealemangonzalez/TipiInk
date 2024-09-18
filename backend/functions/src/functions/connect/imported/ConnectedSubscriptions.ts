import {getStripeCustomerByStripeId} from '../../../db/StripeConnectCustomerDAO'
import {stripe} from '../../../api/Stripe'
import Stripe from 'stripe'
import config from './config'
import {Subscription} from './interfaces'
import {Timestamp} from 'firebase-admin/firestore'
import * as logs from './logs'
import {firestore} from '../../../FirebaseInit'
import {getChatBotConfigRef} from '../../../db/ChatBotConfigDAO'
import {logger} from 'firebase-functions'
import {trackEvent} from '../../../api/tracking'

/*
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
    paymentMethod: Stripe.PaymentMethod,
    stripeAccountId: string,
): Promise<void> => {
    const customer = paymentMethod.customer as string
    const {name, phone, address} = paymentMethod.billing_details
    const addressParam: Stripe.AddressParam | undefined = address ? {
        ...address,
        city: address.city || undefined,
        country: address.country || undefined,
        line1: address.line1 || undefined,
        line2: address.line2 || undefined,
        postal_code: address.postal_code || undefined,
        state: address.state || undefined,
    } : undefined


    await stripe.customers.update(customer,
        {name: name || undefined, phone: phone || undefined, address: addressParam},
        {
            stripeAccount: stripeAccountId,
        },
    )
}
/*
 * Manage subscription status changes.
 */
export const manageSubscriptionStatusChange = async (
    subscriptionId: string,
    customerId: string,
    createAction: boolean,
): Promise<void> => {
    const customerSnap = await getStripeCustomerByStripeId(customerId)
    // Retrieve latest subscription status and write it to the Firestore
    const stripeAccountId = customerSnap.data().stripeAccountId
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method', 'items.data.price.product'],
    }, {
        stripeAccount: stripeAccountId,
    })
    const price: Stripe.Price = subscription.items.data[0].price
    const prices = []
    for (const item of subscription.items.data) {
        prices.push(
            firestore
                .collection(config.productsCollectionPath)
                .doc((item.price.product as Stripe.Product).id)
                .collection('prices')
                .doc(item.price.id),
        )
    }
    logger.debug('Product: ', price.product)
    const product: Stripe.Product = price.product as Stripe.Product
    const role = product.metadata.firebaseRole ?? null
    // Get reference to subscription doc in Cloud Firestore.
    const subsDbRef = customerSnap.ref
        .collection('subscriptions')
        .doc(subscription.id)
    // Update with new Subscription status
    const subscriptionData: Subscription = {
        metadata: subscription.metadata,
        role,
        status: subscription.status,
        stripeLink: `https://dashboard.stripe.com${
            subscription.livemode ? '' : '/test'
        }/subscriptions/${subscription.id}`,
        product: firestore
            .collection(config.productsCollectionPath)
            .doc(product.id),
        price: firestore
            .collection(config.productsCollectionPath)
            .doc(product.id)
            .collection('prices')
            .doc(price.id),
        chatBotConfig: getChatBotConfigRef(product.metadata.chatBotId),
        prices,
        quantity: subscription.items.data[0].quantity!,
        items: subscription.items.data,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at ?
            Timestamp.fromMillis(subscription.cancel_at * 1000) :
            null,
        canceled_at: subscription.canceled_at ?
            Timestamp.fromMillis(subscription.canceled_at * 1000) :
            null,
        current_period_start: Timestamp.fromMillis(
            subscription.current_period_start * 1000,
        ),
        current_period_end: Timestamp.fromMillis(
            subscription.current_period_end * 1000,
        ),
        created: Timestamp.fromMillis(subscription.created * 1000),
        ended_at: subscription.ended_at ?
            Timestamp.fromMillis(subscription.ended_at * 1000) :
            null,
        trial_start: subscription.trial_start ?
            Timestamp.fromMillis(subscription.trial_start * 1000) :
            null,
        trial_end: subscription.trial_end ?
            Timestamp.fromMillis(subscription.trial_end * 1000) :
            null,
    }
    await subsDbRef.set(subscriptionData)

    await trackEvent(customerSnap.id, 'Subscription status changed', {
        status: subscription.status,
        price: price.unit_amount,
    })

    logs.firestoreDocCreated('subscriptions', subscription.id)

    // NOTE: This is a costly operation and should happen at the very end.
    // Copy the billing deatils to the customer object.
    if (createAction && subscription.default_payment_method) {
        await copyBillingDetailsToCustomer(
            subscription.default_payment_method as Stripe.PaymentMethod,
            stripeAccountId,
        )
    }

    return
}
