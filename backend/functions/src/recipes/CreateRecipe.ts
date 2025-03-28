import { logger } from 'firebase-functions'
import { z } from 'zod'

import { Recipe, RecipeIngredient, getProductionCost } from '@tipi/shared'

import { Request, onAIToolRequest, onCallWithSecretKey } from '../FirebaseInit'
import { CreateRecipeRequest, CreateRecipeResponse } from '../types/CreateRecipe'
import { CreateRecipeRequestSchema } from '../types/CreateRecipeRequestSchema'
import { UpdateRecipeRequestSchema } from '../types/UpdateRecipeRequestSchema'
import { createOrUpdateRecipeIngredient, mapToFullRecipeIngredient } from './RecipeIngredientService'
import { createRecipe } from './RecipeRepository'

export type UpdateRecipeIngredientInput = NonNullable<z.infer<typeof UpdateRecipeRequestSchema>['ingredients']>[number]

const createRecipeFunction = async (recipeData: CreateRecipeRequest['recipe']): Promise<Recipe> => {
    logger.info('Creating recipe', { recipeData })

    // Process ingredients if present
    const ingredients: RecipeIngredient[] = []

    if (recipeData.ingredients?.length) {
        // Process each ingredient
        for (const recipeIngredientInput of recipeData.ingredients) {
            ingredients.push(
                await createOrUpdateRecipeIngredient(
                    mapToFullRecipeIngredient(recipeIngredientInput),
                    recipeData.servingsPerProduction,
                ),
            )
        }
    }

    // Calculate production cost based on ingredients
    const productionCost = getProductionCost(ingredients)

    // Create the recipe in the repository
    return createRecipe({
        ...recipeData,
        ingredients,
        productionCost,
    })
}

export const createRecipeHandler = onCallWithSecretKey(
    async (request: Request<CreateRecipeRequest>): Promise<CreateRecipeResponse> => {
        try {
            const recipeData = request.data.recipe
            const newRecipe = await createRecipeFunction(recipeData)
            return {
                success: true,
                recipe: newRecipe,
            }
        } catch (error) {
            logger.error('Error creating recipe:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            }
        }
    },
)

export const createRecipeTool = onAIToolRequest(CreateRecipeRequestSchema, async (request: CreateRecipeRequest) => {
    const newRecipe = await createRecipeFunction(request.recipe)
    return newRecipe
})
