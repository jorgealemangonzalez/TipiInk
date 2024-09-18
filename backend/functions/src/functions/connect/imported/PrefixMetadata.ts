import Stripe from 'stripe'

/*
 * Prefix Stripe metadata keys with `stripe_metadata_` to be spread onto Product and Price docs in Cloud Firestore.
 */
export const prefixMetadata = (metadata: Stripe.Metadata) =>
    Object.keys(metadata).reduce((prefixedMetadata: Stripe.Metadata, key) => {
        prefixedMetadata[`stripe_metadata_${key}`] = metadata[key]
        return prefixedMetadata
    }, {})
