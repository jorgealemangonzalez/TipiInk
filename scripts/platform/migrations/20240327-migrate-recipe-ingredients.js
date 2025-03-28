const { getFirestoreInstance } = require('../firebase')
const { Timestamp } = require('firebase-admin/firestore')

// Migration stats
const stats = {
    total: 0,
    processed: 0,
    success: 0,
    error: 0,
    skipped: 0,
    dryRun: false,
}

/**
 * Get or create an ingredient in the ingredients collection
 * @param {object} recipeIngredient - The recipe ingredient from the recipe document
 * @param {string} organizationId - Organization ID
 * @param {boolean} dryRun - Whether to perform a dry run
 * @returns {Promise<string>} - The ID of the ingredient
 */
async function getOrCreateIngredient(recipeIngredient, organizationId, dryRun) {
    const db = getFirestoreInstance()
    const ingredientsRef = db.collection(`organizations/${organizationId}/ingredients`)

    // First, check if we already have the ingredient in the ingredients collection
    let ingredientId = recipeIngredient.id

    if (recipeIngredient.id) {
        // Ingredient already exists in the ingredients collection
        console.log(`  - Ingredient ${ingredientId} already exists in ingredients collection`)
        return ingredientId
    }

    if (!dryRun) {
        // Create the ingredient in the ingredients collection
        const now = Timestamp.now()
        ingredientId = (
            await ingredientsRef.add({
                name: recipeIngredient.name || 'Unknown Ingredient',
                unit: recipeIngredient.unit || 'ud',
                pricePerUnit: recipeIngredient.pricePerUnit || 0,
                createdAt: now,
                updatedAt: now,
            })
        ).id
        console.log(`  - ✅ Created ingredient ${ingredientId} in ingredients collection`)
    } else {
        console.log(`  - 🔍 Would create ingredient ${ingredientId} in ingredients collection (dry run)`)
    }

    return ingredientId
}

/**
 * Process a recipe to extract ingredients to the ingredients collection
 * @param {string} recipeId - ID of the recipe
 * @param {object} recipeData - Recipe data
 * @param {string} organizationId - Organization ID
 * @param {boolean} dryRun - Whether to perform a dry run
 * @returns {Promise<void>}
 */
async function processRecipe(recipeId, recipeData, organizationId, dryRun) {
    try {
        console.log(`Processing recipe: ${recipeData.name} (${recipeId})`)
        stats.processed++

        // Skip if the recipe doesn't have ingredients
        if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
            console.log(`  - Skipping: Recipe has no ingredients`)
            stats.skipped++
            return
        }

        const db = getFirestoreInstance()
        const recipeRef = db.collection(`organizations/${organizationId}/recipes`).doc(recipeId)

        // Process each ingredient to ensure it exists in the ingredients collection
        const ingredientPromises = recipeData.ingredients.map(async ingredient => {
            const ingredientId = await getOrCreateIngredient(ingredient, organizationId, dryRun)

            // Return the recipe ingredient reference
            return {
                id: ingredientId,
                type: ingredient.type || 'ingredient',
                pricePerProduction: ingredient.quantityPerProduction * ingredient.pricePerUnit || 0,
                quantityPerProduction: ingredient.quantityPerProduction || 0,
            }
        })

        const ingredientReferences = await Promise.all(ingredientPromises)

        if (!dryRun && ingredientReferences.length > 0) {
            // Update the recipe with the new ingredient references
            await recipeRef.update({
                ingredients: ingredientReferences,
                updatedAt: Timestamp.now(),
            })

            console.log(`  - ✅ Updated recipe with ${ingredientReferences.length} ingredient references`)
        } else {
            console.log(
                `  - 🔍 Would update recipe with ${ingredientReferences.length} ingredient references (dry run)`,
            )
        }

        stats.success++
    } catch (error) {
        console.error(`  - ❌ Error processing recipe ${recipeId}:`, error)
        stats.error++
    }
}

/**
 * Run the migration to move recipe ingredients to the ingredients collection
 * @param {string} organizationId - Organization ID
 * @param {object} options - Migration options
 * @returns {Promise<void>}
 */
async function migrateRecipeIngredients(organizationId, options = {}) {
    const dryRun = options.dryRun || false
    stats.dryRun = dryRun

    console.log(
        `Starting migration to move recipe ingredients to ingredients collection for organization '${organizationId}'...`,
    )
    if (dryRun) {
        console.log('🔍 DRY RUN MODE: No changes will be made to the database')
    }

    // Get all recipes for the organization
    const db = getFirestoreInstance()
    const recipesSnapshot = await db.collection(`organizations/${organizationId}/recipes`).get()

    stats.total = recipesSnapshot.size
    console.log(`Found ${stats.total} recipes to process`)

    // Process each recipe
    const processPromises = recipesSnapshot.docs.map(async doc => {
        const recipeId = doc.id
        const recipeData = doc.data()
        await processRecipe(recipeId, recipeData, organizationId, dryRun)
    })

    await Promise.all(processPromises)

    // Print migration summary
    console.log('\n==== Migration Summary ====')
    console.log(`Total recipes: ${stats.total}`)
    console.log(`Processed recipes: ${stats.processed}`)
    console.log(`Successfully updated: ${stats.success}`)
    console.log(`Skipped (no ingredients): ${stats.skipped}`)
    console.log(`Failed updates: ${stats.error}`)

    if (dryRun) {
        console.log('\n🔍 DRY RUN COMPLETED - No changes were made to the database')
        console.log('Run without --dry-run flag to apply changes')
    } else {
        console.log('\nMigration completed successfully!')
    }
}

/**
 * Entry point for the migration
 * @param {string} organizationId - Organization ID
 * @returns {Promise<void>}
 */
module.exports = async organizationId => {
    if (!organizationId) {
        organizationId = 'demo'
        console.log('No organization ID provided, using default "demo"')
    }

    await migrateRecipeIngredients(organizationId, { dryRun: false })
}
