import { logger } from 'firebase-functions'
import { ChunkMetadata, TrieveSDK } from 'trieve-ts-sdk'

import { RecipeWithIngredients } from '@tipi/shared'

import { isLocalEnvironment } from '../FirebaseInit'
import { getRecipeRefById, getRecipeWithIngredientsById } from '../recipes/RecipeRepository'

const trDataset = isLocalEnvironment() ? 'c7b4534b-ed9b-40b7-8b20-268b76bf4217' : 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa'

export const trieve = new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY || '',
    datasetId: trDataset,
})

export const createRecipeInTrieve = async (recipe: RecipeWithIngredients) => {
    const response = await trieve.createChunk({
        chunk_html: JSON.stringify({ ...recipe }),
        metadata: {
            recipeId: recipe.id,
        },
    })

    await getRecipeRefById(recipe.id).update({
        chunkId: (response.chunk_metadata as ChunkMetadata).id,
    })

    return response
}

export const createRecipeInTrieveById = async (recipeId: string) => {
    const recipe = await getRecipeWithIngredientsById(recipeId)
    return createRecipeInTrieve(recipe)
}

/**
 * Gets similar recipes from Trieve based on text query
 * @param {string} searchQuery - The text query to search for
 * @return {Promise<Recipe[]>} The similar recipes
 */
export const getSimilarRecipes = async (searchQuery: string): Promise<RecipeWithIngredients[]> => {
    try {
        const response = await trieve.search({
            query: searchQuery,
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
