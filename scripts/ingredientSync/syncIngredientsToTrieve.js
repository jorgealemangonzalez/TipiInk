#!/usr/bin/env node
const { Command } = require('commander')
const { initializeApp } = require('../platform/firebase')
// Import the repositories and services from the backend code

// Initialize Firebase Admin if needed (this is already done in the backend code)
// require('@tipi/functions/lib/FirebaseInit')

const command = new Command('sync-ingredients-to-trieve')

command
    .description('Synchronize ingredients from Firestore to Trieve search engine')
    .option('--dry-run', 'Run without making changes to Firestore', false)
    .option('--batch-size <size>', 'Number of ingredients to process in each batch', '25')
    .action(async options => {
        await syncIngredientsToTrieve(options)
    })

// Function to migrate ingredients from Firestore to Trieve
async function syncIngredientsToTrieve(options) {
    const { getIngredientsRef, getIngredientRef } = require('@tipi/functions/lib/src/ingredients/IngredientsRepository')
    const { getFirestoreInstance } = require('../platform/firebase')
    const {
        getOrCreateChunkGroup,
        createIngredientInTrieve,
        updateIngredientInTrieve,
    } = require('@tipi/functions/lib/src/trieve/TrieveService')

    const isDryRun = options.dryRun
    const batchSize = parseInt(options.batchSize, 10)

    try {
        console.log('Starting sync of ingredients from Firestore to Trieve...')
        if (isDryRun) {
            console.log('DRY RUN: No changes will be made to Firestore or Trieve.')
        }
        console.log(`Batch size: ${batchSize}`)

        // Interface to track migration stats
        const stats = {
            total: 0,
            success: 0,
            skipped: 0,
            error: 0,
            errors: [],
        }

        // Get or create the ingredients group using the backend service
        let ingredientGroupId = 'mock-group-id-for-dry-run'

        if (!isDryRun) {
            try {
                console.log('Getting or creating ingredient chunk group...')
                ingredientGroupId = await getOrCreateChunkGroup('ingredients')
                console.log(`Using ingredient group with ID: ${ingredientGroupId}`)
            } catch (error) {
                console.error('Error getting or creating ingredient group:', error)
                process.exit(1)
            }
        } else {
            console.log('DRY RUN: Using mock ingredient group ID:', ingredientGroupId)
        }

        // Get all ingredients using the backend repository
        console.log('Fetching all ingredients from Firestore...')
        const ingredientsRef = getIngredientsRef()
        //const ingredientsRef = getFirestoreInstance().collection('organizations/demo/ingredients')
        const ingredientsSnapshot = await ingredientsRef.get()

        if (ingredientsSnapshot.empty) {
            console.log('No ingredients found in Firestore.')
            return
        }

        const totalIngredients = ingredientsSnapshot.size
        console.log(`Found ${totalIngredients} ingredients to process.`)

        // Initialize migration stats
        stats.total = totalIngredients

        // Convert docs to array for batch processing
        const ingredients = ingredientsSnapshot.docs

        // Process ingredients in batches
        for (let i = 0; i < ingredients.length; i += batchSize) {
            const batch = ingredients.slice(i, i + batchSize)
            console.log(
                `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ingredients.length / batchSize)} (${
                    batch.length
                } ingredients)`,
            )

            // Process each ingredient in the current batch
            for (const doc of batch) {
                const ingredientId = doc.id
                const ingredient = doc.data()

                try {
                    console.log(`Processing ingredient: ${ingredient.name} (${ingredientId})`)

                    if (ingredient.chunkId) {
                        console.log(`Ingredient ${ingredientId} already has chunkId ${ingredient.chunkId}, updating...`)

                        if (!isDryRun) {
                            try {
                                // Use the backend service to update the ingredient in Trieve
                                await updateIngredientInTrieve(ingredientId, ingredient.chunkId)
                                console.log(`Updated chunk ${ingredient.chunkId} for ingredient ${ingredientId}`)
                                stats.skipped++
                            } catch (updateError) {
                                console.error(
                                    `Error updating chunk ${ingredient.chunkId} for ingredient ${ingredientId}:`,
                                    updateError,
                                )
                                stats.error++
                                stats.errors.push({
                                    id: ingredientId,
                                    error:
                                        updateError instanceof Error
                                            ? updateError.message
                                            : 'Unknown error during update',
                                })
                            }
                        } else {
                            console.log(
                                `DRY RUN: Would update chunk ${ingredient.chunkId} for ingredient ${ingredientId}`,
                            )
                            stats.skipped++
                        }
                    } else {
                        // Create a new chunk for this ingredient using the backend service
                        if (!isDryRun) {
                            try {
                                const response = await createIngredientInTrieve(ingredient)

                                // The chunkId is automatically added to the ingredient in Firestore by the service
                                const chunkId = response.chunk_metadata.id
                                console.log(
                                    `Ingredient ${ingredientId} successfully indexed in Trieve with chunkId ${chunkId}`,
                                )

                                stats.success++
                            } catch (error) {
                                console.error(`Error creating Trieve chunk for ingredient ${ingredientId}:`, error)
                                stats.error++
                                stats.errors.push({
                                    id: ingredientId,
                                    error: error instanceof Error ? error.message : 'Unknown error',
                                })
                            }
                        } else {
                            console.log(`DRY RUN: Would create new Trieve chunk for ingredient ${ingredientId}`)
                            stats.success++
                        }
                    }
                } catch (error) {
                    console.error(`Error processing ingredient ${ingredientId}:`, error)
                    stats.error++
                    stats.errors.push({
                        id: ingredientId,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                }
            }

            // Print batch progress
            console.log(`Batch ${Math.floor(i / batchSize) + 1} completed.`)
            console.log(
                `Progress: ${Math.min(i + batchSize, ingredients.length)}/${ingredients.length} ingredients processed (${Math.round(
                    (Math.min(i + batchSize, ingredients.length) / ingredients.length) * 100,
                )}%)`,
            )
            console.log(`Current stats: Success=${stats.success}, Skipped=${stats.skipped}, Errors=${stats.error}`)
            console.log('-----------------------------------')
        }

        // Print migration summary
        console.log('\n==== Sync Summary ====')
        console.log(`Total ingredients: ${stats.total}`)
        console.log(`Successfully synced: ${stats.success}`)
        console.log(`Skipped (already synced): ${stats.skipped}`)
        console.log(`Failed syncs: ${stats.error}`)

        if (stats.errors.length > 0) {
            console.log('\nErrors:')
            stats.errors.forEach(({ id, error }) => {
                console.log(`- Ingredient ${id}: ${error}`)
            })
        }

        console.log('\nSync completed.')
        if (isDryRun) {
            console.log('This was a dry run. No changes were made to Firestore or Trieve.')
        }
    } catch (error) {
        console.error('Sync failed:', error)
        process.exit(1)
    }
}

module.exports = command
