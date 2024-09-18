import {
    CREATE_SESSION_TIMEOUT_MILLIS,
    LineItemSessionCreateParams,
    PriceIdSessionCreateParams,
    Session,
    SessionCreateParams,
    StripePaymentsError,
    Subscription,
    SubscriptionSnapshot,
    SubscriptionStatus,
} from '@invertase/firestore-stripe-payments'
import {
    checkNonEmptyArray,
    checkNonEmptyString,
    checkPositiveNumber,
} from '@invertase/firestore-stripe-payments/lib/utils'
import {
    collection,
    CollectionReference,
    DocumentChange,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FirestoreDataConverter,
    FirestoreError,
    getDocs,
    onSnapshot,
    Query,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    Timestamp,
    where,
} from 'firebase/firestore'
import {Unsubscribe} from 'firebase/auth'
import {firestore} from '../firebase/firebase.ts'
import {stripePayments} from './payments.ts'

export function checkAndUpdateCommonParams(params: SessionCreateParams): void {
    if (typeof params.cancel_url !== 'undefined') {
        checkNonEmptyString(
            params.cancel_url,
            'cancel_url must be a non-empty string.',
        )
    } else {
        params.cancel_url = window.location.href
    }

    params.mode ??= 'subscription'
    if (typeof params.success_url !== 'undefined') {
        checkNonEmptyString(
            params.success_url,
            'success_url must be a non-empty string.',
        )
    } else {
        params.success_url = window.location.href
    }
}

export function hasLineItems(
    params: SessionCreateParams,
): params is LineItemSessionCreateParams {
    return 'line_items' in params
}

export function checkLineItemParams(params: LineItemSessionCreateParams): void {
    checkNonEmptyArray(
        params.line_items,
        'line_items must be a non-empty array.',
    )
}

export function checkPriceIdParams(params: PriceIdSessionCreateParams): void {
    checkNonEmptyString(params.price, 'price must be a non-empty string.')
    if (typeof params.quantity !== 'undefined') {
        checkPositiveNumber(
            params.quantity,
            'quantity must be a positive integer.',
        )
    }
}

export function getTimeoutMillis(timeoutMillis: number | undefined): number {
    if (typeof timeoutMillis !== 'undefined') {
        checkPositiveNumber(
            timeoutMillis,
            'timeoutMillis must be a positive number.',
        )
        return timeoutMillis
    }

    return CREATE_SESSION_TIMEOUT_MILLIS
}

type PartialSession = Partial<Session>;

function toUTCDateString(timestamp: Timestamp): string {
    return timestamp.toDate().toUTCString()
}

const SESSION_CONVERTER: FirestoreDataConverter<PartialSession> = {
    toFirestore: (): DocumentData => {
        throw new Error('Not implemented for readonly Session type.')
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): PartialSession => {
        const {created, sessionId, ...rest} = snapshot.data()
        if (typeof sessionId !== 'undefined') {
            return {
                ...(rest as Session),
                id: sessionId,
                created_at: toUTCDateString(created),
            }
        }

        return {...(rest as Session)}
    },
}

function hasSessionId(session: PartialSession | undefined): session is Session {
    return typeof session?.id !== 'undefined'
}

export function waitForSessionId(
    doc: DocumentReference,
    timeoutMillis: number,
): Promise<Session> {
    let cancel: Unsubscribe
    return new Promise<Session>((resolve, reject) => {
        const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
            reject(
                new StripePaymentsError(
                    'deadline-exceeded',
                    'Timeout while waiting for session response.',
                ),
            )
        }, timeoutMillis)
        cancel = onSnapshot(
            doc.withConverter(SESSION_CONVERTER),
            (snap: DocumentSnapshot<PartialSession>) => {
                const session: PartialSession | undefined = snap.data()
                if (hasSessionId(session)) {
                    clearTimeout(timeout)
                    resolve(session)
                }
            },
            (err: FirestoreError) => {
                clearTimeout(timeout)
                reject(
                    new StripePaymentsError(
                        'internal',
                        'Error while querying Firestore.',
                        err,
                    ),
                )
            },
        )
    }).finally(() => cancel())
}

const SUBSCRIPTIONS_COLLECTION = 'subscriptions' as const

function toNullableUTCDateString(timestamp: Timestamp | null): string | null {
    if (timestamp === null) {
        return null
    }

    return toUTCDateString(timestamp)
}


const SUBSCRIPTION_CONVERTER: FirestoreDataConverter<Subscription> = {
    toFirestore: () => {
        throw new Error('Not implemented for readonly Subscription type.')
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): Subscription => {
        const data: DocumentData = snapshot.data()
        const refs: DocumentReference[] = data.prices
        const prices: Array<{ product: string; price: string }> = refs.map(
            (priceRef: DocumentReference) => {
                return {
                    product: priceRef.parent.parent!.id,
                    price: priceRef.id,
                }
            },
        )

        return {
            cancel_at: toNullableUTCDateString(data.cancel_at),
            cancel_at_period_end: data.cancel_at_period_end,
            canceled_at: toNullableUTCDateString(data.canceled_at),
            created: toUTCDateString(data.created),
            current_period_start: toUTCDateString(data.current_period_start),
            current_period_end: toUTCDateString(data.current_period_end),
            ended_at: toNullableUTCDateString(data.ended_at),
            id: snapshot.id,
            metadata: data.metadata ?? {},
            price: (data.price as DocumentReference).id,
            prices,
            product: (data.product as DocumentReference).id,
            quantity: data.quantity ?? null,
            role: data.role ?? null,
            status: data.status,
            stripe_link: data.stripeLink,
            trial_end: toNullableUTCDateString(data.trial_end),
            trial_start: toNullableUTCDateString(data.trial_start),
            uid: snapshot.ref.parent.parent!.id,
            chatBotConfig: (data.chatBotConfig as DocumentReference)?.id,
        }
    },
}

export function onSubscriptionUpdate(
    customersCollection: string,
    uid: string,
    onUpdate: (snapshot: SubscriptionSnapshot) => void,
    onError?: (error: StripePaymentsError) => void,
): () => void {
    const subscriptions: CollectionReference<Subscription> = collection(
        firestore,
        customersCollection,
        uid,
        SUBSCRIPTIONS_COLLECTION,
    ).withConverter(SUBSCRIPTION_CONVERTER)
    return onSnapshot(
        subscriptions,
        (querySnap: QuerySnapshot<Subscription>) => {
            const snapshot: SubscriptionSnapshot = {
                subscriptions: [],
                changes: [],
                size: querySnap.size,
                empty: querySnap.empty,
            }
            querySnap.forEach((snap: QueryDocumentSnapshot<Subscription>) => {
                snapshot.subscriptions.push(snap.data())
            })
            querySnap
                .docChanges()
                .forEach((change: DocumentChange<Subscription>) => {
                    snapshot.changes.push({
                        type: change.type,
                        subscription: change.doc.data(),
                    })
                })

            onUpdate(snapshot)
        },
        (err: FirestoreError) => {
            if (onError) {
                const arg: StripePaymentsError = new StripePaymentsError(
                    'internal',
                    `Error while listening to database updates: ${err.message}`,
                    err,
                )
                onError(arg)
            }
        },
    )
}

export async function queryFirestore<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn()
    } catch (error) {
        throw new StripePaymentsError(
            'internal',
            'Unexpected error while querying Firestore',
            error,
        )
    }
}

async function getSubscriptionSnapshots(
    uid: string,
    status?: SubscriptionStatus[],
): Promise<QuerySnapshot<Subscription>> {
    let subscriptionsQuery: Query<Subscription> = collection(
        firestore,
        stripePayments.customersCollection,
        uid,
        SUBSCRIPTIONS_COLLECTION,
    ).withConverter(SUBSCRIPTION_CONVERTER)
    if (status) {
        subscriptionsQuery = query(
            subscriptionsQuery,
            where('status', 'in', status),
        )
    }

    return await queryFirestore(() => getDocs(subscriptionsQuery))
}

export async function getSubscriptions(
    uid: string,
    options?: { status?: SubscriptionStatus[] },
): Promise<Subscription[]> {
    const querySnap: QuerySnapshot<Subscription> =
        await getSubscriptionSnapshots(uid, options?.status)
    const subscriptions: Subscription[] = []
    querySnap.forEach((snap: QueryDocumentSnapshot<Subscription>) => {
        subscriptions.push(snap.data())
    })

    return subscriptions
}
