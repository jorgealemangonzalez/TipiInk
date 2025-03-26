import { EntityUpdate } from 'src/typing'

import { Ingredient, IngredientDBModel, IngredientUnits } from './IngredientEntity'

export const mergeIngredient = async (
    existingIngredient: Ingredient,
    newIngredient: Partial<Ingredient>,
): Promise<Ingredient> => {
    return {
        ...existingIngredient,
        ...newIngredient,
    }
}

export const defaultIngredient: EntityUpdate<IngredientDBModel> = {
    name: '',
    unit: IngredientUnits.UD,
    pricePerUnit: 0,
}
