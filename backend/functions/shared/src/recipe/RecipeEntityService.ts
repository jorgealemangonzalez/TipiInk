import { Ingredient } from '../ingredients/IngredientEntity'
import { mergeIngredient } from '../ingredients/IngredientEntityService'
import { FullRecipeIngredient, RecipeDBModel, RecipeIngredient } from './RecipeEntity'

export const getProductionCost = (ingredients?: RecipeIngredient[]) => {
    if (!ingredients || ingredients.length === 0) {
        return 0
    }

    // In RecipeIngredient, we have pricePerProduction field that already contains the cost
    return ingredients.reduce((acc, ingredient) => acc + ingredient.pricePerProduction, 0)
}

export const getCostPerServing = (recipe: { servingsPerProduction?: number }, productionCost: number) => {
    if (!recipe.servingsPerProduction) {
        return 0
    }
    return productionCost / recipe.servingsPerProduction
}

export const getCostPercentage = (recipe: { servingsPerProduction?: number; pvp?: number }, costPerServing: number) => {
    if (!recipe.servingsPerProduction || !recipe.pvp) {
        return 0
    }
    return (costPerServing / recipe.pvp) * 100
}

export const getQuantityPerProduction = (ingredient: Partial<FullRecipeIngredient>) => {
    return ingredient.quantityPerProduction ?? (ingredient.unit === 'ud' ? 1 : 0)
}

const getServingsPerProduction = (recipeOrServingsPerProduction?: Partial<RecipeDBModel> | number) => {
    if (!recipeOrServingsPerProduction) {
        return 1
    }

    if (typeof recipeOrServingsPerProduction === 'number') {
        return recipeOrServingsPerProduction
    }

    if (recipeOrServingsPerProduction.servingsPerProduction) {
        return recipeOrServingsPerProduction.servingsPerProduction
    }

    return 1
}

export const getQuantityPerServing = (
    ingredient: Partial<FullRecipeIngredient>,
    recipeOrServingsPerProduction?: Partial<RecipeDBModel> | number,
) => {
    const servingsPerProduction = getServingsPerProduction(recipeOrServingsPerProduction)

    const quantityPerProduction = getQuantityPerProduction(ingredient)

    return quantityPerProduction / servingsPerProduction
}

export const getPricePerProduction = (ingredient: Ingredient, quantityPerProduction?: number) => {
    return ingredient.pricePerUnit * (quantityPerProduction || 1)
}

export const mergeFullRecipeIngredient = async (
    existingIngredient: FullRecipeIngredient,
    newIngredient: Partial<FullRecipeIngredient>,
    servingsPerProduction: number,
) => {
    const mergedIngredient = await mergeIngredient(existingIngredient, newIngredient)
    const mergedRecipeIngredient = {
        ...existingIngredient,
        ...mergedIngredient,
        quantityPerProduction: newIngredient.quantityPerProduction ?? existingIngredient.quantityPerProduction,
    }
    return {
        ...mergedRecipeIngredient,
        quantityPerServing: getQuantityPerServing(mergedRecipeIngredient, servingsPerProduction),
        pricePerProduction: getPricePerProduction(mergedRecipeIngredient),
    }
}
