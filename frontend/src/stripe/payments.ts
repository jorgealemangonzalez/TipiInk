import {getStripePayments} from '@invertase/firestore-stripe-payments'
import {firebaseApp} from '../firebase/firebase.ts'

export const stripePayments = getStripePayments(firebaseApp, {
    customersCollection: 'stripe_customers',
    productsCollection: 'stripe_products',
})
