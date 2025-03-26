#!/usr/bin/env node
const { Command } = require('commander')
const { TrieveSDK } = require('trieve-ts-sdk')
const { getFirestoreInstance } = require('../platform/firebase')
const { getConfig } = require('../config')

const command = new Command('sync-recipes-to-trieve')

command
    .description('Synchronize recipes from Firestore to Trieve search engine')
    .option('--dry-run', 'Run without making changes to Firestore', false)
    .option('--batch-size <size>', 'Number of recipes to process in each batch', '25')
    .action(async options => {
        await syncRecipesToTrieve(options)
    })

// Function to migrate recipes from Firestore to Trieve
async function syncRecipesToTrieve(options) {
    const isDryRun = options.dryRun
    const batchSize = parseInt(options.batchSize, 10)

    try {
        console.log('Starting sync of recipes from Firestore to Trieve...')
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
            datasetId: 'c7b4534b-ed9b-40b7-8b20-268b76bf4217',
        })

        // Interface to track migration stats
        const stats = {
            total: 0,
            success: 0,
            skipped: 0,
            error: 0,
            errors: [],
        }

        // Get all recipes from Firestore
        const recipesSnapshot = await firestore.collection('organizations/demo/recipes').get()

        if (recipesSnapshot.empty) {
            console.log('No recipes found in Firestore.')
            return
        }

        const totalRecipes = recipesSnapshot.size
        console.log(`Found ${totalRecipes} recipes to process.`)

        // Initialize migration stats
        stats.total = totalRecipes

        // Convert docs to array for batch processing
        const recipes = recipesSnapshot.docs

        // Process recipes in batches
        for (let i = 0; i < recipes.length; i += batchSize) {
            const batch = recipes.slice(i, i + batchSize)
            console.log(
                `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recipes.length / batchSize)} (${
                    batch.length
                } recipes)`,
            )

            // Process each recipe in the current batch
            for (const doc of batch) {
                const recipeId = doc.id
                const recipeData = doc.data()

                try {
                    console.log(`Processing recipe: ${recipeData.name} (${recipeId})`)

                    if (recipeData.chunkId) {
                        console.log(`Recipe ${recipeId} already has chunkId ${recipeData.chunkId}, updating tag_set...`)

                        try {
                            if (!isDryRun) {
                                await trieve.updateChunk({
                                    chunk_id: recipeData.chunkId,
                                    tag_set: ['recipe'],
                                })
                                console.log(`Updated chunk ${recipeData.chunkId} with tag_set ['recipe']`)
                            } else {
                                console.log(`DRY RUN: Would update chunk ${recipeData.chunkId} with tag_set ['recipe']`)
                            }
                            stats.skipped++
                            continue
                        } catch (updateError) {
                            console.error(
                                `Error updating chunk ${recipeData.chunkId} for recipe ${recipeId}:`,
                                updateError,
                            )
                            stats.error++
                            stats.errors.push({
                                id: recipeId,
                                error:
                                    updateError instanceof Error ? updateError.message : 'Unknown error during update',
                            })
                            continue
                        }
                    }

                    // Create chunk in Trieve
                    const response = await trieve.createChunk({
                        chunk_html: JSON.stringify({ id: recipeId, ...recipeData }),
                        metadata: {
                            recipeId: recipeId,
                        },
                        tag_set: ['recipe'],
                    })

                    // In the new version of the SDK, the structure is different
                    const chunkId = response.chunk_metadata.id
                    console.log(`Recipe ${recipeId} successfully indexed in Trieve with chunkId ${chunkId}`)

                    // Update recipe in Firestore with the chunkId if not a dry run
                    if (!isDryRun) {
                        await firestore.collection('organizations/demo/recipes').doc(recipeId).update({
                            chunkId: chunkId,
                        })
                        console.log('Updated Firestore document with chunkId')
                    } else {
                        console.log(`DRY RUN: Would update recipe ${recipeId} with chunkId ${chunkId}`)
                    }

                    stats.success++
                } catch (error) {
                    console.error(`Error syncing recipe ${recipeId}:`, error)
                    stats.error++
                    stats.errors.push({
                        id: recipeId,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                }
            }

            // Print batch progress
            console.log(`Batch ${Math.floor(i / batchSize) + 1} completed.`)
            console.log(
                `Progress: ${Math.min(i + batchSize, recipes.length)}/${recipes.length} recipes processed (${Math.round(
                    (Math.min(i + batchSize, recipes.length) / recipes.length) * 100,
                )}%)`,
            )
            console.log(`Current stats: Success=${stats.success}, Skipped=${stats.skipped}, Errors=${stats.error}`)
            console.log('-----------------------------------')
        }

        // Print migration summary
        console.log('\n==== Sync Summary ====')
        console.log(`Total recipes: ${stats.total}`)
        console.log(`Successfully synced: ${stats.success}`)
        console.log(`Skipped (already had chunkId): ${stats.skipped}`)
        console.log(`Failed syncs: ${stats.error}`)

        if (stats.errors.length > 0) {
            console.log('\nErrors:')
            stats.errors.forEach(({ id, error }) => {
                console.log(`- Recipe ${id}: ${error}`)
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
