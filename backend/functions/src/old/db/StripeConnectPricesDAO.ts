import Stripe from 'stripe'
import * as admin from 'firebase-admin'
import config from '../functions/connect/imported/config'
import * as logs from '../functions/connect/imported/logs'

export const deleteConnectedPrice = async (pr: Stripe.Price) => {
    await admin
        .firestore()
        .collection(config.productsCollectionPath)
        .doc((pr as Stripe.Price).product as string)
        .collection('prices')
        .doc(pr.id)
        .delete()
    logs.firestoreDocDeleted('prices', pr.id)
}
