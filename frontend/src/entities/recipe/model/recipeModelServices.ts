import { RecipeDBModel, RecipeIngredientDBModel } from "@monorepo/functions/src/types/recipe";

export const getCostPercentage = (recipe: RecipeDBModel) => {
    if (!recipe.servingsPerProduction || !recipe.pvp) {
        return 0
    }
    const totalCost = recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.pricePerProduction, 0) / recipe.servingsPerProduction
    const costPercentage = (totalCost / recipe.pvp) * 100
    console.log('costPercentage', {totalCost, pvp: recipe.pvp, costPercentage, recipe})
    return costPercentage
}

export const getCostPerServing = (recipe: RecipeDBModel) => {
    if (!recipe.servingsPerProduction || !recipe.productionCost) {
        return 0
    }
    return recipe.productionCost / recipe.servingsPerProduction
}

export const getPricePerProduction = (ingredient: RecipeIngredientDBModel) => {
    return ingredient.pricePerUnit * ingredient.quantityPerProduction
}

export const getQuantityPerServing = (recipe: RecipeDBModel, ingredient: RecipeIngredientDBModel) => {
    return ingredient.quantityPerProduction / recipe.servingsPerProduction
}
