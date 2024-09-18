import * as logs from './logs'
import {Customer, CustomerData} from './interfaces'
import {stripe} from '../../../api/Stripe'
import * as admin from 'firebase-admin'
import config from './config'

/**
 * Create a customer object in Stripe when a user is created.
 */
export const createConnectedCustomer = async (
    {
        email,
        uid,
        phone,
        stripeAccountId,
    }: {
        email?: string;
        phone?: string;
        uid: string;
        stripeAccountId: string
    }) => {
    try {
        logs.creatingCustomer(uid)
        const customerData: CustomerData = {
            metadata: {
                firebaseUID: uid,
            },
        }
        if (email) customerData.email = email
        if (phone) customerData.phone = phone
        const customer = await stripe.customers.create(customerData, {
            stripeAccount: stripeAccountId,
        })

        // Add a mapping record in Cloud Firestore.
        const customerRecord = {
            email: customer.email,
            stripeId: customer.id,
            stripeLink: `https://dashboard.stripe.com${
                customer.livemode ? '' : '/test'
            }/customers/${customer.id}`,
            stripeAccountId,
        }
        if (phone) (customerRecord as any).phone = phone
        await admin
            .firestore()
            .collection(config.customersCollectionPath)
            .doc(uid)
            .set(customerRecord, {merge: true})
        logs.customerCreated(customer.id, customer.livemode)
        return customerRecord as Customer
    } catch (error: any) {
        logs.customerCreationError(error, uid)
        return undefined
    }
}
