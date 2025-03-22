import { FirestoreDataConverter } from 'firebase-admin/firestore'

import { firestore } from '../FirebaseInit'
import { Recipe, RecipeDBModel } from './recipe'
import {
    getCostPerServing,
    getCostPercentage,
    getPricePerProduction,
    getProductionCost,
    getQuantityPerServing,
} from './recipeEntity'

const recipeConverter: FirestoreDataConverter<Recipe, RecipeDBModel> = {
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
                return ingredientData
            }),
        }
    },
    fromFirestore: snapshot => {
        console.log('fromFirestore', snapshot)
        const recipe = snapshot.data() as RecipeDBModel
        const productionCost = getProductionCost(recipe)
        const costPerServing = getCostPerServing(recipe, productionCost)
        const costPercentage = getCostPercentage(recipe, costPerServing)
        return {
            ...recipe,
            id: snapshot.id,
            costPercentage,
            costPerServing,
            productionCost,
            ingredients: recipe.ingredients.map(ingredient => ({
                ...ingredient,
                pricePerProduction: getPricePerProduction(ingredient),
                quantityPerServing: getQuantityPerServing(recipe, ingredient),
            })),
        } as Recipe
    },
}

export const getRecipeRefById = (id: string) => firestore.collection('recipes').doc(id).withConverter(recipeConverter)

export const getRecipeById = async (id: string) => {
    const snapshot = (await getRecipeRefById(id).get()).data()
    if (!snapshot) {
        throw new Error(`Recipe not found id: ${id}`)
    }
    return snapshot
}
