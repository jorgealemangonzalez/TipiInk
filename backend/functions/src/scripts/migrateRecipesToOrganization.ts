#!/usr/bin/env ts-node
import * as admin from 'firebase-admin'

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const batchSize = args.includes('--batch-size') ? parseInt(args[args.indexOf('--batch-size') + 1], 10) : 25 // Default batch size
const organizationId = args.includes('--org-id') ? args[args.indexOf('--org-id') + 1] : 'demo' // Default organization ID
const isProd = args.includes('--prod')
const isLocal = args.includes('--local')

// Configuration helper
const getConfig = () => ({
    prod: isProd,
    local: isLocal,
})

// Initialize Firebase Admin SDK
let isAppInitialized = false

const initializeApp = () => {
    if (!isAppInitialized) {
        console.log('Initializing Firebase app...')
        if (!getConfig().prod) {
            console.log('Using local emulators...')
            process.env.FIRESTORE_EMULATOR_HOST = 'localhost:5003'
            process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:5004'
        } else {
            console.log('Using production environment...')
        }
        admin.initializeApp({
            projectId: 'tipi-ink',
            credential: admin.credential.applicationDefault(), // To make it work: gcloud auth application-default login
        })

        isAppInitialized = true
    }
}

// Initialize Firebase
initializeApp()

// Initialize Firestore
const firestore = admin.firestore()

// Interface to track migration stats
interface MigrationStats {
    total: number
    success: number
    skipped: number
    error: number
    errors: Array<{ id: string; error: string }>
}

// Function to migrate recipes from root collection to organization subcollection
async function migrateRecipesToOrganization() {
    try {
        console.log(`Starting migration of recipes from 'recipes' to 'organizations/${organizationId}/recipes'...`)
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

            // Create a Firestore batch for efficient writes
            const writeBatch = firestore.batch()

            // Process each recipe in the current batch
            for (const doc of batch) {
                const recipeId = doc.id
                const recipeData = doc.data()

                try {
                    console.log(`Processing recipe: ${recipeData.name} (${recipeId})`)

                    // Reference to the new document location
                    const targetDocRef = firestore
                        .collection('organizations')
                        .doc(organizationId)
                        .collection('recipes')
                        .doc(recipeId)

                    // Check if the recipe already exists in the target location
                    const existingDoc = await targetDocRef.get()

                    if (existingDoc.exists) {
                        console.log(`Recipe ${recipeId} already exists in target collection, skipping.`)
                        stats.skipped++
                        continue
                    }

                    // Add set operation to batch
                    if (!isDryRun) {
                        writeBatch.set(targetDocRef, recipeData)
                    } else {
                        console.log(
                            `DRY RUN: Would copy recipe ${recipeId} to organizations/${organizationId}/recipes/${recipeId}`,
                        )
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

            // Commit the batch write if not a dry run
            if (!isDryRun && stats.success > 0) {
                await writeBatch.commit()
                console.log(`Committed batch of ${stats.success} recipes to Firestore.`)
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
        console.log(`Skipped (already existed in target): ${stats.skipped}`)
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
migrateRecipesToOrganization()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Unhandled error during migration:', error)
        process.exit(1)
    })
