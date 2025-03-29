import * as functions from 'firebase-functions'
import { logger } from 'firebase-functions'
import { isLocalEnvironment } from 'src/FirebaseInit'
import { createSupplierInTrieve } from 'src/trieve/TrieveService'
import { TrieveSDK } from 'trieve-ts-sdk'

import { SupplierDBModel } from '@tipi/shared'

import { getSupplierById } from './supplierRepository'

const trDataset = isLocalEnvironment() ? 'c7b4534b-ed9b-40b7-8b20-268b76bf4217' : 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa'

export const trieve = new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY || '',
    datasetId: trDataset,
})

export const onSupplierCreated = functions.firestore.onDocumentCreated(
    'organizations/demo/suppliers/{supplierId}',
    async event => {
        const supplierId = event.params.supplierId
        const snapshot = event.data
        try {
            if (!snapshot) {
                logger.error('No data associated with the event')
                return
            }

            const supplierData = snapshot.data() as SupplierDBModel

            await createSupplierInTrieve({
                ...supplierData,
                id: supplierId,
            })
            logger.info(`Created new Trieve chunk for supplier ${supplierId} : ${supplierData.name}`)
        } catch (error) {
            logger.error(`Error creating Trieve chunk for supplier ${supplierId}:`, error)
        }
    },
)

export const onSupplierUpdated = functions.firestore.onDocumentUpdated(
    'organizations/demo/suppliers/{supplierId}',
    async event => {
        const supplierId = event.params.supplierId
        try {
            const supplierData = event.data?.after.data() as SupplierDBModel
            if (!supplierData) {
                logger.error('No data associated with the event')
                return
            }
            if (!supplierData.chunkId) {
                logger.error(`No chunkId associated with the supplier to update ${supplierId} : ${supplierData.name}`)
                await createSupplierInTrieve({
                    ...supplierData,
                    id: supplierId,
                })
            } else {
                // Get the full supplier
                const supplier = await getSupplierById(supplierId)

                // Update Trieve with the complete supplier
                await trieve.updateChunk({
                    chunk_id: supplierData.chunkId,
                    chunk_html: JSON.stringify(supplier),
                })
            }
            logger.info(`Updated Trieve chunk for supplier ${supplierId} : ${supplierData.name}`)
        } catch (error) {
            logger.error(`Error updating Trieve chunk for supplier ${supplierId}:`, error)
        }
    },
)

export const onSupplierDeleted = functions.firestore.onDocumentDeleted(
    'organizations/demo/suppliers/{supplierId}',
    async event => {
        const supplierId = event.params.supplierId
        const supplier = event.data?.data() as SupplierDBModel
        if (!supplier) {
            logger.error('No data associated with the event')
            return
        }
        if (!supplier.chunkId) {
            logger.error(`No chunkId associated with the supplier to delete ${supplierId} : ${supplier.name}`)
            return
        }
        logger.info(`Deleting Trieve chunk for supplier ${supplierId} : ${supplier.name}`)
        await trieve.deleteChunkById({
            chunkId: supplier.chunkId,
            trDataset,
        })
        logger.info(`Successfully deleted Trieve chunk for supplier ${supplierId} : ${supplier.name}`)
    },
)
