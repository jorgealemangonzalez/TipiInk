import { logger } from 'firebase-functions'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import {
    NullToUndefined,
    Recipe,
    RecipeIngredient,
    RecipePreparation,
    RecipeWithIngredients,
    getProductionCost,
} from '@tipi/shared'

import { onAIToolRequest } from '../FirebaseInit'
import { onFunctionsInit } from '../firebase/OnFunctionsInit'
import { trieve } from '../trieve/TrieveService'
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

// Initialize OpenAI client
let openai: OpenAI

onFunctionsInit(() => {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_SECRET_KEY,
    })
})

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
 * Gets similar recipes from Trieve based on text query
 * @param {string} changes - The changes to search for
 * @return {Promise<Recipe[]>} The similar recipes
 */
const getSimilarRecipes = async (changes: string) => {
    try {
        const response = await trieve.search({
            query: changes,
            search_type: 'bm25',
            page_size: 3,
        })
        logger.info('Trieve response', { response })

        // Return recipes as array of objects
        return response.chunks
            .map(c => {
                try {
                    // Trieve stores recipes as JSON in the chunk_html field
                    return JSON.parse((c.chunk as any).chunk_html)
                } catch (error) {
                    logger.error(`Error parsing recipe from chunk: ${error}`)
                    return null
                }
            })
            .filter(Boolean) // Remove any null entries from parsing errors
    } catch (error) {
        logger.error(`Error searching Trieve: ${error}`)
        throw new Error(`Error finding similar recipes: ${error}`)
    }
}

const nullToUndefined = <T>(value: T): NullToUndefined<T> => {
    if (value === null) {
        return undefined as unknown as NullToUndefined<T>
    }

    if (Array.isArray(value)) {
        return value.map(item => nullToUndefined(item)) as unknown as NullToUndefined<T>
    }

    if (value !== null && typeof value === 'object') {
        const newObj: Record<string, unknown> = {}
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                newObj[key] = nullToUndefined((value as Record<string, unknown>)[key])
            }
        }
        return newObj as NullToUndefined<T>
    }

    return value as NullToUndefined<T>
}

/**
 * Generates recipe update payload using OpenAI
 * @param {string} changes - The changes to search for
 * @param {any[]} recipes - The similar recipes
 * @return {Promise<UpdateRecipeRequest>} The update payload
 */
const generateUpdatePayload = async (changes: string, recipes: any[]): Promise<UpdateRecipeRequest> => {
    if (!openai) {
        throw new Error('OpenAI client not initialized - check OPENAI_SECRET_KEY environment variable')
    }

    try {
        const systemPrompt = `
Eres un asistente que ayuda a cambiar los datos de una receta.

Dada una lista de [recetas] y los [cambios], quiero que extraigas cuáles son los campos concretos a modificar y cuál es el nuevo valor de los campos. Dame un JSON que solo tenga los campos a cambiar y sus valores.

Te daré varias recetas y quiero que elijas solo 1, la que crees que hay que modificar según los [cambios].

El JSON debe seguir estrictamente el esquema de la solicitud UpdateRecipeRequest. 
Debe incluir:
- "id" (string): ID de la receta a actualizar
- "ingredientsToRemove" (array de strings): IDs de los ingredientes a eliminar
- Y cualquier otro campo que deba actualizarse como name, category, allergens, etc.
        `

        const completion = await openai.beta.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: `[Recetas]: ${JSON.stringify(recipes)}\n\n[Cambios]: ${changes}`,
                },
            ],
            temperature: 0,
            response_format: zodResponseFormat(UpdateRecipeRequestSchema, 'updateRecipe'),
        })

        logger.info('OpenAI response parsed successfully', { parsedContent: completion.choices[0].message.parsed })
        return nullToUndefined(completion.choices[0].message.parsed!)
    } catch (error) {
        logger.error(`Error calling OpenAI: ${error}`)
        throw new Error(`Error generating update payload: ${error}`)
    }
}

/**
 * Endpoint to update a recipe based on text description of changes
 */
export const updateRecipeByText = onAIToolRequest(
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
