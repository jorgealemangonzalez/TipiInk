#!/usr/bin/env node
const { Command } = require('commander')
const { initializeApp } = require('../platform/firebase')
// Import the repositories and services from the backend code

// Initialize Firebase Admin if needed (this is already done in the backend code)
// require('@tipi/functions/lib/FirebaseInit')

const command = new Command('sync-ingredients-to-trieve')
let IngredientsRepository = undefined
let TrieveService = undefined

command
    .description('Synchronize ingredients from Firestore to Trieve search engine')
    .option('--dry-run', 'Run without making changes to Firestore', false)
    .option('--batch-size <size>', 'Number of ingredients to process in each batch', '25')
    .action(async options => {
        await syncIngredientsToTrieve(options)
    })

// Main function to orchestrate the sync process
async function syncIngredientsToTrieve(options) {
    initializeDependencies()

    const isDryRun = options.dryRun
    const batchSize = parseInt(options.batchSize, 10)
    const stats = initializeStats()

    logStartupInfo(isDryRun, batchSize)

    try {
        const ingredientGroupId = await setupIngredientGroup(isDryRun)

        const ingredients = await fetchIngredientsFromFirestore(stats)
        if (!ingredients) return

        await processIngredientsInBatches(ingredients, batchSize, isDryRun, stats)

        logSyncSummary(stats, isDryRun)
    } catch (error) {
        console.error('Sync failed:', error)
        process.exit(1)
    }
}

function initializeDependencies() {
    IngredientsRepository = require('@tipi/functions/lib/src/ingredients/IngredientsRepository')
    TrieveService = require('@tipi/functions/lib/src/trieve/TrieveService')
}

function initializeStats() {
    return {
        total: 0,
        success: 0,
        skipped: 0,
        error: 0,
        errors: [],
    }
}

function logStartupInfo(isDryRun, batchSize) {
    console.log('Starting sync of ingredients from Firestore to Trieve...')
    if (isDryRun) {
        console.log('DRY RUN: No changes will be made to Firestore or Trieve.')
    }
    console.log(`Batch size: ${batchSize}`)
}

async function setupIngredientGroup(isDryRun) {
    let ingredientGroupId = 'mock-group-id-for-dry-run'

    if (!isDryRun) {
        try {
            console.log('Getting or creating ingredient chunk group...')
            ingredientGroupId = await TrieveService.getOrCreateChunkGroup('ingredients')
            console.log(`Using ingredient group with ID: ${ingredientGroupId}`)
        } catch (error) {
            console.error('Error getting or creating ingredient group:', error)
            process.exit(1)
        }
    } else {
        console.log('DRY RUN: Using mock ingredient group ID:', ingredientGroupId)
    }

    return ingredientGroupId
}

async function fetchIngredientsFromFirestore(stats) {
    console.log('Fetching all ingredients from Firestore...')
    const ingredientsRef = IngredientsRepository.getIngredientsRef()
    const ingredientsSnapshot = await ingredientsRef.get()

    if (ingredientsSnapshot.empty) {
        console.log('No ingredients found in Firestore.')
        return null
    }

    const totalIngredients = ingredientsSnapshot.size
    console.log(`Found ${totalIngredients} ingredients to process.`)

    // Initialize migration stats
    stats.total = totalIngredients

    // Convert docs to array for batch processing
    return ingredientsSnapshot.docs
}

async function processIngredientsInBatches(ingredients, batchSize, isDryRun, stats) {
    for (let i = 0; i < ingredients.length; i += batchSize) {
        const batch = ingredients.slice(i, i + batchSize)
        const batchNumber = Math.floor(i / batchSize) + 1
        const totalBatches = Math.ceil(ingredients.length / batchSize)

        logBatchStart(batchNumber, totalBatches, batch.length)

        await processBatch(batch, isDryRun, stats)

        logBatchProgress(batchNumber, i, batch.length, ingredients.length, stats)
    }
}

function logBatchStart(batchNumber, totalBatches, batchSize) {
    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batchSize} ingredients)`)
}

async function processBatch(batch, isDryRun, stats) {
    for (const doc of batch) {
        const ingredientId = doc.id
        const ingredient = doc.data()

        try {
            console.log(`Processing ingredient: ${ingredient.name} (${ingredientId})`)

            if (ingredient.chunkId) {
                await processExistingIngredient(ingredientId, ingredient, isDryRun, stats)
            } else {
                await processNewIngredient(ingredientId, ingredient, isDryRun, stats)
            }
        } catch (error) {
            handleIngredientError(ingredientId, error, stats)
        }
    }
}

async function processExistingIngredient(ingredientId, ingredient, isDryRun, stats) {
    console.log(`Ingredient ${ingredientId} already has chunkId ${ingredient.chunkId}, updating...`)

    if (!isDryRun) {
        try {
            await TrieveService.updateIngredientInTrieve(ingredientId, ingredient.chunkId)
            console.log(`Updated chunk ${ingredient.chunkId} for ingredient ${ingredientId}`)
            stats.skipped++
        } catch (updateError) {
            console.error(`Error updating chunk ${ingredient.chunkId} for ingredient ${ingredientId}:`, updateError)
            stats.error++
            stats.errors.push({
                id: ingredientId,
                error: updateError instanceof Error ? updateError.message : 'Unknown error during update',
            })
        }
    } else {
        console.log(`DRY RUN: Would update chunk ${ingredient.chunkId} for ingredient ${ingredientId}`)
        stats.skipped++
    }
}

async function processNewIngredient(ingredientId, ingredient, isDryRun, stats) {
    if (!isDryRun) {
        try {
            const response = await TrieveService.createIngredientInTrieve(ingredient)
            const chunkId = response.chunk_metadata.id
            console.log(`Ingredient ${ingredientId} successfully indexed in Trieve with chunkId ${chunkId}`)
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

function handleIngredientError(ingredientId, error, stats) {
    console.error(`Error processing ingredient ${ingredientId}:`, error)
    stats.error++
    stats.errors.push({
        id: ingredientId,
        error: error instanceof Error ? error.message : 'Unknown error',
    })
}

function logBatchProgress(batchNumber, startIndex, batchSize, totalIngredients, stats) {
    const processedCount = Math.min(startIndex + batchSize, totalIngredients)
    const percentComplete = Math.round((processedCount / totalIngredients) * 100)

    console.log(`Batch ${batchNumber} completed.`)
    console.log(`Progress: ${processedCount}/${totalIngredients} ingredients processed (${percentComplete}%)`)
    console.log(`Current stats: Success=${stats.success}, Skipped=${stats.skipped}, Errors=${stats.error}`)
    console.log('-----------------------------------')
}

function logSyncSummary(stats, isDryRun) {
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
}

module.exports = command
