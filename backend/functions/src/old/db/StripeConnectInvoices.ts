import Stripe from 'stripe'
import * as admin from 'firebase-admin'
import config from '../functions/connect/imported/config'
import * as logs from '../functions/connect/imported/logs'

/*
 * Add invoice objects to Cloud Firestore.
 */
export const insertInvoiceRecord = async (invoice: Stripe.Invoice) => {
    // Get customer's UID from Firestore
    const customersSnap = await admin
        .firestore()
        .collection(config.customersCollectionPath)
        .where('stripeId', '==', invoice.customer)
        .get()
    if (customersSnap.size !== 1) {
        throw new Error('User not found!')
    }
    // Write to invoice to a subcollection on the subscription doc.
    await customersSnap.docs[0].ref
        .collection('subscriptions')
        .doc(invoice.subscription as string)
        .collection('invoices')
        .doc(invoice.id)
        .set(invoice)

    const prices = []
    for (const item of invoice.lines.data) {
        prices.push(
            admin
                .firestore()
                .collection(config.productsCollectionPath)
                .doc(item.price!.product as string)
                .collection('prices')
                .doc(item.price!.id),
        )
    }

    // An Invoice object does not always have an associated Payment Intent
    const recordId: string = (invoice.payment_intent as string) ?? invoice.id

    // Update subscription payment with price data
    await customersSnap.docs[0].ref
        .collection('payments')
        .doc(recordId)
        .set({prices}, {merge: true})
    logs.firestoreDocCreated('invoices', invoice.id)
}
