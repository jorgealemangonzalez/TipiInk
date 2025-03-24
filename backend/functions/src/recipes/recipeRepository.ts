import { Recipe, RecipeDBModel, recipeConverter } from '@tipi/shared'

import { firestore } from '../FirebaseInit'

export const getRecipeRefById = (id: string) =>
    firestore.collection('organizations/demo/recipes').doc(id).withConverter<Recipe, RecipeDBModel>(recipeConverter)

export const getRecipeById = async (id: string) => {
    const snapshot = (await getRecipeRefById(id).get()).data()

    if (!snapshot) {
        throw new Error(`Recipe not found id: ${id}`)
    }
    return snapshot
}
