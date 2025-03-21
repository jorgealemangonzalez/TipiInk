#!/usr/bin/env ts-node
import * as admin from 'firebase-admin'
import { ChunkMetadata, TrieveSDK } from 'trieve-ts-sdk'

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const batchSize = args.includes('--batch-size') ? parseInt(args[args.indexOf('--batch-size') + 1], 10) : 25 // Default batch size

// Initialize Firebase Admin SDK with service account
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'tipi-ink',
})

// Initialize Firestore
const firestore = admin.firestore()

// Initialize Trieve SDK
const trieve = new TrieveSDK({
    apiKey: 'tr-yEror1mDshxFW95Prl7cEQ6B4RFmiVcT',
    // Use production dataset ID
    datasetId: 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa',
})

// Interface to track migration stats
interface MigrationStats {
    total: number
    success: number
    skipped: number
    error: number
    errors: Array<{ id: string; error: string }>
}

// Function to migrate recipes from Firestore to Trieve
async function migrateRecipesToTrieve() {
    try {
        console.log('Starting migration of recipes from Firestore to Trieve...')
        if (isDryRun) {
            console.log('DRY RUN: No changes will be made to Firestore.')
        }
        console.log(`Batch size: ${batchSize}`)

        // Get all recipes from Firestore
        const recipesSnapshot = await firestore.collection('recipes').get()

        if (recipesSnapshot.empty) {
            console.log('No recipes found in Firestore.')
            return
        }

        const totalRecipes = recipesSnapshot.size
        console.log(`Found ${totalRecipes} recipes to process.`)

        // Initialize migration stats
        const stats: MigrationStats = {
            total: totalRecipes,
            success: 0,
            skipped: 0,
            error: 0,
            errors: [],
        }

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

                    // Skip if recipe already has a chunkId (already in Trieve)
                    if (recipeData.chunkId) {
                        console.log(`Recipe ${recipeId} already has chunkId ${recipeData.chunkId}, skipping.`)
                        stats.skipped++
                        continue
                    }

                    // Create chunk in Trieve
                    const response = await trieve.createChunk({
                        chunk_html: JSON.stringify({ id: recipeId, ...recipeData }),
                        metadata: {
                            recipeId: recipeId,
                        },
                    })

                    const chunkId = (response.chunk_metadata as ChunkMetadata).id
                    console.log(`Recipe ${recipeId} successfully indexed in Trieve with chunkId ${chunkId}`)

                    // Update recipe in Firestore with the chunkId if not a dry run
                    if (!isDryRun) {
                        await firestore.collection('recipes').doc(recipeId).update({
                            chunkId: chunkId,
                        })
                        console.log('Updated Firestore document with chunkId')
                    } else {
                        console.log(`DRY RUN: Would update recipe ${recipeId} with chunkId ${chunkId}`)
                    }

                    stats.success++
                } catch (error) {
                    console.error(`Error migrating recipe ${recipeId}:`, error)
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
        console.log('\n==== Migration Summary ====')
        console.log(`Total recipes: ${stats.total}`)
        console.log(`Successfully migrated: ${stats.success}`)
        console.log(`Skipped (already had chunkId): ${stats.skipped}`)
        console.log(`Failed migrations: ${stats.error}`)

        if (stats.errors.length > 0) {
            console.log('\nErrors:')
            stats.errors.forEach(({ id, error }) => {
                console.log(`- Recipe ${id}: ${error}`)
            })
        }

        console.log('\nMigration completed.')
        if (isDryRun) {
            console.log('This was a dry run. No changes were made to Firestore.')
        }
    } catch (error) {
        console.error('Migration failed:', error)
    }
}

// Execute migration
migrateRecipesToTrieve()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Unhandled error during migration:', error)
        process.exit(1)
    })
