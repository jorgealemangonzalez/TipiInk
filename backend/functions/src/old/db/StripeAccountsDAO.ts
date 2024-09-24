import {firestore} from '../../FirebaseInit'
import * as firebase from 'firebase-admin'
import {StripeConnectAccount} from '../types/StripeConnect'
import Stripe from 'stripe'
import {Timestamp} from 'firebase-admin/firestore'
import DocumentReference = firebase.firestore.DocumentReference

const StripeAccountsCollection = 'stripe_accounts'
const StripeAccountCheckoutSessionsCollection = 'checkout_sessions'

export const getStripeAccountByUserId = (userId: string) => {
    return firestore
        .collection(StripeAccountsCollection)
        .doc(userId) as DocumentReference<StripeConnectAccount, StripeConnectAccount>
}

export const getOrThrowStripeAccountByUserId = async (userId: string) => {
    const stripeAccount = (await getStripeAccountByUserId(userId).get()).data()
    if (!stripeAccount) {
        throw new Error(`Stripe account not found for user ${userId}`)
    }
    return stripeAccount
}

export const addSessionToAccount = async (uid: string, session: Stripe.Checkout.Session) => {
    return getStripeAccountByUserId(uid).collection(StripeAccountCheckoutSessionsCollection).doc().set(
        {
            session: session.id,
            created: Timestamp.now(),
        },
    )
}

export const getAccountByStripeAccountId = (accountId: string) =>
    firestore.collection('stripe_accounts')
        .where('stripeAccountId', '==', accountId)
