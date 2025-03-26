import { logger } from 'firebase-functions'

import { onAIToolRequest } from '@/FirebaseInit'
import { UpdateRecipeRequest } from '@/types/UpdateRecipe'
import { UpdateRecipeRequestSchema } from '@/types/UpdateRecipeRequestSchema'
import { Recipe, RecipeIngredient, RecipePreparation, RecipeWithIngredients, getProductionCost } from '@tipi/shared'

import { UpdateRecipeIngredientInput } from './CreateRecipe'
import {
    createOrUpdateRecipeIngredient as buildRecipeIngredientCreatingIngredient,
    mergeAndUpdateRecipeIngredient,
} from './RecipeIngredientService'
import { getRecipeWithIngredientsById, updateRecipe as updateRecipeRepo } from './RecipeRepository'

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

    for (const newIngredient of newIngredients) {
        const existingIndex = ingredientsToKeep.findIndex(i => i.id === newIngredient.id)

        if (existingIndex >= 0) {
            // Update existing ingredient
            ingredientsToKeep[existingIndex] = await mergeAndUpdateRecipeIngredient(
                ingredientsToKeep[existingIndex],
                newIngredient,
                servingsPerProduction,
            )
        } else {
            // Add new ingredient
            const createdIngredient = await buildRecipeIngredientCreatingIngredient(
                newIngredient,
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
