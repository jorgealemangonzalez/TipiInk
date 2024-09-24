/* eslint-disable camelcase */
import * as functions from 'firebase-functions'
import config from './config'
import * as logs from './logs'
import {getOrThrowStripeAccountByUserId} from '../../../db/StripeAccountsDAO'
import {getOrThrowChatbotConfig} from '../../../db/ChatBotConfigDAO'
import {getActiveSubscriptionFeeCents} from '../../../db/StripePaymentsDAO'
import {Customer} from './interfaces'
import * as admin from 'firebase-admin'
import {createConnectedCustomer} from './ConnectedCustomers'
import Stripe from 'stripe'
import {stripe} from '../../../api/Stripe'
import {Timestamp} from 'firebase-admin/firestore'

/**
 * Create a CheckoutSession or PaymentIntent based on which client is being used.
 */
export const createConnectedCheckoutSession = functions
    .firestore.document(
        `/${config.customersCollectionPath}/{uid}/checkout_sessions/{id}`,
    )
    .onCreate(async (snap, context) => {
        const {
            client = 'web',
            mode = 'subscription',
            success_url,
            cancel_url,
            accountId,
        } = snap.data()
        try {
            logs.creatingCheckoutSession(context.params.id)
            const stripeAccount = await getOrThrowStripeAccountByUserId(accountId)
            const chatBotConfig = await getOrThrowChatbotConfig(accountId)
            const subscriptionFee = await getActiveSubscriptionFeeCents()
            const price = Number(chatBotConfig.price!.toFixed(2)) * 100
            const botWhirlFeePercentage = Number(((subscriptionFee / price) * 100).toFixed(2))

            // Get stripe customer id
            let customerRecord = (await snap.ref.parent.parent!.get()).data() as Customer | undefined
            if (!customerRecord?.stripeId) {
                const {email, phoneNumber} = await admin
                    .auth()
                    .getUser(context.params.uid)
                customerRecord = await createConnectedCustomer({
                    uid: context.params.uid,
                    email,
                    phone: phoneNumber,
                    stripeAccountId: stripeAccount.stripeAccountId,
                })
            }
            const customer = customerRecord!.stripeId

            if (client === 'web') {
                const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
                    customer,
                    line_items: [
                        {
                            price: chatBotConfig.stripePriceId,
                            quantity: 1,
                        },
                    ],
                    subscription_data: {
                        application_fee_percent: botWhirlFeePercentage,
                    },
                    mode: 'subscription',
                    success_url: success_url + '&session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: cancel_url + '&session_id={CHECKOUT_SESSION_ID}',
                }
                const session = await stripe.checkout.sessions.create(
                    sessionCreateParams,
                    {
                        idempotencyKey: context.params.id,
                        stripeAccount: stripeAccount.stripeAccountId,
                    },
                )
                await snap.ref.set(
                    {
                        client,
                        mode,
                        sessionId: session.id,
                        url: session.url,
                        created: Timestamp.now(),
                    },
                    {merge: true},
                )
            } else {
                throw new Error(
                    `Client ${client} is not supported. Only 'web' is supported!`,
                )
            }
            logs.checkoutSessionCreated(context.params.id)
            return
        } catch (error: any) {
            logs.checkoutSessionCreationError(context.params.id, error)
            await snap.ref.set(
                {error: {message: error.message}},
                {merge: true},
            )
        }
    })
