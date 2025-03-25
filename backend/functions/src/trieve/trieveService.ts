import { ChunkMetadata, TrieveSDK } from 'trieve-ts-sdk'

import { Recipe } from '@tipi/shared'

import { isLocalEnvironment } from '../FirebaseInit'
import { getRecipeById, getRecipeRefById } from '../recipes/RecipeRepository'

const trDataset = isLocalEnvironment() ? 'c7b4534b-ed9b-40b7-8b20-268b76bf4217' : 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa'

export const trieve = new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY || '',
    datasetId: trDataset,
})

export const createRecipeInTrieve = async (recipe: Recipe) => {
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
    const recipe = await getRecipeById(recipeId)
    return createRecipeInTrieve(recipe)
}
