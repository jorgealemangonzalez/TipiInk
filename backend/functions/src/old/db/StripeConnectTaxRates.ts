import Stripe from 'stripe'
import {TaxRate} from '../functions/connect/imported/interfaces'
import {prefixMetadata} from '../functions/connect/imported/PrefixMetadata'
import * as admin from 'firebase-admin'
import config from '../functions/connect/imported/config'
import * as logs from '../functions/connect/imported/logs'

/*
 * Insert tax rates into the products collection in Cloud Firestore.
 */
export const insertTaxRateRecord = async (taxRate: Stripe.TaxRate): Promise<void> => {
    const taxRateData: Omit<TaxRate, 'metadata'> = {
        ...taxRate,
        ...prefixMetadata(taxRate.metadata!),
    }
    delete taxRateData.metadata
    await admin
        .firestore()
        .collection(config.productsCollectionPath)
        .doc('tax_rates')
        .collection('tax_rates')
        .doc(taxRate.id)
        .set(taxRateData)
    logs.firestoreDocCreated('tax_rates', taxRate.id)
}
