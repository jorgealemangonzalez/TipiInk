import { RecipeDBModel, RecipeIngredientDBModel } from '@tipi/shared'

export const getProductionCost = (recipe: RecipeDBModel) => {
    return recipe.ingredients.reduce(
        (acc, ingredient) => acc + ingredient.pricePerUnit * ingredient.quantityPerProduction,
        0,
    )
}

export const getCostPerServing = (recipe: RecipeDBModel, productionCost: number) => {
    if (!recipe.servingsPerProduction) {
        return 0
    }
    return productionCost / recipe.servingsPerProduction
}

export const getCostPercentage = (recipe: RecipeDBModel, costPerServing: number) => {
    if (!recipe.servingsPerProduction || !recipe.pvp) {
        return 0
    }
    return (costPerServing / recipe.pvp) * 100
}

export const getPricePerProduction = (ingredient: RecipeIngredientDBModel) => {
    return ingredient.pricePerUnit * ingredient.quantityPerProduction
}

export const getQuantityPerServing = (recipe: RecipeDBModel, ingredient: RecipeIngredientDBModel) => {
    return ingredient.quantityPerProduction / recipe.servingsPerProduction
}
