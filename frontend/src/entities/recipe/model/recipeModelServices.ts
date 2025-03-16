import { RecipeDBModel } from "@monorepo/functions/src/types/recipe";

export const getCostPercentage = (recipe: RecipeDBModel) => {
    const totalCost = recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.pricePerProduction, 0) / recipe.servingsPerProduction
    const costPercentage = (totalCost / recipe.pvp) * 100
    console.log('costPercentage', {totalCost, pvp: recipe.pvp, costPercentage, recipe})
    return costPercentage
}

