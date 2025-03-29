import * as functions from 'firebase-functions'
import { logger } from 'firebase-functions'

import { IngredientDBModel } from '@tipi/shared'

import { createIngredientInTrieveById, deleteIngredientChunk, updateIngredientInTrieve } from '../trieve/TrieveService'

export const onIngredientCreated = functions.firestore.onDocumentCreated(
    'organizations/demo/ingredients/{ingredientId}',
    async event => {
        const ingredientId = event.params.ingredientId
        const snapshot = event.data
        try {
            if (!snapshot) {
                logger.error('No data associated with the event')
                return
            }
            const ingredientData = snapshot.data() as IngredientDBModel

            await createIngredientInTrieveById(ingredientId)

            logger.info(`Created new Trieve chunk for ingredient ${ingredientId} : ${ingredientData.name}`)
        } catch (error) {
            logger.error(`Error creating Trieve chunk for ingredient ${ingredientId}:`, error)
        }
    },
)

export const onIngredientUpdated = functions.firestore.onDocumentUpdated(
    'organizations/demo/ingredients/{ingredientId}',
    async event => {
        const ingredientId = event.params.ingredientId
        try {
            const ingredientData = event.data?.after.data() as IngredientDBModel
            if (!ingredientData) {
                logger.error('No data associated with the event')
                return
            }
            if (!ingredientData.chunkId) {
                logger.error(
                    `No chunkId associated with the ingredient to update ${ingredientId} : ${ingredientData.name}`,
                )
                await createIngredientInTrieveById(ingredientId)
            } else {
                await updateIngredientInTrieve(ingredientId, ingredientData.chunkId)
            }
            logger.info(`Updated Trieve chunk for ingredient ${ingredientId} : ${ingredientData.name}`)
        } catch (error) {
            logger.error(`Error updating Trieve chunk for ingredient ${ingredientId}:`, error)
        }
    },
)

export const onIngredientDeleted = functions.firestore.onDocumentDeleted(
    'organizations/demo/ingredients/{ingredientId}',
    async event => {
        const ingredientId = event.params.ingredientId
        const ingredient = event.data?.data() as IngredientDBModel
        if (!ingredient) {
            logger.error('No data associated with the event')
            return
        }
        if (!ingredient.chunkId) {
            logger.error(`No chunkId associated with the ingredient to delete ${ingredientId} : ${ingredient.name}`)
            return
        }
        logger.info(`Deleting Trieve chunk for ingredient ${ingredientId} : ${ingredient.name}`)
        await deleteIngredientChunk(ingredient.chunkId)
        logger.info(`Successfully deleted Trieve chunk for ingredient ${ingredientId} : ${ingredient.name}`)
    },
)
