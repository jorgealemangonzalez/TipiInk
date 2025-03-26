import {
    FullRecipeIngredient,
    getQuantityPerProduction,
    getQuantityPerServing,
    mergeFullRecipeIngredient,
} from '@tipi/shared'

import {
    createOrUpdateIngredient,
    getIngredientById,
    updateIngredientByExistingIngredient as updateIngredientByExisting,
} from '../ingredients/IngredientsRepository'

export const mergeAndUpdateRecipeIngredient = async (
    existingIngredient: FullRecipeIngredient,
    newIngredient: Partial<FullRecipeIngredient>,
    servingsPerProduction: number,
): Promise<FullRecipeIngredient> => {
    const mergedFullRecipeIngredient = await mergeFullRecipeIngredient(
        existingIngredient,
        newIngredient,
        servingsPerProduction,
    )
    await updateIngredientByExisting(existingIngredient, mergedFullRecipeIngredient)
    return mergedFullRecipeIngredient
}

export const createOrUpdateRecipeIngredient = async (
    recipeIngredient: Partial<FullRecipeIngredient>,
    servingsPerProduction?: number,
): Promise<FullRecipeIngredient> => {
    const newIngredientId = await createOrUpdateIngredient(recipeIngredient)
    const newIngredient = await getIngredientById(newIngredientId)
    const updatedRecipeIngredient = {
        ...recipeIngredient,
        ...newIngredient,
    }

    return {
        ...updatedRecipeIngredient,
        type: 'ingredient',
        pricePerProduction: updatedRecipeIngredient?.pricePerUnit ?? 0,
        quantityPerProduction: getQuantityPerProduction(updatedRecipeIngredient),
        quantityPerServing: getQuantityPerServing(updatedRecipeIngredient, servingsPerProduction),
    }
}
