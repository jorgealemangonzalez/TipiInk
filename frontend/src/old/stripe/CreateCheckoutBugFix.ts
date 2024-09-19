/*
    This file contains a bug fix for the createCheckoutSession function.
    More info: https://github.com/invertase/stripe-firebase-extensions/issues/304
 */

import {
    CreateCheckoutSessionOptions,
    Session,
    SessionCreateParams,
    StripePaymentsError
} from '@invertase/firestore-stripe-payments'
import {
    checkAndUpdateCommonParams,
    checkLineItemParams,
    checkPriceIdParams,
    getTimeoutMillis,
    hasLineItems,
    waitForSessionId,
} from './DuplicatedFromLibrary.ts'
import {firestore} from '@/firebase/firebase.ts'
import {addDoc, collection, CollectionReference, DocumentReference} from 'firebase/firestore'
import {stripePayments} from './payments.ts'


async function addSessionDoc(
    uid: string,
    params: SessionCreateParams,
    accountId?: string
): Promise<DocumentReference> {
    const isCheckoutForConnectedAccount = !!accountId
    const sessions: CollectionReference = collection(
        firestore,
        isCheckoutForConnectedAccount ? 'stripe_connect_customers' : stripePayments.customersCollection,
        uid,
        'checkout_sessions',
    )
    console.log('Sessions:', sessions)
    try {
        if (isCheckoutForConnectedAccount) {
            return await addDoc(sessions, {...params, accountId})
        } else {
            return await addDoc(sessions, params)
        }
    } catch (err) {
        throw new StripePaymentsError(
            'internal',
            'Error while querying Firestore.',
            err,
        )
    }
}

async function createCheckoutSessionDb(
    uid: string,
    params: SessionCreateParams,
    timeoutMillis: number,
    accountId?: string
): Promise<Session> {
    const doc: DocumentReference = await addSessionDoc(uid, params, accountId)
    return waitForSessionId(doc, timeoutMillis)
}

export async function createCheckoutSession(
    uid: string,
    params: SessionCreateParams,
    options?: CreateCheckoutSessionOptions,
    accountId?: string,
): Promise<Session> {
    params = {...params}
    checkAndUpdateCommonParams(params)
    if (hasLineItems(params)) {
        checkLineItemParams(params)
    } else {
        checkPriceIdParams(params)
    }

    const timeoutMillis: number = getTimeoutMillis(options?.timeoutMillis)
    return createCheckoutSessionDb(uid, params, timeoutMillis, accountId)
}
