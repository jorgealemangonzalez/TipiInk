const { getFirestoreInstance } = require('../firebase')

// Migration stats
const stats = {
    total: 0,
    success: 0,
    error: 0,
    skipped: 0,
    dryRun: false,
}

/**
 * Calculate production cost from recipe ingredients
 * @param {Array} ingredients Recipe ingredients
 * @returns {number} Calculated production cost
 */
function getProductionCost(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) {
        return 0
    }
    return ingredients.reduce(
        (acc, ingredient) => acc + (ingredient.pricePerUnit || 0) * (ingredient.quantityPerProduction || 0),
        0,
    )
}

/**
 * Update the recipe with production cost
 * @param {string} recipeId ID of the recipe to update
 * @param {object} recipeData Recipe data
 * @param {string} organizationId Organization ID
 * @param {boolean} dryRun Whether to perform a dry run
 * @returns {Promise} Promise that resolves when the recipe is updated
 */
async function updateRecipeWithProductionCost(recipeId, recipeData, organizationId, dryRun) {
    try {
        // Calculate production cost
        const productionCost = getProductionCost(recipeData.ingredients)

        console.log(`Recipe: ${recipeData.name} (${recipeId})`)
        console.log(`  - Current production cost: ${recipeData.productionCost || 'Not set'}`)
        console.log(`  - Calculated production cost: ${productionCost}`)

        if (recipeData.productionCost !== undefined && recipeData.productionCost === productionCost) {
            console.log('  - Skipping: Production cost already set correctly')
            stats.skipped++
            return
        }

        if (!dryRun) {
            // Update recipe with production cost
            const db = getFirestoreInstance()
            const recipeRef = db.collection(`organizations/${organizationId}/recipes`).doc(recipeId)

            await recipeRef.update({
                productionCost,
                updatedAt: new Date(),
            })

            console.log('  - ✅ Updated successfully')
        } else {
            console.log('  - 🔍 Would update (dry run)')
        }

        stats.success++
    } catch (error) {
        console.error(`  - ❌ Error updating recipe ${recipeId}:`, error)
        stats.error++
    }
}

/**
 * Run the migration
 * @param {string} organizationId Organization ID
 * @returns {Promise} Promise that resolves when the migration is complete
 */
async function migrateProductionCosts(organizationId, options = {}) {
    const dryRun = options.dryRun || false
    stats.dryRun = dryRun

    console.log(`Starting migration to add production costs to recipes for organization '${organizationId}'...`)
    if (dryRun) {
        console.log('🔍 DRY RUN MODE: No changes will be made to the database')
    }

    // Get all recipes for the organization
    const db = getFirestoreInstance()
    const recipesSnapshot = await db.collection(`organizations/${organizationId}/recipes`).get()

    stats.total = recipesSnapshot.size
    console.log(`Found ${stats.total} recipes to process`)

    // Process each recipe
    const updatePromises = recipesSnapshot.docs.map(async doc => {
        const recipeId = doc.id
        const recipeData = doc.data()
        await updateRecipeWithProductionCost(recipeId, recipeData, organizationId, dryRun)
    })

    await Promise.all(updatePromises)

    // Print migration summary
    console.log('\n==== Migration Summary ====')
    console.log(`Total recipes: ${stats.total}`)
    console.log(`Successfully updated: ${stats.success}`)
    console.log(`Skipped (already correct): ${stats.skipped}`)
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
 * @param {string} organizationId Organization ID
 * @returns {Promise} Promise that resolves when the migration is complete
 */
module.exports = async organizationId => {
    if (!organizationId) {
        organizationId = 'demo'
        console.log('No organization ID provided, using default "demo"')
    }

    // Check if --dry-run flag was passed
    const dryRun = process.argv.includes('--dry-run')

    await migrateProductionCosts(organizationId, { dryRun })
}
