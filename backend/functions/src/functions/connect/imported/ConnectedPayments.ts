import Stripe from 'stripe'
import {Payment, Price} from './interfaces'
import {getStripeCustomerByStripeId} from '../../../db/StripeConnectCustomerDAO'
import {stripe} from '../../../api/Stripe'
import * as admin from 'firebase-admin'
import config from './config'
import * as logs from './logs'

/*
 * Add PaymentIntent objects to Cloud Firestore for one-time payments.
 */
export const createConnectedPayment = async (
    payment: Stripe.PaymentIntent,
    checkoutSession?: Stripe.Checkout.Session,
) => {
    const paymentDBObject: Payment = {...payment} as Payment
    const customerSnap = await getStripeCustomerByStripeId(payment.customer as string)
    if (checkoutSession) {
        const lineItems = await stripe.checkout.sessions.listLineItems(
            checkoutSession.id,
            {},
            {stripeAccount: customerSnap.data().stripeAccountId},
        )
        const prices = []
        for (const item of lineItems.data) {
            prices.push(
                admin
                    .firestore()
                    .collection(config.productsCollectionPath)
                    .doc(item.price!.product as string)
                    .collection('prices')
                    .doc(item.price!.id),
            )
        }
        paymentDBObject.prices = prices as unknown as Price[]
        paymentDBObject.items = lineItems.data
    }
    // Write to invoice to a subcollection on the customer doc.
    await customerSnap.ref
        .collection('payments')
        .doc(paymentDBObject.id)
        .set(paymentDBObject, {merge: true})
    logs.firestoreDocCreated('payments', paymentDBObject.id)
}
