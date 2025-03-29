import { logger } from 'firebase-functions'
import { ChunkGroup, ChunkMetadata, TrieveSDK } from 'trieve-ts-sdk'

import { ChunkGroups, Ingredient, RecipeWithIngredients, groupNameToDescription } from '@tipi/shared'

import { isLocalEnvironment } from '../FirebaseInit'
import { getIngredientById, getIngredientRef } from '../ingredients/IngredientsRepository'
import { getTrieveGroupId, updateTrieveGroupId } from '../organizations/OrganizationsRepository'
import { getRecipeRefById, getRecipeWithIngredientsById } from '../recipes/RecipeRepository'

const trDataset = isLocalEnvironment() ? 'c7b4534b-ed9b-40b7-8b20-268b76bf4217' : 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa'

export const trieve = new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY || '',
    datasetId: trDataset,
})

export const createRecipeInTrieve = async (recipe: RecipeWithIngredients) => {
    // Get or create the recipes group
    const groupId = await getOrCreateChunkGroup('recipes')

    const response = await trieve.createChunk({
        chunk_html: JSON.stringify({ ...recipe }),
        metadata: {
            recipeId: recipe.id,
        },
        group_ids: [groupId],
        tag_set: buildTagSetForRecipe(recipe),
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

export const getOrCreateChunkGroup = async (groupName: ChunkGroups) => {
    // Try to get the groupId from the organization
    const existingGroupId = await getTrieveGroupId(groupName)

    // If group ID exists, return it
    if (existingGroupId) {
        logger.info(`Found existing Trieve group for ${groupName}: ${existingGroupId}`)
        return existingGroupId
    }

    // If not, create a new group
    logger.info(`Creating new Trieve group for ${groupName}`)
    const response = (await trieve.createChunkGroup({
        name: groupName,
        description: groupNameToDescription[groupName],
    })) as ChunkGroup

    // Extract the group ID from the response
    const newGroupId = response.id

    // Store the new group ID in the organization
    await updateTrieveGroupId(groupName, newGroupId)

    logger.info(`Created new Trieve group for ${groupName}: ${newGroupId}`)
    return newGroupId
}

const buildTagSetForRecipe = (recipe: RecipeWithIngredients): string[] => {
    return [recipe.name, ...recipe.ingredients.map(ingredient => ingredient.name)]
}

/**
 * Updates an existing recipe in Trieve
 * @param {string} recipeId - The ID of the recipe to update
 * @param {string} chunkId - The Trieve chunk ID
 * @return {Promise<void>}
 */
export const updateRecipeInTrieve = async (recipeId: string, chunkId: string): Promise<void> => {
    const recipeWithIngredients = await getRecipeWithIngredientsById(recipeId)

    const groupId = await getOrCreateChunkGroup('recipes')

    await trieve.updateChunk({
        chunk_id: chunkId,
        chunk_html: JSON.stringify(recipeWithIngredients),
        group_ids: [groupId],
        tag_set: buildTagSetForRecipe(recipeWithIngredients),
    })

    logger.info(`Updated Trieve chunk for recipe ${recipeId}`)
}

/**
 * Deletes a recipe chunk from Trieve
 * @param {string} chunkId - The Trieve chunk ID to delete
 * @return {Promise<void>}
 */
export const deleteRecipeChunk = async (chunkId: string): Promise<void> => {
    await trieve.deleteChunkById({
        chunkId: chunkId,
        trDataset,
    })

    logger.info(`Successfully deleted Trieve chunk ${chunkId}`)
}

/**
 * Gets similar recipes from Trieve based on text query
 * @param {string} searchQuery - The text query to search for
 * @return {Promise<Recipe[]>} The similar recipes
 */
export const getSimilarRecipes = async (searchQuery: string): Promise<RecipeWithIngredients[]> => {
    const recipesGroupId = await getTrieveGroupId('recipes')
    const response = await trieve.searchInGroup({
        query: searchQuery,
        search_type: 'bm25',
        page_size: 3,
        group_id: recipesGroupId,
    })
    logger.info('Trieve response', { response })

    // Return recipes as array of objects
    return response.chunks
        .map(c => {
            // Trieve stores recipes as JSON in the chunk_html field
            try {
                return JSON.parse((c.chunk as any).chunk_html)
            } catch (error) {
                logger.error(`Error parsing recipe from chunk: ${error}`)
                return null
            }
        })
        .filter(Boolean) // Remove any null entries from parsing errors
}

/**
 * Creates a new ingredient in Trieve
 * @param {Ingredient} ingredient - The ingredient to create
 * @return {Promise<any>} The Trieve response
 */
export const createIngredientInTrieve = async (ingredient: Ingredient): Promise<any> => {
    // Get or create the ingredients group
    const groupId = await getOrCreateChunkGroup('ingredients')

    const response = await trieve.createChunk({
        chunk_html: JSON.stringify(ingredient),
        metadata: {
            ingredientId: ingredient.id,
        },
        group_ids: [groupId],
        tag_set: [ingredient.name],
    })

    await getIngredientRef(ingredient.id).update({
        chunkId: (response.chunk_metadata as ChunkMetadata).id,
    })

    return response
}

/**
 * Creates a new ingredient in Trieve by ID
 * @param {string} ingredientId - The ID of the ingredient to create
 * @return {Promise<any>} The Trieve response
 */
export const createIngredientInTrieveById = async (ingredientId: string): Promise<any> => {
    const ingredient = await getIngredientById(ingredientId)
    return createIngredientInTrieve(ingredient)
}

/**
 * Updates an existing ingredient in Trieve
 * @param {string} ingredientId - The ID of the ingredient to update
 * @param {string} chunkId - The Trieve chunk ID
 * @return {Promise<void>}
 */
export const updateIngredientInTrieve = async (ingredientId: string, chunkId: string): Promise<void> => {
    const ingredient = await getIngredientById(ingredientId)

    const groupId = await getOrCreateChunkGroup('ingredients')

    await trieve.updateChunk({
        chunk_id: chunkId,
        chunk_html: JSON.stringify(ingredient),
        group_ids: [groupId],
        tag_set: [ingredient.name],
    })

    logger.info(`Updated Trieve chunk for ingredient ${ingredientId}`)
}

/**
 * Deletes an ingredient chunk from Trieve
 * @param {string} chunkId - The Trieve chunk ID to delete
 * @return {Promise<void>}
 */
export const deleteIngredientChunk = async (chunkId: string): Promise<void> => {
    await trieve.deleteChunkById({
        chunkId: chunkId,
        trDataset,
    })

    logger.info(`Successfully deleted Trieve chunk ${chunkId}`)
}
