import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'
import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Recipe, RecipeDBModel } from './RecipeEntity'
import {
    getCostPerServing,
    getCostPercentage,
    getPricePerProduction,
    getQuantityPerServing,
} from './RecipeEntityService'

export const recipeConverter: FirestoreDataConverter<Recipe, RecipeDBModel> = {
    // TODO MOVE TO BACKEND AND IMPORT FROM @MONOREPO/FUNCTIONS
    toFirestore: (recipe: Recipe) => {
        console.log('toFirestore', recipe)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, costPercentage, ingredients, costPerServing, ...recipeData } = recipe
        return {
            ...recipeData,
            ingredients: ingredients.map(ingredient => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { pricePerProduction, quantityPerServing, ...ingredientData } = ingredient
                console.log('ingredientData', ingredientData)
                return ingredientData
            }),
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<Recipe, RecipeDBModel>, options?: any) => {
        console.log('fromFirestore', snapshot)
        let recipe: RecipeDBModel
        if (options) {
            recipe = snapshot.data(options)
        } else {
            recipe = snapshot.data()
        }
        const costPerServing = getCostPerServing(recipe, recipe.productionCost)
        const costPercentage = getCostPercentage(recipe, costPerServing)
        return {
            ...recipe,
            id: snapshot.id,
            costPercentage,
            costPerServing,
            ingredients: recipe.ingredients.map(ingredient => ({
                ...ingredient,
                pricePerProduction: getPricePerProduction(ingredient),
                quantityPerServing: getQuantityPerServing(recipe, ingredient),
            })),
        } as Recipe
    },
}
