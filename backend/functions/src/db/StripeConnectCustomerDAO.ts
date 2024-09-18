import * as admin from 'firebase-admin'
import {firestore} from 'firebase-admin'
import config from '../functions/connect/imported/config'
import {Customer} from '../functions/connect/imported/interfaces'

export const getStripeCustomerByStripeId = async (stripeCustomerId: string) => {
    const customersSnap = await admin
        .firestore()
        .collection(config.customersCollectionPath)
        .where('stripeId', '==', stripeCustomerId)
        .get()
    if (customersSnap.size !== 1) {
        throw new Error('User not found!')
    }
    return customersSnap.docs[0] as firestore.QueryDocumentSnapshot<Customer>
}
