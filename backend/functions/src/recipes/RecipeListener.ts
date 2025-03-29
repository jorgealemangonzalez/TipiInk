import * as functions from 'firebase-functions'
import { logger } from 'firebase-functions'

import { RecipeDBModel } from '@tipi/shared'

import { createRecipeInTrieveById, deleteRecipeChunk, updateRecipeInTrieve } from '../trieve/TrieveService'

export const onRecipeCreated = functions.firestore.onDocumentCreated(
    'organizations/demo/recipes/{recipeId}',
    async event => {
        const recipeId = event.params.recipeId
        const snapshot = event.data
        try {
            if (!snapshot) {
                logger.error('No data associated with the event')
                return
            }
            const recipeData = snapshot.data() as RecipeDBModel

            await createRecipeInTrieveById(recipeId)

            logger.info(`Created new Trieve chunk for recipe ${recipeId} : ${recipeData.name}`)
        } catch (error) {
            logger.error(`Error creating Trieve chunk for recipe ${recipeId}:`, error)
        }
    },
)

export const onRecipeUpdated = functions.firestore.onDocumentUpdated(
    'organizations/demo/recipes/{recipeId}',
    async event => {
        const recipeId = event.params.recipeId
        try {
            const recipeData = event.data?.after.data() as RecipeDBModel
            if (!recipeData) {
                logger.error('No data associated with the event')
                return
            }
            if (!recipeData.chunkId) {
                logger.error(`No chunkId associated with the recipe to update ${recipeId} : ${recipeData.name}`)
                await createRecipeInTrieveById(recipeId)
            } else {
                await updateRecipeInTrieve(recipeId, recipeData.chunkId)
            }
            logger.info(`Updated Trieve chunk for recipe ${recipeId} : ${recipeData.name}`)
        } catch (error) {
            logger.error(`Error updating Trieve chunk for recipe ${recipeId}:`, error)
        }
    },
)

export const onRecipeDeleted = functions.firestore.onDocumentDeleted(
    'organizations/demo/recipes/{recipeId}',
    async event => {
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
        await deleteRecipeChunk(recipe.chunkId)
        logger.info(`Successfully deleted Trieve chunk for recipe ${recipeId} : ${recipe.name}`)
    },
)
