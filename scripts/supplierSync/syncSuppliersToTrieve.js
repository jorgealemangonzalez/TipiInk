#!/usr/bin/env node
const { Command } = require('commander')
const { TrieveSDK } = require('trieve-ts-sdk')
const { getFirestoreInstance } = require('../platform/firebase')
const { getConfig } = require('../config')

const command = new Command('sync-suppliers-to-trieve')

command
    .description('Synchronize suppliers from Firestore to Trieve search engine')
    .option('--dry-run', 'Run without making changes to Firestore', false)
    .option('--batch-size <size>', 'Number of suppliers to process in each batch', '25')
    .action(async options => {
        await syncSuppliersToTrieve(options)
    })

// Function to migrate suppliers from Firestore to Trieve
async function syncSuppliersToTrieve(options) {
    const isDryRun = options.dryRun
    const batchSize = parseInt(options.batchSize, 10)

    try {
        console.log('Starting sync of suppliers from Firestore to Trieve...')
        if (isDryRun) {
            console.log('DRY RUN: No changes will be made to Firestore.')
        }
        console.log(`Batch size: ${batchSize}`)

        // Initialize Firestore
        const firestore = getFirestoreInstance()

        // Initialize Trieve SDK
        const trieve = new TrieveSDK({
            apiKey: 'tr-yEror1mDshxFW95Prl7cEQ6B4RFmiVcT',
            // Use production dataset ID
            datasetId: 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa',
        })

        // Interface to track migration stats
        const stats = {
            total: 0,
            success: 0,
            skipped: 0,
            error: 0,
            errors: [],
        }

        // Get all suppliers from Firestore
        const suppliersSnapshot = await firestore.collection('organizations/demo/suppliers').get()

        if (suppliersSnapshot.empty) {
            console.log('No suppliers found in Firestore.')
            return
        }

        const totalSuppliers = suppliersSnapshot.size
        console.log(`Found ${totalSuppliers} suppliers to process.`)

        // Initialize migration stats
        stats.total = totalSuppliers

        // Convert docs to array for batch processing
        const suppliers = suppliersSnapshot.docs

        // Process suppliers in batches
        for (let i = 0; i < suppliers.length; i += batchSize) {
            const batch = suppliers.slice(i, i + batchSize)
            console.log(
                `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(suppliers.length / batchSize)} (${
                    batch.length
                } suppliers)`,
            )

            // Process each supplier in the current batch
            for (const doc of batch) {
                const supplierId = doc.id
                const supplierData = doc.data()

                try {
                    console.log(`Processing supplier: ${supplierData.name} (${supplierId})`)

                    if (supplierData.chunkId) {
                        console.log(
                            `Supplier ${supplierId} already has chunkId ${supplierData.chunkId}, updating tag_set...`,
                        )

                        try {
                            if (!isDryRun) {
                                await trieve.updateChunk({
                                    chunk_id: supplierData.chunkId,
                                    tag_set: ['supplier'],
                                })
                                console.log(`Updated chunk ${supplierData.chunkId} with tag_set ['supplier']`)
                            } else {
                                console.log(
                                    `DRY RUN: Would update chunk ${supplierData.chunkId} with tag_set ['supplier']`,
                                )
                            }
                            stats.skipped++
                            continue
                        } catch (updateError) {
                            console.error(
                                `Error updating chunk ${supplierData.chunkId} for supplier ${supplierId}:`,
                                updateError,
                            )
                            stats.error++
                            stats.errors.push({
                                id: supplierId,
                                error:
                                    updateError instanceof Error ? updateError.message : 'Unknown error during update',
                            })
                            continue
                        }
                    }

                    // Create chunk in Trieve
                    const response = await trieve.createChunk({
                        chunk_html: JSON.stringify({ id: supplierId, ...supplierData }),
                        metadata: {
                            supplierId: supplierId,
                        },
                        tag_set: ['supplier'],
                    })

                    // In the new version of the SDK, the structure is different
                    const chunkId = response.chunk_metadata.id
                    console.log(`Supplier ${supplierId} successfully indexed in Trieve with chunkId ${chunkId}`)

                    // Update supplier in Firestore with the chunkId if not a dry run
                    if (!isDryRun) {
                        await firestore.collection('organizations/demo/suppliers').doc(supplierId).update({
                            chunkId: chunkId,
                        })
                        console.log('Updated Firestore document with chunkId')
                    } else {
                        console.log(`DRY RUN: Would update supplier ${supplierId} with chunkId ${chunkId}`)
                    }

                    stats.success++
                } catch (error) {
                    console.error(`Error syncing supplier ${supplierId}:`, error)
                    stats.error++
                    stats.errors.push({
                        id: supplierId,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                }
            }

            // Print batch progress
            console.log(`Batch ${Math.floor(i / batchSize) + 1} completed.`)
            console.log(
                `Progress: ${Math.min(i + batchSize, suppliers.length)}/${suppliers.length} suppliers processed (${Math.round(
                    (Math.min(i + batchSize, suppliers.length) / suppliers.length) * 100,
                )}%)`,
            )
            console.log(`Current stats: Success=${stats.success}, Skipped=${stats.skipped}, Errors=${stats.error}`)
            console.log('-----------------------------------')
        }

        // Print migration summary
        console.log('\n==== Sync Summary ====')
        console.log(`Total suppliers: ${stats.total}`)
        console.log(`Successfully synced: ${stats.success}`)
        console.log(`Skipped (already had chunkId): ${stats.skipped}`)
        console.log(`Failed syncs: ${stats.error}`)

        if (stats.errors.length > 0) {
            console.log('\nErrors:')
            stats.errors.forEach(({ id, error }) => {
                console.log(`- Supplier ${id}: ${error}`)
            })
        }

        console.log('\nSync completed.')
        if (isDryRun) {
            console.log('This was a dry run. No changes were made to Firestore.')
        }
    } catch (error) {
        console.error('Sync failed:', error)
        process.exit(1)
    }
}

module.exports = command
