import {https, logger} from 'firebase-functions'
import {stripe} from '../../api/Stripe'
import {prefixMetadata} from '../connect/imported/PrefixMetadata'
import * as admin from 'firebase-admin'
import * as logs from '../connect/imported/logs'

export const InitStripeDb = https.onRequest(async (_, resp) => {
    const products = await stripe.products.list()
    logger.info(`Found ${products.data.length} products in Stripe.`, products.data)
    for (const product of products.data) {
        const {firebaseRole, ...rawMetadata} = product.metadata

        const productData = {
            active: product.active,
            name: product.name,
            description: product.description,
            role: firebaseRole ?? null,
            images: product.images,
            metadata: product.metadata,
            tax_code: product.tax_code ?? null,
            ...prefixMetadata(rawMetadata),
        }
        await admin
            .firestore()
            .collection('stripe_products')
            .doc(product.id)
            .set(productData, {merge: true})
        logs.firestoreDocCreated('stripe_products', product.id)
    }

    resp.sendStatus(200)
})
