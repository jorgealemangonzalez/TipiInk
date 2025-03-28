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
import { UpdateRecipeIngredientInput } from './CreateRecipe'

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
        pricePerProduction: updatedRecipeIngredient
            ? updatedRecipeIngredient.pricePerUnit * (updatedRecipeIngredient.quantityPerProduction ?? 1)
            : 0,
        quantityPerProduction: getQuantityPerProduction(updatedRecipeIngredient),
        quantityPerServing: getQuantityPerServing(updatedRecipeIngredient, servingsPerProduction),
    }
}

/**
 * This function maps an ingredient to a FullRecipeIngredient format.
 * It handles unit conversions for various input units.
 * @param {UpdateRecipeIngredientInput} ingredient - The ingredient to map
 * @return {Partial<FullRecipeIngredient>} The mapped ingredient with converted units and updated quantity per prod
 */
export const mapToFullRecipeIngredient = (ingredient: UpdateRecipeIngredientInput): Partial<FullRecipeIngredient> => {
    // Create a new object without the unit property
    const { unit, ...rest } = ingredient

    // Handle unit conversion for g to kg and ml to l
    let convertedUnit: 'kg' | 'l' | 'ud' | undefined = undefined
    let quantityPerProduction = ingredient.quantityPerProduction

    if (unit) {
        if (unit === 'g') {
            convertedUnit = 'kg'
            if (quantityPerProduction) {
                quantityPerProduction = quantityPerProduction / 1000
            }
        } else if (unit === 'ml') {
            convertedUnit = 'l'
            if (quantityPerProduction) {
                quantityPerProduction = quantityPerProduction / 1000
            }
        } else if (unit === 'kg' || unit === 'l' || unit === 'ud') {
            convertedUnit = unit
        }
    }

    // Return a new object with the correct types
    return {
        ...rest,
        unit: convertedUnit,
        quantityPerProduction,
    }
}
