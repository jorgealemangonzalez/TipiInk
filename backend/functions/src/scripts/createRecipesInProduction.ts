#!/usr/bin/env ts-node
import axios from 'axios'

import { CreateRecipeRequest, CreateRecipeResponse } from '../types/CreateRecipe'
import { recipes } from './recipes'

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const batchSize = args.includes('--batch-size') ? parseInt(args[args.indexOf('--batch-size') + 1], 10) : 5 // Default batch size

// Firebase function URL and server secret key
const FUNCTION_URL = 'https://createrecipe-37sheo4piq-ey.a.run.app'
const SERVER_SECRET_KEY = 'tipi-ink-secret-key'

if (!SERVER_SECRET_KEY) {
    console.error('ERROR: SERVER_SECRET_KEY environment variable is required')
    console.error('Please set it with: export SERVER_SECRET_KEY=your_secret_key')
    process.exit(1)
}

// Interface to track stats
interface ImportStats {
    total: number
    success: number
    error: number
    errors: Array<{ name: string; error: string }>
}

// Function to import recipes to Firestore via cloud function
async function importRecipesToFirestore() {
    try {
        console.log('Starting import of recipes to Firestore via createRecipe cloud function...')

        if (isDryRun) {
            console.log('DRY RUN: No changes will be made to Firestore.')
        }

        console.log(`Batch size: ${batchSize}`)
        console.log(`Total recipes to import: ${recipes.length}`)

        // Initialize stats
        const stats: ImportStats = {
            total: recipes.length,
            success: 0,
            error: 0,
            errors: [],
        }

        // Process recipes in batches
        for (let i = 0; i < recipes.length; i += batchSize) {
            const batch = recipes.slice(i, i + batchSize)
            console.log(
                `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recipes.length / batchSize)} (${
                    batch.length
                } recipes)`,
            )

            // Process each recipe in the current batch
            for (const recipe of batch) {
                try {
                    console.log(`Processing recipe: ${recipe.name}`)

                    if (isDryRun) {
                        console.log(`DRY RUN: Would create recipe "${recipe.name}"`)
                        stats.success++
                        continue
                    }

                    // Prepare the request payload
                    const requestData: CreateRecipeRequest = {
                        recipe,
                    }

                    // Call the cloud function
                    const response = await axios.post<CreateRecipeResponse>(
                        FUNCTION_URL,
                        { data: requestData },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-server-secret-key': SERVER_SECRET_KEY,
                            },
                        },
                    )

                    if (response.data.success) {
                        console.log(`Recipe "${recipe.name}" created successfully`)
                        stats.success++
                    } else {
                        throw new Error(response.data.error || 'Unknown error')
                    }
                } catch (error) {
                    console.error(`Error creating recipe "${recipe.name}":`, error)
                    stats.error++
                    stats.errors.push({
                        name: recipe.name,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                }

                // Add a small delay between requests to avoid overwhelming the function
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            // Print batch progress
            console.log(`Batch ${Math.floor(i / batchSize) + 1} completed.`)
            console.log(
                `Progress: ${Math.min(i + batchSize, recipes.length)}/${recipes.length} recipes processed (${Math.round(
                    (Math.min(i + batchSize, recipes.length) / recipes.length) * 100,
                )}%)`,
            )
            console.log(`Current stats: Success=${stats.success}, Errors=${stats.error}`)
            console.log('-----------------------------------')
        }

        // Print summary
        console.log('\n==== Import Summary ====')
        console.log(`Total recipes: ${stats.total}`)
        console.log(`Successfully imported: ${stats.success}`)
        console.log(`Failed imports: ${stats.error}`)

        if (stats.errors.length > 0) {
            console.log('\nErrors:')
            stats.errors.forEach(({ name, error }) => {
                console.log(`- Recipe "${name}": ${error}`)
            })
        }

        console.log('\nImport completed.')
        if (isDryRun) {
            console.log('This was a dry run. No changes were made to Firestore.')
        }
    } catch (error) {
        console.error('Import failed:', error)
    }
}

// Execute the import
importRecipesToFirestore()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Unhandled error during import:', error)
        process.exit(1)
    })
