import {Product} from '@invertase/firestore-stripe-payments'

type StripeProduct = Product & {
    stripe_metadata_fee: string // TODO PRIORITIZE THIS ONE AND REMOVE THE OTHER FEE
}
