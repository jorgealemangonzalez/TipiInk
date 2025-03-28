import { logger } from 'firebase-functions'
import { z } from 'zod'

import { Recipe, RecipeIngredient, RecipePreparation, RecipeWithIngredients, getProductionCost } from '@tipi/shared'

import { onAIToolRequest } from '../FirebaseInit'
import { generateUpdatePayload } from '../openai/OpenAIService'
import { getSimilarRecipes } from '../trieve/TrieveService'
import { UpdateRecipeRequest } from '../types/UpdateRecipe'
import { UpdateRecipeRequestSchema } from '../types/UpdateRecipeRequestSchema'
import { UpdateRecipeIngredientInput } from './CreateRecipe'
import {
    createOrUpdateRecipeIngredient as buildRecipeIngredientCreatingIngredient,
    mapToFullRecipeIngredient,
    mergeAndUpdateRecipeIngredient,
} from './RecipeIngredientService'
import { getRecipeWithIngredientsById, updateRecipe as updateRecipeRepo } from './RecipeRepository'

// Schema for the updateRecipeByText request
export const UpdateRecipeByTextRequestSchema = z.object({
    changes: z.string().describe('Texto que describe los cambios a realizar en la receta'),
})

// Type for the updateRecipeByText request
export type UpdateRecipeByTextRequest = z.infer<typeof UpdateRecipeByTextRequestSchema>

const mergeAndCreateRecipeIngredients = async (
    existingRecipe: RecipeWithIngredients,
    ingredientsToRemove: RecipeIngredient['id'][],
    newIngredients: UpdateRecipeIngredientInput[],
    servingsPerProduction: number,
): Promise<RecipeIngredient[]> => {
    const existingIngredients = existingRecipe.ingredients
    if (!newIngredients?.length && !ingredientsToRemove?.length) {
        return existingIngredients
    }

    // Filter out ingredients that should be removed
    const ingredientsToKeep = existingIngredients.filter(ingredient => !ingredientsToRemove.includes(ingredient.id))

    // Log all
    console.log('--------------------------------')
    console.log('Ingredients to keep', ingredientsToKeep)
    console.log('Ingredients to remove', ingredientsToRemove)
    console.log('New ingredients', newIngredients)
    console.log('--------------------------------')
    for (const newIngredient of newIngredients) {
        const existingIndex = ingredientsToKeep.findIndex(i => i.id === newIngredient.id)

        if (existingIndex >= 0) {
            // Update existing ingredient
            ingredientsToKeep[existingIndex] = await mergeAndUpdateRecipeIngredient(
                ingredientsToKeep[existingIndex],
                mapToFullRecipeIngredient(newIngredient),
                servingsPerProduction,
            )
        } else {
            // Add new ingredient
            const createdIngredient = await buildRecipeIngredientCreatingIngredient(
                mapToFullRecipeIngredient(newIngredient),
                servingsPerProduction,
            )
            ingredientsToKeep.push(createdIngredient)
        }
    }

    return ingredientsToKeep
}
const mergePreparation = (
    existingPreparation: RecipePreparation,
    newPreparation: Partial<RecipePreparation>,
): RecipePreparation => {
    return {
        ...existingPreparation,
        ...newPreparation,
    }
}
const updateRecipeFunction = async (recipeData: UpdateRecipeRequest): Promise<Recipe> => {
    // First get the recipe to ensure it exists
    const recipe = await getRecipeWithIngredientsById(recipeData.id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ingredients, preparation, ...rest } = recipeData
    const fieldsToUpdate: Partial<Recipe> = {
        ...rest,
    }

    logger.info('Updating recipe', { oldRecipe: recipe, newRecipeDetails: recipeData })

    if (recipeData.ingredients?.length || recipeData.ingredientsToRemove?.length) {
        fieldsToUpdate.ingredients = await mergeAndCreateRecipeIngredients(
            recipe,
            recipeData.ingredientsToRemove || [],
            recipeData.ingredients || [],
            recipeData.servingsPerProduction || recipe.servingsPerProduction,
        )

        fieldsToUpdate.productionCost = getProductionCost(fieldsToUpdate.ingredients)
    }

    // Process preparation if needed
    fieldsToUpdate.preparation = recipeData.preparation
        ? mergePreparation(recipe.preparation, recipeData.preparation)
        : recipe.preparation

    return updateRecipeRepo(recipeData.id, fieldsToUpdate)
}

export const updateRecipeTool = onAIToolRequest(UpdateRecipeRequestSchema, async (request: UpdateRecipeRequest) => {
    return updateRecipeFunction(request)
})

/**
 * Endpoint to update a recipe based on text description of changes
 */
export const updateRecipeByTextTool = onAIToolRequest(
    UpdateRecipeByTextRequestSchema,
    async (request: UpdateRecipeByTextRequest) => {
        try {
            // 1. Get similar recipes from Trieve
            const similarRecipes = await getSimilarRecipes(request.changes)
            if (!similarRecipes.length) {
                throw new Error('No similar recipes found')
            }

            logger.info('Found similar recipes', {
                numRecipes: similarRecipes.length,
                recipeIds: similarRecipes.map(r => r.id),
            })

            // 2. Generate update payload with OpenAI
            const updatePayload = await generateUpdatePayload(request.changes, similarRecipes)

            // 3. Process the update with existing function
            const result = await updateRecipeFunction(updatePayload)

            logger.info('Recipe updated by text', {
                cambios: request.changes,
                recipeId: result.id,
            })

            return result
        } catch (error) {
            logger.error('Error in updateRecipeByText', { error, request })
            throw new Error(`Failed to update recipe: ${error}`)
        }
    },
)
