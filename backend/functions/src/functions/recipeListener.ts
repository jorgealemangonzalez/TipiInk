import { Timestamp } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { logger } from 'firebase-functions'
import { ChunkMetadata, TrieveSDK } from 'trieve-ts-sdk'

import { firestore, isLocalEnvironment } from '../FirebaseInit'
import { RecipeDBModel } from '../types/recipe.d'

const trDataset = isLocalEnvironment() ? 'c7b4534b-ed9b-40b7-8b20-268b76bf4217' : 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa'

export const trieve = new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY || '',
    datasetId: trDataset,
})

export const onRecipeCreated = functions.firestore.onDocumentCreated('recipes/{recipeId}', async event => {
    const recipeId = event.params.recipeId
    const snapshot = event.data
    try {
        if (!snapshot) {
            logger.error('No data associated with the event')
            return
        }
        const recipeData = snapshot.data() as RecipeDBModel
        const response = await trieve.createChunk({
            chunk_html: JSON.stringify({ id: recipeId, ...recipeData }),
            metadata: {
                recipeId,
            },
        })

        await firestore
            .collection('recipes')
            .doc(recipeId)
            .update({
                chunkId: (response.chunk_metadata as ChunkMetadata).id,
            })

        logger.info(`Created new Trieve chunk for recipe ${recipeId} : ${recipeData.name}`)
    } catch (error) {
        logger.error(`Error creating Trieve chunk for recipe ${recipeId}:`, error)
    }
})

export const onRecipeUpdated = functions.firestore.onDocumentUpdated('recipes/{recipeId}', async event => {
    const recipeId = event.params.recipeId
    try {
        const recipeData = event.data?.after.data() as RecipeDBModel
        if (!recipeData) {
            logger.error('No data associated with the event')
            return
        }
        if (!recipeData.chunkId) {
            logger.error(`No chunkId associated with the recipe to update ${recipeId} : ${recipeData.name}`)
            const response = await trieve.createChunk({
                chunk_html: JSON.stringify({ id: recipeId, ...recipeData }),
                metadata: {
                    recipeId,
                },
            })
            await event.data?.after.ref.update({
                chunkId: (response.chunk_metadata as ChunkMetadata).id,
            })
        } else {
            await trieve.updateChunk({
                chunk_id: recipeData.chunkId,
                chunk_html: JSON.stringify({ id: recipeId, ...recipeData }),
            })
        }
        logger.info(`Updated Trieve chunk for recipe ${recipeId} : ${recipeData.name}`)
    } catch (error) {
        logger.error(`Error updating Trieve chunk for recipe ${recipeId}:`, error)
    }
})

export const onRecipeDeleted = functions.firestore.onDocumentDeleted('recipes/{recipeId}', async event => {
    const recipeId = event.params.recipeId
    const recipe = event.data?.data() as RecipeDBModel
    if (!recipe) {
        logger.error('No data associated with the event')
        return
    }
    if (!recipe.chunkId) {
        logger.error(`No chunkId associated with the recipe to delete ${recipeId} : ${recipe.name}`)
        return
    }
    logger.info(`Deleting Trieve chunk for recipe ${recipeId} : ${recipe.name}`)
    await trieve.deleteChunkById({
        chunkId: recipe.chunkId,
        trDataset,
    })
    logger.info(`Successfully deleted Trieve chunk for recipe ${recipeId} : ${recipe.name}`)
})
