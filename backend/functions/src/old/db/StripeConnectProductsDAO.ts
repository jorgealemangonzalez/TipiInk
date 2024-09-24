import Stripe from 'stripe'
import {Product} from '../functions/connect/imported/interfaces'
import {prefixMetadata} from '../functions/connect/imported/PrefixMetadata'
import * as admin from 'firebase-admin'
import config from '../functions/connect/imported/config'
import * as logs from '../functions/connect/imported/logs'
import {getChatBotConfigRef} from './ChatBotConfigDAO'

/*
 * Create a Product record in Firestore based on a Stripe Product object.
 */
export const createProductRecord = async (product: Stripe.Product, stripeAccountId: string): Promise<void> => {
    const {chatBotId, ...rawMetadata} = product.metadata

    const chatBotConfigRef = getChatBotConfigRef(chatBotId)

    const productData: Product = {
        active: product.active,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata,
        tax_code: product.tax_code ?? null,
        stripeAccountId,
        chatBotConfig: chatBotConfigRef,
        default_price: product.default_price as unknown as string,
        ...prefixMetadata(rawMetadata),
    }
    await admin
        .firestore()
        .collection(config.productsCollectionPath)
        .doc(product.id)
        .set(productData, {merge: true})
    logs.firestoreDocCreated(config.productsCollectionPath, product.id)
}
export const deleteConnectedProduct = async (pr: Stripe.Product) => {
    await admin
        .firestore()
        .collection(config.productsCollectionPath)
        .doc(pr.id)
        .delete()
    logs.firestoreDocDeleted(config.productsCollectionPath, pr.id)
}

export const getConnectProductRef = (productId: string) =>
    admin.firestore().collection(config.productsCollectionPath).doc(productId)

export const getOrThrowConnectProduct = async (productId: string) => {
    const productSnap = await getConnectProductRef(productId).get()
    if (!productSnap.exists) {
        throw new Error(`Product not found: ${productId}`)
    }
    return productSnap.data() as Product
}
