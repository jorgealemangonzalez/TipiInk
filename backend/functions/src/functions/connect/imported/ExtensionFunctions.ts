/*
 * Copyright 2020 Stripe, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as functions from 'firebase-functions'
import Stripe from 'stripe'
import * as logs from './logs'
import config from './config'
import {stripe} from '../../../api/Stripe'
import {createProductRecord, deleteConnectedProduct} from '../../../db/StripeConnectProductsDAO'
import {manageSubscriptionStatusChange} from './ConnectedSubscriptions'
import {createConnectedPrice} from './ConnectedPrices'
import {createConnectedPayment} from './ConnectedPayments'
import {insertInvoiceRecord} from '../../../db/StripeConnectInvoices'
import {deleteConnectedPrice} from '../../../db/StripeConnectPricesDAO'
import {insertTaxRateRecord} from '../../../db/StripeConnectTaxRates'
import {firestore} from '../../../FirebaseInit'

export const handleWebhooksEventsHandler = async (req: functions.https.Request, resp: functions.Response) => {
    const relevantEvents = new Set([
        'product.created',
        'product.updated',
        'product.deleted',
        'price.created',
        'price.updated',
        'price.deleted',
        'checkout.session.completed',
        'checkout.session.async_payment_succeeded',
        'checkout.session.async_payment_failed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'tax_rate.created',
        'tax_rate.updated',
        'invoice.paid',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'invoice.upcoming',
        'invoice.marked_uncollectible',
        'invoice.payment_action_required',
        'payment_intent.processing',
        'payment_intent.succeeded',
        'payment_intent.canceled',
        'payment_intent.payment_failed',
    ])
    let event: Stripe.Event

    // Instead of getting the `Stripe.Event`
    // object directly from `req.body`,
    // use the Stripe webhooks API to make sure
    // this webhook call came from a trusted source
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers['stripe-signature']!,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )
    } catch (error: any) {
        logs.badWebhookSecret(error)
        resp.status(401).send('Error')
        return
    }

    const stripeAccountId = event.account
    if (!stripeAccountId) {
        logs.missingStripeAccountIdInWebhook()
        resp.status(401).send('Webhook Error: This webhook is just for connected accounts')
        return
    }

    if (relevantEvents.has(event.type)) {
        logs.startWebhookEventProcessing(event.id, event.type)
        try {
            switch (event.type) {
            case 'product.created':
            case 'product.updated':
                await createProductRecord(event.data.object as Stripe.Product, stripeAccountId)
                break
            case 'price.created':
            case 'price.updated':
                await createConnectedPrice(event.data.object as Stripe.Price, stripeAccountId)
                break
            case 'product.deleted':
                await deleteConnectedProduct(event.data.object as Stripe.Product)
                break
            case 'price.deleted':
                await deleteConnectedPrice(event.data.object as Stripe.Price)
                break
            case 'tax_rate.created':
            case 'tax_rate.updated':
                await insertTaxRateRecord(event.data.object as Stripe.TaxRate)
                break
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                await manageSubscriptionStatusChange(
                    subscription.id,
                    subscription.customer as string,
                    event.type === 'customer.subscription.created',
                )
                break
            }
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded':
            case 'checkout.session.async_payment_failed': {
                const checkoutSession = event.data
                    .object as Stripe.Checkout.Session
                if (checkoutSession.mode === 'subscription') {
                    const subscriptionId = checkoutSession.subscription as string
                    await manageSubscriptionStatusChange(
                        subscriptionId,
                        checkoutSession.customer as string,
                        true,
                    )
                }
                if (checkoutSession.tax_id_collection?.enabled) {
                    const customersSnap = await firestore
                        .collection(config.customersCollectionPath)
                        .where('stripeId', '==', checkoutSession.customer as string)
                        .get()
                    if (customersSnap.size === 1) {
                        await customersSnap.docs[0].ref.set(
                            checkoutSession.customer_details!,
                            {merge: true},
                        )
                    }
                }
                break
            }
            case 'invoice.paid':
            case 'invoice.payment_succeeded':
            case 'invoice.payment_failed':
            case 'invoice.upcoming':
            case 'invoice.marked_uncollectible':
            case 'invoice.payment_action_required': {
                const invoice = event.data.object as Stripe.Invoice
                await insertInvoiceRecord(invoice)
                break
            }
            case 'payment_intent.processing':
            case 'payment_intent.succeeded':
            case 'payment_intent.canceled':
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                await createConnectedPayment(paymentIntent)
                break
            }
            default:
                logs.webhookHandlerError(
                    new Error('Unhandled relevant event!'),
                    event.id,
                    event.type,
                )
            }

            logs.webhookHandlerSucceeded(event.id, event.type)
        } catch (error: any) {
            logs.webhookHandlerError(error, event.id, event.type)
            resp.json({
                error: 'Webhook handler failed. View function logs in Firebase.',
            })
            return
        }
    }

    // Return a response to Stripe to acknowledge receipt of the event.
    resp.json({received: true})
}

